from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.appointment import Appointment
from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentResponse,
)

router = APIRouter(prefix="/appointments", tags=["Appointments"])


def generate_appointment_id(db: Session) -> str:
    count = db.query(Appointment).count()
    return f"APT-{str(count + 1).zfill(5)}"


@router.get("/", response_model=List[AppointmentResponse])
def get_appointments(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Appointment)
    if status:
        query = query.filter(Appointment.status == status)
    return (
        query.order_by(Appointment.appointment_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/count")
def get_appointment_count(db: Session = Depends(get_db)):
    return {"count": db.query(Appointment).count()}


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    apt = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return apt


@router.post("/", response_model=AppointmentResponse, status_code=201)
def create_appointment(data: AppointmentCreate, db: Session = Depends(get_db)):
    apt = Appointment(
        **data.model_dump(),
        appointment_id=generate_appointment_id(db),
    )
    db.add(apt)
    db.commit()
    db.refresh(apt)
    return apt


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(
    appointment_id: int,
    data: AppointmentUpdate,
    db: Session = Depends(get_db),
):
    apt = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(apt, field, value)

    db.commit()
    db.refresh(apt)
    return apt


@router.delete("/{appointment_id}", status_code=204)
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    apt = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db.delete(apt)
    db.commit()