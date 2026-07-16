# AI Procurement & Vendor Management Platform

This project is a starter MVP for an AI-powered procurement and vendor management platform.

## Tech stack
- Backend: FastAPI (Python)
- Middleware: FastAPI middleware for logging and request handling
- Frontend: React + Vite + Node.js

## Run locally

### Backend
```bash
cd ai-enterprise-app
python -m uvicorn backend.main:app --reload
```

### Frontend
```bash
cd ai-enterprise-app/frontend
npm install
npm run dev
```

## API highlights
- GET /health
- GET /procurement/vendors
- GET /procurement/requests
- POST /procurement/requests
- GET /procurement/insights/{request_id}
