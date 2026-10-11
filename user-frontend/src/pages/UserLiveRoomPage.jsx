// //============for number and not allowed msg system
// // user-frontend/src/pages/UserLiveRoomPage.jsx
// import { useEffect, useRef, useState, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import { io } from "socket.io-client";

// const SOCKET_URL = import.meta.env.VITE_API_URL || "";

// // ── Billing rates (must match server.js BILLING_RATES) ───────────────────────
// // Keyed by `${privacy}_${roomType}`
// const BILLING_RATES = {
//   public_single: { user: 48, host: 20, label: "Public Single" },
//   public_double: { user: 100, host: 30, label: "Public Double" },
//   public_multiple: { user: 234, host: 40, label: "Public Multiple" },
//   private_single: { user: 170, host: 90, label: "Private Single" },
//   private_double: { user: 170, host: 90, label: "Private Double" },
//   private_multiple: { user: 170, host: 90, label: "Private Multiple" },
// };

// export default function UserLiveRoomPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useAuth();

//   const room = location.state?.room;
//   const userName = user
//     ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User"
//     : "Guest";
//   const userId = user?._id || user?.id || `guest_${Date.now()}`;

//   // ── State ─────────────────────────────────────────────────────────────────
//   const [phase, setPhase] = useState("connecting"); // connecting|live|ended|error|kicked|insufficient
//   const [errorMsg, setErrorMsg] = useState("");
//   const [viewerCount, setViewerCount] = useState(room?.viewerCount || 0);
//   const [elapsed, setElapsed] = useState(0);
//   const [chat, setChat] = useState([]);
//   const [msgInput, setMsgInput] = useState("");
//   const [joinNotif, setJoinNotif] = useState("");
//   const [chatError, setChatError] = useState("");

//   // ── Billing state ─────────────────────────────────────────────────────────
//   const [talktimeBalance, setTalktimeBalance] = useState(
//     user?.talktimeBalance ?? null,
//   );
//   const [billingStarting, setBillingStarting] = useState(false);
//   const [billingActive, setBillingActive] = useState(false);
//   const [billingCountdown, setBillingCountdown] = useState(10);
//   const [kickedInfo, setKickedInfo] = useState(null);
//   const [summaryInfo, setSummaryInfo] = useState(null);

//   // ── Refs ──────────────────────────────────────────────────────────────────
//   const clientRef = useRef(null);
//   const socketRef = useRef(null);
//   const timerRef = useRef(null);
//   const countdownRef = useRef(null);
//   const chatEndRef = useRef(null);
//   const hostDivRef = useRef(null);
//   const partnerDivRef = useRef(null);
//   const hostOnlineRef = useRef(false);
//   const partnerOnlineRef = useRef(false);
//   const [hostOnline, setHostOnline] = useState(false);
//   const [partnerOnline, setPartnerOnline] = useState(false);

//   const channelName = room?.channelName;
//   // FIX: Room model stores field as "roomType", not "type"
//   const roomType = room?.roomType || room?.type || "single";
//   // FIX: prefer room.hostId (set by Room model) over room.id (which is the room's own _id)
//   const hostId = room?.hostId;
//   const privacy = (room?.visibility || room?.privacy || "public").toLowerCase();
//   const hostInitial = (room?.name || "H").charAt(0).toUpperCase();
//   const hostColor = room?.color || "#f47eb0";
//   const hostAvatar = room?.avatar || null;

//   // ── Privacy-aware rate lookup ─────────────────────────────────────────────
//   const rateKey = `${privacy}_${roomType}`;
//   const rate = BILLING_RATES[rateKey] || BILLING_RATES["public_single"];

//   // Redirect if no room
//   useEffect(() => {
//     if (!room) navigate("/home", { replace: true });
//   }, [room, navigate]);

//   // ── Fetch fresh talktime balance from API ────────────────────────────────
//   const fetchBalance = async () => {
//     try {
//       const res = await fetch("/api/payment/balance", {
//         credentials: "include",
//       });
//       if (!res.ok) return null;
//       const data = await res.json();
//       if (data.success) return data.talktimeBalance;
//       return null;
//     } catch {
//       return null;
//     }
//   };

//   // ── Fetch Agora viewer token from user-backend ────────────────────────────
//   const fetchToken = async () => {
//     try {
//       const res = await fetch(
//         `/api/rooms/token/${channelName}?uid=${encodeURIComponent(userId)}`,
//       );
//       const data = await res.json();
//       if (!data.success) {
//         setErrorMsg(data.message || "Room is not available.");
//         setPhase("error");
//         return null;
//       }
//       return data; // { appId, token, uid, room }
//     } catch {
//       setErrorMsg("Network error. Could not join room.");
//       setPhase("error");
//       return null;
//     }
//   };

//   // ── Agora setup ───────────────────────────────────────────────────────────
//   const startAgora = async (appId, token, uid) => {
//     const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
//     clientRef.current = client;
//     await client.setClientRole("audience");

//     client.on("user-published", async (remoteUser, mediaType) => {
//       await client.subscribe(remoteUser, mediaType);
//       if (mediaType === "video") {
//         if (!hostOnlineRef.current && hostDivRef.current) {
//           remoteUser.videoTrack?.play(hostDivRef.current);
//           hostOnlineRef.current = true;
//           setHostOnline(true);
//           setPhase("live");
//         } else if (
//           roomType === "double" &&
//           !partnerOnlineRef.current &&
//           partnerDivRef.current
//         ) {
//           remoteUser.videoTrack?.play(partnerDivRef.current);
//           partnerOnlineRef.current = true;
//           setPartnerOnline(true);
//         }
//       }
//       if (mediaType === "audio") {
//         remoteUser.audioTrack?.play();
//       }
//     });

//     client.on("user-unpublished", (remoteUser, mediaType) => {
//       if (mediaType === "video" && hostOnlineRef.current) {
//         hostOnlineRef.current = false;
//         setHostOnline(false);
//       }
//     });

//     client.on("user-left", () => {});
//     client.on("connection-state-change", (cur, prev) => {
//       console.log(`Agora connection: ${prev} → ${cur}`);
//     });

//     try {
//       await client.join(appId, channelName, token, uid || null);
//       console.log("Agora joined channel:", channelName);
//       timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
//     } catch (err) {
//       console.error("Agora join error:", err);
//       setErrorMsg("Could not connect to the live room. Please try again.");
//       setPhase("error");
//     }
//   };

//   // ── Socket.IO with billing listeners ─────────────────────────────────────
//   // resolvedHostId / resolvedRoomType / resolvedPrivacy come from tokenData.room
//   // (direct DB values) — always correct even if navigate-state dropped them.
//   const initSocket = (resolvedHostId, resolvedRoomType, resolvedPrivacy) => {
//     const socket = io(SOCKET_URL, {
//       transports: ["websocket"],
//       withCredentials: true,
//     });
//     socketRef.current = socket;

//     // ── FIXED: send privacy so server applies the correct billing rate ──────
//     socket.emit("join-room", {
//       channelName,
//       userId,
//       userName,
//       hostId: resolvedHostId,
//       roomType: resolvedRoomType,
//       privacy: resolvedPrivacy, // ← KEY FIX: private rooms now bill at ₹170/min
//     });

//     socket.on("viewer-count", (count) => setViewerCount(count));

//     socket.on("user-joined", ({ userName: name }) => {
//       if (name !== userName) {
//         setJoinNotif(`${name} joined`);
//         setTimeout(() => setJoinNotif(""), 3000);
//       }
//     });

//     socket.on("chat-message", (msg) => {
//       setChat((prev) => [...prev.slice(-99), msg]);
//     });

//     socket.on("room-ended", () => {
//       setPhase("ended");
//       cleanup();
//     });

//     // ── Room full (private single already has 1 user) ───────────────────
//     socket.on("room-full", ({ message }) => {
//       setErrorMsg(
//         message ||
//           "This private room is occupied. Please wait for the user to leave.",
//       );
//       setPhase("full");
//       cleanup(false);
//     });

//     // ── Billing events ──────────────────────────────────────────────────

//     socket.on("billing-starting", ({ delaySeconds, ratePerMin }) => {
//       setBillingStarting(true);
//       setBillingCountdown(delaySeconds);
//       let c = delaySeconds;
//       countdownRef.current = setInterval(() => {
//         c -= 1;
//         setBillingCountdown(c);
//         if (c <= 0) {
//           clearInterval(countdownRef.current);
//           setBillingStarting(false);
//           setBillingActive(true);
//         }
//       }, 1000);
//     });

//     socket.on("balance-updated", ({ newBalance, minuteNumber, debitedNow }) => {
//       setTalktimeBalance(newBalance);
//       setBillingActive(true);
//     });

//     socket.on("billing-kicked", ({ reason, totalMinutes, totalDebit }) => {
//       clearInterval(countdownRef.current);
//       setKickedInfo({ reason, totalMinutes, totalDebit });
//       setPhase("kicked");
//       cleanup(false);
//     });

//     socket.on("insufficient-balance", ({ required, current, message }) => {
//       setErrorMsg(
//         message || `Need ₹${required} to join. You have ₹${current}.`,
//       );
//       setPhase("insufficient");
//       cleanup(false);
//     });

//     socket.on("billing-summary", ({ totalMinutes, totalDebit }) => {
//       setSummaryInfo({ totalMinutes, totalDebit });
//     });
//   };

//   // ── On mount: balance check → token → Agora → Socket ─────────────────────
//   useEffect(() => {
//     if (!channelName) return;

//     (async () => {
//       // 1. Get fresh balance from API
//       const balance = await fetchBalance();
//       setTalktimeBalance(balance);

//       // 2. Client-side minimum balance guard (uses privacy-aware rate)
//       if (
//         balance !== null &&
//         typeof balance === "number" &&
//         balance < rate.user
//       ) {
//         setErrorMsg(
//           `You need at least ₹${rate.user} to join this ${rate.label} room. Your balance: ₹${balance}. Please recharge.`,
//         );
//         setPhase("insufficient");
//         return;
//       }

//       // 3. Get Agora token
//       const tokenData = await fetchToken();
//       if (!tokenData) return;

//       // 4. Resolve hostId, roomType, privacy from the token API response.
//       //    tokenData.room comes straight from the DB and always has correct values.
//       const resolvedHostId = tokenData.room?.hostId || room?.hostId || room?.id;
//       const resolvedRoomType =
//         tokenData.room?.roomType || room?.roomType || room?.type || "single";
//       const resolvedPrivacy = (
//         tokenData.room?.privacy ||
//         room?.privacy ||
//         room?.visibility ||
//         "public"
//       ).toLowerCase();

//       // 5. Start Agora
//       await startAgora(tokenData.appId, tokenData.token, tokenData.uid);

//       // 6. Start socket + billing — pass all resolved values
//       initSocket(resolvedHostId, resolvedRoomType, resolvedPrivacy);
//     })();

//     return () => cleanup(false);
//   }, []); // eslint-disable-line

//   // ── Chat auto-scroll ──────────────────────────────────────────────────────
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat]);

//   // ── Cleanup ───────────────────────────────────────────────────────────────
//   const cleanup = useCallback(
//     (shouldNavigate = false) => {
//       clearInterval(timerRef.current);
//       clearInterval(countdownRef.current);
//       clientRef.current?.leave().catch(() => {});

//       if (socketRef.current) {
//         socketRef.current.emit("leave-room", { channelName });
//         socketRef.current.disconnect();
//       }

//       if (shouldNavigate) navigate("/home", { replace: true });
//     },
//     [navigate, channelName],
//   );

//   const handleLeave = () => {
//     cleanup(true);
//   };

//   const NUMBER_WORDS =
//     /\b(zero|one|two|three|four|five|six|seven|eight|nine)\b/i;
//   const HAS_DIGITS = /[0-9]/;

//   const sendChat = () => {
//     const msg = msgInput.trim();
//     if (!msg || !socketRef.current) return;
//     if (HAS_DIGITS.test(msg) || NUMBER_WORDS.test(msg)) {
//       setChatError("Numbers are not allowed in chat messages.");
//       return;
//     }
//     setChatError("");
//     socketRef.current.emit("chat-message", {
//       channelName,
//       userId,
//       userName,
//       message: msg,
//     });
//     setMsgInput("");
//   };

//   const fmtTime = (s) => {
//     const m = String(Math.floor(s / 60)).padStart(2, "0");
//     const sec = String(s % 60).padStart(2, "0");
//     return `${m}:${sec}`;
//   };

//   const fmtBalance = (v) => (v === null ? "…" : `₹${v}`);

//   // ── Screens ───────────────────────────────────────────────────────────────

//   if (phase === "full") {
//     return (
//       <FullPageScreen>
//         <div style={{ fontSize: 52 }}>🚫</div>
//         <p
//           style={{
//             color: "#fff",
//             fontWeight: 800,
//             fontSize: 20,
//             textAlign: "center",
//           }}
//         >
//           Room is Full
//         </p>
//         <p
//           style={{
//             color: "#aaa",
//             fontSize: 14,
//             textAlign: "center",
//             maxWidth: 300,
//             lineHeight: 1.6,
//           }}
//         >
//           {errorMsg}
//         </p>
//         <GhostButton onClick={() => navigate("/home", { replace: true })}>
//           Back to Home
//         </GhostButton>
//       </FullPageScreen>
//     );
//   }

//   if (phase === "insufficient") {
//     return (
//       <FullPageScreen>
//         <div style={{ fontSize: 52 }}>💳</div>
//         <p
//           style={{
//             color: "#fff",
//             fontWeight: 800,
//             fontSize: 18,
//             textAlign: "center",
//           }}
//         >
//           Insufficient Balance
//         </p>
//         <p
//           style={{
//             color: "#888",
//             fontSize: 14,
//             textAlign: "center",
//             maxWidth: 300,
//             lineHeight: 1.6,
//           }}
//         >
//           {errorMsg}
//         </p>
//         <PinkButton onClick={() => navigate("/recharge", { replace: true })}>
//           Recharge Now
//         </PinkButton>
//         <GhostButton onClick={() => navigate("/home", { replace: true })}>
//           Back to Home
//         </GhostButton>
//       </FullPageScreen>
//     );
//   }

//   if (phase === "error") {
//     return (
//       <FullPageScreen>
//         <div style={{ fontSize: 48 }}>❌</div>
//         <p
//           style={{
//             color: "#fff",
//             fontWeight: 800,
//             fontSize: 18,
//             textAlign: "center",
//           }}
//         >
//           Could not join room
//         </p>
//         <p
//           style={{
//             color: "#888",
//             fontSize: 14,
//             textAlign: "center",
//             maxWidth: 300,
//           }}
//         >
//           {errorMsg}
//         </p>
//         <PinkButton onClick={() => navigate("/home", { replace: true })}>
//           Back to Home
//         </PinkButton>
//       </FullPageScreen>
//     );
//   }

//   if (phase === "kicked") {
//     return (
//       <FullPageScreen>
//         <div style={{ fontSize: 52 }}>⚠️</div>
//         <p
//           style={{
//             color: "#fff",
//             fontWeight: 800,
//             fontSize: 18,
//             textAlign: "center",
//           }}
//         >
//           Balance Exhausted
//         </p>
//         <p
//           style={{
//             color: "#aaa",
//             fontSize: 14,
//             textAlign: "center",
//             maxWidth: 300,
//             lineHeight: 1.6,
//           }}
//         >
//           {kickedInfo?.reason || "Your talktime balance ran out."}
//         </p>
//         {kickedInfo && (
//           <div
//             style={{
//               background: "#1a1a1a",
//               borderRadius: 12,
//               padding: "14px 24px",
//               textAlign: "center",
//               marginTop: 8,
//             }}
//           >
//             <p style={{ color: "#f47eb0", fontWeight: 800, fontSize: 15 }}>
//               Session Summary
//             </p>
//             <p style={{ color: "#ccc", fontSize: 13, marginTop: 6 }}>
//               Duration: {kickedInfo.totalMinutes} min
//             </p>
//             <p style={{ color: "#ccc", fontSize: 13 }}>
//               Total spent: ₹{kickedInfo.totalDebit}
//             </p>
//           </div>
//         )}
//         <PinkButton onClick={() => navigate("/recharge", { replace: true })}>
//           Recharge Now
//         </PinkButton>
//         <GhostButton onClick={() => navigate("/home", { replace: true })}>
//           Back to Home
//         </GhostButton>
//       </FullPageScreen>
//     );
//   }

//   if (phase === "ended") {
//     return (
//       <FullPageScreen>
//         <div style={{ fontSize: 48 }}>🔴</div>
//         <p style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>
//           Host ended the room
//         </p>
//         {summaryInfo && (
//           <div
//             style={{
//               background: "#1a1a1a",
//               borderRadius: 12,
//               padding: "14px 24px",
//               textAlign: "center",
//               marginTop: 8,
//             }}
//           >
//             <p style={{ color: "#f47eb0", fontWeight: 800, fontSize: 15 }}>
//               Session Summary
//             </p>
//             <p style={{ color: "#ccc", fontSize: 13, marginTop: 6 }}>
//               Duration: {summaryInfo.totalMinutes} min
//             </p>
//             <p style={{ color: "#ccc", fontSize: 13 }}>
//               Total spent: ₹{summaryInfo.totalDebit}
//             </p>
//           </div>
//         )}
//         <PinkButton onClick={() => navigate("/home", { replace: true })}>
//           Back to Home
//         </PinkButton>
//       </FullPageScreen>
//     );
//   }

//   // ── Main live room view ───────────────────────────────────────────────────
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap');
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         .ulr-page { display:flex; flex-direction:column; height:100dvh; background:#0d0d0d;
//           font-family:'Nunito',sans-serif; color:#fff; overflow:hidden; }

//         .ulr-video-area { flex:1; position:relative; overflow:hidden; background:#000; min-height:0; }
//         .ulr-host-full  { width:100%; height:100%; position:relative; background:#000; }
//         .ulr-double-wrap { width:100%; height:100%; display:flex; flex-direction:column; }
//         .ulr-double-top  { flex:1; position:relative; border-bottom:2px solid #0d0d0d; background:#000; }
//         .ulr-double-bottom { flex:1; position:relative; background:#111; }

//         .ulr-video-div {
//           position:absolute; inset:0; width:100%; height:100%; background:#000;
//         }
//         .ulr-video-div video { width:100% !important; height:100% !important; object-fit:cover !important; }

//         .ulr-overlay {
//           position:absolute; inset:0; display:flex; flex-direction:column;
//           align-items:center; justify-content:center; gap:12px;
//           background:#111; z-index:2; transition:opacity 0.4s;
//         }
//         .ulr-overlay.hidden { opacity:0; pointer-events:none; }
//         .ulr-spinner { width:40px; height:40px; border-radius:50%;
//           border:3px solid #333; border-top-color:#f47eb0;
//           animation:ulr-spin .8s linear infinite; }
//         @keyframes ulr-spin { to { transform:rotate(360deg); } }
//         .ulr-avatar-circle { width:80px; height:80px; border-radius:50%;
//           overflow:hidden; display:flex; align-items:center; justify-content:center;
//           border:3px solid rgba(255,255,255,0.2); }
//         .ulr-avatar-circle img { width:100%; height:100%; object-fit:cover; }
//         .ulr-avatar-init { color:#fff; font-weight:900; font-size:32px; }

//         .ulr-name-strip { position:absolute; bottom:0; left:0; right:0; padding:8px 12px;
//           background:linear-gradient(0deg,rgba(0,0,0,0.8),transparent);
//           display:flex; align-items:center; gap:8px; z-index:3; }
//         .ulr-name-txt  { font-size:14px; font-weight:800; }
//         .ulr-host-badge   { background:#f47eb0; color:#fff; font-size:10px; font-weight:800;
//           padding:2px 8px; border-radius:10px; }
//         .ulr-viewer-badge { color:#aaa; font-size:11px; font-weight:700; }

//         .ulr-topbar { position:absolute; top:0; left:0; right:0; padding:10px 14px;
//           display:flex; align-items:center; gap:8px; z-index:10;
//           background:linear-gradient(180deg,rgba(0,0,0,0.7),transparent); flex-wrap:wrap; }
//         .ulr-live-pill { display:flex; align-items:center; gap:5px;
//           background:rgba(0,0,0,0.6); border-radius:20px; padding:4px 10px; }
//         .ulr-live-dot  { width:8px; height:8px; border-radius:50%; background:#f47eb0;
//           animation:ulr-pulse 1.2s infinite; }
//         @keyframes ulr-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
//         .ulr-live-txt  { color:#fff; font-size:11px; font-weight:900; letter-spacing:1px; }
//         .ulr-view-pill { display:flex; align-items:center; gap:4px;
//           background:rgba(0,0,0,0.5); border-radius:20px; padding:4px 10px;
//           color:#fff; font-size:12px; font-weight:700; }
//         .ulr-timer     { color:#fff; font-size:13px; font-weight:800;
//           background:rgba(0,0,0,0.4); border-radius:20px; padding:4px 10px; }
//         .ulr-balance-pill { display:flex; align-items:center; gap:4px;
//           background:rgba(244,126,176,0.25); border:1px solid rgba(244,126,176,0.5);
//           border-radius:20px; padding:4px 10px; color:#f47eb0; font-size:12px; font-weight:800;
//           margin-left:auto; }
//         .ulr-leave-btn { background:rgba(255,60,60,0.85); color:#fff; border:none;
//           border-radius:20px; padding:5px 14px; font-weight:800; font-size:12px; cursor:pointer; }

//         .ulr-infobar { position:absolute; top:48px; left:0; right:0; padding:6px 14px;
//           display:flex; align-items:center; gap:8px; z-index:10; flex-wrap:wrap; }
//         .ulr-room-badge { display:flex; align-items:center; gap:6px;
//           background:rgba(0,0,0,0.6); border-radius:20px; padding:4px 12px;
//           font-size:11px; font-weight:700; color:#ddd; }
//         .ulr-join-notif { background:rgba(244,126,176,0.85); color:#fff;
//           border-radius:20px; padding:3px 10px; font-size:11px; font-weight:700; }
//         .ulr-private-badge { background:rgba(0,0,0,0.7); color:#f9ca24;
//           border-radius:20px; padding:3px 10px; font-size:11px; font-weight:700; }

//         /* billing toast */
//         .ulr-billing-toast {
//           position:absolute; bottom:8px; left:50%; transform:translateX(-50%);
//           background:rgba(244,126,176,0.92); color:#fff; border-radius:20px;
//           padding:6px 18px; font-size:12px; font-weight:800; z-index:20;
//           white-space:nowrap; animation:ulr-fade-in 0.3s;
//         }
//         @keyframes ulr-fade-in { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

//         .ulr-bottom { background:#0d0d0d; display:flex; flex-direction:column; max-height:42vh; flex-shrink:0; }
//         .ulr-viewers-row { padding:10px 14px 0; display:flex; align-items:center; gap:8px;
//           overflow-x:auto; scrollbar-width:none; flex-shrink:0; }
//         .ulr-viewers-row::-webkit-scrollbar { display:none; }
//         .ulr-viewers-label { font-size:11px; font-weight:800; color:#aaa;
//           display:flex; align-items:center; gap:4px; white-space:nowrap; }
//         .ulr-viewers-label span { width:7px; height:7px; border-radius:50%;
//           background:#f47eb0; display:inline-block; }
//         .ulr-viewing-count { font-size:11px; font-weight:700; color:#aaa; margin-left:auto; white-space:nowrap; }
//         .ulr-chat { flex:1; overflow-y:auto; padding:8px 14px; scrollbar-width:none; min-height:60px; }
//         .ulr-chat::-webkit-scrollbar { display:none; }
//         .ulr-chat-msg  { margin-bottom:6px; font-size:13px; line-height:1.4; }
//         .ulr-chat-name { font-weight:800; color:#f47eb0; margin-right:4px; }
//         .ulr-chat-text { color:#ddd; }
//         .ulr-input-row { display:flex; align-items:center; gap:8px; padding:8px 14px; }
//         .ulr-msg-input { flex:1; background:#1a1a1a; border:1px solid #333; border-radius:22px;
//           padding:9px 16px; color:#fff; font-size:13px; font-family:'Nunito',sans-serif; outline:none; }
//         .ulr-msg-input::placeholder { color:#555; }
//         .ulr-send-btn  { width:38px; height:38px; border-radius:50%;
//           background:linear-gradient(135deg,#f47eb0,#ee5fa0); border:none; cursor:pointer;
//           display:flex; align-items:center; justify-content:center; flex-shrink:0; }
//         .ulr-desc { font-size:12px; color:#888; padding:4px 14px 0; font-style:italic; flex-shrink:0; }
//       `}</style>

//       <div className="ulr-page">
//         {/* ── VIDEO AREA ──────────────────────────────────────────────────── */}
//         <div className="ulr-video-area">
//           {roomType === "double" ? (
//             <div className="ulr-double-wrap">
//               <div className="ulr-double-top">
//                 <div ref={hostDivRef} className="ulr-video-div" />
//                 <div className={`ulr-overlay ${hostOnline ? "hidden" : ""}`}>
//                   {phase === "connecting" ? (
//                     <>
//                       <div className="ulr-spinner" />
//                       <span style={{ color: "#aaa", fontSize: 13 }}>
//                         Connecting…
//                       </span>
//                     </>
//                   ) : (
//                     <>
//                       <AvatarCircle
//                         color={hostColor}
//                         avatar={hostAvatar}
//                         initial={hostInitial}
//                       />
//                       <span style={{ color: "#888", fontSize: 13 }}>
//                         Waiting for host…
//                       </span>
//                     </>
//                   )}
//                 </div>
//                 <div className="ulr-name-strip">
//                   <span className="ulr-name-txt">
//                     🎙️ {room?.name || "Host"}
//                   </span>
//                   <span className="ulr-host-badge">HOST</span>
//                 </div>
//               </div>
//               <div className="ulr-double-bottom">
//                 <div ref={partnerDivRef} className="ulr-video-div" />
//                 <div
//                   className={`ulr-overlay ${partnerOnline ? "hidden" : ""}`}
//                   style={{ background: "transparent" }}
//                 >
//                   <div style={{ fontSize: 40 }}>👤</div>
//                   <span style={{ color: "#444", fontSize: 12 }}>
//                     Waiting for partner…
//                   </span>
//                 </div>
//                 {partnerOnline && (
//                   <div className="ulr-name-strip">
//                     <span className="ulr-name-txt">🎙️ Viewer</span>
//                     <span className="ulr-viewer-badge">VIEWER</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="ulr-host-full">
//               <div ref={hostDivRef} className="ulr-video-div" />
//               <div className={`ulr-overlay ${hostOnline ? "hidden" : ""}`}>
//                 {phase === "connecting" ? (
//                   <>
//                     <div className="ulr-spinner" />
//                     <span style={{ color: "#aaa", fontSize: 13 }}>
//                       Joining room…
//                     </span>
//                   </>
//                 ) : (
//                   <>
//                     <AvatarCircle
//                       color={hostColor}
//                       avatar={hostAvatar}
//                       initial={hostInitial}
//                     />
//                     <span style={{ color: "#888", fontSize: 13, marginTop: 8 }}>
//                       Waiting for host…
//                     </span>
//                   </>
//                 )}
//               </div>
//               <div className="ulr-name-strip">
//                 <span className="ulr-name-txt">🎙️ {room?.name || "Host"}</span>
//                 <span className="ulr-host-badge">HOST</span>
//               </div>
//             </div>
//           )}

//           {/* TOP BAR */}
//           <div className="ulr-topbar">
//             <div className="ulr-live-pill">
//               <span className="ulr-live-dot" />
//               <span className="ulr-live-txt">LIVE</span>
//             </div>
//             <div className="ulr-view-pill">
//               <span>👁</span>
//               <span>{viewerCount}</span>
//             </div>
//             <span className="ulr-timer">{fmtTime(elapsed)}</span>
//             <div className="ulr-balance-pill">
//               💰 {fmtBalance(talktimeBalance)}
//             </div>
//             <button className="ulr-leave-btn" onClick={handleLeave}>
//               Leave
//             </button>
//           </div>

//           {/* INFO BAR */}
//           <div className="ulr-infobar">
//             <div className="ulr-room-badge">
//               <span>{room?.roomName || room?.name}</span>
//               <span style={{ color: "#aaa" }}>|</span>
//               <span style={{ textTransform: "capitalize" }}>
//                 {rate.label} · ₹{rate.user}/min
//               </span>
//             </div>
//             {joinNotif && <div className="ulr-join-notif">👋 {joinNotif}</div>}
//             {privacy === "private" && (
//               <div className="ulr-private-badge">🔒 Private</div>
//             )}
//           </div>

//           {/* BILLING COUNTDOWN TOAST */}
//           {billingStarting && (
//             <div className="ulr-billing-toast">
//               ⏱ Billing starts in {billingCountdown}s · ₹{rate.user}/min
//             </div>
//           )}

//           {/* BILLING ACTIVE TOAST */}
//           {billingActive && !billingStarting && (
//             <div
//               className="ulr-billing-toast"
//               style={{ background: "rgba(30,180,100,0.85)" }}
//             >
//               🔴 Billing active · ₹{rate.user}/min
//             </div>
//           )}
//         </div>

//         {/* ── BOTTOM PANEL ────────────────────────────────────────────────── */}
//         <div className="ulr-bottom">
//           {room?.description && (
//             <p className="ulr-desc">"{room.description}"</p>
//           )}
//           <div className="ulr-viewers-row">
//             <span className="ulr-viewers-label">
//               <span />
//               Live Viewers
//             </span>
//             <span className="ulr-viewing-count">{viewerCount} watching</span>
//           </div>
//           <div className="ulr-chat">
//             {chat.length === 0 && (
//               <p
//                 style={{
//                   color: "#444",
//                   fontSize: 12,
//                   textAlign: "center",
//                   marginTop: 8,
//                 }}
//               >
//                 Say hello! 👋
//               </p>
//             )}
//             {chat.map((m, i) => (
//               <div key={i} className="ulr-chat-msg">
//                 <span className="ulr-chat-name">{m.userName}:</span>
//                 <span className="ulr-chat-text">{m.message}</span>
//               </div>
//             ))}
//             <div ref={chatEndRef} />
//           </div>
//           <div className="ulr-input-row">
//             <input
//               className="ulr-msg-input"
//               placeholder="Say something…"
//               value={msgInput}
//               onChange={(e) => {
//                 setMsgInput(e.target.value);
//                 if (chatError) setChatError("");
//               }}
//               onKeyDown={(e) => e.key === "Enter" && sendChat()}
//             />
//             <button className="ulr-send-btn" onClick={sendChat}>
//               <svg
//                 style={{ width: 16, height: 16, fill: "#fff" }}
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
//               </svg>
//             </button>
//           </div>
//           {chatError && (
//             <div
//               style={{
//                 color: "#ff4d4d",
//                 fontSize: 12,
//                 padding: "4px 8px 0",
//                 fontWeight: 700,
//               }}
//             >
//               {chatError}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// // ── Small helper components ───────────────────────────────────────────────────

// function AvatarCircle({ color, avatar, initial }) {
//   return (
//     <div className="ulr-avatar-circle" style={{ background: color }}>
//       {avatar ? (
//         <img
//           src={avatar}
//           alt="host"
//           onError={(e) => (e.target.style.display = "none")}
//         />
//       ) : (
//         <span className="ulr-avatar-init">{initial}</span>
//       )}
//     </div>
//   );
// }

// function FullPageScreen({ children }) {
//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#111",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 16,
//         padding: 32,
//         fontFamily: "Nunito,sans-serif",
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// function PinkButton({ onClick, children }) {
//   return (
//     <button
//       onClick={onClick}
//       style={{
//         background: "#f47eb0",
//         color: "#fff",
//         border: "none",
//         borderRadius: 50,
//         padding: "12px 32px",
//         fontWeight: 900,
//         fontSize: 15,
//         cursor: "pointer",
//         marginTop: 8,
//       }}
//     >
//       {children}
//     </button>
//   );
// }

// function GhostButton({ onClick, children }) {
//   return (
//     <button
//       onClick={onClick}
//       style={{
//         background: "transparent",
//         color: "#888",
//         border: "1px solid #333",
//         borderRadius: 50,
//         padding: "10px 28px",
//         fontWeight: 700,
//         fontSize: 14,
//         cursor: "pointer",
//       }}
//     >
//       {children}
//     </button>
//   );
// }

//for the record stop
// user-frontend/src/pages/UserLiveRoomPage.jsx
// MAX anti-screenshot / anti-screen-recording protection
// NEW: animated moving watermark (bounces like DVD screensaver — harder to edit out)
import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AgoraRTC from "agora-rtc-sdk-ng";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "";

const BILLING_RATES = {
  public_single: { user: 48, host: 20, label: "Public Single" },
  public_double: { user: 100, host: 30, label: "Public Double" },
  public_multiple: { user: 234, host: 40, label: "Public Multiple" },
  private_single: { user: 170, host: 90, label: "Private Single" },
  private_double: { user: 170, host: 90, label: "Private Double" },
  private_multiple: { user: 170, host: 90, label: "Private Multiple" },
};

// ── Animated Watermark: moves around like a DVD screensaver ──────────────────
function AnimatedWatermark({ text }) {
  const [pos, setPos] = useState({ x: 10, y: 20 });
  const rafRef = useRef(null);

  useEffect(() => {
    let x = Math.random() * 60 + 5;
    let y = Math.random() * 60 + 5;
    let dx = (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.3);
    let dy = (Math.random() > 0.5 ? 1 : -1) * (0.2 + Math.random() * 0.2);
    let last = performance.now();

    function step(now) {
      const dt = Math.min(now - last, 50);
      last = now;
      x += dx * dt * 0.04;
      y += dy * dt * 0.04;
      if (x <= 2 || x >= 75) {
        dx = -dx;
        x = Math.max(2, Math.min(75, x));
      }
      if (y <= 2 || y >= 85) {
        dy = -dy;
        y = Math.max(2, Math.min(85, y));
      }
      setPos({ x, y });
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 25,
        overflow: "hidden",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* Moving label */}
      <div
        style={{
          position: "absolute",
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          color: "rgba(255,255,255,0.18)",
          fontSize: "13px",
          fontWeight: "900",
          fontFamily: "Nunito, sans-serif",
          letterSpacing: "3px",
          whiteSpace: "nowrap",
          textShadow: "0 0 8px rgba(0,0,0,0.6)",
          transform: "rotate(-20deg)",
          pointerEvents: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {text}
      </div>
      {/* Faint diagonal grid */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${i * 17}%`,
            left: "-40%",
            width: "180%",
            whiteSpace: "nowrap",
            transform: "rotate(-20deg)",
            color: "rgba(255,255,255,0.04)",
            fontSize: "11px",
            fontWeight: "800",
            fontFamily: "Nunito, sans-serif",
            letterSpacing: "8px",
            lineHeight: "1",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {Array(15)
            .fill(text + "   ")
            .join("")}
        </div>
      ))}
    </div>
  );
}

export default function UserLiveRoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  const room = location.state?.room;
  const userName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User"
    : "Guest";
  const userId = user?._id || user?.id || `guest_${Date.now()}`;

  const [phase, setPhase] = useState("connecting");
  const [errorMsg, setErrorMsg] = useState("");
  const [viewerCount, setViewerCount] = useState(room?.viewerCount || 0);
  const [elapsed, setElapsed] = useState(0);
  const [chat, setChat] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [joinNotif, setJoinNotif] = useState("");
  const [chatError, setChatError] = useState("");
  const [pageBlurred, setPageBlurred] = useState(false);
  const [talktimeBalance, setTalktimeBalance] = useState(
    user?.talktimeBalance ?? null,
  );
  const [billingStarting, setBillingStarting] = useState(false);
  const [billingActive, setBillingActive] = useState(false);
  const [billingCountdown, setBillingCountdown] = useState(10);
  const [kickedInfo, setKickedInfo] = useState(null);
  const [summaryInfo, setSummaryInfo] = useState(null);
  const [hostOnline, setHostOnline] = useState(false);
  const [partnerOnline, setPartnerOnline] = useState(false);

  const clientRef = useRef(null);
  const socketRef = useRef(null);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const chatEndRef = useRef(null);
  const hostDivRef = useRef(null);
  const partnerDivRef = useRef(null);
  const hostOnlineRef = useRef(false);
  const partnerOnlineRef = useRef(false);

  const channelName = room?.channelName;
  const roomType = room?.roomType || room?.type || "single";
  const privacy = (room?.visibility || room?.privacy || "public").toLowerCase();
  const hostInitial = (room?.name || "H").charAt(0).toUpperCase();
  const hostColor = room?.color || "#f47eb0";
  const hostAvatar = room?.avatar || null;
  const watermarkText = `${userName}${user?.phone ? " · " + user.phone : ""}`;

  const rateKey = `${privacy}_${roomType}`;
  const rate = BILLING_RATES[rateKey] || BILLING_RATES["public_single"];

  // ── Anti-screenshot protection ────────────────────────────────────────────
  useEffect(() => {
    const hide = () => setPageBlurred(true);
    const show = () => setPageBlurred(false);
    const onVis = () => {
      document.hidden ? hide() : show();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", hide);
    window.addEventListener("focus", show);
    window.addEventListener("pagehide", hide);
    window.addEventListener("pageshow", show);
    const blockTouch = (e) => {
      const tag = e.target?.tagName?.toUpperCase?.() || "";
      if (tag === "VIDEO" || tag === "CANVAS") e.preventDefault();
    };
    document.addEventListener("touchstart", blockTouch, {
      passive: false,
      capture: true,
    });
    document.addEventListener("touchend", blockTouch, {
      passive: false,
      capture: true,
    });
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", hide);
      window.removeEventListener("focus", show);
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("pageshow", show);
      document.removeEventListener("touchstart", blockTouch, { capture: true });
      document.removeEventListener("touchend", blockTouch, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (!room) navigate("/home", { replace: true });
  }, [room, navigate]);

  const fetchBalance = async () => {
    try {
      const res = await fetch("/api/payment/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return data.success ? data.talktimeBalance : null;
    } catch {
      return null;
    }
  };

  const fetchToken = async () => {
    try {
      const res = await fetch(
        `/api/rooms/token/${channelName}?uid=${encodeURIComponent(userId)}`,
      );
      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.message || "Room is not available.");
        setPhase("error");
        return null;
      }
      return data;
    } catch {
      setErrorMsg("Network error. Could not join room.");
      setPhase("error");
      return null;
    }
  };

  const startAgora = async (appId, token, uid) => {
    const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    clientRef.current = client;
    await client.setClientRole("audience");

    client.on("user-published", async (remoteUser, mediaType) => {
      await client.subscribe(remoteUser, mediaType);
      if (mediaType === "video") {
        if (!hostOnlineRef.current && hostDivRef.current) {
          remoteUser.videoTrack?.play(hostDivRef.current);
          hostOnlineRef.current = true;
          setHostOnline(true);
          setPhase("live");
        } else if (
          roomType === "double" &&
          !partnerOnlineRef.current &&
          partnerDivRef.current
        ) {
          remoteUser.videoTrack?.play(partnerDivRef.current);
          partnerOnlineRef.current = true;
          setPartnerOnline(true);
        }
      }
      if (mediaType === "audio") remoteUser.audioTrack?.play();
    });
    client.on("user-unpublished", (_, mediaType) => {
      if (mediaType === "video" && hostOnlineRef.current) {
        hostOnlineRef.current = false;
        setHostOnline(false);
      }
    });
    try {
      await client.join(appId, channelName, token, uid || null);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch (err) {
      console.error("Agora join error:", err);
      setErrorMsg("Could not connect to the live room. Please try again.");
      setPhase("error");
    }
    return client;
  };

  const initSocket = (resolvedHostId, resolvedRoomType, resolvedPrivacy) => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
      auth: { token },
    });
    socketRef.current = socket;
    socket.on("join-error", ({ message }) => {
      setErrorMsg(message || "Could not join room.");
      setPhase("error");
      cleanup(false);
    });
    socket.emit("join-room", {
      channelName,
      userId,
      userName,
      hostId: resolvedHostId,
      roomType: resolvedRoomType,
      privacy: resolvedPrivacy,
    });
    socket.on("viewer-count", (c) => setViewerCount(c));
    socket.on("user-joined", ({ userName: n }) => {
      if (n !== userName) {
        setJoinNotif(`${n} joined`);
        setTimeout(() => setJoinNotif(""), 3000);
      }
    });
    socket.on("chat-message", (msg) => setChat((p) => [...p.slice(-99), msg]));
    socket.on("room-ended", () => {
      setPhase("ended");
      cleanup();
    });
    socket.on("room-full", ({ message }) => {
      setErrorMsg(message || "This private room is occupied.");
      setPhase("full");
      cleanup(false);
    });
    socket.on("billing-starting", ({ delaySeconds }) => {
      setBillingStarting(true);
      setBillingCountdown(delaySeconds);
      let c = delaySeconds;
      countdownRef.current = setInterval(() => {
        c -= 1;
        setBillingCountdown(c);
        if (c <= 0) {
          clearInterval(countdownRef.current);
          setBillingStarting(false);
          setBillingActive(true);
        }
      }, 1000);
    });
    socket.on("balance-updated", ({ newBalance }) => {
      setTalktimeBalance(newBalance);
      setBillingActive(true);
    });
    socket.on("billing-kicked", ({ reason, totalMinutes, totalDebit }) => {
      clearInterval(countdownRef.current);
      setKickedInfo({ reason, totalMinutes, totalDebit });
      setPhase("kicked");
      cleanup(false);
    });
    socket.on("insufficient-balance", ({ required, current, message }) => {
      setErrorMsg(
        message || `Need ₹${required} to join. You have ₹${current}.`,
      );
      setPhase("insufficient");
      cleanup(false);
    });
    socket.on("billing-summary", ({ totalMinutes, totalDebit }) =>
      setSummaryInfo({ totalMinutes, totalDebit }),
    );
  };

  useEffect(() => {
    if (!channelName) return;
    // StrictMode mounts → unmounts → remounts in dev; without this flag the
    // first (stale) run would still join, opening a 2nd socket = double billing
    let cancelled = false;
    (async () => {
      const balance = await fetchBalance();
      if (cancelled) return;
      setTalktimeBalance(balance);
      if (
        balance !== null &&
        typeof balance === "number" &&
        balance < rate.user
      ) {
        setErrorMsg(
          `You need at least ₹${rate.user} to join this ${rate.label} room. Your balance: ₹${balance}. Please recharge.`,
        );
        setPhase("insufficient");
        return;
      }
      const tokenData = await fetchToken();
      if (!tokenData || cancelled) return;
      const resolvedHostId = tokenData.room?.hostId || room?.hostId || room?.id;
      const resolvedRoomType =
        tokenData.room?.roomType || room?.roomType || room?.type || "single";
      const resolvedPrivacy = (
        tokenData.room?.privacy ||
        room?.privacy ||
        room?.visibility ||
        "public"
      ).toLowerCase();
      const client = await startAgora(
        tokenData.appId,
        tokenData.token,
        tokenData.uid,
      );
      if (cancelled) {
        // Unmounted while Agora was connecting — drop this connection
        clearInterval(timerRef.current);
        client.leave().catch(() => {});
        return;
      }
      initSocket(resolvedHostId, resolvedRoomType, resolvedPrivacy);
    })();
    return () => {
      cancelled = true;
      cleanup(false);
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const cleanup = useCallback(
    (shouldNavigate = false) => {
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);
      clientRef.current?.leave().catch(() => {});
      if (socketRef.current) {
        socketRef.current.emit("leave-room", { channelName });
        socketRef.current.disconnect();
      }
      if (shouldNavigate) navigate("/home", { replace: true });
    },
    [navigate, channelName],
  );

  const handleLeave = () => cleanup(true);

  const NUMBER_WORDS =
    /\b(zero|one|two|three|four|five|six|seven|eight|nine)\b/i;
  const HAS_DIGITS = /[0-9]/;

  const sendChat = () => {
    const msg = msgInput.trim();
    if (!msg || !socketRef.current) return;
    if (HAS_DIGITS.test(msg) || NUMBER_WORDS.test(msg)) {
      setChatError("Numbers are not allowed in chat messages.");
      return;
    }
    setChatError("");
    socketRef.current.emit("chat-message", {
      channelName,
      userId,
      userName,
      message: msg,
    });
    setMsgInput("");
  };

  const fmtTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const fmtBalance = (v) => (v === null ? "…" : `₹${v}`);

  // ── Status screens ────────────────────────────────────────────────────────
  if (phase === "full")
    return (
      <FullPageScreen>
        <div style={{ fontSize: 52 }}>🚫</div>
        <p
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Room is Full
        </p>
        <p
          style={{
            color: "#aaa",
            fontSize: 14,
            textAlign: "center",
            maxWidth: 300,
            lineHeight: 1.6,
          }}
        >
          {errorMsg}
        </p>
        <GhostButton onClick={() => navigate("/home", { replace: true })}>
          Back to Home
        </GhostButton>
      </FullPageScreen>
    );
  if (phase === "insufficient")
    return (
      <FullPageScreen>
        <div style={{ fontSize: 52 }}>💳</div>
        <p
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: 18,
            textAlign: "center",
          }}
        >
          Insufficient Balance
        </p>
        <p
          style={{
            color: "#888",
            fontSize: 14,
            textAlign: "center",
            maxWidth: 300,
            lineHeight: 1.6,
          }}
        >
          {errorMsg}
        </p>
        <PinkButton onClick={() => navigate("/recharge", { replace: true })}>
          Recharge Now
        </PinkButton>
        <GhostButton onClick={() => navigate("/home", { replace: true })}>
          Back to Home
        </GhostButton>
      </FullPageScreen>
    );
  if (phase === "error")
    return (
      <FullPageScreen>
        <div style={{ fontSize: 48 }}>❌</div>
        <p
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: 18,
            textAlign: "center",
          }}
        >
          Could not join room
        </p>
        <p
          style={{
            color: "#888",
            fontSize: 14,
            textAlign: "center",
            maxWidth: 300,
          }}
        >
          {errorMsg}
        </p>
        <PinkButton onClick={() => navigate("/home", { replace: true })}>
          Back to Home
        </PinkButton>
      </FullPageScreen>
    );
  if (phase === "kicked")
    return (
      <FullPageScreen>
        <div style={{ fontSize: 52 }}>⚠️</div>
        <p
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: 18,
            textAlign: "center",
          }}
        >
          Balance Exhausted
        </p>
        <p
          style={{
            color: "#aaa",
            fontSize: 14,
            textAlign: "center",
            maxWidth: 300,
            lineHeight: 1.6,
          }}
        >
          {kickedInfo?.reason || "Your talktime balance ran out."}
        </p>
        {kickedInfo && (
          <div
            style={{
              background: "#1a1a1a",
              borderRadius: 12,
              padding: "14px 24px",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            <p style={{ color: "#f47eb0", fontWeight: 800, fontSize: 15 }}>
              Session Summary
            </p>
            <p style={{ color: "#ccc", fontSize: 13, marginTop: 6 }}>
              Duration: {kickedInfo.totalMinutes} min
            </p>
            <p style={{ color: "#ccc", fontSize: 13 }}>
              Total spent: ₹{kickedInfo.totalDebit}
            </p>
          </div>
        )}
        <PinkButton onClick={() => navigate("/recharge", { replace: true })}>
          Recharge Now
        </PinkButton>
        <GhostButton onClick={() => navigate("/home", { replace: true })}>
          Back to Home
        </GhostButton>
      </FullPageScreen>
    );
  if (phase === "ended")
    return (
      <FullPageScreen>
        <div style={{ fontSize: 48 }}>🔴</div>
        <p style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>
          Host ended the room
        </p>
        {summaryInfo && (
          <div
            style={{
              background: "#1a1a1a",
              borderRadius: 12,
              padding: "14px 24px",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            <p style={{ color: "#f47eb0", fontWeight: 800, fontSize: 15 }}>
              Session Summary
            </p>
            <p style={{ color: "#ccc", fontSize: 13, marginTop: 6 }}>
              Duration: {summaryInfo.totalMinutes} min
            </p>
            <p style={{ color: "#ccc", fontSize: 13 }}>
              Total spent: ₹{summaryInfo.totalDebit}
            </p>
          </div>
        )}
        <PinkButton onClick={() => navigate("/home", { replace: true })}>
          Back to Home
        </PinkButton>
      </FullPageScreen>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        /* Anti-screenshot blur */
        .ulr-page-blurred { filter:blur(20px) brightness(0.2)!important; transition:filter 0.2s; }

        .ulr-page {
          display:flex; flex-direction:column; height:100dvh; background:#0d0d0d;
          font-family:'Nunito',sans-serif; color:#fff; overflow:hidden;
          user-select:none; -webkit-user-select:none; -webkit-touch-callout:none;
        }
        .ulr-video-area { flex:1; position:relative; overflow:hidden; background:#000; min-height:0; }
        .ulr-host-full  { width:100%; height:100%; position:relative; background:#000; }
        .ulr-double-wrap { width:100%; height:100%; display:flex; flex-direction:column; }
        .ulr-double-top  { flex:1; position:relative; border-bottom:2px solid #0d0d0d; background:#000; }
        .ulr-double-bottom { flex:1; position:relative; background:#111; }
        .ulr-video-div { position:absolute; inset:0; width:100%; height:100%; background:#000; }
        .ulr-video-div video { width:100%!important; height:100%!important; object-fit:cover!important; }
        .ulr-overlay { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; background:#111; z-index:2; transition:opacity 0.4s; }
        .ulr-overlay.hidden { opacity:0; pointer-events:none; }
        .ulr-spinner { width:40px; height:40px; border-radius:50%; border:3px solid #333; border-top-color:#f47eb0; animation:ulr-spin .8s linear infinite; }
        @keyframes ulr-spin { to { transform:rotate(360deg); } }
        .ulr-avatar-circle { width:80px; height:80px; border-radius:50%; overflow:hidden; display:flex; align-items:center; justify-content:center; border:3px solid rgba(255,255,255,0.2); }
        .ulr-avatar-circle img { width:100%; height:100%; object-fit:cover; }
        .ulr-avatar-init { color:#fff; font-weight:900; font-size:32px; }
        .ulr-name-strip { position:absolute; bottom:0; left:0; right:0; padding:8px 12px; background:linear-gradient(0deg,rgba(0,0,0,0.8),transparent); display:flex; align-items:center; gap:8px; z-index:3; }
        .ulr-name-txt { font-size:14px; font-weight:800; }
        .ulr-host-badge   { background:#f47eb0; color:#fff; font-size:10px; font-weight:800; padding:2px 8px; border-radius:10px; }
        .ulr-viewer-badge { color:#aaa; font-size:11px; font-weight:700; }
        .ulr-topbar { position:absolute; top:0; left:0; right:0; padding:10px 14px; display:flex; align-items:center; gap:8px; z-index:10; background:linear-gradient(180deg,rgba(0,0,0,0.7),transparent); flex-wrap:wrap; }
        .ulr-live-pill { display:flex; align-items:center; gap:5px; background:rgba(0,0,0,0.6); border-radius:20px; padding:4px 10px; }
        .ulr-live-dot  { width:8px; height:8px; border-radius:50%; background:#f47eb0; animation:ulr-pulse 1.2s infinite; }
        @keyframes ulr-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .ulr-live-txt  { color:#fff; font-size:11px; font-weight:900; letter-spacing:1px; }
        .ulr-view-pill { display:flex; align-items:center; gap:4px; background:rgba(0,0,0,0.5); border-radius:20px; padding:4px 10px; color:#fff; font-size:12px; font-weight:700; }
        .ulr-timer     { color:#fff; font-size:13px; font-weight:800; background:rgba(0,0,0,0.4); border-radius:20px; padding:4px 10px; }
        .ulr-balance-pill { display:flex; align-items:center; gap:4px; background:rgba(244,126,176,0.25); border:1px solid rgba(244,126,176,0.5); border-radius:20px; padding:4px 10px; color:#f47eb0; font-size:12px; font-weight:800; margin-left:auto; }
        .ulr-leave-btn { background:rgba(255,60,60,0.85); color:#fff; border:none; border-radius:20px; padding:5px 14px; font-weight:800; font-size:12px; cursor:pointer; }
        .ulr-infobar { position:absolute; top:48px; left:0; right:0; padding:6px 14px; display:flex; align-items:center; gap:8px; z-index:10; flex-wrap:wrap; }
        .ulr-room-badge { display:flex; align-items:center; gap:6px; background:rgba(0,0,0,0.6); border-radius:20px; padding:4px 12px; font-size:11px; font-weight:700; color:#ddd; }
        .ulr-join-notif { background:rgba(244,126,176,0.85); color:#fff; border-radius:20px; padding:3px 10px; font-size:11px; font-weight:700; }
        .ulr-private-badge { background:rgba(0,0,0,0.7); color:#f9ca24; border-radius:20px; padding:3px 10px; font-size:11px; font-weight:700; }
        .ulr-billing-toast { position:absolute; bottom:8px; left:50%; transform:translateX(-50%); background:rgba(244,126,176,0.92); color:#fff; border-radius:20px; padding:6px 18px; font-size:12px; font-weight:800; z-index:20; white-space:nowrap; animation:ulr-fade-in 0.3s; }
        @keyframes ulr-fade-in { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        .ulr-bottom { background:#0d0d0d; display:flex; flex-direction:column; max-height:42vh; flex-shrink:0; }
        .ulr-viewers-row { padding:10px 14px 0; display:flex; align-items:center; gap:8px; overflow-x:auto; scrollbar-width:none; flex-shrink:0; }
        .ulr-viewers-row::-webkit-scrollbar { display:none; }
        .ulr-viewers-label { font-size:11px; font-weight:800; color:#aaa; display:flex; align-items:center; gap:4px; white-space:nowrap; }
        .ulr-viewers-label span { width:7px; height:7px; border-radius:50%; background:#f47eb0; display:inline-block; }
        .ulr-viewing-count { font-size:11px; font-weight:700; color:#aaa; margin-left:auto; white-space:nowrap; }
        .ulr-chat { flex:1; overflow-y:auto; padding:8px 14px; scrollbar-width:none; min-height:60px; }
        .ulr-chat::-webkit-scrollbar { display:none; }
        .ulr-chat-msg  { margin-bottom:6px; font-size:13px; line-height:1.4; }
        .ulr-chat-name { font-weight:800; color:#f47eb0; margin-right:4px; }
        .ulr-chat-text { color:#ddd; }
        .ulr-input-row { display:flex; align-items:center; gap:8px; padding:8px 14px; }
        .ulr-msg-input { flex:1; background:#1a1a1a; border:1px solid #333; border-radius:22px; padding:9px 16px; color:#fff; font-size:13px; font-family:'Nunito',sans-serif; outline:none; user-select:text!important; -webkit-user-select:text!important; }
        .ulr-msg-input::placeholder { color:#555; }
        .ulr-send-btn { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,#f47eb0,#ee5fa0); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .ulr-desc { font-size:12px; color:#888; padding:4px 14px 0; font-style:italic; flex-shrink:0; }
      `}</style>

      <div className={`ulr-page${pageBlurred ? " ulr-page-blurred" : ""}`}>
        {/* VIDEO AREA */}
        <div className="ulr-video-area">
          {roomType === "double" ? (
            <div className="ulr-double-wrap">
              <div className="ulr-double-top">
                <div ref={hostDivRef} className="ulr-video-div" />
                <div className={`ulr-overlay ${hostOnline ? "hidden" : ""}`}>
                  {phase === "connecting" ? (
                    <>
                      <div className="ulr-spinner" />
                      <span style={{ color: "#aaa", fontSize: 13 }}>
                        Connecting…
                      </span>
                    </>
                  ) : (
                    <>
                      <AvatarCircle
                        color={hostColor}
                        avatar={hostAvatar}
                        initial={hostInitial}
                      />
                      <span style={{ color: "#888", fontSize: 13 }}>
                        Waiting for host…
                      </span>
                    </>
                  )}
                </div>
                <AnimatedWatermark text={watermarkText} />
                <div className="ulr-name-strip">
                  <span className="ulr-name-txt">
                    🎙️ {room?.name || "Host"}
                  </span>
                  <span className="ulr-host-badge">HOST</span>
                </div>
              </div>
              <div className="ulr-double-bottom">
                <div ref={partnerDivRef} className="ulr-video-div" />
                <div
                  className={`ulr-overlay ${partnerOnline ? "hidden" : ""}`}
                  style={{ background: "transparent" }}
                >
                  <div style={{ fontSize: 40 }}>👤</div>
                  <span style={{ color: "#444", fontSize: 12 }}>
                    Waiting for partner…
                  </span>
                </div>
                <AnimatedWatermark text={watermarkText} />
                {partnerOnline && (
                  <div className="ulr-name-strip">
                    <span className="ulr-name-txt">🎙️ Viewer</span>
                    <span className="ulr-viewer-badge">VIEWER</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="ulr-host-full">
              <div ref={hostDivRef} className="ulr-video-div" />
              <div className={`ulr-overlay ${hostOnline ? "hidden" : ""}`}>
                {phase === "connecting" ? (
                  <>
                    <div className="ulr-spinner" />
                    <span style={{ color: "#aaa", fontSize: 13 }}>
                      Joining room…
                    </span>
                  </>
                ) : (
                  <>
                    <AvatarCircle
                      color={hostColor}
                      avatar={hostAvatar}
                      initial={hostInitial}
                    />
                    <span style={{ color: "#888", fontSize: 13, marginTop: 8 }}>
                      Waiting for host…
                    </span>
                  </>
                )}
              </div>
              <AnimatedWatermark text={watermarkText} />
              <div className="ulr-name-strip">
                <span className="ulr-name-txt">🎙️ {room?.name || "Host"}</span>
                <span className="ulr-host-badge">HOST</span>
              </div>
            </div>
          )}

          {/* TOP BAR */}
          <div className="ulr-topbar">
            <div className="ulr-live-pill">
              <span className="ulr-live-dot" />
              <span className="ulr-live-txt">LIVE</span>
            </div>
            <div className="ulr-view-pill">
              <span>👁</span>
              <span>{viewerCount}</span>
            </div>
            <span className="ulr-timer">{fmtTime(elapsed)}</span>
            <div className="ulr-balance-pill">
              💰 {fmtBalance(talktimeBalance)}
            </div>
            <button className="ulr-leave-btn" onClick={handleLeave}>
              Leave
            </button>
          </div>
          <div className="ulr-infobar">
            <div className="ulr-room-badge">
              <span>{room?.roomName || room?.name}</span>
              <span style={{ color: "#aaa" }}>|</span>
              <span style={{ textTransform: "capitalize" }}>
                {rate.label} · ₹{rate.user}/min
              </span>
            </div>
            {joinNotif && <div className="ulr-join-notif">👋 {joinNotif}</div>}
            {privacy === "private" && (
              <div className="ulr-private-badge">🔒 Private</div>
            )}
          </div>
          {billingStarting && (
            <div className="ulr-billing-toast">
              ⏱ Billing starts in {billingCountdown}s · ₹{rate.user}/min
            </div>
          )}
          {billingActive && !billingStarting && (
            <div
              className="ulr-billing-toast"
              style={{ background: "rgba(30,180,100,0.85)" }}
            >
              🔴 Billing active · ₹{rate.user}/min
            </div>
          )}
        </div>

        {/* BOTTOM PANEL */}
        <div className="ulr-bottom">
          {room?.description && (
            <p className="ulr-desc">"{room.description}"</p>
          )}
          <div className="ulr-viewers-row">
            <span className="ulr-viewers-label">
              <span />
              Live Viewers
            </span>
            <span className="ulr-viewing-count">{viewerCount} watching</span>
          </div>
          <div className="ulr-chat">
            {chat.length === 0 && (
              <p
                style={{
                  color: "#444",
                  fontSize: 12,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                Say hello! 👋
              </p>
            )}
            {chat.map((m, i) => (
              <div key={i} className="ulr-chat-msg">
                <span className="ulr-chat-name">{m.userName}:</span>
                <span className="ulr-chat-text">{m.message}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="ulr-input-row">
            <input
              className="ulr-msg-input"
              placeholder="Say something…"
              value={msgInput}
              onChange={(e) => {
                setMsgInput(e.target.value);
                if (chatError) setChatError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
            />
            <button className="ulr-send-btn" onClick={sendChat}>
              <svg
                style={{ width: 16, height: 16, fill: "#fff" }}
                viewBox="0 0 24 24"
              >
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
            </button>
          </div>
          {chatError && (
            <div
              style={{
                color: "#ff4d4d",
                fontSize: 12,
                padding: "4px 8px 0",
                fontWeight: 700,
              }}
            >
              {chatError}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function AvatarCircle({ color, avatar, initial }) {
  return (
    <div className="ulr-avatar-circle" style={{ background: color }}>
      {avatar ? (
        <img
          src={avatar}
          alt="host"
          onError={(e) => (e.target.style.display = "none")}
        />
      ) : (
        <span className="ulr-avatar-init">{initial}</span>
      )}
    </div>
  );
}
function FullPageScreen({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 32,
        fontFamily: "Nunito,sans-serif",
      }}
    >
      {children}
    </div>
  );
}
function PinkButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#f47eb0",
        color: "#fff",
        border: "none",
        borderRadius: 50,
        padding: "12px 32px",
        fontWeight: 900,
        fontSize: 15,
        cursor: "pointer",
        marginTop: 8,
      }}
    >
      {children}
    </button>
  );
}
function GhostButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        color: "#888",
        border: "1px solid #333",
        borderRadius: 50,
        padding: "10px 28px",
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
