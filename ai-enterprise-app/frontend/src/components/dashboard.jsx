import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const spendData = [
  { month: "Jan", spend: 12000 },
  { month: "Feb", spend: 18000 },
  { month: "Mar", spend: 15000 },
  { month: "Apr", spend: 24000 },
  { month: "May", spend: 21000 },
  { month: "Jun", spend: 28000 },
];

const vendorData = [
  { vendor: "Amazon", orders: 34 },
  { vendor: "Microsoft", orders: 27 },
  { vendor: "Dell", orders: 19 },
  { vendor: "Oracle", orders: 14 },
];

const aiInsights = [
  {
    title: "Potential cost saving",
    description:
      "Consolidating software licenses with Microsoft could reduce annual spend by approximately 12%.",
    level: "high",
  },
  {
    title: "Vendor delivery risk",
    description:
      "Oracle delivery performance declined by 8% during the last 30 days.",
    level: "medium",
  },
  {
    title: "Unusual purchase activity",
    description:
      "Technology equipment spend is 18% higher than the monthly average.",
    level: "low",
  },
];

const initialApprovals = [
  {
    id: "PO-1045",
    requester: "Sarah Johnson",
    vendor: "Dell Technologies",
    amount: 18400,
    status: "Pending",
  },
  {
    id: "PO-1046",
    requester: "Michael Smith",
    vendor: "Microsoft",
    amount: 9200,
    status: "Pending",
  },
  {
    id: "PO-1047",
    requester: "Emily Davis",
    vendor: "Amazon Business",
    amount: 4750,
    status: "Pending",
  },
];

const vendorScorecards = [
  {
    name: "Microsoft",
    quality: 94,
    delivery: 91,
    compliance: 96,
    overall: 94,
  },
  {
    name: "Dell Technologies",
    quality: 90,
    delivery: 88,
    compliance: 93,
    overall: 90,
  },
  {
    name: "Amazon Business",
    quality: 87,
    delivery: 95,
    compliance: 89,
    overall: 90,
  },
  {
    name: "Oracle",
    quality: 86,
    delivery: 78,
    compliance: 91,
    overall: 85,
  },
];

function Dashboard() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello. I am your AI procurement assistant.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [approvals, setApprovals] = useState(initialApprovals);

  const updateApproval = (id, status) => {
    setApprovals((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((current) => [
      ...current,
      { sender: "user", text: userMessage },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8001/chatbot/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: userMessage,
  }),
});

      if (!response.ok) {
        throw new Error(`Server error ${response.status}`);
      }

      const data = await response.json();

      setMessages((current) => [
        ...current,
        {
          sender: "bot",
          text:
            data.response ||
            data.reply ||
            data.answer ||
            data.message ||
            "The server returned an empty response.",
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          sender: "bot",
          text: `Unable to connect to chatbot: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>ProcureAI</h2>

        <nav>
          <button className="nav-active">Dashboard</button>
          <button>Purchase Orders</button>
          <button>Vendors</button>
          <button>Analytics</button>
          <button>AI Assistant</button>
        </nav>
      </aside>

      <main className="main-content">
        <header>
          <div>
            <h1>Procurement Dashboard</h1>
            <p>
              Monitor procurement spend, approvals, vendors and AI insights.
            </p>
          </div>

          <div className="status">Backend: Port 8001</div>
        </header>

        <section className="cards">
          <div className="card">
            <span>Total Spend</span>
            <strong>$118,000</strong>
            <small>+12% this month</small>
          </div>

          <div className="card">
            <span>Purchase Orders</span>
            <strong>94</strong>
            <small>18 pending approval</small>
          </div>

          <div className="card">
            <span>Active Vendors</span>
            <strong>27</strong>
            <small>4 added recently</small>
          </div>

          <div className="card">
            <span>Cost Savings</span>
            <strong>$16,400</strong>
            <small>8.3% improvement</small>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="panel chart-panel">
            <h3>Monthly Procurement Spend</h3>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={spendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="spend"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="panel chart-panel">
            <h3>Orders by Vendor</h3>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={vendorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vendor" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <h3>AI Insights</h3>
              <p>Automated procurement recommendations and risk detection.</p>
            </div>
          </div>

          <div className="insights-grid">
            {aiInsights.map((insight) => (
              <div
                key={insight.title}
                className={`insight-card ${insight.level}`}
              >
                <span className="insight-badge">
                  {insight.level.toUpperCase()}
                </span>

                <h4>{insight.title}</h4>
                <p>{insight.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <h3>Approval Queue</h3>
              <p>Review and manage pending purchase orders.</p>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="approval-table">
              <thead>
                <tr>
                  <th>Purchase Order</th>
                  <th>Requester</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {approvals.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.requester}</td>
                    <td>{item.vendor}</td>
                    <td>${item.amount.toLocaleString()}</td>
                    <td>
                      <span
                        className={`approval-status ${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.status === "Pending" ? (
                        <div className="approval-actions">
                          <button
                            className="approve-button"
                            onClick={() =>
                              updateApproval(item.id, "Approved")
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="reject-button"
                            onClick={() =>
                              updateApproval(item.id, "Rejected")
                            }
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="completed-label">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <h3>Vendor Scorecards</h3>
              <p>
                Vendor quality, delivery and compliance performance.
              </p>
            </div>
          </div>

          <div className="vendor-grid">
            {vendorScorecards.map((vendor) => (
              <article className="vendor-card" key={vendor.name}>
                <div className="vendor-header">
                  <div>
                    <h4>{vendor.name}</h4>
                    <span>Preferred vendor</span>
                  </div>

                  <div className="overall-score">
                    {vendor.overall}
                  </div>
                </div>

                <ScoreRow
                  label="Quality"
                  value={vendor.quality}
                />

                <ScoreRow
                  label="Delivery"
                  value={vendor.delivery}
                />

                <ScoreRow
                  label="Compliance"
                  value={vendor.compliance}
                />
              </article>
            ))}
          </div>
        </section>

        <section className="panel chat-panel">
          <div className="section-heading">
            <div>
              <h3>AI Procurement Assistant</h3>
              <p>
                Ask questions about vendors, orders, spend and approvals.
              </p>
            </div>
          </div>

          <div className="messages">
            {messages.map((item, index) => (
              <div
                key={`${item.sender}-${index}`}
                className={`message ${item.sender}`}
              >
                {item.text}
              </div>
            ))}

            {loading && (
              <div className="message bot">Thinking...</div>
            )}
          </div>

          <div className="chat-input">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask the AI procurement assistant..."
            />

            <button onClick={sendMessage} disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function ScoreRow({ label, value }) {
  return (
    <div className="score-row">
      <div className="score-label">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>

      <div className="score-track">
        <div
          className="score-fill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default Dashboard;