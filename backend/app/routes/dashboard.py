from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.core.database import get_db
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.appointment import Appointment

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Returns all numbers needed for the dashboard stat cards
    in a single API call.
    """
    today = date.today()

    total_patients = db.query(Patient).count()
    total_doctors = db.query(Doctor).count()
    total_appointments = db.query(Appointment).count()
    todays_appointments = (
        db.query(Appointment)
        .filter(Appointment.appointment_date == today)
        .count()
    )
    active_patients = (
        db.query(Patient).filter(Patient.status == "Active").count()
    )
    active_doctors = (
        db.query(Doctor).filter(Doctor.status == "Active").count()
    )

    return {
        "total_patients": total_patients,
        "total_doctors": total_doctors,
        "total_appointments": total_appointments,
        "todays_appointments": todays_appointments,
        "active_patients": active_patients,
        "active_doctors": active_doctors,
    }


@router.get("/recent-appointments")
def get_recent_appointments(
    limit: int = 5, db: Session = Depends(get_db)
):
    """Returns the most recent appointments for the dashboard table."""
    appointments = (
        db.query(Appointment)
        .order_by(Appointment.created_at.desc())
        .limit(limit)
        .all()
    )
    return appointments


@router.get("/weekly-admissions")
def get_weekly_admissions(db: Session = Depends(get_db)):
    """
    Returns patient registration counts for the last 7 days
    for the bar chart on the dashboard.
    """
    from datetime import timedelta

    today = date.today()
    result = []

    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        count = (
            db.query(Patient)
            .filter(func.date(Patient.created_at) == day)
            .count()
        )
        result.append({
            "day": day.strftime("%a"),
            "date": str(day),
            "admissions": count,
        })

    return result