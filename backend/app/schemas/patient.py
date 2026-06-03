from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime


class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    age: int
    gender: str
    dob: Optional[date] = None
    contact: str
    email: Optional[str] = None
    address: Optional[str] = None
    doctor_id: Optional[int] = None
    department: Optional[str] = None
    status: str = "Active"


class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    dob: Optional[date] = None
    contact: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    doctor_id: Optional[int] = None
    department: Optional[str] = None
    status: Optional[str] = None


class PatientResponse(BaseModel):
    id: int
    patient_id: str
    first_name: str
    last_name: str
    age: Optional[int]
    gender: str
    dob: Optional[date]
    contact: str
    email: Optional[str]
    address: Optional[str]
    doctor_id: Optional[int]
    department: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True