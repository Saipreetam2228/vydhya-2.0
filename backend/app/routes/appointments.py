from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.appointment import Appointment
from app.schemas.appointment import (
    AppointmentCreate, AppointmentUpdate, AppointmentResponse
)

router = APIRouter(prefix="/appointments", tags=["Appointments"])

def _generate_next_serial_id(db: Session, field, prefix: str) -> str:
    rows = db.query(field).all()
    max_serial = 0
    for (value,) in rows:
        if value and isinstance(value, str) and value.startswith(prefix + "-"):
            suffix = value.split("-", 1)[1]
            if suffix.isdigit():
                max_serial = max(max_serial, int(suffix))
    return f"{prefix}-{str(max_serial + 1).zfill(5)}"


def generate_appointment_id(db: Session) -> str:
    return _generate_next_serial_id(db, Appointment.appointment_id, "APT")

@router.get("/", response_model=List[AppointmentResponse])
def get_appointments(
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    # Return appointments newest first so the latest booked appointment appears at the top
    return db.query(Appointment).order_by(
        Appointment.created_at.desc(),
        Appointment.id.desc()
    ).all()

@router.post("/", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(
    data: AppointmentCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    appointment = Appointment(
        **data.model_dump(),
        appointment_id=generate_appointment_id(db)
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    apt = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return apt

@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(
    appointment_id: int,
    data: AppointmentUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
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

@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    apt = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db.delete(apt)
    db.commit()