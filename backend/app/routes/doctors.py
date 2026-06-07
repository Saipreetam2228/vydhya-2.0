from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.doctor import Doctor
from app.schemas.doctor import DoctorCreate, DoctorUpdate, DoctorResponse

router = APIRouter(prefix="/doctors", tags=["Doctors"])

def _generate_next_serial_id(db: Session, field, prefix: str) -> str:
    rows = db.query(field).all()
    max_serial = 0
    for (value,) in rows:
        if value and isinstance(value, str) and value.startswith(prefix + "-"):
            suffix = value.split("-", 1)[1]
            if suffix.isdigit():
                max_serial = max(max_serial, int(suffix))
    return f"{prefix}-{str(max_serial + 1).zfill(5)}"


def generate_doctor_id(db: Session) -> str:
    return _generate_next_serial_id(db, Doctor.doctor_id, "DOC")

@router.get("/", response_model=List[DoctorResponse])
def get_doctors(
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    # Return doctors newest first so the latest added record appears at the top
    return db.query(Doctor).order_by(Doctor.created_at.desc(), Doctor.id.desc()).all()

@router.post("/", response_model=DoctorResponse, status_code=status.HTTP_201_CREATED)
def create_doctor(
    data: DoctorCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    doctor = Doctor(
        **data.model_dump(),
        doctor_id=generate_doctor_id(db)
    )
    db.add(doctor)
    db.commit()
    db.refresh(doctor)
    return doctor

@router.get("/{doctor_id}", response_model=DoctorResponse)
def get_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

@router.put("/{doctor_id}", response_model=DoctorResponse)
def update_doctor(
    doctor_id: int,
    data: DoctorUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(doctor, field, value)
    db.commit()
    db.refresh(doctor)
    return doctor

@router.delete("/{doctor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    db.delete(doctor)
    db.commit()