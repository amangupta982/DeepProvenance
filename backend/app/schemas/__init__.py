"""DeepProvenance — Pydantic Schemas for API validation."""
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime
from enum import Enum


# ── Enums ──────────────────────────────────────────────

class UserRoleSchema(str, Enum):
    photographer = "photographer"
    broadcaster = "broadcaster"
    agency = "agency"
    admin = "admin"


class VerdictSchema(str, Enum):
    original = "original"
    verified_reuse = "verified_reuse"
    unverified_copy = "unverified_copy"
    fake = "fake"


class UploadTypeSchema(str, Enum):
    official = "official"
    reuse = "reuse"
    suspicious = "suspicious"


# ── Auth ───────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: str = Field(..., description="User email")
    password: str = Field(..., min_length=8)
    role: UserRoleSchema = UserRoleSchema.photographer
    device_id: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    device_id: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ── Upload / Verification ─────────────────────────────

class VerifyRequest(BaseModel):
    upload_type: UploadTypeSchema = UploadTypeSchema.suspicious


class VerifyTaskResponse(BaseModel):
    task_id: str
    status: str = "pending"
    message: str = "Verification queued"


class FeatureScores(BaseModel):
    grass: float = 0.0
    jerseys: float = 0.0
    ball: float = 0.0
    crowd: float = 0.0
    lighting: float = 0.0
    hands: float = 0.0


class VerificationResult(BaseModel):
    task_id: str
    status: str
    verdict: Optional[VerdictSchema] = None
    ai_score: Optional[float] = None
    registry_score: Optional[float] = None
    ownership_flag: Optional[bool] = None
    heatmap_url: Optional[str] = None
    feature_scores: Optional[FeatureScores] = None
    certificate: Optional["CertificateResponse"] = None
    processing_time_ms: Optional[int] = None


# ── Certificate ───────────────────────────────────────

class MintRequest(BaseModel):
    device_id: str
    metadata: dict = Field(default_factory=dict)


class CertificateResponse(BaseModel):
    id: str
    content_hash: str
    timestamp_captured: datetime
    device_id: str
    owner_id: str
    owner_email: Optional[str] = None
    tx_hash: Optional[str]
    on_chain_token_id: Optional[int]
    metadata: dict = Field(default_factory=dict)
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AuthorizeRequest(BaseModel):
    user_id: str


class ChainOfCustodyEntry(BaseModel):
    event: str
    actor: str
    timestamp: datetime
    details: dict = Field(default_factory=dict)


# ── Analytics ─────────────────────────────────────────

class AnalyticsOverview(BaseModel):
    total_certificates: int
    total_verifications: int
    fakes_detected: int
    violations_reported: int
    detection_rate: float
    avg_confidence: float
    avg_response_ms: int


class PlatformViolation(BaseModel):
    platform: str
    count: int


class VerdictBreakdown(BaseModel):
    original: int
    verified_reuse: int
    unverified_copy: int
    fake: int


# ── Admin ─────────────────────────────────────────────

class TakedownRequest(BaseModel):
    upload_id: str
    reason: str


class ModelStatsResponse(BaseModel):
    version: str
    f1_score: float
    auc_roc: float
    precision: float
    recall: float
    total_predictions: int
    last_updated: datetime


# Update forward refs
VerificationResult.model_rebuild()
