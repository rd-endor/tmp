import pytest
from fastapi.testclient import TestClient
from main import app
from database import Base, engine, SessionLocal
import models

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_and_teardown():
    Base.metadata.create_all(bind=engine)
    yield


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_logos_list():
    response = client.get("/api/logos")
    assert response.status_code == 200
    logos = response.json()
    assert len(logos) >= 2
    assert any(l["id"] == "endor-labs-full" for l in logos)
    assert any(l["id"] == "endor-labs-ss" for l in logos)


def test_strong_password_validation():
    # 1. Reject too short (<8)
    r1 = client.post("/api/auth/signup", json={
        "username": "short_user",
        "email": "short@test.com",
        "password": "Pass1!"
    })
    assert r1.status_code == 422

    # 2. Reject no uppercase
    r2 = client.post("/api/auth/signup", json={
        "username": "no_upper_user",
        "email": "noupper@test.com",
        "password": "password123!"
    })
    assert r2.status_code == 422

    # 3. Reject no digit
    r3 = client.post("/api/auth/signup", json={
        "username": "no_digit_user",
        "email": "nodigit@test.com",
        "password": "Password!"
    })
    assert r3.status_code == 422

    # 4. Reject no special character
    r4 = client.post("/api/auth/signup", json={
        "username": "no_special_user",
        "email": "nospecial@test.com",
        "password": "Password123"
    })
    assert r4.status_code == 422


def test_auth_and_signatures_flow():
    test_user = "testuser_sig_builder_v2"
    test_email = "testuser_v2@example.com"
    test_pwd = "StrongPassword123!"

    # 1. Signup
    signup_resp = client.post("/api/auth/signup", json={
        "username": test_user,
        "email": test_email,
        "password": test_pwd
    })
    
    if signup_resp.status_code == 400:
        login_resp = client.post("/api/auth/login", json={
            "username": test_user,
            "password": test_pwd
        })
        assert login_resp.status_code == 200
        token = login_resp.json()["access_token"]
    else:
        assert signup_resp.status_code == 201
        token = signup_resp.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Me
    me_resp = client.get("/api/auth/me", headers=headers)
    assert me_resp.status_code == 200
    assert me_resp.json()["username"] == test_user

    # 3. Create Signature
    sig_payload = {
        "title": "Corporate Executive Signature",
        "full_name": "Jane Doe",
        "job_title": "Lead Security Architect",
        "department": "AppSec & Infrastructure",
        "company": "Endor Labs",
        "email": "jane.doe@endorlabs.com",
        "phone": "+1 (555) 019-2834",
        "website": "https://endorlabs.com",
        "template_id": "modern_horizon",
        "primary_color": "#2563eb",
        "logo_url": "/static/logos/endor-labs-logo-2.png",
        "social_links": '{"linkedin": "https://linkedin.com/in/janedoe", "github": "https://github.com/janedoe"}'
    }
    create_resp = client.post("/api/signatures", json=sig_payload, headers=headers)
    assert create_resp.status_code == 201
    created_sig = create_resp.json()
    sig_id = created_sig["id"]
    assert created_sig["full_name"] == "Jane Doe"

    # 4. List Signatures
    list_resp = client.get("/api/signatures", headers=headers)
    assert list_resp.status_code == 200
    sigs = list_resp.json()
    assert any(s["id"] == sig_id for s in sigs)

    # 5. Delete Signature
    del_resp = client.delete(f"/api/signatures/{sig_id}", headers=headers)
    assert del_resp.status_code == 204


def test_credit_card_tokenization_and_payments_flow():
    # Setup test user for payments
    pay_user = "billing_user_test"
    pay_email = "billing@endorlabs.com"
    pay_pwd = "VaultPassword#2026"

    signup_resp = client.post("/api/auth/signup", json={
        "username": pay_user,
        "email": pay_email,
        "password": pay_pwd
    })
    if signup_resp.status_code == 400:
        login_resp = client.post("/api/auth/login", json={
            "username": pay_user,
            "password": pay_pwd
        })
        token = login_resp.json()["access_token"]
    else:
        token = signup_resp.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    # 1. Test Luhn check failure with invalid card number
    bad_card_resp = client.post("/api/payments/tokenize-and-save", json={
        "cardholder_name": "John Doe",
        "card_number": "4242 4242 4242 4241", # fails Luhn
        "exp_month": 12,
        "exp_year": 2028,
        "cvv": "123"
    }, headers=headers)
    assert bad_card_resp.status_code == 400
    assert "Invalid payment card details" in bad_card_resp.json()["detail"]

    # 2. Test valid Visa card submission & tokenization
    valid_card_resp = client.post("/api/payments/tokenize-and-save", json={
        "cardholder_name": "Jane Doe",
        "card_number": "4242 4242 4242 4242", # valid test Visa
        "exp_month": 11,
        "exp_year": 2028,
        "cvv": "888",
        "set_as_default": True
    }, headers=headers)
    assert valid_card_resp.status_code == 201
    card_data = valid_card_resp.json()
    assert card_data["brand"] == "visa"
    assert card_data["last4"] == "4242"
    assert card_data["is_default"] is True
    assert card_data["token"].startswith("tok_visa_")
    card_id = card_data["id"]

    # 3. Test listing payment methods
    list_cards = client.get("/api/payments/methods", headers=headers)
    assert list_cards.status_code == 200
    cards = list_cards.json()
    assert len(cards) >= 1
    assert any(c["id"] == card_id for c in cards)

    # 4. Test adding a Mastercard
    mc_resp = client.post("/api/payments/tokenize-and-save", json={
        "cardholder_name": "Jane Corp",
        "card_number": "5555 5555 5555 4444", # valid test Mastercard
        "exp_month": 8,
        "exp_year": 2029,
        "cvv": "456",
        "set_as_default": False
    }, headers=headers)
    assert mc_resp.status_code == 201
    mc_id = mc_resp.json()["id"]
    assert mc_resp.json()["brand"] == "mastercard"

    # 5. Set second card as default
    set_def_resp = client.put(f"/api/payments/methods/{mc_id}/default", headers=headers)
    assert set_def_resp.status_code == 200
    assert set_def_resp.json()["is_default"] is True

    # 6. Delete card
    del_card_resp = client.delete(f"/api/payments/methods/{card_id}", headers=headers)
    assert del_card_resp.status_code == 204
