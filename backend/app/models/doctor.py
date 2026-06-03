from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class DoctorStatus(str, enum.Enum):
    active = "Active"
    on_leave = "On Leave"
    inactive = "Inactive"


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(String(20), unique=True, nullable=False, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    specialty = Column(String(100), nullable=False)
    experience_years = Column(Integer, default=0)
    contact = Column(String(15), nullable=False)
    email = Column(String(150))
    status = Column(
        Enum(DoctorStatus),
        default=DoctorStatus.active,
        nullable=False
    )
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationship — one doctor can have many appointments
    appointments = relationship(
        "Appointment", back_populates="doctor", cascade="all, delete"
    )
    patients = relationship("Patient", back_populates="doctor")