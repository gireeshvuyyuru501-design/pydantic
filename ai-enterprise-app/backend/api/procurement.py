from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.auth import get_current_user
from database.models import (
    ProcurementRequestModel,
    VendorModel,

)
from database.session import SessionLocal

from schemas.procurement import (
    AIInsightResponse,
    ProcurementRequest,
    ProcurementRequestCreate,
    Vendor,
    VendorCreate,
)

router = APIRouter(
    prefix="/procurement",
    tags=["Procurement"]
)

# -----------------------------
# Helper: Temporary AI Scoring
# -----------------------------
def calculate_ai_score(amount: float, urgency: str):
    score = 80
    if urgency == "high":
        score += 10
    if amount < 100000:
        score += 5
    return min(score, 100)

# -----------------------------
# Database Dependency
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------------
# Model Converters
# -----------------------------
def vendor_response(vendor):
    return Vendor(
        id=vendor.id,
        name=vendor.name,
        category=vendor.category,
        score=vendor.score,
        lead_time_days=vendor.lead_time_days,
        compliance_status=vendor.compliance_status
    )

def request_response(request):
    return ProcurementRequest(
        id=request.id,
        title=request.title,
        department=request.department,
        requested_by=request.requested_by,
        vendor_id=request.vendor_id,
        requested_amount=request.requested_amount,
        urgency=request.urgency,
        description=request.description,
        status=request.status,
        ai_score=request.ai_score
    )

# -----------------------------
# Vendor APIs
# -----------------------------
@router.get("/vendors", response_model=list[Vendor])
def get_vendors(db: Session = Depends(get_db)):
    vendors = db.query(VendorModel).all()
    return [vendor_response(v) for v in vendors]

@router.post("/vendors", response_model=Vendor)
def create_vendor(
    payload: VendorCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    vendor = VendorModel(
        name=payload.name,
        category=payload.category,
        score=payload.score,
        lead_time_days=payload.lead_time_days,
        compliance_status=payload.compliance_status
    )
    db.add(vendor)
    db.commit()
    db.refresh(vendor)
    return vendor_response(vendor)

# -----------------------------
# Procurement Request APIs
# -----------------------------
@router.get("/requests", response_model=list[ProcurementRequest])
def get_requests(db: Session = Depends(get_db)):
    requests = db.query(ProcurementRequestModel).all()
    return [request_response(r) for r in requests]

@router.post("/requests", response_model=ProcurementRequest)
def create_purchase_request(
    payload: ProcurementRequestCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if payload.vendor_id:
        vendor = db.query(VendorModel).filter(VendorModel.id == payload.vendor_id).first()
        if not vendor:
            raise HTTPException(status_code=404, detail="Vendor not found")

    ai_score = calculate_ai_score(payload.requested_amount, payload.urgency)
    
    request = ProcurementRequestModel(
        title=payload.title,
        department=payload.department,
        requested_by=payload.requested_by,
        vendor_id=payload.vendor_id,
        requested_amount=payload.requested_amount,
        urgency=payload.urgency,
        description=payload.description,
        status="submitted",
        ai_score=ai_score
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return request_response(request)

# -----------------------------
# Approval Workflow
# -----------------------------
@router.post("/requests/{request_id}/approve")
def approve_request(request_id: int, db: Session = Depends(get_db)):
    request = db.query(ProcurementRequestModel).filter(ProcurementRequestModel.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    request.status = "approved"
    db.commit()
    db.refresh(request)
    return {"message": "Success", "request_id": request.id, "status": request.status}

# -----------------------------
# AI Insights
# -----------------------------
# @router.get("/insights/{request_id}", response_model=AIInsightResponse)
def ai_insights(request_id: int, db: Session = Depends(get_db)):
    request = db.query(ProcurementRequestModel).filter(ProcurementRequestModel.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    vendor = db.query(VendorModel).filter(VendorModel.id == request.vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    risk = "low" if vendor.compliance_status == "compliant" else "medium"
    savings = round(request.requested_amount * 0.08, 2)

    return AIInsightResponse(
        recommendation=f"Approve {request.title} with {vendor.name}",
        risk_level=risk,
        estimated_savings=savings,
        suggested_vendor_id=vendor.id,
        # These fields match the Frontend's needs:
        vendor_score=vendor.score,
        delivery_time=f"{vendor.lead_time_days} days",
        compliance=vendor.compliance_status,
        reasons=[
            f"Vendor score: {vendor.score}/100",
            f"Delivery time: {vendor.lead_time_days} days",
            f"Compliance status: {vendor.compliance_status}"
        ]
    )