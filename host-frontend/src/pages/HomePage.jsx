////host-frontend
// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const STORAGE_KEY_ROOM = "rc_host_roomName";
const STORAGE_KEY_TOPIC = "rc_host_topic";

// ── Earning rates per combination ─────────────────────────────────────────────
const EARN_RATES = {
  public_single: 20,
  public_double: 30,
  public_multiple: 40,
  private_single: 90,
};

// ── Availability matrix ───────────────────────────────────────────────────────
// Public  → Single ✅  Double ✅  Multiple ✅
// Private → Single ✅  Double 🔜  Multiple 🔜
const AVAILABLE = {
  Public: { Single: true, Double: true, Multiple: true },
  Private: { Single: true, Double: false, Multiple: false },
};

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState(
    () => localStorage.getItem(STORAGE_KEY_ROOM) || "",
  );
  const [topic, setTopic] = useState(
    () => localStorage.getItem(STORAGE_KEY_TOPIC) || "",
  );
  const [roomType, setRoomType] = useState("Single");
  const [privacy, setPrivacy] = useState("Public");
  const [hosts, setHosts] = useState([]);
  const [hostsLoading, setHostsLoading] = useState(true);
  const [goLiveLoading, setGoLiveLoading] = useState(false);

  const firstName = user?.firstName || "";
  const earnings = user?.earnings != null ? Number(user.earnings) : 0;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ROOM, roomName);
  }, [roomName]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TOPIC, topic);
  }, [topic]);

  useEffect(() => {
    api
      .get("/api/host/profile/hosts")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setHosts(d.hosts || []);
      })
      .catch(() => {})
      .finally(() => setHostsLoading(false));
  }, []);

  // When privacy changes, if current roomType becomes unavailable → fall back to Single
  const handlePrivacyChange = (p) => {
    setPrivacy(p);
    if (!AVAILABLE[p]?.[roomType]) setRoomType("Single");
  };

  const handleRoomTypeChange = (rt) => {
    if (!AVAILABLE[privacy]?.[rt]) return; // locked — no-op
    setRoomType(rt);
  };

  const earnKey = `${privacy.toLowerCase()}_${roomType.toLowerCase()}`;
  const earnRate = EARN_RATES[earnKey] ?? null;

  const handleGoLive = async () => {
    if (!roomName.trim()) {
      alert("Please enter a room name.");
      return;
    }
    if (!AVAILABLE[privacy]?.[roomType]) {
      alert(`${privacy} ${roomType} rooms are coming soon.`);
      return;
    }
    setGoLiveLoading(true);
    try {
      const res = await api.post("/api/host/rooms/create", {
        roomName: roomName.trim(),
        roomType,
        privacy,
        description: topic.trim(),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to create room.");
        return;
      }
      navigate("/host/live", {
        state: {
          room: data.room,
          token: data.token,
          appId: data.appId,
          uid: data.uid,
        },
      });
    } catch (err) {
      console.error("Go Live error:", err);
      alert("Network error. Please try again.");
    } finally {
      setGoLiveLoading(false);
    }
  };

  const roomTypes = [
    { key: "Single", emoji: "🧍", sub: "Host only" },
    { key: "Double", emoji: "👥", sub: "Host + viewer" },
    { key: "Multiple", emoji: "🎙️", sub: "Host + audience" },
  ];
  const privacyTypes = [
    { key: "Public", emoji: "🌍", sub: "Anyone can join" },
    { key: "Private", emoji: "🔒", sub: "Only 1 person joins" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        .hp-root{min-height:100vh;background:#f7f0f3;font-family:'Nunito',sans-serif;display:flex;flex-direction:column}

        /* ── HEADER ── */
        .hp-hdr{background:linear-gradient(135deg,#f9c846 0%,#f9a050 35%,#f47eb0 70%,#ee5fa0 100%);padding:20px 20px 0;position:relative;overflow:hidden;flex-shrink:0}
        .hp-hdr::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,0.1)}
        .hp-hdr-inner{max-width:1400px;margin:0 auto;width:100%}
        .hp-hdr-top{display:flex;align-items:center;justify-content:space-between;position:relative;z-index:2;padding-bottom:4px}
        .hp-brand{font-family:'Playfair Display',serif;font-size:26px;font-weight:800;color:#fff;line-height:1.1}
        .hp-welcome{font-size:13px;font-weight:700;color:rgba(255,255,255,0.85);margin-top:2px}
        .hp-hdr-right{display:flex;align-items:center;gap:10px}
        .hp-wallet{background:#fff;border-radius:50px;padding:7px 14px;display:flex;align-items:center;gap:6px;box-shadow:0 2px 12px rgba(0,0,0,0.12)}
        .hp-wallet-amt{font-weight:900;font-size:15px;color:#f47eb0}
        .hp-desk-nav{display:none}
        .hp-tabs{display:flex;position:relative;z-index:2;margin-top:8px}
        .hp-tab{padding:12px 20px 10px;cursor:pointer;font-size:14px;font-weight:700;color:rgba(255,255,255,0.7);border:none;background:none;font-family:'Nunito',sans-serif;border-bottom:3px solid transparent;transition:all .2s}
        .hp-tab.on{color:#fff;border-bottom-color:#fff}

        /* ── BODY ── */
        .hp-body{flex:1;padding:20px 16px 100px;max-width:1400px;margin:0 auto;width:100%}
        .hp-left,.hp-right{display:flex;flex-direction:column;gap:16px}
        .hp-right{margin-top:16px}

        /* ── CARD ── */
        .hp-card{background:#fff;border-radius:20px;padding:20px;box-shadow:0 2px 16px rgba(244,126,176,0.1)}
        .hp-ctitle{font-family:'Playfair Display',serif;font-size:18px;font-weight:800;color:#1a1a1a;margin-bottom:14px}

        /* ── HOST CIRCLES ── */
        .hp-circles{display:flex;gap:14px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}
        .hp-circles::-webkit-scrollbar{display:none}
        .hp-hitem{display:flex;flex-direction:column;align-items:center;gap:6px;flex-shrink:0;cursor:pointer}
        .hp-hring{width:62px;height:62px;border-radius:50%;padding:3px;background:linear-gradient(135deg,#f9c846,#f47eb0);box-shadow:0 2px 10px rgba(244,126,176,0.3)}
        .hp-hinner{width:100%;height:100%;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;border:2px solid #fff}
        .hp-hinner img{width:100%;height:100%;object-fit:cover;border-radius:50%}
        .hp-hinit{font-weight:900;font-size:20px;color:#f47eb0}
        .hp-hname{font-size:11px;font-weight:700;color:#555;text-align:center;max-width:66px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .hp-skel-c{width:62px;height:62px;border-radius:50%;background:linear-gradient(90deg,#f0e0e8 25%,#fce4ec 50%,#f0e0e8 75%);background-size:200% 100%;animation:shimmer 1.2s infinite}
        .hp-skel-n{width:44px;height:10px;border-radius:6px;background:linear-gradient(90deg,#f0e0e8 25%,#fce4ec 50%,#f0e0e8 75%);background-size:200% 100%;animation:shimmer 1.2s infinite}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

        /* ── FORM ── */
        .hp-label{font-size:14px;font-weight:800;color:#1a1a1a;margin:14px 0 10px}
        .hp-saved{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:#f47eb0;background:#fce4ec;padding:3px 8px;border-radius:20px;margin-bottom:8px}
        .hp-iwrap{position:relative;width:100%}
        .hp-input{width:100%;padding:13px 40px 13px 16px;border-radius:13px;border:2px solid #fce4ec;font-size:15px;color:#333;outline:none;background:#fffbfd;font-family:'Nunito',sans-serif;transition:border-color .2s}
        .hp-input:focus{border-color:#f47eb0}
        .hp-input::placeholder{color:#bbb}
        .hp-xclear{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:16px;color:#ccc;padding:4px;line-height:1;transition:color .2s}
        .hp-xclear:hover{color:#f47eb0}
        .hp-tawrap{position:relative;width:100%}
        .hp-ta{width:100%;padding:13px 40px 13px 16px;border-radius:13px;border:2px solid #fce4ec;font-size:15px;color:#333;outline:none;resize:none;background:#fffbfd;font-family:'Nunito',sans-serif;transition:border-color .2s}
        .hp-ta:focus{border-color:#f47eb0}
        .hp-ta::placeholder{color:#bbb}
        .hp-taxclear{position:absolute;right:12px;top:14px;background:none;border:none;cursor:pointer;font-size:16px;color:#ccc;padding:4px;line-height:1;transition:color .2s}
        .hp-taxclear:hover{color:#f47eb0}

        /* ── ROOM TYPE GRID ── */
        .hp-types{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}

        .hp-tbtn{
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          padding:13px 6px 11px;border-radius:15px;border:2px solid #f0e0e8;
          background:#fff;cursor:pointer;gap:2px;transition:all .18s;
          font-family:'Nunito',sans-serif;position:relative;min-height:96px;
        }
        /* hover only when not locked */
        .hp-tbtn:not(.locked):hover{border-color:#f47eb0;transform:translateY(-1px)}
        /* selected */
        .hp-tbtn.on{
          background:linear-gradient(135deg,#f47eb0,#ee5fa0);
          border-color:#f47eb0;
          box-shadow:0 6px 18px rgba(244,126,176,0.4);
          transform:translateY(-2px);
        }
        /* coming-soon / locked */
        .hp-tbtn.locked{opacity:0.52;cursor:not-allowed;background:#fafafa;border-color:#ede0e8}
        .hp-tbtn.locked:hover{transform:none;border-color:#ede0e8;box-shadow:none}

        .hp-temoji{font-size:22px;line-height:1}
        .hp-tname{font-weight:800;font-size:12px;margin-top:2px}
        .hp-tsub{font-size:10px;text-align:center;line-height:1.3}

        /* 🔜 Soon badge — top-right corner of locked button */
        .hp-soon-badge{
          position:absolute;top:6px;right:6px;
          background:#fff3cd;color:#8a5200;
          font-size:9px;font-weight:900;
          border-radius:7px;padding:2px 5px;
          border:1px solid #ffe08a;white-space:nowrap;
          letter-spacing:0.2px;
        }

        /* ── PRIVACY ── */
        .hp-privacy{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .hp-pbtn{display:flex;flex-direction:column;align-items:center;padding:16px 12px;border-radius:15px;border:2px solid #f0e0e8;background:#fff;cursor:pointer;gap:3px;transition:all .18s;font-family:'Nunito',sans-serif}
        .hp-pbtn:hover{border-color:#f47eb0;transform:translateY(-1px)}
        .hp-pbtn.on{background:linear-gradient(135deg,#f47eb0,#ee5fa0);border-color:#f47eb0;box-shadow:0 6px 18px rgba(244,126,176,0.4);transform:translateY(-2px)}
        .hp-pemoji{font-size:28px}
        .hp-pname{font-weight:800;font-size:14px;margin-top:4px}
        .hp-psub{font-size:11px}

        /* ── EARNING BANNER ── */
        .hp-earn-banner{
          margin-top:14px;
          background:linear-gradient(135deg,#fff8e1,#fff3e0);
          border:1.5px solid #f9c846;border-radius:13px;
          padding:12px 16px;display:flex;align-items:center;gap:10px;
        }
        .hp-earn-icon{font-size:22px;flex-shrink:0}
        .hp-earn-text{font-size:13px;font-weight:800;color:#7a4f00;line-height:1.4}
        .hp-earn-rate{font-size:18px;font-weight:900;color:#e07b00}

        /* ── NOTES BOX ── */
        .hp-notes{background:#f0f9ff;border:1.5px solid #bae0f7;border-radius:13px;padding:14px 16px}
        .hp-notes-title{font-size:13px;font-weight:900;color:#0c5a7a;margin-bottom:8px;display:flex;align-items:center;gap:6px}
        .hp-notes-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px}
        .hp-notes-list li{font-size:12px;font-weight:700;color:#1a5070;display:flex;align-items:flex-start;gap:6px;line-height:1.4}
        .hp-notes-list li::before{content:'•';color:#2196f3;font-size:14px;line-height:1.1;flex-shrink:0}
        .hp-note-soon{color:#b07000;font-size:11px;font-weight:800;margin-left:2px}

        /* ── GO LIVE ── */
        .hp-golive{width:100%;padding:16px 0;border-radius:50px;background:linear-gradient(135deg,#f9b8c8,#f47eb0);border:none;cursor:pointer;font-size:18px;font-weight:900;color:#fff;display:flex;align-items:center;justify-content:center;gap:12px;font-family:'Nunito',sans-serif;box-shadow:0 6px 24px rgba(244,126,176,0.45);letter-spacing:0.5px;transition:transform .15s,box-shadow .15s;margin-top:16px}
        .hp-golive:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(244,126,176,0.5)}
        .hp-golive:disabled{opacity:0.7;cursor:not-allowed;transform:none}
        .hp-dot{width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px rgba(255,255,255,0.35);animation:pulse 1.5s infinite;flex-shrink:0}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 4px rgba(255,255,255,0.35)}50%{box-shadow:0 0 0 8px rgba(255,255,255,0.15)}}

        /* ── BOTTOM NAV ── */
        .hp-bnav{position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#f9c846 0%,#f9a050 40%,#f47eb0 100%);display:flex;justify-content:center;z-index:100;box-shadow:0 -4px 20px rgba(244,126,176,0.3)}
        .hp-nbtn{flex:1;max-width:160px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:none;border:none;cursor:pointer;padding:10px 0 18px;font-family:'Nunito',sans-serif;transition:background .2s}
        .hp-nbtn.on{background:rgba(255,255,255,0.22)}
        .hp-nicon{font-size:22px}
        .hp-nlabel{font-size:12px;color:rgba(255,255,255,0.75);font-weight:700}
        .hp-nbtn.on .hp-nlabel{color:#fff}

        .hp-footer{text-align:center;font-size:12px;color:#c0a0b0;padding:20px 16px;line-height:1.8}

        /* ══ TABLET ══ */
        @media(min-width:768px){
          .hp-hdr{padding:24px 32px 0}
          .hp-brand{font-size:30px}
          .hp-body{padding:24px 32px 100px}
          .hp-card{padding:24px}
          .hp-ctitle{font-size:20px}
          .hp-hring,.hp-skel-c{width:68px;height:68px}
          .hp-tbtn{padding:16px 8px 13px;min-height:108px}
          .hp-temoji{font-size:26px}
          .hp-tname{font-size:13px}
          .hp-tsub{font-size:11px}
          .hp-pemoji{font-size:32px}
          .hp-pname{font-size:15px}
          .hp-golive{font-size:19px;padding:17px 0}
        }

        /* ══ LAPTOP — TWO COLUMN ══ */
        @media(min-width:1024px){
          .hp-hdr{padding:28px 48px 0}
          .hp-brand{font-size:34px}
          .hp-welcome{font-size:14px}
          .hp-body{padding:32px 48px 48px}
          .hp-desk-nav{display:flex;gap:8px}
          .hp-tabs{display:none !important}
          .hp-bnav{display:none}
          .hp-desk-btn{display:flex;align-items:center;gap:7px;padding:9px 18px;border-radius:50px;border:none;background:rgba(255,255,255,0.2);color:rgba(255,255,255,0.85);font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:background .2s;white-space:nowrap}
          .hp-desk-btn:hover{background:rgba(255,255,255,0.3)}
          .hp-desk-btn.on{background:rgba(255,255,255,0.35);color:#fff}
          .hp-cols{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:start}
          .hp-left,.hp-right{gap:24px;margin-top:0}
          .hp-card{padding:28px;border-radius:24px}
          .hp-ctitle{font-size:22px}
          .hp-hring,.hp-skel-c{width:72px;height:72px}
          .hp-input{font-size:16px;padding:15px 44px 15px 18px}
          .hp-ta{font-size:16px;padding:15px 44px 15px 18px}
          .hp-tbtn{padding:18px 8px 14px;min-height:116px}
          .hp-temoji{font-size:28px}
          .hp-tname{font-size:14px}
          .hp-pbtn{padding:20px 16px}
          .hp-pemoji{font-size:36px}
          .hp-pname{font-size:16px}
          .hp-psub{font-size:12px}
          .hp-golive{font-size:20px;padding:18px 0}
        }

        /* ══ LARGE DESKTOP ══ */
        @media(min-width:1280px){
          .hp-hdr{padding:32px 64px 0}
          .hp-brand{font-size:38px}
          .hp-body{padding:36px 64px 56px}
          .hp-cols{gap:36px}
          .hp-card{padding:32px}
          .hp-ctitle{font-size:24px}
        }

        @media(min-width:1536px){
          .hp-body,.hp-hdr-inner{max-width:1600px}
        }
      `}</style>

      <div className="hp-root">
        {/* ── HEADER ── */}
        <div className="hp-hdr">
          <div className="hp-hdr-inner">
            <div className="hp-hdr-top">
              <div>
                <div className="hp-brand">Red Cherry</div>
                <div className="hp-welcome">
                  Welcome, {firstName || "Host"} 👋
                </div>
              </div>
              <div className="hp-hdr-right">
                <div className="hp-wallet">
                  <span style={{ fontSize: 16 }}>💰</span>
                  <span className="hp-wallet-amt">₹{earnings}</span>
                </div>
                <div className="hp-desk-nav">
                  <button className="hp-desk-btn on">🏠 Home</button>
                  <button
                    className="hp-desk-btn"
                    onClick={() => navigate("/host/account")}
                  >
                    👤 Account
                  </button>
                </div>
              </div>
            </div>
            <div className="hp-tabs">
              <button className="hp-tab on">🏠 Home</button>
              <button
                className="hp-tab"
                onClick={() => navigate("/host/account")}
              >
                👤 Account
              </button>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="hp-body">
          <div className="hp-cols">
            {/* ── LEFT ── */}
            <div className="hp-left">
              {/* Other Hosts */}
              <div className="hp-card">
                <div className="hp-ctitle">Other Hosts</div>
                <div className="hp-circles">
                  {hostsLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="hp-hitem">
                        <div className="hp-skel-c" />
                        <div className="hp-skel-n" />
                      </div>
                    ))
                  ) : hosts.length === 0 ? (
                    <p style={{ fontSize: 13, color: "#bbb", fontWeight: 700 }}>
                      No other hosts online
                    </p>
                  ) : (
                    hosts.map((h) => (
                      <div key={h._id} className="hp-hitem">
                        <div className="hp-hring">
                          <div className="hp-hinner">
                            {h.profileImage ? (
                              <img
                                src={h.profileImage}
                                alt={h.name}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <span
                              className="hp-hinit"
                              style={{
                                display: h.profileImage ? "none" : "flex",
                              }}
                            >
                              {h.initials}
                            </span>
                          </div>
                        </div>
                        <span className="hp-hname">{h.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Create Room */}
              <div className="hp-card">
                <div className="hp-ctitle">Create a Room</div>
                {roomName.trim() && <div className="hp-saved">✓ Saved</div>}
                <div className="hp-iwrap">
                  <input
                    className="hp-input"
                    placeholder="Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                  />
                  {roomName && (
                    <button
                      className="hp-xclear"
                      onClick={() => setRoomName("")}
                      title="Clear"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="hp-label">Room Type</div>
                <div className="hp-types">
                  {roomTypes.map((rt) => {
                    const avail = AVAILABLE[privacy]?.[rt.key] ?? false;
                    const isOn = avail && roomType === rt.key;
                    return (
                      <button
                        key={rt.key}
                        className={`hp-tbtn${isOn ? " on" : ""}${!avail ? " locked" : ""}`}
                        onClick={() => handleRoomTypeChange(rt.key)}
                        title={!avail ? "Coming soon" : undefined}
                      >
                        {!avail && (
                          <span className="hp-soon-badge">🔜 Soon</span>
                        )}
                        <span className="hp-temoji">{rt.emoji}</span>
                        <span
                          className="hp-tname"
                          style={{
                            color: isOn
                              ? "#fff"
                              : !avail
                                ? "#b898a8"
                                : "#1a1a1a",
                          }}
                        >
                          {rt.key}
                        </span>
                        <span
                          className="hp-tsub"
                          style={{
                            color: isOn
                              ? "rgba(255,255,255,0.85)"
                              : !avail
                                ? "#c0a8b4"
                                : "#999",
                          }}
                        >
                          {!avail ? "Coming soon" : rt.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic earning rate banner */}
                {earnRate != null && AVAILABLE[privacy]?.[roomType] && (
                  <div className="hp-earn-banner">
                    <span className="hp-earn-icon">💸</span>
                    <div className="hp-earn-text">
                      You earn <span className="hp-earn-rate">₹{earnRate}</span>{" "}
                      per minute for this room
                    </div>
                  </div>
                )}
              </div>

              {/* Earning Rates Notes */}
              <div className="hp-card">
                <div className="hp-notes">
                  <div className="hp-notes-title">
                    📋 Earning Rates (per min)
                  </div>
                  <ul className="hp-notes-list">
                    <li>Public Single — ₹20 / min</li>
                    <li>
                      Public Double — ₹30 / min{" "}
                      <span className="hp-note-soon">🔜 Coming soon</span>
                    </li>
                    <li>
                      Public Multiple — ₹40 / min{" "}
                      <span className="hp-note-soon">🔜 Coming soon</span>
                    </li>
                    <li>Private Single — ₹90 / min</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="hp-right">
              {/* Privacy */}
              <div className="hp-card">
                <div className="hp-ctitle">Room Privacy</div>
                <p
                  style={{
                    fontSize: 13,
                    color: "#999",
                    marginBottom: 14,
                    marginTop: -8,
                  }}
                >
                  {privacy === "Private"
                    ? "Private: only Single type is available (1-on-1 session)"
                    : "Choose who can join your room"}
                </p>
                <div className="hp-privacy">
                  {privacyTypes.map((pt) => (
                    <button
                      key={pt.key}
                      className={`hp-pbtn${privacy === pt.key ? " on" : ""}`}
                      onClick={() => handlePrivacyChange(pt.key)}
                    >
                      <span className="hp-pemoji">{pt.emoji}</span>
                      <span
                        className="hp-pname"
                        style={{
                          color: privacy === pt.key ? "#fff" : "#1a1a1a",
                        }}
                      >
                        {pt.key}
                      </span>
                      <span
                        className="hp-psub"
                        style={{
                          color:
                            privacy === pt.key
                              ? "rgba(255,255,255,0.85)"
                              : "#999",
                        }}
                      >
                        {pt.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic + Go Live */}
              <div className="hp-card">
                <div className="hp-ctitle">Your Topic</div>
                {topic.trim() && <div className="hp-saved">✓ Saved</div>}
                <div className="hp-tawrap">
                  <textarea
                    className="hp-ta"
                    placeholder="What will you talk about?"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    rows={4}
                  />
                  {topic && (
                    <button
                      className="hp-taxclear"
                      onClick={() => setTopic("")}
                      title="Clear"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  className="hp-golive"
                  onClick={handleGoLive}
                  disabled={goLiveLoading}
                >
                  {goLiveLoading ? (
                    <span style={{ fontSize: 16 }}>Starting…</span>
                  ) : (
                    <>
                      <span className="hp-dot" /> Go Live
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <p className="hp-footer">
            © 2025 Biswa Bangla Social Networking Club. All rights reserved.
          </p>
        </div>

        {/* ── MOBILE BOTTOM NAV ── */}
        <div className="hp-bnav">
          <button className="hp-nbtn on">
            <span className="hp-nicon">🏠</span>
            <span className="hp-nlabel">Home</span>
          </button>
          <button className="hp-nbtn" onClick={() => navigate("/host/account")}>
            <span className="hp-nicon">👤</span>
            <span className="hp-nlabel">Account</span>
          </button>
        </div>
      </div>
    </>
  );
}
