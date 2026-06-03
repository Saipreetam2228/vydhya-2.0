from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.core.security import hash_password, verify_password
from app.models.admin import AdminUser

router = APIRouter(prefix="/settings", tags=["Settings"])


class ProfileUpdate(BaseModel):
    name: str
    email: str


@router.get("/profile")
def get_profile(db: Session = Depends(get_db)):
    admin = db.query(AdminUser).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return {"id": admin.id, "name": admin.name, "email": admin.email}


@router.put("/profile")
def update_profile(data: ProfileUpdate, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    admin.name = data.name
    admin.email = data.email
    db.commit()
    return {"message": "Profile updated", "name": admin.name, "email": admin.email}