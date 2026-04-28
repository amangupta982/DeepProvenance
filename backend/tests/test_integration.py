"""DeepProvenance — Integration Tests for API endpoints."""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.fixture
def client():
    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url="http://test")


@pytest.mark.asyncio
async def test_health_check(client):
    async with client as ac:
        resp = await ac.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert data["service"] == "DeepProvenance API"


@pytest.mark.asyncio
async def test_register_user(client):
    async with client as ac:
        resp = await ac.post("/api/v1/auth/register", json={
            "email": "test@example.com",
            "password": "securepassword123",
            "role": "photographer",
        })
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "test@example.com"
    assert data["role"] == "photographer"


@pytest.mark.asyncio
async def test_login(client):
    async with client as ac:
        resp = await ac.post("/api/v1/auth/login", json={
            "email": "test@example.com",
            "password": "securepassword123",
        })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_model_stats(client):
    async with client as ac:
        resp = await ac.get("/api/v1/ml/model-stats")
    assert resp.status_code == 200
    data = resp.json()
    assert data["version"] == "vit-base-v1.0"
    assert data["f1_score"] > 0.9
    assert data["auc_roc"] > 0.93


@pytest.mark.asyncio
async def test_analytics_overview(client):
    async with client as ac:
        resp = await ac.get("/api/v1/analytics/overview")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_certificates"] > 0
    assert data["detection_rate"] > 95


@pytest.mark.asyncio
async def test_analytics_heatmap(client):
    async with client as ac:
        resp = await ac.get("/api/v1/analytics/heatmap")
    assert resp.status_code == 200
    data = resp.json()
    assert "platforms" in data
    assert len(data["platforms"]) > 0


@pytest.mark.asyncio
async def test_certificate_by_hash(client):
    async with client as ac:
        resp = await ac.get("/api/v1/certificate/0xabc123")
    assert resp.status_code == 200
    data = resp.json()
    assert "content_hash" in data
    assert "tx_hash" in data


@pytest.mark.asyncio
async def test_chain_of_custody(client):
    async with client as ac:
        resp = await ac.get("/api/v1/certificate/cert_001/chain")
    assert resp.status_code == 200
    data = resp.json()
    assert "chain" in data
    assert len(data["chain"]) > 0


@pytest.mark.asyncio
async def test_admin_queue(client):
    async with client as ac:
        resp = await ac.get("/api/v1/admin/queue")
    assert resp.status_code == 200
    data = resp.json()
    assert "queue" in data


@pytest.mark.asyncio
async def test_upload_verify(client):
    """Test file upload and verification."""
    import io
    # Create a simple test image
    from PIL import Image
    img = Image.new("RGB", (224, 224), color="green")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    async with client as ac:
        resp = await ac.post(
            "/api/v1/upload/verify",
            files={"file": ("test.jpg", buf, "image/jpeg")},
            data={"upload_type": "suspicious"},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "task_id" in data
        assert data["status"] in ["pending", "processing"]

        # Poll for result
        resp = await ac.get(f"/api/v1/upload/result/{data['task_id']}")
        assert resp.status_code == 200
        result = resp.json()
        assert result["status"] == "complete"
        assert result["verdict"] in ["original", "verified_reuse", "unverified_copy", "fake"]
        assert 0 <= result["ai_score"] <= 100
