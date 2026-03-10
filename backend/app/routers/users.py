from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from typing import List
from app.schemas.auth import (
    UserResponse, UserUpdate, ChangePassword, UserListResponse
)
from app.models.user import User
from app.core.security import (
    get_password_hash, verify_password, 
    get_current_user, get_current_active_user
)

router = APIRouter(prefix="/api/users", tags=["👤 Users"])

# ==================== READ ====================

@router.get("/me", 
            response_model=UserResponse,
            summary="Mon profil",
            description="Récupérer les informations de l'utilisateur connecté")
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """
    Récupérer les informations de l'utilisateur connecté
    """
    return UserResponse.from_orm(current_user)

@router.get("/", 
            response_model=UserListResponse,
            summary="Liste des utilisateurs",
            description="Récupérer tous les utilisateurs (Admin)")
async def get_all_users(
    skip: int = 0, 
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)
):
    """
    Récupérer tous les utilisateurs
    
    - **skip**: Nombre d'utilisateurs à ignorer
    - **limit**: Nombre maximum d'utilisateurs à retourner
    """
    users = await User.find_all().skip(skip).limit(limit).to_list()
    total = await User.count()
    
    users_response = [UserResponse.from_orm(u) for u in users]  # ✅ Serializer appliqué
    
    return {
        "users": users_response,
        "total": total,
        "page": (skip // limit) + 1,
        "limit": limit
    }

@router.get("/{user_id}", 
            response_model=UserResponse,
            summary="Détails utilisateur",
            description="Récupérer un utilisateur par son ID")
async def get_user(
    user_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Récupérer un utilisateur spécifique par son ID
    """
    user = await User.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="❌ Utilisateur non trouvé"
        )
    return UserResponse.from_orm(user)

# ==================== UPDATE ====================

@router.put("/profile", 
            response_model=UserResponse,
            summary="Modifier profil",
            description="Mettre à jour les informations de profil")
async def update_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """
    Mettre à jour le profil de l'utilisateur
    
    - **full_name**: Nouveau nom complet
    - **company**: Nouvelle entreprise
    - **goal**: Nouvel objectif
    """
    update_data = user_update.dict(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="❌ Aucune donnée à mettre à jour"
        )
    
    # Mettre à jour les champs
    for field, value in update_data.items():
        if hasattr(current_user, field):
            setattr(current_user, field, value)
    
    current_user.updated_at = datetime.now()
    await current_user.save()
    
    return UserResponse.from_orm(current_user)

@router.put("/change-password",
            summary="Changer mot de passe",
            description="Modifier le mot de passe de l'utilisateur")
async def change_password(
    password_data: ChangePassword,
    current_user: User = Depends(get_current_active_user)
):
    """
    Changer le mot de passe de l'utilisateur
    
    - **old_password**: Ancien mot de passe
    - **new_password**: Nouveau mot de passe (min 8 caractères)
    """
    # Vérifier l'ancien mot de passe
    if not verify_password(password_data.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="❌ Ancien mot de passe incorrect"
        )
    
    # Vérifier que le nouveau mot de passe est différent
    if password_data.old_password == password_data.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="❌ Le nouveau mot de passe doit être différent"
        )
    
    # Mettre à jour avec le nouveau mot de passe
    current_user.password_hash = get_password_hash(password_data.new_password)
    current_user.updated_at = datetime.now()
    await current_user.save()
    
    return {"message": "✅ Mot de passe modifié avec succès"}

# ==================== DELETE ====================

@router.delete("/account",
               summary="Supprimer mon compte",
               description="Désactiver le compte de l'utilisateur (Soft Delete)")
async def delete_account(
    current_user: User = Depends(get_current_active_user)
):
    """
    Supprimer le compte (Soft delete - désactivation)
    """
    current_user.is_active = False
    current_user.updated_at = datetime.now()
    await current_user.save()
    
    return {"message": "✅ Compte désactivé avec succès"}

@router.delete("/{user_id}",
               summary="Supprimer un utilisateur",
               description="Supprimer un utilisateur par son ID (Admin)")
async def delete_user(
    user_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Supprimer un utilisateur (Admin only)
    """
    # Vérifier si l'utilisateur actuel est admin
    if not current_user.is_admin():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="❌ Accès réservé aux administrateurs"
        )
    
    user_to_delete = await User.get(user_id)
    if not user_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="❌ Utilisateur non trouvé"
        )
    
    # Soft delete
    user_to_delete.is_active = False
    user_to_delete.updated_at = datetime.now()
    await user_to_delete.save()
    
    return {"message": "✅ Utilisateur supprimé avec succès"}