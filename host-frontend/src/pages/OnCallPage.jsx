//host-frontend
// src/pages/OnCallPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OnCallPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const earnings = user?.earnings != null ? Number(user.earnings) : 0;
  const isActive = user?.onCallActive ?? false;

  const handleActivate = async () => {
    if (!code.trim()) return setError("Please enter your On Call Host Code.");
    setError("");
    setLoading(true);
    try {
      // TODO: wire up real API call
      // const res = await api.post("/api/host/oncall/activate", { code });
      // if (!res.ok) throw new Error((await res.json()).message);
      setSuccess("Premium On Call Host status activated!");
    } catch (err) {
      setError(err.message || "Activation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .oc-page{min-height:100vh;background:#f7f0f3;font-family:'Nunito',sans-serif;display:flex;justify-content:center;padding-bottom:80px}
        .oc-wrap{width:100%;max-width:520px;display:flex;flex-direction:column}

        /* HEADER */
        .oc-hdr{background:linear-gradient(135deg,#f9c846 0%,#f9a050 35%,#f47eb0 70%,#ee5fa0 100%);border-bottom-left-radius:28px;border-bottom-right-radius:28px;padding:48px 20px 0;position:relative;overflow:hidden}
        .oc-hdr::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,0.1)}
        .oc-hdr::after{content:'';position:absolute;bottom:-60px;left:-30px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,0.07)}
        .oc-hdr-top{display:flex;align-items:center;justify-content:space-between;position:relative;z-index:2;padding-bottom:16px}
        .oc-title{font-family:'Playfair Display',serif;font-size:clamp(22px,5vw,30px);font-weight:800;color:#fff;line-height:1.1}
        .oc-logo{width:clamp(58px,13vw,76px);height:clamp(58px,13vw,76px);border-radius:50%;object-fit:contain;background:#fff;padding:4px;box-shadow:0 4px 16px rgba(0,0,0,0.18);border:3px solid rgba(255,255,255,0.8)}
        .oc-wallet{background:#fff;border-radius:50px;padding:7px 14px;display:flex;align-items:center;gap:6px;box-shadow:0 2px 12px rgba(0,0,0,0.12)}
        .oc-wallet-amt{font-weight:900;font-size:clamp(13px,3.5vw,16px);color:#f47eb0}

        /* TAB BAR inside header */
        .oc-tabs{display:flex;position:relative;z-index:2;margin-top:4px}
        .oc-tab{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:13px 0 10px;cursor:pointer;font-size:clamp(13px,3.2vw,15px);font-weight:700;color:rgba(255,255,255,0.7);border:none;background:none;font-family:'Nunito',sans-serif;transition:color .2s}
        .oc-tab.active{color:#fff}
        .oc-tab-line{position:absolute;bottom:0;height:3px;background:#fff;border-radius:3px 3px 0 0;transition:left .25s,width .25s}

        /* BODY */
        .oc-body{padding:24px 16px 0}
        .oc-section-title{font-family:'Playfair Display',serif;font-size:clamp(20px,5vw,26px);font-weight:800;color:#1a1a1a;display:flex;align-items:center;gap:10px;margin-bottom:6px}
        .oc-section-sub{font-size:clamp(12px,2.8vw,14px);color:#888;margin-bottom:20px}

        /* CARD */
        .oc-card{background:#fff;border-radius:20px;padding:20px;box-shadow:0 2px 16px rgba(244,126,176,0.1);margin-bottom:16px}
        .oc-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
        .oc-card-title{font-weight:800;font-size:clamp(15px,3.5vw,18px);color:#1a1a1a}
        .oc-badge{padding:5px 14px;border-radius:50px;font-size:clamp(11px,2.5vw,13px);font-weight:800}
        .oc-badge.inactive{background:#f0f0f0;color:#999}
        .oc-badge.active{background:linear-gradient(135deg,#f47eb0,#ee5fa0);color:#fff}
        .oc-card-desc{font-size:clamp(12px,2.8vw,14px);color:#888;margin-bottom:16px}

        /* INPUT ROW */
        .oc-input-row{display:flex;gap:10px;align-items:stretch}
        .oc-input{flex:1;padding:13px 16px;border-radius:13px;border:2px solid #fce4ec;font-size:clamp(13px,3vw,15px);color:#333;outline:none;background:#fffbfd;font-family:'Nunito',sans-serif;transition:border-color .2s}
        .oc-input:focus{border-color:#f47eb0}
        .oc-input::placeholder{color:#bbb}
        .oc-activate-btn{padding:13px 22px;border-radius:13px;background:linear-gradient(135deg,#f9b8c8,#f47eb0);border:none;cursor:pointer;font-size:clamp(13px,3vw,15px);font-weight:800;color:#fff;font-family:'Nunito',sans-serif;transition:transform .15s,box-shadow .15s;white-space:nowrap}
        .oc-activate-btn:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(244,126,176,0.4)}
        .oc-activate-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none}

        /* Messages */
        .oc-error{color:#e05070;font-size:13px;margin-top:8px;font-weight:700}
        .oc-success{color:#2db87a;font-size:13px;margin-top:8px;font-weight:700}

        /* FOOTER */
        .oc-footer{text-align:center;font-size:clamp(10px,2vw,12px);color:#c0a0b0;padding:20px 16px;line-height:1.8}

        /* BOTTOM NAV */
        .oc-nav{position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#f9c846 0%,#f9a050 40%,#f47eb0 100%);display:flex;justify-content:center;z-index:100;box-shadow:0 -4px 20px rgba(244,126,176,0.3)}
        .oc-nbtn{flex:1;max-width:160px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:none;border:none;cursor:pointer;padding:10px 0 18px;font-family:'Nunito',sans-serif;transition:background .2s}
        .oc-nbtn.on{background:rgba(255,255,255,0.22)}
        .oc-nicon{font-size:clamp(20px,5vw,24px)}
        .oc-nlabel{font-size:clamp(10px,2.5vw,13px);color:rgba(255,255,255,0.75);font-weight:700}
        .oc-nbtn.on .oc-nlabel{color:#fff}

        @media(min-width:768px){
          .oc-hdr{border-radius:0 0 32px 32px;padding:56px 36px 0}
          .oc-body{padding:28px 0 0}
          .oc-card{padding:28px;border-radius:24px}
        }
      `}</style>

      <div className="oc-page">
        <div className="oc-wrap">
          {/* HEADER */}
          <div className="oc-hdr">
            <div className="oc-hdr-top">
              <div>
                <div className="oc-title">Host</div>
                <div className="oc-title">Dashboard</div>
              </div>
              <img
                src="/logo.png"
                alt="BBSNC"
                className="oc-logo"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/76x76/fff/f47eb0?text=RC";
                }}
              />
              <div className="oc-wallet">
                <span style={{ fontSize: 15 }}>🗂️</span>
                <span className="oc-wallet-amt">
                  ₹{earnings.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* TABS */}
            <div className="oc-tabs" style={{ position: "relative" }}>
              <button className="oc-tab" onClick={() => navigate("/host/home")}>
                <span style={{ fontSize: 16 }}>🎙️</span> Dashboard
              </button>
              <button className="oc-tab active">
                <span style={{ fontSize: 16 }}>📞</span> On Call
              </button>
              {/* active underline under "On Call" (right tab) */}
              <div
                className="oc-tab-line"
                style={{ left: "50%", width: "50%" }}
              />
            </div>
          </div>

          {/* BODY */}
          <div className="oc-body">
            <div className="oc-section-title">
              <span style={{ fontSize: 28 }}>📞</span> On Call
            </div>
            <p className="oc-section-sub">
              Activate your Premium On Call Host status and manage your profile
              media.
            </p>

            {/* PREMIUM ON CALL HOST CARD */}
            <div className="oc-card">
              <div className="oc-card-header">
                <span className="oc-card-title">Premium On Call Host</span>
                <span
                  className={`oc-badge ${isActive ? "active" : "inactive"}`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="oc-card-desc">
                Enter your On Call Host Code to activate premium status
              </p>
              <div className="oc-input-row">
                <input
                  className="oc-input"
                  placeholder="Enter On Call Host Code..."
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  disabled={isActive}
                />
                <button
                  className="oc-activate-btn"
                  onClick={handleActivate}
                  disabled={loading || isActive}
                >
                  {loading ? "..." : "Activate"}
                </button>
              </div>
              {error && <p className="oc-error">⚠️ {error}</p>}
              {success && <p className="oc-success">✅ {success}</p>}
            </div>
          </div>

          <p className="oc-footer">
            © 2026 Biswa Bangla Social Networking Club.
            <br />
            All rights reserved.
          </p>

          {/* BOTTOM NAV */}
          <div className="oc-nav">
            <button
              className="oc-nbtn on"
              onClick={() => navigate("/host/home")}
            >
              <span className="oc-nicon">🏠</span>
              <span className="oc-nlabel">Home</span>
            </button>
            <button
              className="oc-nbtn"
              onClick={() => navigate("/host/account")}
            >
              <span className="oc-nicon">👤</span>
              <span className="oc-nlabel">Account</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
