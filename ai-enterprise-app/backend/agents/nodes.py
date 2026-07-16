from agents.tools import search_vendors, evaluate_risk


def planner_node(state):
    message = state.get("message", "").strip().lower()

    if any(word in message for word in ["vendor", "microsoft", "aws", "oracle"]):
        state["intent"] = "vendor_search"
    else:
        state["intent"] = "procurement_help"

    return state


def vendor_agent_node(state):
    message = state.get("message", "").strip().lower()

    if "microsoft" in message:
        search_term = "Microsoft"
    elif "aws" in message:
        search_term = "AWS"
    elif "oracle" in message:
        search_term = "Oracle"
    else:
        search_term = "all"

    state["vendor_data"] = search_vendors(search_term)

    print("CHATBOT VENDORS:", state["vendor_data"])

    return state


def risk_agent_node(state):
    vendors = state.get("vendor_data", [])

    if vendors:
        state["risk_level"] = evaluate_risk(
            vendors[0]["compliance"]
        )
    else:
        state["risk_level"] = "unknown"

    return state


def response_node(state):
    vendors = state.get("vendor_data", [])

    if not vendors:
        state["response"] = (
            "No vendor records were returned from the database."
        )
        state["confidence"] = 0.50
        return state

    if len(vendors) == 1:
        vendor = vendors[0]

        state["response"] = (
            f"Vendor: {vendor['name']}\n"
            f"Category: {vendor['category']}\n"
            f"Score: {vendor['score']}\n"
            f"Lead time: {vendor['lead_time']} days\n"
            f"Compliance: {vendor['compliance']}\n"
            f"Risk: {state['risk_level']}"
        )
    else:
        lines = [
            (
                f"{vendor['name']} — "
                f"{vendor['category']} — "
                f"Score {vendor['score']} — "
                f"{vendor['lead_time']} days"
            )
            for vendor in vendors
        ]

        state["response"] = (
            "Available vendors:\n\n" + "\n".join(lines)
        )

    state["confidence"] = 0.92

    return state