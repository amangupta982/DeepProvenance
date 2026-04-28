"""DeepProvenance — Configuration via Pydantic Settings."""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    app_name: str = "DeepProvenance"
    app_env: str = "development"
    debug: bool = True
    secret_key: str = "dev-secret-key-change-in-production"
    api_version: str = "v1"
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # Database
    database_url: str = "postgresql+asyncpg://deepprov:deepprov@localhost:5432/deepprovenance"

    # Redis
    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"

    # JWT
    jwt_secret_key: str = "jwt-dev-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    jwt_refresh_token_expire_days: int = 7

    # MinIO
    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin"
    minio_bucket: str = "deepprovenance-media"
    minio_use_ssl: bool = False

    # Pinecone
    pinecone_api_key: str = ""
    pinecone_environment: str = "us-east-1"
    pinecone_index_name: str = "content-dna-registry"

    # Blockchain
    polygon_rpc_url: str = "https://rpc.cardona.zkevm-rpc.com"
    polygon_chain_id: int = 2442
    contract_address: str = "0x0000000000000000000000000000000000000000"
    deployer_private_key: str = ""

    # ML
    model_path: str = "./ml/checkpoints/vit_forgery_detector.pth"
    model_name: str = "google/vit-base-patch16-224"
    confidence_threshold: float = 0.7
    demo_mode: bool = True

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "protected_namespaces": ("settings_",),
    }


@lru_cache()
def get_settings() -> Settings:
    return Settings()
