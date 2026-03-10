from beanie import Document, Indexed
from datetime import datetime
from typing import Optional, Literal
from pydantic import Field

class Subscription(Document):
    user_id: Indexed(str)
    plan: Literal["starter", "pro", "enterprise"]
    billing_cycle: Literal["monthly", "yearly"]
    price: float
    currency: str = "EUR"

    status: Literal["active", "canceled", "past_due"] = "active"
    current_period_start: datetime
    current_period_end: datetime

    analyses_limit: int = 10
    pages_per_analysis_limit: int = 10
    analyses_used: int = 0
    customer_info: Optional[dict] = None

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None
    canceled_at: Optional[datetime] = None

    class Settings:
        name = "subscriptions"
        use_state_management = True

    def is_active(self) -> bool:
        return self.status == "active" and datetime.now() < self.current_period_end