from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.routes import auth, patients, doctors, appointments, dashboard, settings

# Create all database tables from models
# In production you would use Alembic migrations instead
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="VYDHYA 2.0 API",
    description="Hospital Management System — Backend API",
    version="2.0.0",
)

# CORS middleware — allows the React frontend to call this API
# In production, replace * with your actual Vercel domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all route modules
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(doctors.router)
app.include_router(appointments.router)
app.include_router(dashboard.router)
app.include_router(settings.router)


@app.get("/")
def root():
    return {
        "message": "VYDHYA 2.0 API is running",
        "docs": "/docs",
        "version": "2.0.0",
    }