from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse

router = APIRouter(prefix="/patients", tags=["Patients"])


def _generate_next_serial_id(db: Session, field, prefix: str) -> str:
    rows = db.query(field).all()
    max_serial = 0
    for (value,) in rows:
        if value and isinstance(value, str) and value.startswith(prefix + "-"):
            suffix = value.split("-", 1)[1]
            if suffix.isdigit():
                max_serial = max(max_serial, int(suffix))
    return f"{prefix}-{str(max_serial + 1).zfill(5)}"


def generate_patient_id(db: Session) -> str:
    return _generate_next_serial_id(db, Patient.patient_id, "PAT")

@router.get("/", response_model=List[PatientResponse])
def get_patients(
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    # No limit — return ALL patients newest first so latest entries appear at the top
    return db.query(Patient).order_by(Patient.created_at.desc(), Patient.id.desc()).all()

@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(
    data: PatientCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    existing = db.query(Patient).filter(
        Patient.contact == data.contact
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="A patient with this contact number already exists",
        )
    patient = Patient(
        **data.model_dump(),
        patient_id=generate_patient_id(db)
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int,
    data: PatientUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(patient, field, value)
    db.commit()
    db.refresh(patient)
    return patient

@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()