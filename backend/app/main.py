# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ← IMPORTANT: importer ça
from app.core.database import init_db
from app.routers import auth, users, subscriptions, agents, analysis

# Créer l'app FIRST
app = FastAPI(
    title="PFESEO API",
    description="SEO Analysis Platform with AI Agents",
    version="1.0.0",
    docs_url="/api/docs",           # ← Swagger UI
    redoc_url="/api/redoc",         # ← ReDoc (optionnel)
    openapi_url="/api/openapi.json" # ← Spec OpenAPI
)


# ⚠️ CORS DOIT être ajouté IMMÉDIATEMENT après la création de l'app
# ⚠️ AVANT d'inclure les routers !
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ← "*" pour le développement (autorise tout)
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, OPTIONS, etc.
    allow_headers=["*"],  # Authorization, Content-Type, etc.
)

# ✅ Maintenant on peut inclure les routers
app.include_router(auth.router, prefix="/api/auth", tags=["🔐 Auth"])
app.include_router(users.router, prefix="/api/users", tags=["👤 Users"])
app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["💳 Subs"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["📊 Analysis"])
app.include_router(agents.router, prefix="/api/agents", tags=["🤖 Agents"])

# Health check
@app.get("/api/health")
async def health():
    return {"status": "ok", "cors": "enabled"}

# Startup
@app.on_event("startup")
async def startup():
    await init_db()
    print("✅ MongoDB + CORS ready")