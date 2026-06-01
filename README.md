<div align="center">
  <h1>VYDHYA 2.0</h1>
  <p><strong>Hospital Management System</strong></p>
  <p>A modern, full-stack web application for managing patients, doctors, and appointments.</p>

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38BDF8?logo=tailwindcss)

</div>

---

## Overview

VYDHYA 2.0 is a rebuild of an original Class XII Computer Science project.
The original was a Python/Tkinter desktop application. This version is a
deployable, full-stack web application built with a modern tech stack.

**Live Demo:** [vydhya.vercel.app](#) _(added after deployment)_
**Backend API:** [vydhya-api.onrender.com](#) _(added after deployment)_

---

## Features

- **Authentication** — Secure JWT-based admin login with bcrypt password hashing
- **Dashboard** — Live statistics, weekly admissions chart, recent appointments
- **Patient Management** — Full CRUD with search, pagination, and status tracking
- **Doctor Management** — Full CRUD with specialty and availability management
- **Appointment Management** — Scheduling with status filters and date-based views
- **Settings** — Profile management and light/dark theme toggle

---

## Tech Stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Frontend   | React 18, Vite, Tailwind CSS                            |
| Backend    | FastAPI, Python 3.11                                    |
| Database   | MySQL 8.0                                               |
| Auth       | JWT Tokens, bcrypt                                      |
| Deployment | Vercel (frontend), Render (backend), Railway (database) |

---

## Local Setup

### Prerequisites

- Node.js 20+ and npm
- Python 3.11+
- MySQL 8.0+

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Database

Run the SQL in `docs/DATABASE.md` in MySQL Workbench.

---

## Project Structure

vydhya-2.0/
├── frontend/ # React + Vite + Tailwind
├── backend/ # FastAPI + MySQL
└── docs/ # PRD, API docs, DB schema

---

## Original Project

This is a complete rebuild of YDHYA HMS, originally developed as a
Class XII Computer Science project using Python, Tkinter, and MySQL.

---

_Built with care by [Your Name]_
