from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timedelta
from app.schemas.auth import UserRegister, UserLogin, Token, UserResponse
from app.models.user import User
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings

router = APIRouter(prefix="/api/auth", tags=["🔐 Authentication"])

# ================= REGISTER =================
@router.post("/register", response_model=UserResponse, status_code=201)
async def register(user_in: UserRegister):

    existing_user = await User.find_one(User.email == user_in.email)
    if existing_user:
        raise HTTPException(400, "Email already exists")

    user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        company=user_in.company,
        goal=user_in.goal or "seo"
    )

    await user.insert()

    return UserResponse(
        id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        company=user.company,
        goal=user.goal,
        plan=user.plan,
        created_at=user.created_at,
        last_login=user.last_login,
        is_active=user.is_active
    )


# ================= LOGIN =================
@router.post("/login", response_model=Token)
async def login(user_in: UserLogin):

    user = await User.find_one(User.email == user_in.email)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user_in.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")

    user.last_login = datetime.now()
    await user.save()

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }