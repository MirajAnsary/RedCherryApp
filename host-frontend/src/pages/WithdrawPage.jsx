//host-frontend
// src/pages/WithdrawPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function WithdrawPage() {
  const { user, updateUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Always fetch fresh earnings from server when this page loads
  useEffect(() => {
    refreshUser();
  }, []); // eslint-disable-line

  const balance = user?.earnings ?? 0;
  const hasBank = user?.bank?.hasBank ?? false;
  const QUICK = [100, 500, 1000];

  const handleWithdraw = async () => {
    setError("");
    setSuccess("");
    const amt = Number(amount);
    if (!amt || amt < 100) return setError("Minimum withdrawal is ₹100.");
    if (amt > balance) return setError("Insufficient balance.");
    if (!hasBank) return setError("Please add bank details first.");
    setProcessing(true);
    const res = await api.post("/api/host/profile/withdraw", { amount: amt });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
      setProcessing(false);
      return;
    }
    updateUser({ earnings: data.remainingBalance });
    setSuccess(`₹${amt} withdrawal request submitted! ✓`);
    setAmount("");
    setProcessing(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .wd-page{min-height:100vh;background:#f7f0f3;font-family:'Nunito',sans-serif;display:flex;justify-content:center;padding-bottom:40px}
        .wd-wrap{width:100%;max-width:520px;display:flex;flex-direction:column}
        .wd-topbar{display:flex;align-items:center;gap:12px;padding:52px 20px 16px;background:#fff}
        .wd-back{background:none;border:none;cursor:pointer;font-size:22px;color:#f47eb0;font-weight:800}
        .wd-topbar-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:800;color:#1a1a1a}
        .wd-logo-row{display:flex;justify-content:center;padding:14px;background:#fff;border-bottom:1px solid #f5f0f3}
        .wd-logo{width:88px;height:88px;border-radius:50%;object-fit:contain;border:3px solid #fce4ec;padding:4px}
        .wd-balance-card{background:linear-gradient(135deg,#f9b8c8,#f47eb0);border-radius:18px;margin:16px 16px 0;padding:20px 22px;box-shadow:0 4px 18px rgba(244,126,176,.35)}
        .wd-balance-label{font-size:13px;color:rgba(255,255,255,.85);font-weight:600;margin-bottom:4px}
        .wd-balance-amt{font-family:'Playfair Display',serif;font-size:36px;font-weight:800;color:#fff}
        .wd-balance-min{font-size:12px;color:rgba(255,255,255,.75);margin-top:4px}
        .wd-body{padding:0 16px}
        .wd-input{width:100%;padding:14px 16px;border-radius:13px;border:2px solid #fce4ec;font-size:16px;color:#333;outline:none;background:#fffbfd;font-family:'Nunito',sans-serif;transition:border-color .2s;margin-top:16px}
        .wd-input:focus{border-color:#f47eb0}
        .wd-input::placeholder{color:#bbb}
        .wd-chips{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap}
        .wd-chip{padding:9px 18px;border-radius:50px;background:#f0e8f0;border:none;font-weight:800;font-size:14px;color:#555;cursor:pointer;font-family:'Nunito',sans-serif;transition:all .15s}
        .wd-chip:hover{background:#f47eb0;color:#fff}
        .wd-bank-info{display:flex;align-items:center;gap:12px;background:#fff8fa;border:1px solid #fce4ec;border-radius:14px;padding:14px 16px;margin-top:16px}
        .wd-bank-icon{font-size:24px;flex-shrink:0}
        .wd-bank-name{font-weight:800;font-size:14px;color:#1a1a1a}
        .wd-bank-sub{font-size:12px;color:#aaa;margin-top:2px}
        .wd-now-btn{width:100%;padding:17px 0;border-radius:50px;background:#f5c518;border:none;color:#fff;font-weight:900;font-size:18px;cursor:pointer;font-family:'Nunito',sans-serif;box-shadow:0 4px 18px rgba(245,197,24,.4);margin-top:18px;letter-spacing:.5px}
        .wd-now-btn:disabled{opacity:.6;cursor:not-allowed}
        .wd-error{background:#fff0f0;border:1px solid #ffd5d5;color:#e53935;font-size:13px;border-radius:12px;padding:10px 16px;text-align:center;margin:10px 16px 0}
        .wd-success{background:#f0fdf4;border:1px solid #bbf7d0;color:#16a34a;font-size:13px;border-radius:12px;padding:10px 16px;text-align:center;margin:10px 16px 0}
        .wd-footer{text-align:center;font-size:11px;color:#c0a0b0;padding:24px 16px;line-height:1.8}
        @media(min-width:768px){.wd-wrap{max-width:700px}}
        @media(min-width:1024px){.wd-wrap{max-width:900px}}
      `}</style>
      <div className="wd-page">
        <div className="wd-wrap">
          <div className="wd-topbar">
            <button className="wd-back" onClick={() => navigate(-1)}>
              ←
            </button>
            <span className="wd-topbar-title">Withdraw</span>
          </div>
          <div className="wd-logo-row">
            <img
              src="/logo.png"
              alt="BBSNC"
              className="wd-logo"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/88x88/fce4ec/f47eb0?text=RC";
              }}
            />
          </div>

          <div className="wd-balance-card">
            <div className="wd-balance-label">Available to Withdraw</div>
            <div className="wd-balance-amt">₹{Number(balance).toFixed(2)}</div>
            <div className="wd-balance-min">Minimum withdrawal: ₹100</div>
          </div>

          {error && <div className="wd-error">{error}</div>}
          {success && <div className="wd-success">{success}</div>}

          <div className="wd-body">
            <input
              className="wd-input"
              type="number"
              placeholder="Enter Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={100}
            />

            <div className="wd-chips">
              {QUICK.map((q) => (
                <button
                  key={q}
                  className="wd-chip"
                  onClick={() => setAmount(String(q))}
                >
                  ₹{q}
                </button>
              ))}
              <button
                className="wd-chip"
                onClick={() => setAmount(String(balance))}
              >
                All
              </button>
            </div>

            <div className="wd-bank-info">
              <span className="wd-bank-icon">🏦</span>
              <div>
                <div className="wd-bank-name">
                  {hasBank ? "Bank account linked" : "No bank account added"}
                </div>
                <div className="wd-bank-sub">
                  {hasBank ? "Ready to withdraw" : "Add bank details first"}
                </div>
              </div>
            </div>
            <button
              className="wd-now-btn"
              onClick={handleWithdraw}
              disabled={processing}
            >
              {processing ? "Processing…" : "Withdraw Now"}
            </button>
          </div>

          <p className="wd-footer">
            © 2026 Biswa Bangla Social Networking Club. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
