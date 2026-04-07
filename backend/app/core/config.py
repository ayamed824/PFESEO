# backend/app/core/config.py
from pydantic_settings import BaseSettings
from typing import Optional, List

class Settings(BaseSettings):
    # ==================== APPLICATION ====================
    PROJECT_NAME: str = "SEO Platform PFE"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    DEBUG: bool = True
     # ==================== OPENROUTER AI ====================
    OPENROUTER_API_KEY: Optional[str] = None
    OPENROUTER_MODEL: str = "openrouter/free"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    # ==================== MONGODB ====================
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "seo_platform"
    
    # ==================== JWT / SECURITY ====================
    SECRET_KEY: str = "ton_secret_key_tres_long_et_securise_123456789"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # ==================== BCRYPT ====================
    BCRYPT_ROUNDS: int = 12
    
    # ==================== STRIPE (Optionnel - pour les abonnements) ====================
    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None
    STRIPE_PRICE_STARTER_MONTHLY: Optional[str] = None
    STRIPE_PRICE_STARTER_YEARLY: Optional[str] = None
    STRIPE_PRICE_PRO_MONTHLY: Optional[str] = None
    STRIPE_PRICE_PRO_YEARLY: Optional[str] = None
    STRIPE_PRICE_ENTERPRISE_MONTHLY: Optional[str] = None
    STRIPE_PRICE_ENTERPRISE_YEARLY: Optional[str] = None
    
    # ==================== FRONTEND ====================
    FRONTEND_URL: str = "http://localhost:3000"
    
    # ==================== CORS ====================
    CORS_ORIGINS: List[str] = ["*"]  # En prod: ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        # ✅ Autoriser les variables non définies (optionnel)
        # extra = "allow"

settings = Settings()