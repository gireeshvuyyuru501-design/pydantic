from langgraph.graph import StateGraph, END

from agents.state import ProcurementState
from agents.nodes import (
    planner_node,
    vendor_agent_node,
    risk_agent_node,
    response_node,
)


workflow = StateGraph(ProcurementState)

workflow.add_node("planner", planner_node)
workflow.add_node("vendor_agent", vendor_agent_node)
workflow.add_node("risk_agent", risk_agent_node)
workflow.add_node("response", response_node)

workflow.set_entry_point("planner")

workflow.add_edge("planner", "vendor_agent")
workflow.add_edge("vendor_agent", "risk_agent")
workflow.add_edge("risk_agent", "response")
workflow.add_edge("response", END)

procurement_graph = workflow.compile()