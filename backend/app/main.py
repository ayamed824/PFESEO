from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.database import init_db
from app.routers import auth, users, subscriptions, agents, analysis, admin
from app.routers.pricing import router as pricing_router
from app.routers.export import router as export_router

app = FastAPI(
    title="PFESEO API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# ✅ MIDDLEWARE CUSTOM CORS - Force les headers sur TOUTES les réponses
class ForceCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if request.method == "OPTIONS":
            return JSONResponse(
                content={"status": "ok"},
                headers={
                    "Access-Control-Allow-Origin": "http://localhost:5173",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Credentials": "true",
                }
            )
        
        try:
            response = await call_next(request)
        except Exception as exc:
            print(f"❌ UNHANDLED ERROR: {exc}")
            response = JSONResponse(
                status_code=500,
                content={"detail": str(exc)}
            )
        
        # Force CORS headers sur toutes les réponses
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        
        return response

# Ajoute le middleware custom AVANT CORS standard
app.add_middleware(ForceCORSMiddleware)

# CORS standard (backup)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["🔐 Auth"])
app.include_router(users.router, prefix="/api/users", tags=["👤 Users"])
app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["💳 Subs"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["📊 Analysis"])
app.include_router(agents.router, prefix="/api/agents", tags=["🤖 Agents"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(pricing_router, prefix="/api")
app.include_router(export_router, prefix="/api/export")

@app.get("/api/health")
async def health():
    return {"status": "ok"}

@app.on_event("startup")
async def startup():
    await init_db()
    print("✅ MongoDB + CORS ready")