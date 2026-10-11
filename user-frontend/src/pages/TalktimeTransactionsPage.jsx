// user-frontend/src/pages/TalktimeTransactionsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function fmtDate(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " · " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  );
}

const PLAN_COLORS = {
  single: "#ec4899",
  double: "#7c3aed",
  multiple: "#ef4444",
};

export default function TalktimeTransactionsPage() {
  const navigate = useNavigate();
  const { token, refreshUser } = useAuth();

  // Refresh balance in context so wallet page shows updated amount
  useEffect(() => {
    refreshUser?.();
  }, []); // eslint-disable-line
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTx() {
      try {
        const res = await fetch("/api/payment/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setTransactions(data.transactions);
        else setError(data.message || "Failed to load.");
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchTx();
  }, [token]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-pink-300 w-full sticky top-0 z-40 shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-white font-extrabold text-xl leading-tight">
              Talktime Transactions
            </h1>
            <p className="text-white/70 text-xs">
              Recharge &amp; billing history
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 pt-5 pb-10">
        {loading ? (
          <div className="flex flex-col gap-3 mt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-2 bg-gray-100 rounded w-1/3" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-400 font-semibold">{error}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-pink-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-gray-700 font-bold text-base mb-1">
              No transactions yet
            </p>
            <p className="text-gray-400 text-sm mb-5">
              Recharge your wallet to get started
            </p>
            <button
              onClick={() => navigate("/recharge")}
              className="px-6 py-2.5 rounded-full text-white font-bold text-sm"
              style={{
                background: "linear-gradient(135deg, #f472b6, #ec4899)",
              }}
            >
              Recharge Now
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.map((tx) => {
              const color = PLAN_COLORS[tx.planId] || "#ec4899";
              return (
                <div key={tx._id} className="card p-4">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${color}18` }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{
                          color: tx.type === "debit" ? "#ef4444" : "#22c55e",
                        }}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {tx.type === "debit" ? (
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 13l-4-4h3V8h2v3h3l-4 4z" />
                        ) : (
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 10v-4h2l-3-3-3 3h2v4h2z" />
                        )}
                      </svg>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-gray-800 text-sm truncate">
                        {tx.planLabel || "Recharge"}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {fmtDate(tx.createdAt)}
                      </p>
                      {tx.description && (
                        <p className="text-gray-400 text-xs mt-0.5 truncate">
                          {tx.description}
                        </p>
                      )}
                      {tx.razorpayPaymentId && (
                        <p className="text-gray-300 text-xs mt-0.5 truncate font-mono">
                          {tx.razorpayPaymentId}
                        </p>
                      )}
                    </div>

                    {/* Amount + status */}
                    <div className="text-right shrink-0">
                      <p
                        className="font-extrabold text-base"
                        style={{
                          color: tx.type === "credit" ? "#22c55e" : "#ef4444",
                        }}
                      >
                        {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                      </p>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background:
                            tx.status === "success" ? "#dcfce7" : "#fee2e2",
                          color:
                            tx.status === "success" ? "#16a34a" : "#dc2626",
                        }}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
