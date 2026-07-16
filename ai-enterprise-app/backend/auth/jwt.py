
from jose import jwt
from datetime import datetime,timedelta


SECRET_KEY="ai-procurement-secret"
ALGORITHM="HS256"


def create_token(data:dict):

    expire=datetime.utcnow()+timedelta(hours=8)

    data.update({
        "exp":expire
    })

    token=jwt.encode(
        data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token