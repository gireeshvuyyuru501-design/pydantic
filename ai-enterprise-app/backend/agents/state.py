from typing import TypedDict, Optional, List


class ProcurementState(TypedDict):

    user_id: int

    message: str

    intent: Optional[str]

    vendor_data: Optional[list]

    recommendation: Optional[str]

    risk_level: Optional[str]

    response: Optional[str]

    confidence: float