from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.chatbot import router as chatbot_router
from api.procurement import router as procurement_router
from api.auth import router as auth_router

from database.models import Base
from database.session import engine

from middleware.logging import LoggingMiddleware


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Procurement & Vendor Management Platform",
    version="1.0.0"
)


# FIX CORS FOR FRONTEND
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_middleware(
    LoggingMiddleware
)


app.include_router(auth_router)
app.include_router(procurement_router)
app.include_router(chatbot_router)



@app.get("/")
def home():

    return {
        "message":"AI Procurement API Running"
    }



@app.get("/health")
def health():

    return {
        "status":"ok"
    }