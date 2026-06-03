from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class DoctorCreate(BaseModel):
    first_name: str
    last_name: str
    specialty: str
    experience_years: int
    contact: str
    email: EmailStr
    status: str = "Active"


class DoctorUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    specialty: Optional[str] = None
    experience_years: Optional[int] = None
    contact: Optional[str] = None
    email: Optional[EmailStr] = None
    status: Optional[str] = None


class DoctorResponse(BaseModel):
    id: int
    doctor_id: str
    first_name: str
    last_name: str
    specialty: str
    experience_years: int
    contact: str
    email: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True