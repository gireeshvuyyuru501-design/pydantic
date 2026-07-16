import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import VendorManagement from "./VendorManagement";
import ApprovalQueue from "./ApprovalQueue";

interface Vendor {
  id: number;
  name: string;
  category: string;
  score: number;
  lead_time_days: number;
  compliance_status: string;
}

interface ProcurementRequest {
  id: number;
  title: string;
  department: string;
  status: string;
  ai_score: number;
  requested_amount: number;
}

interface AIInsight {
  recommendation: string;
  risk_level: string;
  estimated_savings: number;
  suggested_vendor_id: number | null;
  reasons: string[];
}

const API_URL = "http://127.0.0.1:8001";

export default function Dashboard() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [requests, setRequests] = useState<ProcurementRequest[]>([]);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [vendorResponse, requestResponse, insightResponse] =
        await Promise.all([
          fetch(`${API_URL}/procurement/vendors`),
          fetch(`${API_URL}/procurement/requests`),
          fetch(`${API_URL}/procurement/insights/1`)
        ]);

      if (!vendorResponse.ok) {
        throw new Error("Unable to load vendors.");
      }

      if (!requestResponse.ok) {
        throw new Error("Unable to load procurement requests.");
      }

      const vendorData: Vendor[] = await vendorResponse.json();
      const requestData: ProcurementRequest[] =
        await requestResponse.json();

      setVendors(vendorData);
      setRequests(requestData);

      if (insightResponse.ok) {
        const insightData: AIInsight = await insightResponse.json();
        setInsight(insightData);
      } else {
        setInsight(null);
      }
    } catch (err) {
      console.error("Dashboard loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const approvedRequests = useMemo(
    () =>
      requests.filter(
        (request) => request.status.toLowerCase() === "approved"
      ).length,
    [requests]
  );

  const pendingRequests = useMemo(
    () =>
      requests.filter((request) =>
        ["pending", "submitted"].includes(
          request.status.toLowerCase()
        )
      ).length,
    [requests]
  );

  const totalSpend = useMemo(
    () =>
      requests.reduce(
        (total, request) =>
          total + Number(request.requested_amount || 0),
        0
      ),
    [requests]
  );

  const bestVendor = useMemo(() => {
    if (vendors.length === 0) {
      return null;
    }

    return [...vendors].sort((a, b) => b.score - a.score)[0];
  }, [vendors]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">
            AI Procurement Workspace
          </h1>

          <p className="text-gray-600">
            Manage vendors, procurement requests, approvals and
            AI-guided decisions.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-semibold">{error}</p>

            <button
              type="button"
              onClick={loadDashboard}
              className="mt-3 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">Total Vendors</p>

            <p className="mt-2 text-4xl font-bold text-blue-700">
              {loading ? "..." : vendors.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">Total Requests</p>

            <p className="mt-2 text-4xl font-bold">
              {loading ? "..." : requests.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Approved Requests
            </p>

            <p className="mt-2 text-4xl font-bold text-green-600">
              {loading ? "..." : approvedRequests}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Pending Requests
            </p>

            <p className="mt-2 text-4xl font-bold text-orange-500">
              {loading ? "..." : pendingRequests}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 mb-8 xl:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Total Procurement Spend
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-700">
              ${totalSpend.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Estimated AI Savings
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              $
              {Number(
                insight?.estimated_savings || 0
              ).toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Highest-Ranked Vendor
            </p>

            <p className="mt-2 text-2xl font-bold">
              {bestVendor?.name || "Unavailable"}
            </p>

            {bestVendor && (
              <p className="mt-1 text-gray-600">
                Score: {bestVendor.score}
              </p>
            )}
          </div>
        </section>

        <section className="mb-8 rounded-xl bg-white p-6 shadow">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Vendor Performance Scores
            </h2>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              Live API Data
            </span>
          </div>

          <div className="space-y-5">
            {vendors.map((vendor) => (
              <div key={vendor.id}>
                <div className="mb-1 flex justify-between">
                  <span className="font-semibold">{vendor.name}</span>

                  <span>{vendor.score}</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${Math.min(vendor.score, 100)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-xl bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-blue-700">
              AI Insight Overview
            </h2>

            {insight && (
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  insight.risk_level.toLowerCase() === "low"
                    ? "bg-green-100 text-green-700"
                    : insight.risk_level.toLowerCase() === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {insight.risk_level} Risk
              </span>
            )}
          </div>

          {insight ? (
            <>
              <p className="mb-5 text-lg font-semibold">
                ✓ {insight.recommendation}
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Estimated Savings
                  </p>

                  <p className="mt-1 text-2xl font-bold text-green-600">
                    $
                    {Number(
                      insight.estimated_savings
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Suggested Vendor ID
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {insight.suggested_vendor_id ?? "N/A"}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Risk Level
                  </p>

                  <p className="mt-1 text-2xl font-bold capitalize">
                    {insight.risk_level}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="mb-2 font-bold">AI Reasons</h3>

                <ul className="list-disc space-y-1 pl-6 text-gray-700">
                  {insight.reasons.map((reason, index) => (
                    <li key={`${reason}-${index}`}>{reason}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="text-gray-500">
              AI insight is currently unavailable.
            </p>
          )}
        </section>

        <section className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-2xl font-bold">
            Vendor Scorecard
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="p-3 text-left">Vendor</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Score</th>
                  <th className="p-3 text-left">Lead Time</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b">
                    <td className="p-3 font-semibold">
                      {vendor.name}
                    </td>

                    <td className="p-3">{vendor.category}</td>

                    <td className="p-3">{vendor.score}</td>

                    <td className="p-3">
                      {vendor.lead_time_days} days
                    </td>

                    <td className="p-3">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          vendor.compliance_status === "compliant"
                            ? "bg-green-100 text-green-700"
                            : vendor.compliance_status === "review"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {vendor.compliance_status}
                      </span>
                    </td>
                  </tr>
                ))}

                {!loading && vendors.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-gray-500"
                    >
                      No vendors available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <VendorManagement />

        <div className="mt-8">
          <ApprovalQueue />
        </div>
      </main>
    </div>
  );
}