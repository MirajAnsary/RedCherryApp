////host-frontend
// src/pages/AccountPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const profileItems = [
  {
    key: "images",
    icon: "🖼️",
    bg: "#fce4ec",
    label: "My Images",
    sub: "Up to 5 photos",
    badge: null,
  },
  {
    key: "video",
    icon: "🎬",
    bg: "#fff8e1",
    label: "My Video",
    sub: "1 intro video",
    badge: null,
  },
  {
    key: "audition",
    icon: "🎤",
    bg: "#e8f5e9",
    label: "Audition Video",
    sub: "1 audition clip",
    badge: null,
  },
  {
    key: "kyc",
    icon: "✅",
    bg: "#e8f5e9",
    label: "My KYC",
    sub: "Aadhaar & Voter ID",
    badge: "Pending",
  },
];
const financeItems = [
  { key: "bank", icon: "🏦", bg: "#fff8e1", label: "Bank Details" },
  { key: "withdraw", icon: "💳", bg: "#fce4ec", label: "Withdraw" },
  { key: "history", icon: "🕒", bg: "#e8f5e9", label: "Withdrawal History" },
  { key: "faq", icon: "❓", bg: "#e8f5e9", label: "FAQ & Help" },
];

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate("/host/signin", { replace: true });
  };

  // ✅ 100% real data — zero dummy values
  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "—";
  const handle = firstName
    ? `@${(firstName + lastName).toLowerCase().replace(/\s+/g, "")}`
    : "—";
  const phone = user?.phoneNumber
    ? `${user.countryCode || "+91"} ${user.phoneNumber}`
    : "—";
  const gender = user?.gender || "—";
  const age = user?.age != null ? String(user.age) : "—";
  const role = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Host";
  const location = user?.location || "India";
  const earnings = user?.earnings != null ? Number(user.earnings) : 0;
  const isVerified = user?.isVerified ?? false;
  const initials = firstName ? firstName[0].toUpperCase() : "?";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .acc-page{min-height:100vh;background:#f7f0f3;font-family:'Nunito',sans-serif;display:flex;justify-content:center;padding-bottom:90px}
        .acc-wrap{width:100%;max-width:520px;display:flex;flex-direction:column}
        .acc-hdr{background:linear-gradient(135deg,#f9c846 0%,#f9a050 40%,#f47eb0 100%);height:110px;position:relative;display:flex;align-items:center;justify-content:center;padding-top:28px;border-bottom-left-radius:28px;border-bottom-right-radius:28px;overflow:hidden}
        .acc-hdr::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 70% 40%,rgba(255,255,255,0.18) 0%,transparent 60%)}
        .acc-htitle{color:#fff;font-family:'Playfair Display',serif;font-weight:800;font-size:clamp(18px,4.5vw,24px);position:relative;z-index:2}
        .acc-card{background:#fff;border-radius:20px;margin:16px 16px 0;padding:20px;box-shadow:0 4px 20px rgba(244,126,176,0.1)}
        .acc-arow{display:flex;align-items:center;gap:14px}
        .acc-ring{width:clamp(60px,14vw,76px);height:clamp(60px,14vw,76px);border-radius:50%;border:3px solid #f9c846;overflow:hidden;flex-shrink:0;box-shadow:0 2px 12px rgba(249,200,70,0.4)}
        .acc-ring img{width:100%;height:100%;object-fit:cover}
        .acc-fallback{width:100%;height:100%;background:linear-gradient(135deg,#f9c846,#f47eb0);display:flex;align-items:center;justify-content:center;font-size:clamp(22px,6vw,30px);font-weight:900;color:#fff}
        .acc-nblock{flex:1;min-width:0}
        .acc-fname{font-family:'Playfair Display',serif;font-weight:800;font-size:clamp(17px,4.5vw,22px);color:#1a1a1a;line-height:1.2}
        .acc-handle{color:#f47eb0;font-size:clamp(12px,3vw,14px);font-weight:700;margin-top:2px}
        .acc-loc{display:flex;align-items:center;gap:4px;margin-top:4px;font-size:clamp(11px,2.8vw,13px);color:#777}
        .acc-editbtn{padding:8px clamp(12px,3vw,20px);border-radius:50px;border:2px solid #f0e0e8;background:#fff;color:#333;font-weight:700;font-size:clamp(12px,3vw,14px);cursor:pointer;flex-shrink:0;font-family:'Nunito',sans-serif;transition:border-color .2s}
        .acc-editbtn:hover{border-color:#f47eb0}
        .acc-vrow{display:flex;align-items:center;gap:6px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:7px 12px;margin-top:12px;font-size:12px;color:#16a34a;font-weight:700}
        .acc-divider{height:1px;background:#f0f0f0;margin:14px 0}
        .acc-inforow{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #f8f0f4}
        .acc-inforow:last-child{border-bottom:none}
        .acc-ilabel{font-size:clamp(12px,2.8vw,14px);color:#aaa;font-weight:600}
        .acc-ivalue{font-size:clamp(12px,2.8vw,14px);font-weight:800;color:#333}
        .acc-earnings{text-align:center}
        .acc-eamt{font-family:'Playfair Display',serif;font-size:clamp(28px,7vw,38px);font-weight:800;color:#f9a020;letter-spacing:-0.5px}
        .acc-elabel{font-size:clamp(12px,3vw,14px);color:#aaa;margin-top:2px}
        .acc-stitle{font-family:'Playfair Display',serif;font-size:clamp(16px,4vw,20px);font-weight:800;color:#1a1a1a;padding:16px 16px 8px}
        .acc-menu{background:#fff;border-radius:18px;margin:0 16px;overflow:hidden;box-shadow:0 2px 14px rgba(244,126,176,0.08)}
        .acc-mrow{width:100%;display:flex;align-items:center;gap:14px;padding:clamp(12px,3vw,16px);background:none;border:none;cursor:pointer;text-align:left;font-family:'Nunito',sans-serif;transition:background .15s}
        .acc-mrow:hover{background:#fff5f8}
        .acc-micon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:20px}
        .acc-mtexts{flex:1;display:flex;flex-direction:column;gap:2px}
        .acc-mlabel{font-size:clamp(13px,3.5vw,15px);font-weight:800;color:#1a1a1a}
        .acc-msub{font-size:clamp(10px,2.5vw,12px);color:#aaa}
        .acc-pending{background:transparent;border:2px solid #f9c846;color:#e6a800;border-radius:50px;padding:3px 11px;font-size:11px;font-weight:800}
        .acc-chev{font-size:22px;color:#ddd;line-height:1}
        .acc-rowdiv{height:1px;background:#f8f0f4;margin-left:72px}
        .acc-logout{width:100%;padding:clamp(13px,3.5vw,17px) 0;border-radius:14px;border:2.5px solid #f47eb0;background:#fff;color:#e8334a;font-weight:900;font-size:clamp(14px,3.5vw,17px);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;font-family:'Nunito',sans-serif;transition:background .2s,color .2s}
        .acc-logout:hover{background:#fff0f4}
        .acc-footer{text-align:center;font-size:clamp(10px,2vw,12px);color:#c0a0b0;padding:20px 16px;line-height:1.8}
        .acc-nav{position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#f9c846 0%,#f9a050 40%,#f47eb0 100%);display:flex;justify-content:center;z-index:100;box-shadow:0 -4px 20px rgba(244,126,176,0.3)}
        .acc-nbtn{flex:1;max-width:160px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:none;border:none;cursor:pointer;padding:10px 0 18px;font-family:'Nunito',sans-serif;transition:background .2s}
        .acc-nbtn.on{background:rgba(255,255,255,0.22)}
        .acc-nicon{font-size:clamp(20px,5vw,24px)}
        .acc-nlabel{font-size:clamp(10px,2.5vw,13px);color:rgba(255,255,255,0.75);font-weight:700}
        .acc-nbtn.on .acc-nlabel{color:#fff}
        @media(min-width:768px){
          .acc-page{padding:0 16px 40px}
          .acc-wrap{max-width:700px}
          .acc-hdr{border-radius:0 0 32px 32px;height:130px}
          .acc-card{margin:20px 0 0;padding:28px;border-radius:24px}
          .acc-menu{margin:0;border-radius:20px}
          .acc-stitle{padding:20px 0 10px}
          .acc-nav{position:sticky;border-radius:20px 20px 0 0;margin-top:24px}
        }
        @media(min-width:1024px){
          .acc-page{padding:0 24px 40px}
          .acc-wrap{max-width:900px}
          .acc-card{padding:32px}
        }
        @media(min-width:1280px){.acc-wrap{max-width:1040px}}
      `}</style>

      <div className="acc-page">
        <div className="acc-wrap">
          {/* HEADER */}
          <div className="acc-hdr">
            <span className="acc-htitle">My Account</span>
          </div>

          {/* PROFILE CARD */}
          <div className="acc-card">
            <div className="acc-arow">
              <div className="acc-ring">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={fullName} />
                ) : (
                  <div className="acc-fallback">{initials}</div>
                )}
              </div>
              <div className="acc-nblock">
                <div className="acc-fname">{fullName}</div>
                <div className="acc-handle">{handle}</div>
                <div className="acc-loc">📍 {location}</div>
              </div>
              <button
                className="acc-editbtn"
                onClick={() => navigate("/host/edit-profile")}
              >
                Edit
              </button>
            </div>

            {isVerified && <div className="acc-vrow">✅ Account Verified</div>}

            <div className="acc-divider" />

            {/* Real info rows */}
            {[
              ["Phone", phone],
              ["Gender", gender],
              ["Age", age],
              ["Role", role],
            ].map(([l, v]) => (
              <div key={l} className="acc-inforow">
                <span className="acc-ilabel">{l}</span>
                <span className="acc-ivalue">{v}</span>
              </div>
            ))}

            <div className="acc-divider" />

            {/* Real earnings */}
            <div className="acc-earnings">
              <div className="acc-eamt">
                ₹{earnings.toLocaleString("en-IN")}
              </div>
              <div className="acc-elabel">Total Earnings</div>
            </div>
          </div>

          {/* MY PROFILE */}
          <div className="acc-stitle">My Profile</div>
          <div className="acc-menu">
            {profileItems.map((item, i) => (
              <div key={item.key}>
                <button
                  className="acc-mrow"
                  onClick={() => navigate(`/host/${item.key}`)}
                >
                  <div className="acc-micon" style={{ background: item.bg }}>
                    {item.icon}
                  </div>
                  <div className="acc-mtexts">
                    <span className="acc-mlabel">{item.label}</span>
                    {item.sub && <span className="acc-msub">{item.sub}</span>}
                  </div>
                  {item.badge && (
                    <span className="acc-pending">{item.badge}</span>
                  )}
                  <span className="acc-chev">›</span>
                </button>
                {i < profileItems.length - 1 && <div className="acc-rowdiv" />}
              </div>
            ))}
          </div>

          {/* FINANCE */}
          <div className="acc-stitle">Finance</div>
          <div className="acc-menu">
            {financeItems.map((item, i) => (
              <div key={item.key}>
                <button
                  className="acc-mrow"
                  onClick={() => navigate(`/host/${item.key}`)}
                >
                  <div className="acc-micon" style={{ background: item.bg }}>
                    {item.icon}
                  </div>
                  <div className="acc-mtexts">
                    <span className="acc-mlabel">{item.label}</span>
                  </div>
                  <span className="acc-chev">›</span>
                </button>
                {i < financeItems.length - 1 && <div className="acc-rowdiv" />}
              </div>
            ))}
          </div>

          {/* LOG OUT */}
          <div style={{ padding: "12px 16px 4px" }}>
            <button
              className="acc-logout"
              style={{ opacity: loggingOut ? 0.7 : 1 }}
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <span style={{ fontSize: 18 }}>⎋</span>
              {loggingOut ? "Signing Out…" : "Log Out"}
            </button>
          </div>

          <p className="acc-footer">
            © 2025 Biswa Bangla Social Networking Club. All rights reserved.
          </p>

          {/* BOTTOM NAV */}
          <div className="acc-nav">
            <button className="acc-nbtn" onClick={() => navigate("/host/home")}>
              <span className="acc-nicon">🏠</span>
              <span className="acc-nlabel">Home</span>
            </button>
            <button className="acc-nbtn on">
              <span className="acc-nicon">👤</span>
              <span className="acc-nlabel">Account</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
