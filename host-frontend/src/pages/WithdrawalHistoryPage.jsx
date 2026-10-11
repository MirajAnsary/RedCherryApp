//host-frontend
// src/pages/WithdrawalHistoryPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const STATUS_STYLES = {
  success: { color: "#16a34a", border: "#bbf7d0", label: "Success" },
  pending: { color: "#ca8a04", border: "#fde68a", label: "Pending" },
  failed: { color: "#e53935", border: "#fecaca", label: "Failed" },
};

export default function WithdrawalHistoryPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalWithdrawn: 0,
    totalPending: 0,
    history: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/host/profile/withdrawal-history")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fmt = (iso) =>
    new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .wh-page{min-height:100vh;background:#f7f0f3;font-family:'Nunito',sans-serif;display:flex;justify-content:center;padding-bottom:40px}
        .wh-wrap{width:100%;max-width:520px;display:flex;flex-direction:column}
        .wh-topbar{display:flex;align-items:center;gap:12px;padding:52px 20px 16px;background:#fff}
        .wh-back{background:none;border:none;cursor:pointer;font-size:22px;color:#f47eb0;font-weight:800}
        .wh-topbar-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:800;color:#1a1a1a}
        .wh-logo-row{display:flex;justify-content:center;padding:14px;background:#fff;border-bottom:1px solid #f5f0f3}
        .wh-logo{width:88px;height:88px;border-radius:50%;object-fit:contain;border:3px solid #fce4ec;padding:4px}
        .wh-summary{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 16px 0}
        .wh-sum-card{background:#fff;border-radius:16px;padding:16px;box-shadow:0 2px 12px rgba(0,0,0,.06);text-align:center}
        .wh-sum-amt{font-family:'Playfair Display',serif;font-size:24px;font-weight:800;color:#1a1a1a}
        .wh-sum-amt.yellow{color:#f9a020}
        .wh-sum-label{font-size:12px;color:#aaa;margin-top:4px;font-weight:600}
        .wh-list{display:flex;flex-direction:column;gap:10px;margin:16px 16px 0}
        .wh-row{display:flex;align-items:center;gap:14px;background:#fff;border-radius:16px;padding:14px 16px;box-shadow:0 2px 10px rgba(0,0,0,.05)}
        .wh-icon-box{width:44px;height:44px;border-radius:12px;background:#fffde7;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
        .wh-info{flex:1}
        .wh-amt{font-weight:800;font-size:17px;color:#1a1a1a}
        .wh-date{font-size:12px;color:#aaa;margin-top:2px}
        .wh-badge{border-radius:50px;padding:5px 14px;font-size:12px;font-weight:800;border:2px solid}
        .wh-empty{text-align:center;color:#ccc;padding:40px;font-size:15px}
        .wh-footer{text-align:center;font-size:11px;color:#c0a0b0;padding:20px 16px;line-height:1.8}
        @media(min-width:768px){.wh-wrap{max-width:700px}}
        @media(min-width:1024px){.wh-wrap{max-width:900px}}
      `}</style>
      <div className="wh-page">
        <div className="wh-wrap">
          <div className="wh-topbar">
            <button className="wh-back" onClick={() => navigate(-1)}>
              ←
            </button>
            <span className="wh-topbar-title">Withdrawal History</span>
          </div>
          <div className="wh-logo-row">
            <img
              src="/logo.png"
              alt="BBSNC"
              className="wh-logo"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/88x88/fce4ec/f47eb0?text=RC";
              }}
            />
          </div>

          <div className="wh-summary">
            <div className="wh-sum-card">
              <div className="wh-sum-amt">
                ₹{data.totalWithdrawn.toLocaleString("en-IN")}
              </div>
              <div className="wh-sum-label">Total Withdrawn</div>
            </div>
            <div className="wh-sum-card">
              <div className="wh-sum-amt yellow">
                ₹{data.totalPending.toLocaleString("en-IN")}
              </div>
              <div className="wh-sum-label">Pending</div>
            </div>
          </div>

          {loading ? (
            <div className="wh-empty">Loading…</div>
          ) : data.history.length === 0 ? (
            <div className="wh-empty">No withdrawal history yet.</div>
          ) : (
            <div className="wh-list">
              {data.history.map((w) => {
                const st = STATUS_STYLES[w.status] || STATUS_STYLES.pending;
                return (
                  <div key={w._id} className="wh-row">
                    <div className="wh-icon-box">🏧</div>
                    <div className="wh-info">
                      <div className="wh-amt">
                        ₹{Number(w.amount).toFixed(2)}
                      </div>
                      <div className="wh-date">{fmt(w.createdAt)}</div>
                    </div>
                    <span
                      className="wh-badge"
                      style={{ color: st.color, borderColor: st.border }}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <p className="wh-footer">
            © 2025 Biswa Bangla Social Networking Club. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
