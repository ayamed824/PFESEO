# backend/app/routers/analysis.py

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from pydantic import BaseModel, Field

from app.core.security import get_current_active_user
from app.models.user import User
from app.models.analysis import Analysis
from app.models.subscription import Subscription
from app.services.seo_crawler import crawl_website
from app.services.scoring import compute_scores

router = APIRouter(
    tags=["🔎 Analysis"]
)

# =============================
# Request Schema
# =============================
class LaunchAnalysisRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2048)


# =============================
# Response Schema
# =============================
class AnalysisResponse(BaseModel):
    message: str
    analysis_id: str
    global_score: int

    class Config:
        from_attributes = True


# =============================
# POST /api/analysis/launch
# =============================
@router.post("/launch", response_model=AnalysisResponse)
async def launch_analysis(
    request: LaunchAnalysisRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Launch a new SEO analysis:
    - Validate URL
    - Check subscription quota
    - Crawl website
    - Compute SEO scores
    - Save analysis
    """

    url = request.url.strip()

    # ✅ Auto-fix URL
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    # =============================
    # 🔐 Subscription Check
    # =============================
    subscription = await Subscription.find_one(
        Subscription.user_id == str(current_user.id)
    )

    if not subscription or not subscription.is_active():
        raise HTTPException(
            status_code=403,
            detail="No active subscription."
        )

    if not subscription.can_run_analysis():
        raise HTTPException(
            status_code=403,
            detail="Analysis quota exceeded. Upgrade your plan."
        )

    try:
        # =============================
        # 1️⃣ Crawl Website
        # =============================
        raw_data = await crawl_website(url)

        # =============================
        # 2️⃣ Compute Scores
        # =============================
        scores = compute_scores(raw_data)

        # =============================
        # 3️⃣ Save Analysis
        # =============================
        # ✅ FIX: convert dict → list
        # ✅ FIX: convert dict → list
        raw_issues = scores.get("issues", {})

        all_issues = []
        if isinstance(raw_issues, dict):
            for level in ["critical", "high", "medium", "low"]:
                all_issues.extend(raw_issues.get(level, []))
        else:
            all_issues = raw_issues

        analysis = Analysis(
            user_id=str(current_user.id),
            url=url,
            global_score=scores.get("global_score", 0),
            category_scores=scores.get("categories", {}),
            raw_data=raw_data,
            issues=all_issues,   # ✅ FIXED
            status="completed"
        )

        await analysis.insert()

        # =============================
        # 4️⃣ Update Subscription
        # =============================
        subscription.analyses_used += 1
        await subscription.save()

        return {
            "message": "Analysis completed successfully",
            "analysis_id": str(analysis.id),
            "global_score": scores.get("global_score", 0)
        }

    except Exception as e:
        import logging
        logging.error(f"Analysis failed: {e}", exc_info=True)

        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


# =============================
# GET /api/analysis/{id}
# =============================
@router.get("/{id}")
async def get_analysis(
    id: str,
    current_user: User = Depends(get_current_active_user)
):
    analysis = await Analysis.get(id)

    if not analysis:
        raise HTTPException(404, "Analysis not found")

    if analysis.user_id != str(current_user.id):
        raise HTTPException(403, "Access denied")

    return {
        "id": str(analysis.id),
        "url": analysis.url,
        "scores": {
            "global_score": analysis.global_score,
            "technical_seo": analysis.category_scores.get("technical", 0),
            "content_quality": analysis.category_scores.get("content", 0),
            "ux_ui": analysis.category_scores.get("ux", 0),
            "popularity": analysis.category_scores.get("popularity", 0),
        },
        "category_scores": analysis.category_scores,
        "raw_data": analysis.raw_data,
        "issues": analysis.issues,
        "status": analysis.status,
        "created_at": analysis.created_at
    }


# =============================
# GET /api/analysis/
# =============================
@router.get("/")
async def list_user_analyses(
    limit: int = 20,
    current_user: User = Depends(get_current_active_user)
):
    """List user's analyses"""

    analyses = await Analysis.find(
        Analysis.user_id == str(current_user.id)
    ).sort(-Analysis.created_at).limit(limit).to_list()

    return {
    "total": len(analyses),
    "analyses": [
        {
            "id": str(a.id),
            "url": a.url,
            "scores": {
                "global_score": a.global_score,
                "technical_seo": a.category_scores.get("technical", 0),
                "content_quality": a.category_scores.get("content", 0),
                "ux_ui": a.category_scores.get("ux", 0),
                "popularity": a.category_scores.get("popularity", 0),
            },
            "created_at": a.created_at
        }
        for a in analyses
    ]
}