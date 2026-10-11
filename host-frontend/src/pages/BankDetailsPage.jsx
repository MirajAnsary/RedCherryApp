//host-frontend
// src/pages/BankDetailsPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function BankDetailsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const balance = user?.earnings ?? 0;

  useEffect(() => {
    api
      .get("/api/host/profile/bank")
      .then((r) => r.json())
      .then((d) => {
        if (d.bank?.accountHolderName) {
          setForm((prev) => ({
            ...prev,
            accountHolderName: d.bank.accountHolderName,
            ifscCode: d.bank.ifscCode,
            bankName: d.bank.bankName,
          }));
        }
      });
  }, []);

  const handleSave = async () => {
    setError("");
    setSuccess("");
    if (!form.accountHolderName.trim())
      return setError("Account holder name required.");
    if (!form.accountNumber) return setError("Account number required.");
    if (form.accountNumber !== form.confirmAccountNumber)
      return setError("Account numbers do not match.");
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(form.ifscCode))
      return setError("Invalid IFSC code (e.g. SBIN0001234).");
    if (!form.bankName.trim()) return setError("Bank name required.");
    setSaving(true);
    const res = await api.post("/api/host/profile/bank", form);
    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
      setSaving(false);
      return;
    }
    setSuccess("Bank details saved successfully! ✓");
    setSaving(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .bd-page{min-height:100vh;background:#f7f0f3;font-family:'Nunito',sans-serif;display:flex;justify-content:center;padding-bottom:40px}
        .bd-wrap{width:100%;max-width:520px;display:flex;flex-direction:column}
        .bd-topbar{display:flex;align-items:center;gap:12px;padding:52px 20px 16px;background:#fff}
        .bd-back{background:none;border:none;cursor:pointer;font-size:22px;color:#f47eb0;font-weight:800}
        .bd-topbar-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:800;color:#1a1a1a}
        .bd-logo-row{display:flex;justify-content:center;padding:14px;background:#fff;border-bottom:1px solid #f5f0f3}
        .bd-logo{width:88px;height:88px;border-radius:50%;object-fit:contain;border:3px solid #fce4ec;padding:4px}
        .bd-balance-card{background:linear-gradient(135deg,#f9b8c8,#f47eb0);border-radius:18px;margin:16px 16px 0;padding:20px 22px;box-shadow:0 4px 18px rgba(244,126,176,.35)}
        .bd-balance-label{font-size:13px;color:rgba(255,255,255,.85);font-weight:600;margin-bottom:6px}
        .bd-balance-amt{font-family:'Playfair Display',serif;font-size:34px;font-weight:800;color:#fff}
        .bd-section-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:800;color:#1a1a1a;padding:16px 16px 8px}
        .bd-input{width:100%;padding:14px 16px;border-radius:13px;border:2px solid #fce4ec;font-size:15px;color:#333;outline:none;background:#fffbfd;font-family:'Nunito',sans-serif;transition:border-color .2s;margin-bottom:12px}
        .bd-input:focus{border-color:#f47eb0}
        .bd-input::placeholder{color:#bbb}
        .bd-form-wrap{padding:0 16px}
        .bd-save{width:100%;padding:16px 0;border-radius:50px;background:linear-gradient(135deg,#f9b8c8,#f47eb0);border:none;color:#fff;font-weight:900;font-size:17px;cursor:pointer;font-family:'Nunito',sans-serif;box-shadow:0 4px 18px rgba(244,126,176,.4);margin-top:4px}
        .bd-save:disabled{opacity:.6;cursor:not-allowed}
        .bd-error{background:#fff0f0;border:1px solid #ffd5d5;color:#e53935;font-size:13px;border-radius:12px;padding:10px 16px;text-align:center;margin:0 16px 10px}
        .bd-success{background:#f0fdf4;border:1px solid #bbf7d0;color:#16a34a;font-size:13px;border-radius:12px;padding:10px 16px;text-align:center;margin:0 16px 10px}
        .bd-footer{text-align:center;font-size:11px;color:#c0a0b0;padding:20px 16px;line-height:1.8}
        @media(min-width:768px){.bd-wrap{max-width:700px}}
        @media(min-width:1024px){.bd-wrap{max-width:900px}}
      `}</style>
      <div className="bd-page">
        <div className="bd-wrap">
          <div className="bd-topbar">
            <button className="bd-back" onClick={() => navigate(-1)}>
              ←
            </button>
            <span className="bd-topbar-title">Bank Details</span>
          </div>
          <div className="bd-logo-row">
            <img
              src="/logo.png"
              alt="BBSNC"
              className="bd-logo"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/88x88/fce4ec/f47eb0?text=RC";
              }}
            />
          </div>

          <div className="bd-balance-card">
            <div className="bd-balance-label">Available Balance</div>
            <div className="bd-balance-amt">₹{Number(balance).toFixed(2)}</div>
          </div>

          <div className="bd-section-title">Add / Update Bank Account</div>
          {error && <div className="bd-error">{error}</div>}
          {success && <div className="bd-success">{success}</div>}

          <div className="bd-form-wrap">
            {[
              {
                key: "accountHolderName",
                ph: "Account Holder Name",
                type: "text",
              },
              { key: "accountNumber", ph: "Account Number", type: "password" },
              {
                key: "confirmAccountNumber",
                ph: "Confirm Account Number",
                type: "password",
              },
              { key: "ifscCode", ph: "IFSC Code", type: "text" },
              { key: "bankName", ph: "Bank Name", type: "text" },
            ].map((f) => (
              <input
                key={f.key}
                className="bd-input"
                type={f.type}
                placeholder={f.ph}
                value={form[f.key]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
                }
              />
            ))}
            <button className="bd-save" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save Bank Details"}
            </button>
          </div>

          <p className="bd-footer">
            © 2026 Biswa Bangla Social Networking Club. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
