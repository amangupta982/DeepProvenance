"""DeepProvenance — Unit Tests for ML Pipeline."""
import pytest


class TestFeatureExtractor:
    """Tests for ViT embedding extraction."""

    def test_embedding_shape(self):
        from app.ml import dna_extractor
        embedding = dna_extractor.extract(b"test_image_bytes" * 100)
        assert len(embedding) == 768, f"Expected 768-dim embedding, got {len(embedding)}"

    def test_embedding_determinism(self):
        from app.ml import dna_extractor
        data = b"deterministic_test_data" * 100
        e1 = dna_extractor.extract(data)
        e2 = dna_extractor.extract(data)
        assert e1 == e2, "Embeddings should be deterministic for same input"

    def test_embedding_values_normalized(self):
        from app.ml import dna_extractor
        embedding = dna_extractor.extract(b"test_data" * 100)
        assert all(isinstance(v, float) for v in embedding)


class TestForgeryDetector:
    """Tests for AI forgery detection."""

    def test_model_returns_score(self):
        from app.ml import detector
        result = detector.predict(b"test_image" * 100, "test_hash")
        assert "ai_score" in result
        assert 0 <= result["ai_score"] <= 100

    def test_deterministic_results(self):
        from app.ml import detector
        r1 = detector.predict(b"test" * 100, "same_hash")
        r2 = detector.predict(b"test" * 100, "same_hash")
        assert r1["ai_score"] == r2["ai_score"]

    def test_feature_scores_present(self):
        from app.ml import detector
        result = detector.predict(b"image_data" * 100, "hash123")
        assert "feature_scores" in result
        scores = result["feature_scores"]
        for key in ["grass", "jerseys", "ball", "crowd", "lighting", "hands"]:
            assert key in scores

    def test_model_version(self):
        from app.ml import detector
        result = detector.predict(b"data" * 100, "hash")
        assert "model_version" in result


class TestVerdictEngine:
    """Tests for verdict computation logic."""

    def test_original_verified(self):
        from app.ml import verdict_engine
        result = verdict_engine.compute(ai_score=5, registry_score=95, ownership_flag=True, is_owner=True)
        assert result["verdict"] == "original"

    def test_verified_reuse(self):
        from app.ml import verdict_engine
        result = verdict_engine.compute(ai_score=8, registry_score=92, ownership_flag=True, is_owner=False)
        assert result["verdict"] == "verified_reuse"

    def test_unverified_copy(self):
        from app.ml import verdict_engine
        result = verdict_engine.compute(ai_score=5, registry_score=90, ownership_flag=False, is_owner=False)
        assert result["verdict"] == "unverified_copy"

    def test_fake_detected(self):
        from app.ml import verdict_engine
        result = verdict_engine.compute(ai_score=85, registry_score=10, ownership_flag=False, is_owner=False)
        assert result["verdict"] == "fake"

    def test_edge_case_ambiguous(self):
        from app.ml import verdict_engine
        result = verdict_engine.compute(ai_score=50, registry_score=50, ownership_flag=False, is_owner=False)
        assert result["verdict"] == "human_review"

    def test_confidence_score(self):
        from app.ml import verdict_engine
        result = verdict_engine.compute(ai_score=92, registry_score=8, ownership_flag=False)
        assert "confidence" in result
        assert result["confidence"] > 0


class TestBlockchain:
    """Tests for blockchain service."""

    def test_mint_returns_token_id(self):
        from app.blockchain import blockchain_service
        result = blockchain_service.mint_certificate("0xabc123", "DEVICE-1", "0x742d...", 1714200000)
        assert result["success"] is True
        assert "token_id" in result
        assert "tx_hash" in result

    def test_mint_returns_explorer_url(self):
        from app.blockchain import blockchain_service
        result = blockchain_service.mint_certificate("0xdef456", "DEVICE-2", "0x742d...", 1714200000)
        assert "explorer_url" in result
        assert "polygonscan.com" in result["explorer_url"]

    def test_verify_certificate(self):
        from app.blockchain import blockchain_service
        result = blockchain_service.verify_certificate(1247)
        assert result["exists"] is True
        assert "content_hash" in result
