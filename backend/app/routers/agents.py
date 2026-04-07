# backend/app/routers/agents.py
from fastapi import APIRouter, HTTPException, Depends, status
from typing import Optional, Dict, Any, Literal
from app.core.security import get_current_active_user
from app.models.user import User
from app.services.openrouter import openrouter_client
from app.services.agent_prompts import get_agent_prompt  # Task #11

router = APIRouter(prefix="/api/agents", tags=["🤖 AI Agents"])

# Types d'agents disponibles
AgentType = Literal["technical", "content", "ux", "popularity", "recommendation"]

@router.post("/{agent_type}/chat")
async def agent_chat(
    agent_type: AgentType,
    message: str,
    context: Optional[Dict[str, Any]] = None,
    current_user: User = Depends(get_current_active_user)
):
    """
    Chat avec un agent SEO intelligent
    
    Args:
        agent_type: Type d'agent (technical/content/ux/popularity/recommendation)
        message: Message de l'utilisateur
        context: Données optionnelles (ex: résultats d'analyse SEO)
        current_user: Utilisateur authentifié
    """
    # 1️⃣ Charger le prompt système pour cet agent
    system_prompt = get_agent_prompt(agent_type)
    if not system_prompt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Agent type '{agent_type}' not supported"
        )
    
    # 2️⃣ Préparer le contexte enrichi avec les données SEO
    enriched_context = ""
    if context and context.get("analysis"):
        a = context["analysis"]
        enriched_context += f"\n📊 Latest SEO Analysis for {a.get('url', 'N/A')}:\n"
        enriched_context += f"   • Global Score: {a.get('global_score', 'N/A')}/100\n"
        enriched_context += f"   • Technical: {a.get('category_scores', {}).get('technical', 'N/A')}/100\n"
        enriched_context += f"   • Content: {a.get('category_scores', {}).get('content', 'N/A')}/100\n"
        enriched_context += f"   • UX: {a.get('category_scores', {}).get('ux', 'N/A')}/100\n"
        enriched_context += f"   • Popularity: {a.get('category_scores', {}).get('popularity', 'N/A')}/100\n"
        
        if a.get("issues"):
            enriched_context += f"\n⚠️ Top Issues Found:\n"
            for issue in a["issues"][:5]:  # Top 5 issues
                enriched_context += f"   • {issue}\n"
    
    # 3️⃣ Préparer les messages pour l'API OpenRouter
    messages = [
        {"role": "user", "content": f"{message}\n\nContext:{enriched_context}"}
    ]
    
    # 4️⃣ Appeler OpenRouter (Task #9)
    result = await openrouter_client.chat_completion(
        messages=messages,
        system_prompt=system_prompt,
        temperature=0.7,
        max_tokens=2000
    )
    
    # 5️⃣ Gérer les erreurs
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI Service Error: {result['error']}"
        )
    
    # 6️⃣ Retourner la réponse
    return {
        "agent_type": agent_type,
        "response": result["response"],
        "model_used": result["model_used"],
        "usage": result.get("usage", {})
    }


@router.get("/types")
async def get_agent_types():
    """Lister les types d'agents disponibles"""
    return {
        "agents": [
            {
                "type": "technical",
                "name": "Technical SEO Agent",
                "description": "Expert en performance, crawlabilité, Core Web Vitals",
                "icon": "🔧"
            },
            {
                "type": "content",
                "name": "Content Agent",
                "description": "Expert en mots-clés, lisibilité, meta tags",
                "icon": "📝"
            },
            {
                "type": "ux",
                "name": "UX/UI Agent",
                "description": "Expert en ergonomie, accessibilité, mobile-friendly",
                "icon": "🎨"
            },
            {
                "type": "popularity",
                "name": "Popularity Agent",
                "description": "Expert en backlinks, autorité de domaine, social signals",
                "icon": "🔗"
            },
            {
                "type": "recommendation",
                "name": "Recommendation Agent",
                "description": "Synthétise toutes les analyses en actions prioritaires",
                "icon": "💡"
            }
        ]
    }