from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey
)

from sqlalchemy.orm import relationship

from database.base import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(
        String(50),
        unique=True,
        index=True,
        nullable=False
    )

    email = Column(
        String(120),
        unique=True,
        index=True,
        nullable=False
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    role = Column(
        String(50),
        default="buyer"
    )



class VendorModel(Base):

    __tablename__ = "vendors"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    category = Column(
        String(100),
        nullable=False
    )

    score = Column(
        Float,
        default=0.0
    )

    lead_time_days = Column(
        Integer,
        default=0
    )

    compliance_status = Column(
        String(50),
        default="pending"
    )



class ProcurementRequestModel(Base):

    __tablename__ = "procurement_requests"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String(200),
        nullable=False
    )

    department = Column(
        String(100),
        nullable=False
    )

    requested_by = Column(
        String(100),
        nullable=False
    )

    vendor_id = Column(
        Integer,
        ForeignKey("vendors.id")
    )

    requested_amount = Column(
        Float,
        nullable=False
    )

    urgency = Column(
        String(20),
        default="medium"
    )

    description = Column(
        String(500),
        nullable=False
    )

    status = Column(
        String(30),
        default="submitted"
    )

    ai_score = Column(
        Float,
        default=0.0
    )


    vendor = relationship(
        "VendorModel"
    )
