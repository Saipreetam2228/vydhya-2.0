from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.doctor import Doctor
from app.schemas.doctor import DoctorCreate, DoctorUpdate, DoctorResponse

router = APIRouter(prefix="/doctors", tags=["Doctors"])


def generate_doctor_id(db: Session) -> str:
    count = db.query(Doctor).count()
    return f"DOC-{str(count + 1).zfill(5)}"


@router.get("/", response_model=List[DoctorResponse])
def get_doctors(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Doctor)
    if search:
        query = query.filter(
            Doctor.first_name.ilike(f"%{search}%")
            | Doctor.last_name.ilike(f"%{search}%")
            | Doctor.specialty.ilike(f"%{search}%")
            | Doctor.doctor_id.ilike(f"%{search}%")
        )
    if status:
        query = query.filter(Doctor.status == status)
    return query.order_by(Doctor.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/count")
def get_doctor_count(db: Session = Depends(get_db)):
    return {"count": db.query(Doctor).count()}


@router.get("/{doctor_id}", response_model=DoctorResponse)
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor


@router.post("/", response_model=DoctorResponse, status_code=201)
def create_doctor(data: DoctorCreate, db: Session = Depends(get_db)):
    doctor = Doctor(
        **data.model_dump(),
        doctor_id=generate_doctor_id(db),
    )
    db.add(doctor)
    db.commit()
    db.refresh(doctor)
    return doctor


@router.put("/{doctor_id}", response_model=DoctorResponse)
def update_doctor(
    doctor_id: int, data: DoctorUpdate, db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(doctor, field, value)

    db.commit()
    db.refresh(doctor)
    return doctor


@router.delete("/{doctor_id}", status_code=204)
def delete_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    db.delete(doctor)
    db.commit()