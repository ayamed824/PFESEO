# backend/app/core/database.py
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGODB_URL)

async def init_db():
    """Initialiser la connexion MongoDB avec Beanie"""
    from app.models.user import User
    from app.models.subscription import Subscription
    
    await init_beanie(
        database=client[settings.DATABASE_NAME],
        document_models=[User, Subscription]
    )
    print("✅ MongoDB connecté avec Beanie")
    print(f"📊 Base de données: {settings.DATABASE_NAME}")