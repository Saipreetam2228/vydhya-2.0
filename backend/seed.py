"""
Run this script once to create the default admin account.
Usage: python seed.py
"""
from app.core.database import SessionLocal, engine, Base
from app.core.security import hash_password
from app.models.admin import AdminUser
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.appointment import Appointment

# Create all tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Check if admin already exists
existing = db.query(AdminUser).filter(
    AdminUser.email == "admin@vydhya.com"
).first()

if not existing:
    admin = AdminUser(
        name="VYDHYA Admin",
        email="admin@vydhya.com",
        password_hash=hash_password("Admin@123"),
    )
    db.add(admin)
    db.commit()
    print("Admin account created: admin@vydhya.com / Admin@123")
else:
    print("Admin account already exists")

db.close()
print("Database seeded successfully")