import re
from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, validator

try:
    from pydantic import ConfigDict, field_validator
    HAS_V2 = True
except ImportError:
    HAS_V2 = False


def validate_password_strength(password: str) -> str:
    """Enforce strict strong password rules."""
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long")
    if not re.search(r"[A-Z]", password):
        raise ValueError("Password must contain at least one uppercase letter (A-Z)")
    if not re.search(r"[a-z]", password):
        raise ValueError("Password must contain at least one lowercase letter (a-z)")
    if not re.search(r"[0-9]", password):
        raise ValueError("Password must contain at least one numeric digit (0-9)")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>\-_+=\[\]\\/`~]", password):
        raise ValueError("Password must contain at least one special character (!@#$%^&*)")
    return password


# Auth Schemas
class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str

    if HAS_V2:
        @field_validator("password")
        @classmethod
        def check_password(cls, v: str) -> str:
            return validate_password_strength(v)
    else:
        @validator("password")
        def check_password(cls, v: str) -> str:
            return validate_password_strength(v)


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    if HAS_V2:
        model_config = ConfigDict(from_attributes=True)
    else:
        class Config:
            orm_mode = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Signature Schemas
class SignatureBase(BaseModel):
    title: str = "My Signature"
    full_name: str = ""
    job_title: str = ""
    department: str = ""
    company: str = ""
    email: str = ""
    phone: str = ""
    mobile: str = ""
    website: str = ""
    address: str = ""
    
    template_id: str = "modern_horizon"
    primary_color: str = "#0284c7"
    secondary_color: str = "#475569"
    font_family: str = "Arial, sans-serif"
    
    avatar_url: str = ""
    logo_url: str = ""
    banner_url: str = ""
    
    social_links: Optional[str] = "{}"
    disclaimer: str = ""
    custom_cta_text: str = ""
    custom_cta_url: str = ""


class SignatureCreate(SignatureBase):
    pass


class SignatureUpdate(SignatureBase):
    pass


class SignatureResponse(SignatureBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    if HAS_V2:
        model_config = ConfigDict(from_attributes=True)
    else:
        class Config:
            orm_mode = True


# Payment / Tokenization Schemas
class CardSubmitRequest(BaseModel):
    cardholder_name: str
    card_number: str
    exp_month: int
    exp_year: int
    cvv: str
    set_as_default: bool = False


class PaymentMethodResponse(BaseModel):
    id: int
    user_id: int
    token: str
    cardholder_name: str
    brand: str
    last4: str
    exp_month: int
    exp_year: int
    is_default: bool
    created_at: datetime

    if HAS_V2:
        model_config = ConfigDict(from_attributes=True)
    else:
        class Config:
            orm_mode = True
