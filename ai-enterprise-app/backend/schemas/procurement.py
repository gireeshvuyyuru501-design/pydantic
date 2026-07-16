from typing import List, Literal
from pydantic import BaseModel, Field

class Vendor(BaseModel):
    id: int
    name: str
    category: str
    score: float = Field(ge=0, le=100)
    lead_time_days: int
    compliance_status: Literal["compliant", "review", "pending"]

class VendorCreate(BaseModel):
    name: str
    category: str
    score: float = Field(ge=0, le=100)
    lead_time_days: int
    compliance_status: Literal["compliant", "review", "pending"]

class ProcurementRequestCreate(BaseModel):
    title: str
    department: str
    requested_by: str
    vendor_id: int
    requested_amount: float
    urgency: Literal["low", "medium", "high"]
    description: str

class ProcurementRequest(ProcurementRequestCreate):
    id: int
    status: Literal["draft", "submitted", "pending", "approved", "rejected"]
    ai_score: float

class AIInsightResponse(BaseModel):
    recommendation: str
    risk_level: str
    estimated_savings: float
    suggested_vendor_id: int
    reasons: List[str]
    # These match the fields required by your frontend:
    vendor_score: float
    delivery_time: str
    compliance: str