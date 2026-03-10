from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.routers import auth, users, subscriptions

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SEO Platform PFE API with Subscription System",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redoc_url="/api/redoc"
)

# ✅ CORS fix for React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(subscriptions.router)

@app.on_event("startup")
async def on_startup():
    """Initialize MongoDB / Beanie"""
    await init_db()

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": settings.PROJECT_NAME, "version": settings.VERSION}

@app.get("/", tags=["Root"])
async def root():
    return {"message": "🚀 Welcome to SEO Platform API", "docs": "/api/docs", "health": "/api/health"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)