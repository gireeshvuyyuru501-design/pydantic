from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    message: str
    intent: str = "general"
    confidence: float = 0.0
