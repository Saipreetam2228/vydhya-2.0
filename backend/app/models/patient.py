from sqlalchemy import Column, Integer, String, DateTime, Date, Enum, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class PatientStatus(str, enum.Enum):
    active = "Active"
    discharged = "Discharged"
    under_observation = "Under Observation"


class GenderEnum(str, enum.Enum):
    male = "Male"
    female = "Female"
    other = "Other"


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String(20), unique=True, nullable=False, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    age = Column(Integer)
    gender = Column(Enum(GenderEnum), nullable=False)
    dob = Column(Date)
    contact = Column(String(15), unique=True, nullable=False, index=True)
    email = Column(String(150))
    address = Column(Text)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="SET NULL"), nullable=True)
    department = Column(String(100))
    status = Column(
        Enum(PatientStatus),
        default=PatientStatus.active,
        nullable=False
    )
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    doctor = relationship("Doctor", back_populates="patients")
    appointments = relationship(
        "Appointment", back_populates="patient", cascade="all, delete"
    )