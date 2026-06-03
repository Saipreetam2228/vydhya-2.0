from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, create_access_token, hash_password
from app.models.admin import AdminUser
from app.schemas.auth import LoginRequest, TokenResponse, PasswordChangeRequest

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate admin and return a JWT token.
    """
    admin = db.query(AdminUser).filter(
        AdminUser.email == request.email
    ).first()

    if not admin or not verify_password(request.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(
        data={"sub": str(admin.id), "email": admin.email}
    )

    return TokenResponse(
        access_token=token,
        user={"id": admin.id, "name": admin.name, "email": admin.email},
    )


@router.post("/change-password")
def change_password(
    request: PasswordChangeRequest,
    db: Session = Depends(get_db),
):
    """
    Change admin password after verifying the current one.
    TODO Phase 11: Add JWT dependency to protect this route.
    """
    admin = db.query(AdminUser).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    if not verify_password(request.current_password, admin.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    admin.password_hash = hash_password(request.new_password)
    db.commit()
    return {"message": "Password updated successfully"}