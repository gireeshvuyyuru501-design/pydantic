from sqlalchemy import or_

from database.models import VendorModel
from database.session import SessionLocal


GENERAL_QUERIES = {
    "",
    "all",
    "all vendors",
    "show all vendors",
    "list all vendors",
    "list vendors",
    "vendors",
    "general",
    "hi",
    "hello",
    "hey",
}


def search_vendors(search_term: str | None = None):
    db = SessionLocal()

    try:
        query = db.query(VendorModel)

        term = (search_term or "").strip().lower()

        if term not in GENERAL_QUERIES:
            query = query.filter(
                or_(
                    VendorModel.name.ilike(f"%{term}%"),
                    VendorModel.category.ilike(f"%{term}%"),
                )
            )

        vendors = query.order_by(VendorModel.score.desc()).all()

        return [
            {
                "id": vendor.id,
                "name": vendor.name,
                "category": vendor.category,
                "score": vendor.score,
                "lead_time": vendor.lead_time_days,
                "compliance": vendor.compliance_status,
            }
            for vendor in vendors
        ]

    finally:
        db.close()


def calculate_savings(amount: float):
    return round(amount * 0.08, 2)


def evaluate_risk(compliance_status: str):
    if compliance_status.lower() == "compliant":
        return "low"

    return "medium"