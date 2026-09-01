import re
import secrets
import hashlib
from typing import Tuple, Dict, Any


def validate_luhn(card_number: str) -> bool:
    """Validate card number using the standard Luhn algorithm."""
    digits = [int(c) for c in card_number if c.isdigit()]
    if len(digits) < 13 or len(digits) > 19:
        return False
    
    checksum = 0
    reverse_digits = digits[::-1]
    
    for idx, digit in enumerate(reverse_digits):
        if idx % 2 == 1:
            doubled = digit * 2
            if doubled > 9:
                doubled -= 9
            checksum += doubled
        else:
            checksum += digit
            
    return checksum % 10 == 0


def detect_card_brand(card_number: str) -> str:
    """Detect card brand based on IIN / BIN prefix."""
    clean = re.sub(r"\D", "", card_number)
    
    if re.match(r"^4", clean):
        return "visa"
    elif re.match(r"^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)", clean):
        return "mastercard"
    elif re.match(r"^3[47]", clean):
        return "amex"
    elif re.match(r"^(6011|65|64[4-9]|622)", clean):
        return "discover"
    elif re.match(r"^35(2[89]|[3-8]\d)", clean):
        return "jcb"
    elif re.match(r"^(30[0-5]|36|38)", clean):
        return "diners"
    return "unknown"


def tokenize_card(
    cardholder_name: str,
    card_number: str,
    exp_month: int,
    exp_year: int,
    cvv: str
) -> Dict[str, Any]:
    """
    Validate and tokenize card data in a simulated PCI-compliant vault.
    Returns token, brand, last4, and expiry metadata without storing full PAN or CVV.
    """
    clean_number = re.sub(r"\D", "", card_number)
    
    # 1. Validate Luhn
    if not validate_luhn(clean_number):
        raise ValueError("Invalid credit card number (failed Luhn check)")
        
    # 2. Validate Expiration
    if not (1 <= exp_month <= 12):
        raise ValueError("Invalid expiration month (must be between 1 and 12)")
        
    if exp_year < 2024:
        raise ValueError("Card has already expired")
        
    # 3. Validate CVV
    clean_cvv = re.sub(r"\D", "", cvv)
    if len(clean_cvv) < 3 or len(clean_cvv) > 4:
        raise ValueError("Invalid CVV/CVC code (must be 3 or 4 digits)")
        
    # 4. Detect Brand
    brand = detect_card_brand(clean_number)
    last4 = clean_number[-4:]
    
    # 5. Generate Secure Token (PCI DSS compliant token representation)
    random_hex = secrets.token_hex(8)
    fingerprint = hashlib.sha256(f"{clean_number}-{exp_month}-{exp_year}".encode()).hexdigest()[:12]
    token = f"tok_{brand}_{fingerprint}_{random_hex}"
    
    return {
        "token": token,
        "brand": brand,
        "last4": last4,
        "exp_month": exp_month,
        "exp_year": exp_year,
        "cardholder_name": cardholder_name.strip()
    }
