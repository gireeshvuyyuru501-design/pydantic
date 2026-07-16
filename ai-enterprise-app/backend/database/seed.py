from database.session import SessionLocal
from database.models import VendorModel, ProcurementRequestModel


db = SessionLocal()


def seed():

    # check vendors
    if db.query(VendorModel).count() == 0:

        vendors = [

            VendorModel(
                name="Microsoft",
                category="Cloud Services",
                score=95,
                lead_time_days=10,
                compliance_status="compliant"
            ),

            VendorModel(
                name="AWS",
                category="Cloud Infrastructure",
                score=93,
                lead_time_days=12,
                compliance_status="compliant"
            ),

            VendorModel(
                name="Oracle",
                category="Database",
                score=88,
                lead_time_days=15,
                compliance_status="compliant"
            )

        ]

        db.add_all(vendors)
        db.commit()


    microsoft = db.query(
        VendorModel
    ).filter(
        VendorModel.name=="Microsoft"
    ).first()


    if db.query(ProcurementRequestModel).count()==0:

        requests=[

            ProcurementRequestModel(
                title="Cloud Infrastructure Purchase",
                department="IT",
                requested_by="Admin",
                vendor_id=microsoft.id,
                requested_amount=25000,
                urgency="high",
                description="Purchase cloud servers",
                status="submitted ",
                ai_score=95
            ),


            ProcurementRequestModel(
                title="Database License Renewal",
                department="Engineering",
                requested_by="Manager",
                vendor_id=microsoft.id,
                requested_amount=15000,
                urgency="medium",
                description="Renew enterprise database",
                status="submitted",
                ai_score=87
            )

        ]


        db.add_all(requests)
        db.commit()



    print("Database seeded successfully")



seed()

