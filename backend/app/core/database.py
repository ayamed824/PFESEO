# backend/app/core/database.py
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.user import User
from app.models.subscription import Subscription
from app.models.analysis import Analysis


client = AsyncIOMotorClient(settings.MONGODB_URL)

async def init_db():
    """Initialiser la connexion MongoDB avec Beanie"""
    
    
    await init_beanie(
        database=client[settings.DATABASE_NAME],
        document_models=[User, Subscription,
        Analysis,]
    )
    print("✅ MongoDB connecté avec Beanie")
    print(f"📊 Base de données: {settings.DATABASE_NAME}")