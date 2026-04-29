"""DeepProvenance — SQLAlchemy ORM Models."""
import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, DateTime, ForeignKey,
    Enum as SAEnum, JSON
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
import enum


# ── Enums ──────────────────────────────────────────────

class UserRole(str, enum.Enum):
    PHOTOGRAPHER = "photographer"
    BROADCASTER = "broadcaster"
    AGENCY = "agency"
    ADMIN = "admin"


class UploadType(str, enum.Enum):
    OFFICIAL = "official"
    REUSE = "reuse"
    SUSPICIOUS = "suspicious"


class VerdictType(str, enum.Enum):
    ORIGINAL = "original"
    VERIFIED_REUSE = "verified_reuse"
    UNVERIFIED_COPY = "unverified_copy"
    FAKE = "fake"


class ViolationStatus(str, enum.Enum):
    PENDING = "pending"
    TAKEDOWN = "takedown"
    RESOLVED = "resolved"


# ── Models ─────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role: Column = Column(SAEnum(UserRole), nullable=False, default=UserRole.PHOTOGRAPHER)
    device_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    certificates = relationship("Certificate", back_populates="owner")
    uploads = relationship("Upload", back_populates="uploader")


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content_hash = Column(String(128), unique=True, nullable=False, index=True)
    timestamp_captured = Column(DateTime, nullable=False)
    device_id = Column(String(255), nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    tx_hash = Column(String(128), nullable=True)
    on_chain_token_id = Column(Integer, nullable=True)
    metadata_ = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="certificates")
    authorized_users = relationship("AuthorizedUser", back_populates="certificate")


class AuthorizedUser(Base):
    __tablename__ = "authorized_users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    certificate_id = Column(UUID(as_uuid=True), ForeignKey("certificates.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    granted_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    granted_at = Column(DateTime, default=datetime.utcnow)
    revoked_at = Column(DateTime, nullable=True)

    certificate = relationship("Certificate", back_populates="authorized_users")
    user = relationship("User", foreign_keys=[user_id])


class Upload(Base):
    __tablename__ = "uploads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    uploader_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_hash = Column(String(128), nullable=False, index=True)
    upload_type: Column = Column(SAEnum(UploadType), nullable=False, default=UploadType.SUSPICIOUS)
    verdict: Column = Column(SAEnum(VerdictType), nullable=True)
    ai_score = Column(Float, nullable=True)
    registry_match_id = Column(String(128), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    uploader = relationship("User", back_populates="uploads")


class Violation(Base):
    __tablename__ = "violations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    upload_id = Column(UUID(as_uuid=True), ForeignKey("uploads.id"), nullable=False)
    certificate_id = Column(UUID(as_uuid=True), ForeignKey("certificates.id"), nullable=False)
    violator_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reported_at = Column(DateTime, default=datetime.utcnow)
    status: Column = Column(SAEnum(ViolationStatus), default=ViolationStatus.PENDING)


class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_type = Column(String(100), nullable=False, index=True)
    actor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    resource_id = Column(String(128), nullable=True)
    resource_type = Column(String(50), nullable=True)
    metadata_ = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
