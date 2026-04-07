# backend/app/models/analysis.py
from beanie import Document
from pydantic import Field
from datetime import datetime

class Analysis(Document):
    """Modèle minimal - 100% compatible Pydantic v2"""
    
    user_id: str
    url: str
    global_score: int = 0
    category_scores: dict = Field(default_factory=dict)
    raw_data: dict = Field(default_factory=dict)
    issues: list = Field(default_factory=list)
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "analyses"