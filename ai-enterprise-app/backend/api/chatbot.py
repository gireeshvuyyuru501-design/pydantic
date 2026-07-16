from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from agents.graph import procurement_graph
from database.session import SessionLocal
from schemas.chatbot import ChatRequest, ChatResponse


router = APIRouter(
    prefix="/chatbot",
    tags=["AI Chatbot"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post(
    "/chat",
    response_model=ChatResponse,
)
def chatbot(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    """
    Development chatbot endpoint.

    Authentication is temporarily disabled so the React dashboard
    can call this endpoint without a bearer token.
    """

    try:
        state = {
            "user_id": 1,
            "message": request.message,
            "conversation": [],
            "intent": None,
            "vendor_data": None,
            "recommendation": None,
            "response": None,
        }

        result = procurement_graph.invoke(state)

        return ChatResponse(
            message=result.get(
                "response",
                "I'm sorry, I couldn't process that request.",
            ),
            intent=result.get("intent", "general"),
            confidence=result.get("confidence", 0.90),
        )

    except Exception as error:
        print(f"Chatbot Error: {error}")

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )