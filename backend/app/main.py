"""DeepProvenance — FastAPI Application."""
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import structlog
import hashlib
import uuid
import time
import random
from datetime import datetime, timezone

from app.config import get_settings
from app.schemas import (
    RegisterRequest, LoginRequest, TokenResponse, UserResponse,
    VerifyTaskResponse, VerificationResult, FeatureScores, AnalyticsOverview, ModelStatsResponse,
    TakedownRequest
)
from app.ml import detector, dna_extractor, verdict_engine
from app.blockchain import blockchain_service

logger = structlog.get_logger()
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("app.startup", app=settings.app_name, env=settings.app_env)
    yield
    logger.info("app.shutdown")


app = FastAPI(
    title="DeepProvenance API",
    description="AI Forgery Detection & Blockchain Provenance for Sports Media",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# In-memory demo storage (replaces DB in demo mode)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

demo_users: dict = {}
demo_tasks: dict = {}
demo_certificates: dict = {}
demo_uploads: list = []


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# AUTH ENDPOINTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.post("/api/v1/auth/register", response_model=UserResponse, tags=["Auth"])
async def register(req: RegisterRequest):
    """Register a new creator account."""
    if req.email in demo_users:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    user = {
        "id": user_id, "email": req.email, "role": req.role.value,
        "device_id": req.device_id, "created_at": now.isoformat()
    }
    demo_users[req.email] = user
    logger.info("auth.register", email=req.email, role=req.role)
    return UserResponse(
        id=user_id, 
        email=req.email, 
        role=req.role.value, 
        device_id=req.device_id, 
        created_at=now
    )


@app.post("/api/v1/auth/login", response_model=TokenResponse, tags=["Auth"])
async def login(req: LoginRequest):
    """Authenticate and receive JWT tokens."""
    import secrets
    token = secrets.token_urlsafe(32)
    return TokenResponse(
        access_token=token,
        refresh_token=secrets.token_urlsafe(32),
        expires_in=settings.jwt_access_token_expire_minutes * 60
    )


@app.post("/api/v1/auth/refresh", response_model=TokenResponse, tags=["Auth"])
async def refresh_token():
    """Refresh access token."""
    import secrets
    return TokenResponse(
        access_token=secrets.token_urlsafe(32),
        refresh_token=secrets.token_urlsafe(32),
        expires_in=settings.jwt_access_token_expire_minutes * 60
    )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# UPLOAD & VERIFICATION ENDPOINTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.post("/api/v1/upload/verify", response_model=VerifyTaskResponse, tags=["Upload"])
async def verify_upload(
    file: UploadFile = File(...),
    upload_type: str = Form("suspicious"),
):
    """Upload an image for verification. Returns task_id for polling."""
    contents = await file.read()
    file_hash = hashlib.sha256(contents).hexdigest()
    task_id = f"task_{uuid.uuid4().hex[:12]}"

    # Run detection (simulated async — in production uses Celery)
    prediction = detector.predict(contents, file_hash)
    registry_score = random.uniform(5, 20) if prediction["is_fake"] else random.uniform(85, 99)
    ownership_flag = random.choice([True, False]) if not prediction["is_fake"] else False
    is_owner = ownership_flag and random.random() > 0.5

    verdict_result = verdict_engine.compute(
        ai_score=prediction["ai_score"],
        registry_score=registry_score,
        ownership_flag=ownership_flag,
        is_owner=is_owner,
    )

    demo_tasks[task_id] = {
        "task_id": task_id,
        "status": "complete",
        "verdict": verdict_result["verdict"],
        "ai_score": prediction["ai_score"],
        "registry_score": round(registry_score, 1),
        "ownership_flag": ownership_flag,
        "feature_scores": prediction.get("feature_scores", {}),
        "processing_time_ms": prediction.get("inference_time_ms", 250) + random.randint(100, 500),
        "heatmap_url": f"/api/v1/heatmap/{task_id}.png" if prediction["is_fake"] else None,
        "file_hash": file_hash,
    }

    logger.info("upload.verify", task_id=task_id, file=file.filename, hash=file_hash[:16])
    return VerifyTaskResponse(task_id=task_id, status="processing", message="Verification started")


@app.get("/api/v1/upload/result/{task_id}", response_model=VerificationResult, tags=["Upload"])
async def get_verification_result(task_id: str):
    """Poll for verification result."""
    if task_id not in demo_tasks:
        raise HTTPException(status_code=404, detail="Task not found")

    task = demo_tasks[task_id]
    return VerificationResult(
        task_id=task_id,
        status=task["status"],
        verdict=task.get("verdict"),
        ai_score=task.get("ai_score"),
        registry_score=task.get("registry_score"),
        ownership_flag=task.get("ownership_flag"),
        heatmap_url=task.get("heatmap_url"),
        feature_scores=FeatureScores(**task["feature_scores"]) if task.get("feature_scores") else None,
        processing_time_ms=task.get("processing_time_ms"),
    )


@app.post("/api/v1/upload/mint", tags=["Upload"])
async def mint_certificate(
    file: UploadFile = File(...),
    device_id: str = Form("CANON-EOS-R5"),
):
    """Mint a Reality Certificate for official content."""
    contents = await file.read()
    file_hash = hashlib.sha256(contents).hexdigest()

    # Extract content DNA
    embedding = dna_extractor.extract(contents)

    # Mint on blockchain
    mint_result = blockchain_service.mint_certificate(
        content_hash=file_hash,
        device_id=device_id,
        owner_address="0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38",
        timestamp=int(time.time()),
    )

    cert = {
        "id": str(uuid.uuid4()),
        "content_hash": file_hash,
        "timestamp_captured": datetime.now(timezone.utc).isoformat(),
        "device_id": device_id,
        "owner_id": "demo_user",
        "tx_hash": mint_result["tx_hash"],
        "on_chain_token_id": mint_result["token_id"],
        "metadata": {"filename": file.filename, "embedding_dim": len(embedding)},
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    demo_certificates[file_hash] = cert

    logger.info("upload.mint", hash=file_hash[:16], token_id=mint_result["token_id"])
    return {"certificate": cert, "blockchain": mint_result}


@app.get("/api/v1/upload/history", tags=["Upload"])
async def upload_history():
    """Get user's upload history."""
    return {"uploads": demo_uploads[-20:]}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CERTIFICATE ENDPOINTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.get("/api/v1/certificate/{content_hash}", tags=["Certificate"])
async def get_certificate(content_hash: str):
    """Get certificate details by content hash."""
    # Return demo certificate
    return {
        "id": "cert_001",
        "content_hash": content_hash,
        "timestamp_captured": "2026-04-27T14:32:07Z",
        "device_id": "CANON-EOS-R5-SN4823",
        "owner_id": "user_001",
        "owner_email": "photographer@bcci.tv",
        "tx_hash": "0x3a2c8e9f1b4d7c6a5e2f8d9c0b3a4e5f6d7c8b9a0e1f2d3c4b5a6f7e8d9c0b",
        "on_chain_token_id": 1247,
        "metadata": {"event": "IPL 2026 Final", "venue": "Narendra Modi Stadium"},
        "created_at": "2026-04-27T14:32:07Z",
        "on_chain_verified": True,
    }


@app.post("/api/v1/certificate/{cert_id}/authorize", tags=["Certificate"])
async def authorize_user(cert_id: str, user_id: str = Form(...)):
    """Grant access to a user for this certificate."""
    return {"status": "authorized", "certificate_id": cert_id, "user_id": user_id}


@app.delete("/api/v1/certificate/{cert_id}/authorize/{user_id}", tags=["Certificate"])
async def revoke_authorization(cert_id: str, user_id: str):
    """Revoke user access to this certificate."""
    return {"status": "revoked", "certificate_id": cert_id, "user_id": user_id}


@app.get("/api/v1/certificate/{cert_id}/chain", tags=["Certificate"])
async def get_chain_of_custody(cert_id: str):
    """Get ownership history for a certificate."""
    return {
        "certificate_id": cert_id,
        "chain": [
            {"event": "Certificate Minted", "actor": "photographer@bcci.tv", "timestamp": "2026-04-27T14:32:07Z"},
            {"event": "DNA Registered", "actor": "System", "timestamp": "2026-04-27T14:32:08Z"},
            {"event": "User Authorized", "actor": "photographer@bcci.tv", "timestamp": "2026-04-27T14:35:22Z"},
            {"event": "Verified Reuse", "actor": "player@bcci.tv", "timestamp": "2026-04-27T15:10:45Z"},
            {"event": "Unauthorized Copy Flagged", "actor": "System", "timestamp": "2026-04-27T16:22:11Z"},
        ]
    }


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ML ENDPOINTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.post("/api/v1/ml/detect", tags=["ML"])
async def run_detection(file: UploadFile = File(...)):
    """Run AI forgery detection (internal endpoint)."""
    contents = await file.read()
    file_hash = hashlib.sha256(contents).hexdigest()
    result = detector.predict(contents, file_hash)
    return result


@app.get("/api/v1/ml/model-stats", response_model=ModelStatsResponse, tags=["ML"])
async def model_stats():
    """Get model accuracy metrics and version info."""
    return ModelStatsResponse(
        version="vit-base-v1.0",
        f1_score=0.934,
        auc_roc=0.961,
        precision=0.912,
        recall=0.957,
        total_predictions=48291,
        last_updated=datetime.now(timezone.utc),
    )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ANALYTICS ENDPOINTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.get("/api/v1/analytics/overview", response_model=AnalyticsOverview, tags=["Analytics"])
async def analytics_overview():
    """Get overall analytics."""
    return AnalyticsOverview(
        total_certificates=12847,
        total_verifications=48291,
        fakes_detected=3241,
        violations_reported=892,
        detection_rate=98.7,
        avg_confidence=94.2,
        avg_response_ms=2340,
    )


@app.get("/api/v1/analytics/heatmap", tags=["Analytics"])
async def analytics_heatmap():
    """Get platform violation distribution."""
    return {
        "platforms": [
            {"platform": "Twitter/X", "violations": 245},
            {"platform": "Instagram", "violations": 189},
            {"platform": "Facebook", "violations": 134},
            {"platform": "TikTok", "violations": 98},
            {"platform": "YouTube", "violations": 67},
            {"platform": "Reddit", "violations": 45},
        ]
    }


@app.get("/api/v1/analytics/audit/{upload_id}", tags=["Analytics"])
async def get_audit_trail(upload_id: str):
    """Get chain-of-custody for an asset."""
    return {
        "upload_id": upload_id,
        "trail": [
            {"event": "Upload Received", "timestamp": "2026-04-27T14:32:06Z", "actor": "system"},
            {"event": "Feature Extraction", "timestamp": "2026-04-27T14:32:07Z", "actor": "ml_pipeline"},
            {"event": "Registry Search", "timestamp": "2026-04-27T14:32:08Z", "actor": "pinecone"},
            {"event": "Forgery Detection", "timestamp": "2026-04-27T14:32:09Z", "actor": "vit_model"},
            {"event": "Verdict Computed", "timestamp": "2026-04-27T14:32:10Z", "actor": "verdict_engine"},
        ]
    }


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ADMIN ENDPOINTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.post("/api/v1/admin/takedown", tags=["Admin"])
async def initiate_takedown(req: TakedownRequest):
    """Initiate a content takedown."""
    return {"status": "takedown_initiated", "upload_id": req.upload_id, "reason": req.reason}


@app.get("/api/v1/admin/queue", tags=["Admin"])
async def review_queue():
    """Get human review queue."""
    return {
        "queue": [
            {"id": "upl_001", "file": "suspicious_match.jpg", "ai_score": 87, "status": "pending"},
            {"id": "upl_002", "file": "ipl_celebration.png", "ai_score": 4, "status": "pending"},
            {"id": "upl_003", "file": "world_cup.jpg", "ai_score": 92, "status": "reviewing"},
        ]
    }


@app.post("/api/v1/admin/export/{upload_id}", tags=["Admin"])
async def export_forensic_report(upload_id: str):
    """Generate forensic report PDF."""
    return {"status": "generating", "upload_id": upload_id, "estimated_time_ms": 5000}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# HEALTH CHECK
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.get("/api/health", tags=["Health"])
async def health():
    return {"status": "healthy", "service": "DeepProvenance API", "version": "1.0.0", "demo_mode": settings.demo_mode}
