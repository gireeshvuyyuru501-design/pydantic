from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
from database.session import SessionLocal
from .users import get_user
from .jwt import create_token


router=APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


class LoginRequest(BaseModel):

    username:str
    password:str



@router.post("/login")
def login(request:LoginRequest):

    user=get_user(request.username)


    if not user or user["password"] != request.password:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )


    token=create_token({
        "username":user["username"],
        "role":user["role"]
    })


    return {

        "access_token":token,
        "role":user["role"]

    }