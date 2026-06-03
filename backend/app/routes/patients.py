from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse

router = APIRouter(prefix="/patients", tags=["Patients"])


def generate_patient_id(db: Session) -> str:
    """Generate next sequential patient ID like PAT-00042."""
    count = db.query(Patient).count()
    return f"PAT-{str(count + 1).zfill(5)}"


@router.get("/", response_model=List[PatientResponse])
def get_patients(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Get all patients with optional search and status filter."""
    query = db.query(Patient)

    if search:
        query = query.filter(
            Patient.first_name.ilike(f"%{search}%")
            | Patient.last_name.ilike(f"%{search}%")
            | Patient.contact.ilike(f"%{search}%")
            | Patient.patient_id.ilike(f"%{search}%")
        )
    if status:
        query = query.filter(Patient.status == status)

    return query.order_by(Patient.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/count")
def get_patient_count(db: Session = Depends(get_db)):
    """Return total patient count for dashboard."""
    return {"count": db.query(Patient).count()}


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    """Get a single patient by their PAT-XXXXX ID."""
    patient = db.query(Patient).filter(
        Patient.patient_id == patient_id
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.post("/", response_model=PatientResponse, status_code=201)
def create_patient(data: PatientCreate, db: Session = Depends(get_db)):
    """Add a new patient record."""
    # Check contact uniqueness
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
        patient_id=generate_patient_id(db),
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: str, data: PatientUpdate, db: Session = Depends(get_db)
):
    """Update an existing patient record."""
    patient = db.query(Patient).filter(
        Patient.patient_id == patient_id
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(patient, field, value)

    db.commit()
    db.refresh(patient)
    return patient


@router.delete("/{patient_id}", status_code=204)
def delete_patient(patient_id: str, db: Session = Depends(get_db)):
    """Delete a patient and all their appointments."""
    patient = db.query(Patient).filter(
        Patient.patient_id == patient_id
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    db.delete(patient)
    db.commit()