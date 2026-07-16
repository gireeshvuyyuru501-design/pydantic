from datetime import datetime, timedelta, timezone
from typing import Optional
import os

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
# Change the import line from 'UserModel' to 'User'

from jose import JWTError, jwt
from passlib.context import CryptContext

from sqlalchemy.orm import Session

from database.session import SessionLocal
from database.models import User


from schemas.user import (
    UserCreate,
    UserLogin,
    UserOut
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "temporary-secret"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


security = HTTPBearer()



def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()



def create_access_token(
    data:dict,
    expires_delta:Optional[timedelta]=None
):

    payload=data.copy()

    expire=datetime.now(timezone.utc)+(
        expires_delta or timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload["exp"]=expire


    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )



def get_current_user(
    credentials:HTTPAuthorizationCredentials=Depends(security),
    db:Session=Depends(get_db)
):

    try:

        payload=jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username=payload.get("sub")


        if username is None:
            raise Exception()

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )


    user=db.query(User).filter(
        User.username==username
    ).first()


    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    return user


@router.post(
    "/register",
    response_model=UserOut
)
def register(
    payload:UserCreate,
    db:Session=Depends(get_db)
):

    user=User(

        username=payload.username,

        email=str(payload.email),

        password_hash=pwd_context.hash(
            payload.password
        ),

        role=payload.role
    )


    db.add(user)

    db.commit()

    db.refresh(user)


    return user



@router.post("/login")
def login(
    payload:UserLogin,
    db:Session=Depends(get_db)
):

    user=db.query(User).filter(
        User.username==payload.username
    ).first()


    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid username/password"
        )


    if not pwd_context.verify(
        payload.password,
        user.password_hash
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid username/password"
        )


    token=create_access_token(
        {
            "sub":user.username
        }
    )


    return {

        "access_token":token,

        "token_type":"bearer"

    }