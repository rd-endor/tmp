import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    signatures = relationship("Signature", back_populates="owner", cascade="all, delete-orphan")
    payment_methods = relationship("PaymentMethod", back_populates="owner", cascade="all, delete-orphan")


class Signature(Base):
    __tablename__ = "signatures"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(100), default="My Signature")
    
    # Personal & Company Details
    full_name = Column(String(100), default="")
    job_title = Column(String(100), default="")
    department = Column(String(100), default="")
    company = Column(String(100), default="")
    email = Column(String(100), default="")
    phone = Column(String(50), default="")
    mobile = Column(String(50), default="")
    website = Column(String(200), default="")
    address = Column(String(200), default="")
    
    # Design & Layout
    template_id = Column(String(50), default="modern_horizon")
    primary_color = Column(String(20), default="#0284c7")  # hex code
    secondary_color = Column(String(20), default="#475569")
    font_family = Column(String(50), default="Arial, sans-serif")
    
    # Images & Branding
    avatar_url = Column(String(500), default="")
    logo_url = Column(String(500), default="")
    banner_url = Column(String(500), default="")
    
    # Social links (JSON string or comma-separated)
    social_links = Column(Text, default="{}")
    
    # Extra content
    disclaimer = Column(Text, default="")
    custom_cta_text = Column(String(100), default="")
    custom_cta_url = Column(String(200), default="")
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="signatures")


class PaymentMethod(Base):
    __tablename__ = "payment_methods"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String(100), unique=True, index=True, nullable=False)
    cardholder_name = Column(String(100), nullable=False)
    brand = Column(String(30), nullable=False)
    last4 = Column(String(4), nullable=False)
    exp_month = Column(Integer, nullable=False)
    exp_year = Column(Integer, nullable=False)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="payment_methods")
