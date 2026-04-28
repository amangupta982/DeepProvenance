"""DeepProvenance — ML Inference Service (Simulated for demo, real architecture)."""
import hashlib
import random
import time
from typing import Optional
import structlog

logger = structlog.get_logger()


class ForgeryDetector:
    """
    ViT-based AI forgery detector.
    In production, loads google/vit-base-patch16-224 fine-tuned checkpoint.
    In demo mode, returns deterministic simulated results.
    """

    def __init__(self, model_path: Optional[str] = None, demo_mode: bool = True):
        self.demo_mode = demo_mode
        self.model_loaded = False
        self.model_path = model_path

        if not demo_mode and model_path:
            self._load_model(model_path)
        else:
            logger.info("ml.detector.init", mode="demo", message="Using simulated inference")

    def _load_model(self, path: str):
        """Load the fine-tuned ViT model."""
        try:
            import torch
            import timm
            self.model = timm.create_model("vit_base_patch16_224", pretrained=False, num_classes=2)
            checkpoint = torch.load(path, map_location="cpu")
            self.model.load_state_dict(checkpoint)
            self.model.eval()
            self.model_loaded = True
            logger.info("ml.detector.loaded", path=path)
        except Exception as e:
            logger.warning("ml.detector.load_failed", error=str(e), fallback="demo_mode")
            self.demo_mode = True

    def predict(self, image_bytes: bytes, file_hash: str = "") -> dict:
        """Run forgery detection on an image."""
        start = time.time()

        if self.demo_mode:
            return self._simulate_prediction(file_hash)

        return self._real_prediction(image_bytes)

    def _simulate_prediction(self, file_hash: str) -> dict:
        """Deterministic simulation based on file hash for consistent demo results."""
        seed = int(hashlib.md5(file_hash.encode()).hexdigest()[:8], 16)
        rng = random.Random(seed)

        # ~30% chance of being flagged as fake for random uploads
        is_fake = rng.random() > 0.7
        ai_score = rng.uniform(75, 97) if is_fake else rng.uniform(1, 15)

        feature_scores = {
            "grass": round(rng.uniform(30, 50) if is_fake else rng.uniform(0, 5), 1),
            "jerseys": round(rng.uniform(20, 35) if is_fake else rng.uniform(0, 3), 1),
            "ball": round(rng.uniform(15, 35) if is_fake else rng.uniform(0, 3), 1),
            "crowd": round(rng.uniform(15, 30) if is_fake else rng.uniform(0, 2), 1),
            "lighting": round(rng.uniform(10, 25) if is_fake else rng.uniform(0, 2), 1),
            "hands": round(rng.uniform(5, 20) if is_fake else rng.uniform(0, 1), 1),
        }

        return {
            "ai_score": round(ai_score, 1),
            "is_fake": is_fake,
            "confidence": round(abs(ai_score - 50) * 2, 1),
            "feature_scores": feature_scores,
            "model_version": "vit-base-v1.0-demo",
            "inference_time_ms": random.randint(150, 450),
        }

    def _real_prediction(self, image_bytes: bytes) -> dict:
        """Real ViT inference (used when model is loaded)."""
        import torch
        from torchvision import transforms
        from PIL import Image
        import io

        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = transform(image).unsqueeze(0)

        with torch.no_grad():
            output = self.model(tensor)
            probs = torch.softmax(output, dim=1)
            ai_prob = probs[0][1].item()

        return {
            "ai_score": round(ai_prob * 100, 1),
            "is_fake": ai_prob > 0.5,
            "confidence": round(abs(ai_prob - 0.5) * 200, 1),
            "feature_scores": {},
            "model_version": "vit-base-v1.0",
        }


class ContentDNAExtractor:
    """Extract 768-dim visual embeddings using ViT for content registry."""

    def __init__(self, demo_mode: bool = True):
        self.demo_mode = demo_mode

    def extract(self, image_bytes: bytes) -> list[float]:
        """Extract 768-dimensional content DNA embedding."""
        if self.demo_mode:
            seed = int(hashlib.md5(image_bytes[:1024]).hexdigest()[:8], 16)
            rng = random.Random(seed)
            return [round(rng.gauss(0, 1), 6) for _ in range(768)]

        # Real extraction with ViT
        import torch
        import timm
        from torchvision import transforms
        from PIL import Image
        import io

        model = timm.create_model("vit_base_patch16_224", pretrained=True)
        model.head = torch.nn.Identity()
        model.eval()

        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = transform(image).unsqueeze(0)

        with torch.no_grad():
            embedding = model(tensor).squeeze().tolist()

        return embedding


class VerdictEngine:
    """Combines AI score, registry score, and ownership to determine verdict."""

    @staticmethod
    def compute(ai_score: float, registry_score: float, ownership_flag: bool, is_owner: bool = False) -> dict:
        if registry_score > 85 and is_owner and ai_score < 10:
            verdict = "original"
        elif registry_score > 85 and ownership_flag and ai_score < 30:
            verdict = "verified_reuse"
        elif registry_score > 85 and not ownership_flag:
            verdict = "unverified_copy"
        elif ai_score > 70 and registry_score < 30:
            verdict = "fake"
        elif 40 <= ai_score <= 70:
            verdict = "human_review"
        else:
            verdict = "original" if ai_score < 30 else "fake"

        return {
            "verdict": verdict,
            "ai_score": round(ai_score, 1),
            "registry_score": round(registry_score, 1),
            "ownership_flag": ownership_flag,
            "confidence": round(max(abs(ai_score - 50), abs(registry_score - 50)) * 2, 1),
        }


# Singleton instances
detector = ForgeryDetector(demo_mode=True)
dna_extractor = ContentDNAExtractor(demo_mode=True)
verdict_engine = VerdictEngine()
