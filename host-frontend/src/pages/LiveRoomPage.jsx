// // host-frontend/src/pages/LiveRoomPage.jsx
// // ─────────────────────────────────────────────────────────────────────────────
// // Full live room: Agora RTC + Socket.IO chat + Single/Double/Multiple support
// // ─────────────────────────────────────────────────────────────────────────────
// import { useEffect, useRef, useState, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import { io } from "socket.io-client";
// import api from "../utils/api";

// const SOCKET_URL = import.meta.env.VITE_API_URL || "https://redcheery.com";

// export default function LiveRoomPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, refreshUser } = useAuth();

//   // Room data passed from HomePage via navigate(state)
//   const roomData = location.state?.room; // { id, channelName, roomName, roomType, privacy, maxUsers }
//   const initToken = location.state?.token;
//   const initAppId = location.state?.appId;
//   const initUid = location.state?.uid;

//   // ── State ──────────────────────────────────────────────────────────────────
//   const [joined, setJoined] = useState(false);
//   const [micOn, setMicOn] = useState(true);
//   const [camOn, setCamOn] = useState(true);
//   const [viewerCount, setViewerCount] = useState(0);
//   const [elapsed, setElapsed] = useState(0);
//   const [chat, setChat] = useState([]);
//   const [msgInput, setMsgInput] = useState("");
//   const [viewers, setViewers] = useState([]); // remote users list
//   const [showEndModal, setShowEndModal] = useState(false);
//   const [joinNotif, setJoinNotif] = useState(""); // "Priya joined"
//   const [chatError, setChatError] = useState("");

//   // ── Refs ───────────────────────────────────────────────────────────────────
//   const clientRef = useRef(null);
//   const audioRef = useRef(null);
//   const videoRef = useRef(null);
//   const socketRef = useRef(null);
//   const timerRef = useRef(null);
//   const chatEndRef = useRef(null);
//   const hostVideoDiv = useRef(null);

//   const channelName = roomData?.channelName;
//   const roomType = roomData?.roomType || "single";
//   const privacy = roomData?.privacy || "public";
//   const roomName = roomData?.roomName || "Live Room";
//   const hostName =
//     `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Host";

//   // ── Redirect if no room data ───────────────────────────────────────────────
//   useEffect(() => {
//     if (!roomData || !initToken) {
//       navigate("/host/home", { replace: true });
//     }
//   }, [roomData, initToken, navigate]);

//   // ── Agora init ─────────────────────────────────────────────────────────────
//   const startAgora = useCallback(async () => {
//     if (!channelName || !initToken || !initAppId) return;

//     const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
//     clientRef.current = client;

//     // Remote user published
//     client.on("user-published", async (remoteUser, mediaType) => {
//       await client.subscribe(remoteUser, mediaType);
//       if (mediaType === "video") {
//         setViewers((prev) => {
//           if (prev.find((v) => v.uid === remoteUser.uid)) return prev;
//           return [
//             ...prev,
//             { uid: remoteUser.uid, videoTrack: remoteUser.videoTrack },
//           ];
//         });
//       }
//       if (mediaType === "audio") {
//         remoteUser.audioTrack?.play();
//       }
//     });

//     client.on("user-unpublished", (remoteUser) => {
//       setViewers((prev) => prev.filter((v) => v.uid !== remoteUser.uid));
//     });

//     client.on("user-left", (remoteUser) => {
//       setViewers((prev) => prev.filter((v) => v.uid !== remoteUser.uid));
//     });

//     try {
//       await client.join(initAppId, channelName, initToken, initUid || null);

//       const audio = await AgoraRTC.createMicrophoneAudioTrack();
//       const video = await AgoraRTC.createCameraVideoTrack({
//         encoderConfig: "360p",
//       });

//       audioRef.current = audio;
//       videoRef.current = video;

//       await client.publish([audio, video]);

//       // Play host video locally
//       if (hostVideoDiv.current) {
//         video.play(hostVideoDiv.current);
//       }

//       setJoined(true);
//     } catch (err) {
//       console.error("Agora join error:", err);
//       alert("Failed to start live stream. Check camera/mic permissions.");
//       navigate("/host/home", { replace: true });
//     }
//   }, [channelName, initToken, initAppId, initUid, navigate]);

//   // ── Socket.IO ──────────────────────────────────────────────────────────────
//   const initSocket = useCallback(() => {
//     const socket = io(SOCKET_URL, {
//       transports: ["websocket"],
//       withCredentials: true,
//     });
//     socketRef.current = socket;

//     socket.emit("join-room", {
//       channelName,
//       userId: initUid,
//       userName: hostName,
//       privacy, // ← pass privacy so server rate lookup works correctly
//     });

//     socket.on("viewer-count", (count) => setViewerCount(count));

//     socket.on("user-joined", ({ userName }) => {
//       setJoinNotif(`${userName} joined`);
//       setTimeout(() => setJoinNotif(""), 3000);
//     });

//     socket.on("chat-message", (msg) => {
//       setChat((prev) => [...prev.slice(-99), msg]);
//     });

//     socket.on("room-ended", () => {
//       // Should not happen to host (they're the one ending), but handle anyway
//       handleLeaveCleanup();
//       navigate("/host/home", { replace: true });
//     });
//   }, [channelName, initUid, hostName]);

//   // ── On mount: start Agora + socket + timer ─────────────────────────────────
//   useEffect(() => {
//     if (!channelName || !initToken) return;
//     startAgora();
//     initSocket();

//     timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);

//     return () => {
//       clearInterval(timerRef.current);
//     };
//   }, [channelName, initToken]); // eslint-disable-line

//   // ── Play remote video tracks when viewers list updates ─────────────────────
//   useEffect(() => {
//     viewers.forEach((v) => {
//       if (v.videoTrack) {
//         const el = document.getElementById(`viewer-${v.uid}`);
//         if (el && !el.hasChildNodes()) {
//           v.videoTrack.play(`viewer-${v.uid}`);
//         }
//       }
//     });
//   }, [viewers]);

//   // ── Scroll chat ────────────────────────────────────────────────────────────
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat]);

//   // ── Helpers ────────────────────────────────────────────────────────────────
//   const fmtTime = (s) => {
//     const m = String(Math.floor(s / 60)).padStart(2, "0");
//     const sec = String(s % 60).padStart(2, "0");
//     return `${m}:${sec}`;
//   };

//   const toggleMic = async () => {
//     if (!audioRef.current) return;
//     if (micOn) {
//       await audioRef.current.setEnabled(false);
//     } else {
//       await audioRef.current.setEnabled(true);
//     }
//     setMicOn(!micOn);
//   };

//   const flipCamera = async () => {
//     if (!videoRef.current) return;
//     const devices = await AgoraRTC.getCameras();
//     if (devices.length < 2) return;
//     const current = videoRef.current.getTrackLabel();
//     const next = devices.find((d) => d.label !== current) || devices[0];
//     await videoRef.current.setDevice(next.deviceId);
//     setCamOn(true);
//   };

//   const handleLeaveCleanup = useCallback(async () => {
//     clearInterval(timerRef.current);
//     audioRef.current?.close();
//     videoRef.current?.close();
//     if (clientRef.current) {
//       try {
//         await clientRef.current.leave();
//       } catch {}
//     }
//     socketRef.current?.emit("end-room", { channelName });
//     socketRef.current?.disconnect();
//     // Mark room ended in backend
//     try {
//       await api.post(`/api/host/rooms/end/${channelName}`, {});
//     } catch {}
//   }, [channelName]);

//   const confirmEnd = async () => {
//     setShowEndModal(false);
//     await handleLeaveCleanup();
//     // Re-fetch host profile so earnings displayed on HomePage are up to date
//     await refreshUser();
//     navigate("/host/home", { replace: true });
//   };

//   const NUMBER_WORDS_RE =
//     /\b(zero|one|two|three|four|five|six|seven|eight|nine)\b/i;
//   const HAS_DIGITS_RE = /[0-9]/;

//   const sendChat = () => {
//     const msg = msgInput.trim();
//     if (!msg || !socketRef.current) return;
//     if (HAS_DIGITS_RE.test(msg) || NUMBER_WORDS_RE.test(msg)) {
//       setChatError("Numbers are not allowed in chat messages.");
//       return;
//     }
//     setChatError("");
//     socketRef.current.emit("chat-message", {
//       channelName,
//       userId: initUid,
//       userName: hostName,
//       message: msg,
//     });
//     setMsgInput("");
//   };

//   const hostAvatarSrc = user?.profilePicture
//     ? `/host-uploads/${user.profilePicture}`
//     : null;
//   const hostInitials = hostName[0]?.toUpperCase() || "H";

//   // ── Viewer avatar helpers (show real pics when available) ──────────────────
//   const mockViewerNames = [
//     "Priya",
//     "Kiran",
//     "Dev",
//     "Meera",
//     "Rahul",
//     "Ananya",
//     "Sneha",
//   ];
//   const getViewerName = (idx) => mockViewerNames[idx % mockViewerNames.length];

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
//         *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
//         html,body{
//           background:#000;
//           height:100%;
//           /* do NOT put overflow:hidden on body — it kills mobile scroll recovery */
//         }

//         /* ─────────────────────────────────────────────────────────────────
//            PAGE SHELL
//            We use position:fixed so the page always fills the real visual
//            viewport on mobile (behind/under browser chrome is avoided).
//         ───────────────────────────────────────────────────────────────── */
//         .lr-page{
//           position:fixed;
//           inset:0;
//           /* respect iOS notch / Android status bar */
//           top:env(safe-area-inset-top,0px);
//           bottom:env(safe-area-inset-bottom,0px);
//           left:env(safe-area-inset-left,0px);
//           right:env(safe-area-inset-right,0px);
//           display:flex;
//           flex-direction:column;
//           background:#0d0d0d;
//           font-family:'Nunito',sans-serif;
//           color:#fff;
//           overflow:hidden;
//         }

//         /* ─────────────────────────────────────────────────────────────────
//            TOP BAR — ALWAYS the first visible element, never clipped
//         ───────────────────────────────────────────────────────────────── */
//         .lr-topbar{
//           display:flex;
//           align-items:center;
//           justify-content:space-between;
//           padding:10px 16px 8px;
//           background:#0d0d0d;
//           flex-shrink:0;
//           z-index:60;
//           min-height:52px;
//           border-bottom:1px solid #1a1a1a;
//           /* guarantee it never collapses */
//           width:100%;
//         }
//         .lr-live-pill{display:flex;align-items:center;gap:5px;background:#1a1a1a;border-radius:20px;padding:6px 12px;flex-shrink:0}
//         .lr-live-dot{width:8px;height:8px;border-radius:50%;background:#ff3b3b;animation:lr-blink 1s infinite;flex-shrink:0}
//         @keyframes lr-blink{0%,100%{opacity:1}50%{opacity:.3}}
//         .lr-live-txt{font-size:12px;font-weight:800;letter-spacing:.5px}
//         .lr-view-pill{display:flex;align-items:center;gap:4px;background:#1a1a1a;border-radius:20px;padding:6px 12px;font-size:12px;font-weight:700;flex-shrink:0}
//         .lr-timer{font-size:15px;font-weight:800;letter-spacing:1px;color:#fff;flex-shrink:0}
//         .lr-end-btn{background:#c0392b;color:#fff;border:none;border-radius:20px;padding:8px 18px;font-size:13px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;flex-shrink:0;transition:background .15s;white-space:nowrap}
//         .lr-end-btn:hover{background:#e74c3c}
//         .lr-end-btn:active{background:#a93226}

//         /* ─────────────────────────────────────────────────────────────────
//            ROOM INFO BAR
//         ───────────────────────────────────────────────────────────────── */
//         .lr-infobar{
//           display:flex;
//           align-items:center;
//           gap:8px;
//           padding:8px 20px;
//           flex-shrink:0;
//           flex-wrap:wrap;
//           background:#0d0d0d;
//         }
//         .lr-room-badge{background:#1a1a1a;border-radius:20px;padding:5px 14px;font-size:12px;font-weight:800;display:flex;align-items:center;gap:5px}
//         .lr-join-notif{background:#1a1a1a;border-radius:20px;padding:5px 12px;font-size:12px;font-weight:700;color:#ffd700;display:flex;align-items:center;gap:4px}
//         .lr-private-badge{background:#1a1a1a;border-radius:20px;padding:5px 12px;font-size:12px;font-weight:800;color:#f9c846;display:flex;align-items:center;gap:4px;margin-left:auto}

//         /* ─────────────────────────────────────────────────────────────────
//            BODY — flex row on desktop, column on mobile
//         ───────────────────────────────────────────────────────────────── */
//         .lr-body{
//           flex:1;
//           display:flex;
//           flex-direction:column;
//           min-height:0;
//           overflow:hidden;
//         }

//         /* ── VIDEO AREA ── */
//         .lr-video-area{
//           flex:1;
//           position:relative;
//           overflow:hidden;
//           background:#111;
//           min-height:0;
//         }
//         /* Single & Multiple: host full-area */
//         .lr-host-full{width:100%;height:100%;background:#1a1a1a;display:flex;align-items:center;justify-content:center}
//         /* Double: split top/bottom (mobile) / left-right (desktop) */
//         .lr-double-wrap{display:flex;flex-direction:column;height:100%}
//         .lr-double-host{flex:1;background:#1a1a1a;display:flex;align-items:center;justify-content:center;border-bottom:1px solid #222}
//         .lr-double-viewer{flex:1;background:#111;display:flex;align-items:center;justify-content:center}

//         /* Avatar circle */
//         .lr-avatar{width:110px;height:110px;border-radius:50%;border:3px solid #f47eb0;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#2a1a22}
//         .lr-avatar img{width:100%;height:100%;object-fit:cover}
//         .lr-avatar-init{font-size:40px;font-weight:900;color:#f47eb0}
//         .lr-avatar-placeholder{width:70px;height:70px;border-radius:50%;border:2px solid #444;background:#222;display:flex;align-items:center;justify-content:center;color:#666;font-size:26px}

//         /* Host label strip */
//         .lr-host-strip{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(0deg,rgba(0,0,0,0.88),transparent);padding:16px 20px 10px;display:flex;align-items:center;justify-content:space-between}
//         .lr-host-name-txt{font-size:15px;font-weight:800;display:flex;align-items:center;gap:6px}
//         .lr-mic-icon{font-size:15px;color:#f47eb0}
//         .lr-host-badge{background:#f47eb0;color:#fff;font-size:11px;font-weight:800;padding:3px 10px;border-radius:10px}
//         .lr-viewer-badge{color:#aaa;font-size:12px;font-weight:700}

//         /* ── BOTTOM PANEL (mobile: below video; desktop: right sidebar) ── */
//         .lr-bottom{
//           background:#0d0d0d;
//           display:flex;
//           flex-direction:column;
//           /* mobile: cap height so video still shows */
//           max-height:44vh;
//           flex-shrink:0;
//           border-top:1px solid #1a1a1a;
//           /* iOS home bar padding */
//           padding-bottom:env(safe-area-inset-bottom,0px);
//         }

//         /* Viewer row */
//         .lr-viewers-row{padding:10px 20px 0;display:flex;align-items:center;gap:10px;overflow-x:auto;scrollbar-width:none;flex-shrink:0}
//         .lr-viewers-row::-webkit-scrollbar{display:none}
//         .lr-viewers-label{font-size:12px;font-weight:800;color:#aaa;display:flex;align-items:center;gap:4px;white-space:nowrap}
//         .lr-viewers-label span{width:7px;height:7px;border-radius:50%;background:#f47eb0;display:inline-block}
//         .lr-viewer-item{display:flex;flex-direction:column;align-items:center;gap:4px;flex-shrink:0}
//         .lr-viewer-circle{width:56px;height:66px;border-radius:14px;overflow:hidden;background:#1e1e1e;position:relative}
//         .lr-viewer-circle-inner{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:20px;color:#666}
//         .lr-viewer-circle div{width:100%;height:100%}
//         .lr-viewer-name-txt{font-size:10px;font-weight:700;color:#aaa}
//         .lr-viewing-count{font-size:12px;font-weight:700;color:#aaa;margin-left:auto;white-space:nowrap;padding-right:4px}

//         /* Chat */
//         .lr-chat{flex:1;overflow-y:auto;padding:10px 20px;scrollbar-width:thin;scrollbar-color:#2a2a2a transparent;min-height:60px}
//         .lr-chat::-webkit-scrollbar{width:4px}
//         .lr-chat::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:4px}
//         .lr-chat-msg{margin-bottom:8px;font-size:13px;line-height:1.4}
//         .lr-chat-name{font-weight:800;color:#f47eb0;margin-right:4px}
//         .lr-chat-text{color:#ddd}

//         /* Input row */
//         .lr-input-row{display:flex;align-items:center;gap:8px;padding:10px 20px}
//         .lr-msg-input{flex:1;background:#1a1a1a;border:1px solid #333;border-radius:22px;padding:10px 18px;color:#fff;font-size:14px;font-family:'Nunito',sans-serif;outline:none;transition:border-color .2s}
//         .lr-msg-input:focus{border-color:#f47eb0}
//         .lr-msg-input::placeholder{color:#555}
//         .lr-send-btn{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f47eb0,#ee5fa0);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .15s}
//         .lr-send-btn:hover{opacity:.85}
//         .lr-send-icon{width:17px;height:17px;fill:#fff}

//         /* Controls */
//         .lr-controls{display:flex;padding:6px 20px 16px;gap:0;border-top:1px solid #1a1a1a}
//         .lr-ctrl-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;background:none;border:none;cursor:pointer;color:#aaa;font-family:'Nunito',sans-serif;padding:10px 0;font-size:12px;font-weight:700;transition:color .15s}
//         .lr-ctrl-btn:hover{color:#f47eb0}
//         .lr-ctrl-btn.off{color:#555}

//         /* End modal */
//         .lr-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px}
//         .lr-modal{background:#1a1a1a;border-radius:20px;padding:32px 28px;width:100%;max-width:360px;text-align:left;border:1px solid #2a2a2a}
//         .lr-modal-title{font-size:22px;font-weight:900;color:#fff;margin-bottom:12px}
//         .lr-modal-body{font-size:14px;color:#aaa;margin-bottom:28px;line-height:1.6}
//         .lr-modal-actions{display:flex;justify-content:flex-end;gap:20px}
//         .lr-modal-cancel{background:none;border:none;color:#aaa;font-size:15px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;transition:color .15s}
//         .lr-modal-cancel:hover{color:#fff}
//         .lr-modal-confirm{background:#c0392b;color:#fff;border:none;border-radius:12px;padding:10px 22px;font-size:15px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;transition:background .15s}
//         .lr-modal-confirm:hover{background:#e74c3c}

//         /* Agora video containers */
//         .agora-video-player{width:100%;height:100%;object-fit:cover}

//         /* ─────────────────────────────────────────────────────────────────
//            TABLET  (≥ 768px)  — bigger padding, slightly larger text
//         ───────────────────────────────────────────────────────────────── */
//         @media (min-width:768px){
//           .lr-topbar{padding:12px 28px 10px;min-height:58px}
//           .lr-infobar{padding:8px 28px}
//           .lr-bottom{max-height:40vh}
//           .lr-host-strip{padding:18px 24px 12px}
//         }

//         /* ─────────────────────────────────────────────────────────────────
//            DESKTOP (≥ 1024px) — side-by-side: video | chat panel
//         ───────────────────────────────────────────────────────────────── */
//         @media (min-width:1024px){
//           .lr-topbar{padding:14px 36px 12px;min-height:64px}
//           .lr-infobar{padding:10px 36px}
//           .lr-live-txt{font-size:14px}
//           .lr-view-pill{font-size:14px;padding:6px 16px}
//           .lr-timer{font-size:18px}
//           .lr-end-btn{padding:10px 28px;font-size:15px}

//           /* Body switches to row */
//           .lr-body{
//             flex-direction:row;
//           }

//           /* Video takes all remaining width */
//           .lr-video-area{
//             flex:1;
//             height:100%;
//           }

//           /* Double layout splits left-right on desktop */
//           .lr-double-wrap{flex-direction:row}
//           .lr-double-host{border-bottom:none;border-right:1px solid #222}

//           /* Right chat sidebar — fixed width, full height */
//           .lr-bottom{
//             width:380px;
//             min-width:320px;
//             max-width:420px;
//             max-height:none;
//             height:100%;
//             border-top:none;
//             border-left:1px solid #1a1a1a;
//             flex-shrink:0;
//             padding-bottom:0;
//           }

//           .lr-viewers-row{padding:14px 20px 0}
//           .lr-chat{padding:12px 20px;font-size:14px}
//           .lr-chat-msg{margin-bottom:10px;font-size:14px}
//           .lr-input-row{padding:12px 20px}
//           .lr-msg-input{font-size:14px;padding:12px 20px}
//           .lr-send-btn{width:44px;height:44px}
//           .lr-controls{padding:8px 20px 20px}
//           .lr-ctrl-btn{font-size:13px}

//           /* Avatar scales up on desktop */
//           .lr-avatar{width:140px;height:140px}
//           .lr-avatar-init{font-size:52px}
//           .lr-host-strip{padding:20px 28px 14px}
//           .lr-host-name-txt{font-size:16px}
//           .lr-host-badge{font-size:12px;padding:4px 12px}
//         }

//         /* ─────────────────────────────────────────────────────────────────
//            LARGE DESKTOP (≥ 1440px)
//         ───────────────────────────────────────────────────────────────── */
//         @media (min-width:1440px){
//           .lr-topbar{padding:16px 48px 14px}
//           .lr-infobar{padding:10px 48px}
//           .lr-bottom{width:440px;max-width:460px}
//           .lr-chat{font-size:15px}
//           .lr-chat-msg{font-size:15px}
//           .lr-msg-input{font-size:15px}
//         }
//       `}</style>

//       <div className="lr-page">
//         {/* ── TOP BAR — always visible, never behind browser chrome ── */}
//         <div className="lr-topbar">
//           <div className="lr-live-pill">
//             <span className="lr-live-dot" />
//             <span className="lr-live-txt">LIVE</span>
//           </div>
//           <div className="lr-view-pill">
//             <span>👁</span>
//             <span>{viewerCount}</span>
//           </div>
//           <span className="lr-timer">{fmtTime(elapsed)}</span>
//           <button className="lr-end-btn" onClick={() => setShowEndModal(true)}>
//             End
//           </button>
//         </div>

//         {/* ── ROOM INFO BAR ── */}
//         <div className="lr-infobar">
//           <div className="lr-room-badge">
//             <span>{roomName}</span>
//             <span style={{ color: "#aaa" }}>|</span>
//             <span style={{ textTransform: "capitalize" }}>
//               {roomType.charAt(0).toUpperCase() + roomType.slice(1)} –{" "}
//               {privacy.charAt(0).toUpperCase() + privacy.slice(1)}
//             </span>
//           </div>
//           {joinNotif && <div className="lr-join-notif">👋 {joinNotif}</div>}
//           {privacy === "private" && (
//             <div className="lr-private-badge">🔒 Private</div>
//           )}
//         </div>

//         {/* ── BODY: video (left/top) + chat (right/bottom) ── */}
//         <div className="lr-body">
//           {/* ── VIDEO AREA ─────────────────────────────────────────────────── */}
//           <div className="lr-video-area">
//             {roomType === "double" ? (
//               <div className="lr-double-wrap">
//                 {/* Host top */}
//                 <div
//                   className="lr-double-host"
//                   style={{ position: "relative" }}
//                 >
//                   <div
//                     ref={hostVideoDiv}
//                     style={{ width: "100%", height: "100%" }}
//                   >
//                     {!joined && (
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           height: "100%",
//                         }}
//                       >
//                         <div className="lr-avatar">
//                           {hostAvatarSrc ? (
//                             <img src={hostAvatarSrc} alt={hostName} />
//                           ) : (
//                             <span className="lr-avatar-init">
//                               {hostInitials}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <div className="lr-host-strip">
//                     <span className="lr-host-name-txt">
//                       <span className="lr-mic-icon">🎙️</span> You (Host)
//                     </span>
//                     <span className="lr-host-badge">HOST</span>
//                   </div>
//                 </div>
//                 {/* Viewer bottom */}
//                 <div
//                   className="lr-double-viewer"
//                   style={{ position: "relative" }}
//                 >
//                   {viewers.length > 0 ? (
//                     <>
//                       <div
//                         id={`viewer-${viewers[0].uid}`}
//                         style={{ width: "100%", height: "100%" }}
//                       />
//                       <div className="lr-host-strip">
//                         <span className="lr-host-name-txt">
//                           <span className="lr-mic-icon">🎙️</span>{" "}
//                           {getViewerName(0)}
//                         </span>
//                         <span className="lr-viewer-badge">VIEWER</span>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="lr-avatar-placeholder">👤</div>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               /* Single / Multiple: host full screen */
//               <div className="lr-host-full" style={{ position: "relative" }}>
//                 <div
//                   ref={hostVideoDiv}
//                   style={{ width: "100%", height: "100%" }}
//                 >
//                   {!joined && (
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         height: "100%",
//                       }}
//                     >
//                       <div className="lr-avatar">
//                         {hostAvatarSrc ? (
//                           <img src={hostAvatarSrc} alt={hostName} />
//                         ) : (
//                           <span className="lr-avatar-init">{hostInitials}</span>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 <div className="lr-host-strip">
//                   <span className="lr-host-name-txt">
//                     <span className="lr-mic-icon">🎙️</span> You (Host)
//                   </span>
//                   <span className="lr-host-badge">HOST</span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ── BOTTOM PANEL ───────────────────────────────────────────────── */}
//           <div className="lr-bottom">
//             {/* Viewer row — only for Single/Multiple public (not double) */}
//             {roomType !== "double" && (
//               <div className="lr-viewers-row">
//                 <span className="lr-viewers-label">
//                   <span />
//                   Live Viewers
//                 </span>
//                 {viewers.map((v, i) => (
//                   <div className="lr-viewer-item" key={v.uid}>
//                     <div className="lr-viewer-circle">
//                       <div
//                         id={`viewer-${v.uid}`}
//                         className="lr-viewer-circle-inner"
//                       >
//                         <span>{getViewerName(i)[0]}</span>
//                       </div>
//                     </div>
//                     <span className="lr-viewer-name-txt">
//                       {getViewerName(i)}
//                     </span>
//                   </div>
//                 ))}
//                 <span className="lr-viewing-count">{viewerCount} watching</span>
//               </div>
//             )}

//             {/* Chat messages */}
//             <div className="lr-chat">
//               {chat.map((m, i) => (
//                 <div key={i} className="lr-chat-msg">
//                   <span className="lr-chat-name">{m.userName}:</span>
//                   <span className="lr-chat-text">{m.message}</span>
//                 </div>
//               ))}
//               <div ref={chatEndRef} />
//             </div>

//             {/* Message input */}
//             <div className="lr-input-row">
//               <input
//                 className="lr-msg-input"
//                 placeholder="Say something..."
//                 value={msgInput}
//                 onChange={(e) => {
//                   setMsgInput(e.target.value);
//                   if (chatError) setChatError("");
//                 }}
//                 onKeyDown={(e) => e.key === "Enter" && sendChat()}
//               />
//               <button className="lr-send-btn" onClick={sendChat}>
//                 <svg className="lr-send-icon" viewBox="0 0 24 24">
//                   <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
//                 </svg>
//               </button>
//             </div>
//             {chatError && (
//               <div
//                 style={{
//                   color: "#ff4d4d",
//                   fontSize: 12,
//                   padding: "4px 10px 2px",
//                   fontWeight: 700,
//                 }}
//               >
//                 ⚠️ {chatError}
//               </div>
//             )}

//             {/* Controls */}
//             <div className="lr-controls">
//               <button
//                 className={`lr-ctrl-btn${micOn ? "" : " off"}`}
//                 onClick={toggleMic}
//               >
//                 <span style={{ fontSize: 22 }}>{micOn ? "🎙️" : "🔇"}</span>
//                 <span>Mic</span>
//               </button>
//               <button className="lr-ctrl-btn" onClick={flipCamera}>
//                 <span style={{ fontSize: 22 }}>📷</span>
//                 <span>Flip</span>
//               </button>
//             </div>
//           </div>
//           {/* ── END lr-bottom ── */}
//         </div>
//         {/* ── END lr-body ── */}

//         {/* ── END MODAL ──────────────────────────────────────────────────── */}
//         {showEndModal && (
//           <div
//             className="lr-modal-overlay"
//             onClick={() => setShowEndModal(false)}
//           >
//             <div className="lr-modal" onClick={(e) => e.stopPropagation()}>
//               <div className="lr-modal-title">End Live?</div>
//               <div className="lr-modal-body">
//                 Are you sure you want to end the live session for everyone?
//               </div>
//               <div className="lr-modal-actions">
//                 <button
//                   className="lr-modal-cancel"
//                   onClick={() => setShowEndModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button className="lr-modal-confirm" onClick={confirmEnd}>
//                   End Live
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

//for record
// host-frontend/src/pages/LiveRoomPage.jsx
// Full live room + MAX anti-screenshot / anti-screen-recording protection
// NEW: animated moving watermark (bounces across video like a screensaver)
import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AgoraRTC from "agora-rtc-sdk-ng";
import { io } from "socket.io-client";
import api from "../utils/api";

const SOCKET_URL = import.meta.env.VITE_API_URL || "https://redcheery.com";

// ── Animated Watermark: moves around like a DVD screensaver ──────────────────
// Much harder to remove from a recording than a static overlay
function AnimatedWatermark({ text }) {
  const [pos, setPos] = useState({ x: 10, y: 20 });
  const [dir, setDir] = useState({ x: 0.4, y: 0.3 });
  const rafRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let x = Math.random() * 60 + 5;
    let y = Math.random() * 60 + 5;
    let dx = (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.3);
    let dy = (Math.random() > 0.5 ? 1 : -1) * (0.2 + Math.random() * 0.2);
    let last = performance.now();

    function step(now) {
      const dt = Math.min(now - last, 50); // cap at 50ms
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
      ref={containerRef}
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
      {/* Moving watermark label */}
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
      {/* Static diagonal grid (faint) — provides second layer */}
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

export default function LiveRoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useAuth();

  const roomData = location.state?.room;
  const initToken = location.state?.token;
  const initAppId = location.state?.appId;
  const initUid = location.state?.uid;

  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [chat, setChat] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [viewers, setViewers] = useState([]);
  const [showEndModal, setShowEndModal] = useState(false);
  const [joinNotif, setJoinNotif] = useState("");
  const [chatError, setChatError] = useState("");
  const [pageBlurred, setPageBlurred] = useState(false);

  const clientRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const timerRef = useRef(null);
  const chatEndRef = useRef(null);
  const hostVideoDiv = useRef(null);

  const channelName = roomData?.channelName;
  const roomType = roomData?.roomType || "single";
  const privacy = roomData?.privacy || "public";
  const roomName = roomData?.roomName || "Live Room";
  const hostName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Host";
  const watermarkText = `${hostName}${user?.phone ? " · " + user.phone : ""}`;

  // ── Anti-screenshot: blur + visibilitychange + focus/blur ────────────────
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

    // Block touch long-press on video elements
    const blockTouch = (e) => {
      if (
        e.target &&
        (e.target.tagName === "VIDEO" || e.target.tagName === "CANVAS")
      ) {
        e.preventDefault();
      }
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

  // ── Redirect if no room data ──────────────────────────────────────────────
  useEffect(() => {
    if (!roomData || !initToken) navigate("/host/home", { replace: true });
  }, [roomData, initToken, navigate]);

  // ── Agora ─────────────────────────────────────────────────────────────────
  const startAgora = useCallback(async () => {
    if (!channelName || !initToken || !initAppId) return;
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    clientRef.current = client;

    client.on("user-published", async (remoteUser, mediaType) => {
      await client.subscribe(remoteUser, mediaType);
      if (mediaType === "video") {
        setViewers((prev) => {
          if (prev.find((v) => v.uid === remoteUser.uid)) return prev;
          return [
            ...prev,
            { uid: remoteUser.uid, videoTrack: remoteUser.videoTrack },
          ];
        });
      }
      if (mediaType === "audio") remoteUser.audioTrack?.play();
    });
    client.on("user-unpublished", (u) =>
      setViewers((p) => p.filter((v) => v.uid !== u.uid)),
    );
    client.on("user-left", (u) =>
      setViewers((p) => p.filter((v) => v.uid !== u.uid)),
    );

    try {
      await client.join(initAppId, channelName, initToken, initUid || null);
      const audio = await AgoraRTC.createMicrophoneAudioTrack();
      const video = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: "360p",
      });
      audioRef.current = audio;
      videoRef.current = video;
      await client.publish([audio, video]);
      if (hostVideoDiv.current) video.play(hostVideoDiv.current);
      setJoined(true);
    } catch (err) {
      console.error("Agora join error:", err);
      alert("Failed to start live stream. Check camera/mic permissions.");
      navigate("/host/home", { replace: true });
    }
  }, [channelName, initToken, initAppId, initUid, navigate]);

  // ── Socket ────────────────────────────────────────────────────────────────
  const initSocket = useCallback(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    socketRef.current = socket;
    socket.emit("join-room", {
      channelName,
      userId: initUid,
      userName: hostName,
      privacy,
    });
    socket.on("viewer-count", (c) => setViewerCount(c));
    socket.on("user-joined", ({ userName: n }) => {
      setJoinNotif(`${n} joined`);
      setTimeout(() => setJoinNotif(""), 3000);
    });
    socket.on("chat-message", (msg) => setChat((p) => [...p.slice(-99), msg]));
    socket.on("room-ended", () => {
      handleLeaveCleanup();
      navigate("/host/home", { replace: true });
    });
  }, [channelName, initUid, hostName]);

  // ── Mount ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!channelName || !initToken) return;
    startAgora();
    initSocket();
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [channelName, initToken]); // eslint-disable-line

  // ── Play remote viewers ───────────────────────────────────────────────────
  useEffect(() => {
    viewers.forEach((v) => {
      if (v.videoTrack) {
        const el = document.getElementById(`viewer-${v.uid}`);
        if (el && !el.hasChildNodes()) v.videoTrack.play(`viewer-${v.uid}`);
      }
    });
  }, [viewers]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const fmtTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const toggleMic = async () => {
    if (!audioRef.current) return;
    await audioRef.current.setEnabled(!micOn);
    setMicOn(!micOn);
  };

  const flipCamera = async () => {
    if (!videoRef.current) return;
    const devices = await AgoraRTC.getCameras();
    if (devices.length < 2) return;
    const next =
      devices.find((d) => d.label !== videoRef.current.getTrackLabel()) ||
      devices[0];
    await videoRef.current.setDevice(next.deviceId);
    setCamOn(true);
  };

  const handleLeaveCleanup = useCallback(async () => {
    clearInterval(timerRef.current);
    audioRef.current?.close();
    videoRef.current?.close();
    try {
      await clientRef.current?.leave();
    } catch {}
    socketRef.current?.emit("end-room", { channelName });
    socketRef.current?.disconnect();
    try {
      await api.post(`/api/host/rooms/end/${channelName}`, {});
    } catch {}
  }, [channelName]);

  const confirmEnd = async () => {
    setShowEndModal(false);
    await handleLeaveCleanup();
    await refreshUser();
    navigate("/host/home", { replace: true });
  };

  const NUMBER_WORDS_RE =
    /\b(zero|one|two|three|four|five|six|seven|eight|nine)\b/i;
  const HAS_DIGITS_RE = /[0-9]/;

  const sendChat = () => {
    const msg = msgInput.trim();
    if (!msg || !socketRef.current) return;
    if (HAS_DIGITS_RE.test(msg) || NUMBER_WORDS_RE.test(msg)) {
      setChatError("Numbers are not allowed in chat messages.");
      return;
    }
    setChatError("");
    socketRef.current.emit("chat-message", {
      channelName,
      userId: initUid,
      userName: hostName,
      message: msg,
    });
    setMsgInput("");
  };

  const hostAvatarSrc = user?.profilePicture
    ? `/host-uploads/${user.profilePicture}`
    : null;
  const hostInitials = hostName[0]?.toUpperCase() || "H";
  const mockViewerNames = [
    "Priya",
    "Kiran",
    "Dev",
    "Meera",
    "Rahul",
    "Ananya",
    "Sneha",
  ];
  const getViewerName = (i) => mockViewerNames[i % mockViewerNames.length];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{background:#000;height:100%;}

        /* Anti-screenshot blur */
        .lr-page-blurred{filter:blur(20px) brightness(0.2)!important;transition:filter 0.2s;}

        .lr-page{
          position:fixed;inset:0;
          top:env(safe-area-inset-top,0px);bottom:env(safe-area-inset-bottom,0px);
          left:env(safe-area-inset-left,0px);right:env(safe-area-inset-right,0px);
          display:flex;flex-direction:column;
          background:#0d0d0d;font-family:'Nunito',sans-serif;color:#fff;overflow:hidden;
          user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;
        }
        .lr-topbar{display:flex;align-items:center;justify-content:space-between;padding:10px 16px 8px;background:#0d0d0d;flex-shrink:0;z-index:60;min-height:52px;border-bottom:1px solid #1a1a1a;width:100%;}
        .lr-live-pill{display:flex;align-items:center;gap:5px;background:#1a1a1a;border-radius:20px;padding:6px 12px;flex-shrink:0}
        .lr-live-dot{width:8px;height:8px;border-radius:50%;background:#ff3b3b;animation:lr-blink 1s infinite;flex-shrink:0}
        @keyframes lr-blink{0%,100%{opacity:1}50%{opacity:.3}}
        .lr-live-txt{font-size:12px;font-weight:800;letter-spacing:.5px}
        .lr-view-pill{display:flex;align-items:center;gap:4px;background:#1a1a1a;border-radius:20px;padding:6px 12px;font-size:12px;font-weight:700;flex-shrink:0}
        .lr-timer{font-size:15px;font-weight:800;letter-spacing:1px;color:#fff;flex-shrink:0}
        .lr-end-btn{background:#c0392b;color:#fff;border:none;border-radius:20px;padding:8px 18px;font-size:13px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;flex-shrink:0;transition:background .15s;white-space:nowrap}
        .lr-end-btn:hover{background:#e74c3c}
        .lr-infobar{display:flex;align-items:center;gap:8px;padding:8px 20px;flex-shrink:0;flex-wrap:wrap;background:#0d0d0d;}
        .lr-room-badge{background:#1a1a1a;border-radius:20px;padding:5px 14px;font-size:12px;font-weight:800;display:flex;align-items:center;gap:5px}
        .lr-join-notif{background:#1a1a1a;border-radius:20px;padding:5px 12px;font-size:12px;font-weight:700;color:#ffd700;display:flex;align-items:center;gap:4px}
        .lr-private-badge{background:#1a1a1a;border-radius:20px;padding:5px 12px;font-size:12px;font-weight:800;color:#f9c846;display:flex;align-items:center;gap:4px;margin-left:auto}
        .lr-body{flex:1;display:flex;flex-direction:column;min-height:0;overflow:hidden;}
        .lr-video-area{flex:1;position:relative;overflow:hidden;background:#111;min-height:0;}
        .lr-host-full{width:100%;height:100%;background:#1a1a1a;display:flex;align-items:center;justify-content:center}
        .lr-double-wrap{display:flex;flex-direction:column;height:100%}
        .lr-double-host{flex:1;background:#1a1a1a;display:flex;align-items:center;justify-content:center;border-bottom:1px solid #222}
        .lr-double-viewer{flex:1;background:#111;display:flex;align-items:center;justify-content:center}
        .lr-avatar{width:110px;height:110px;border-radius:50%;border:3px solid #f47eb0;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#2a1a22}
        .lr-avatar img{width:100%;height:100%;object-fit:cover}
        .lr-avatar-init{font-size:40px;font-weight:900;color:#f47eb0}
        .lr-avatar-placeholder{width:70px;height:70px;border-radius:50%;border:2px solid #444;background:#222;display:flex;align-items:center;justify-content:center;color:#666;font-size:26px}
        .lr-host-strip{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(0deg,rgba(0,0,0,0.88),transparent);padding:16px 20px 10px;display:flex;align-items:center;justify-content:space-between}
        .lr-host-name-txt{font-size:15px;font-weight:800;display:flex;align-items:center;gap:6px}
        .lr-mic-icon{font-size:15px;color:#f47eb0}
        .lr-host-badge{background:#f47eb0;color:#fff;font-size:11px;font-weight:800;padding:3px 10px;border-radius:10px}
        .lr-viewer-badge{color:#aaa;font-size:12px;font-weight:700}
        .lr-bottom{background:#0d0d0d;display:flex;flex-direction:column;max-height:44vh;flex-shrink:0;border-top:1px solid #1a1a1a;padding-bottom:env(safe-area-inset-bottom,0px);}
        .lr-viewers-row{padding:10px 20px 0;display:flex;align-items:center;gap:10px;overflow-x:auto;scrollbar-width:none;flex-shrink:0}
        .lr-viewers-row::-webkit-scrollbar{display:none}
        .lr-viewers-label{font-size:12px;font-weight:800;color:#aaa;display:flex;align-items:center;gap:4px;white-space:nowrap}
        .lr-viewers-label span{width:7px;height:7px;border-radius:50%;background:#f47eb0;display:inline-block}
        .lr-viewer-item{display:flex;flex-direction:column;align-items:center;gap:4px;flex-shrink:0}
        .lr-viewer-circle{width:56px;height:66px;border-radius:14px;overflow:hidden;background:#1e1e1e;position:relative}
        .lr-viewer-circle-inner{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:20px;color:#666}
        .lr-viewer-circle div{width:100%;height:100%}
        .lr-viewer-name-txt{font-size:10px;font-weight:700;color:#aaa}
        .lr-viewing-count{font-size:12px;font-weight:700;color:#aaa;margin-left:auto;white-space:nowrap;padding-right:4px}
        .lr-chat{flex:1;overflow-y:auto;padding:10px 20px;scrollbar-width:thin;scrollbar-color:#2a2a2a transparent;min-height:60px}
        .lr-chat::-webkit-scrollbar{width:4px}
        .lr-chat::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:4px}
        .lr-chat-msg{margin-bottom:8px;font-size:13px;line-height:1.4}
        .lr-chat-name{font-weight:800;color:#f47eb0;margin-right:4px}
        .lr-chat-text{color:#ddd}
        .lr-input-row{display:flex;align-items:center;gap:8px;padding:10px 20px}
        .lr-msg-input{flex:1;background:#1a1a1a;border:1px solid #333;border-radius:22px;padding:10px 18px;color:#fff;font-size:14px;font-family:'Nunito',sans-serif;outline:none;transition:border-color .2s;user-select:text!important;-webkit-user-select:text!important;}
        .lr-msg-input:focus{border-color:#f47eb0}
        .lr-msg-input::placeholder{color:#555}
        .lr-send-btn{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f47eb0,#ee5fa0);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .15s}
        .lr-send-btn:hover{opacity:.85}
        .lr-send-icon{width:17px;height:17px;fill:#fff}
        .lr-controls{display:flex;padding:6px 20px 16px;gap:0;border-top:1px solid #1a1a1a}
        .lr-ctrl-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;background:none;border:none;cursor:pointer;color:#aaa;font-family:'Nunito',sans-serif;padding:10px 0;font-size:12px;font-weight:700;transition:color .15s}
        .lr-ctrl-btn:hover{color:#f47eb0}
        .lr-ctrl-btn.off{color:#555}
        .lr-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px}
        .lr-modal{background:#1a1a1a;border-radius:20px;padding:32px 28px;width:100%;max-width:360px;text-align:left;border:1px solid #2a2a2a}
        .lr-modal-title{font-size:22px;font-weight:900;color:#fff;margin-bottom:12px}
        .lr-modal-body{font-size:14px;color:#aaa;margin-bottom:28px;line-height:1.6}
        .lr-modal-actions{display:flex;justify-content:flex-end;gap:20px}
        .lr-modal-cancel{background:none;border:none;color:#aaa;font-size:15px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;transition:color .15s}
        .lr-modal-cancel:hover{color:#fff}
        .lr-modal-confirm{background:#c0392b;color:#fff;border:none;border-radius:12px;padding:10px 22px;font-size:15px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;transition:background .15s}
        .lr-modal-confirm:hover{background:#e74c3c}
        .agora-video-player{width:100%;height:100%;object-fit:cover}
        @media(min-width:768px){.lr-topbar{padding:12px 28px 10px;min-height:58px}.lr-infobar{padding:8px 28px}.lr-bottom{max-height:40vh}.lr-host-strip{padding:18px 24px 12px}}
        @media(min-width:1024px){
          .lr-topbar{padding:14px 36px 12px;min-height:64px}.lr-infobar{padding:10px 36px}
          .lr-live-txt{font-size:14px}.lr-view-pill{font-size:14px;padding:6px 16px}
          .lr-timer{font-size:18px}.lr-end-btn{padding:10px 28px;font-size:15px}
          .lr-body{flex-direction:row}.lr-video-area{flex:1;height:100%}
          .lr-double-wrap{flex-direction:row}.lr-double-host{border-bottom:none;border-right:1px solid #222}
          .lr-bottom{width:380px;min-width:320px;max-width:420px;max-height:none;height:100%;border-top:none;border-left:1px solid #1a1a1a;flex-shrink:0;padding-bottom:0;}
          .lr-viewers-row{padding:14px 20px 0}.lr-chat{padding:12px 20px;font-size:14px}
          .lr-chat-msg{margin-bottom:10px;font-size:14px}.lr-input-row{padding:12px 20px}
          .lr-msg-input{font-size:14px;padding:12px 20px}.lr-send-btn{width:44px;height:44px}
          .lr-controls{padding:8px 20px 20px}.lr-ctrl-btn{font-size:13px}
          .lr-avatar{width:140px;height:140px}.lr-avatar-init{font-size:52px}
          .lr-host-strip{padding:20px 28px 14px}.lr-host-name-txt{font-size:16px}.lr-host-badge{font-size:12px;padding:4px 12px}
        }
        @media(min-width:1440px){.lr-topbar{padding:16px 48px 14px}.lr-infobar{padding:10px 48px}.lr-bottom{width:440px;max-width:460px}.lr-chat{font-size:15px}.lr-chat-msg{font-size:15px}.lr-msg-input{font-size:15px}}
      `}</style>

      <div className={`lr-page${pageBlurred ? " lr-page-blurred" : ""}`}>
        {/* TOP BAR */}
        <div className="lr-topbar">
          <div className="lr-live-pill">
            <span className="lr-live-dot" />
            <span className="lr-live-txt">LIVE</span>
          </div>
          <div className="lr-view-pill">
            <span>👁</span>
            <span>{viewerCount}</span>
          </div>
          <span className="lr-timer">{fmtTime(elapsed)}</span>
          <button className="lr-end-btn" onClick={() => setShowEndModal(true)}>
            End
          </button>
        </div>

        {/* ROOM INFO BAR */}
        <div className="lr-infobar">
          <div className="lr-room-badge">
            <span>{roomName}</span>
            <span style={{ color: "#aaa" }}>|</span>
            <span style={{ textTransform: "capitalize" }}>
              {roomType.charAt(0).toUpperCase() + roomType.slice(1)} –{" "}
              {privacy.charAt(0).toUpperCase() + privacy.slice(1)}
            </span>
          </div>
          {joinNotif && <div className="lr-join-notif">👋 {joinNotif}</div>}
          {privacy === "private" && (
            <div className="lr-private-badge">🔒 Private</div>
          )}
        </div>

        <div className="lr-body">
          {/* VIDEO AREA */}
          <div className="lr-video-area">
            {roomType === "double" ? (
              <div className="lr-double-wrap">
                <div
                  className="lr-double-host"
                  style={{ position: "relative" }}
                >
                  <div
                    ref={hostVideoDiv}
                    style={{ width: "100%", height: "100%" }}
                  >
                    {!joined && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        <div className="lr-avatar">
                          {hostAvatarSrc ? (
                            <img src={hostAvatarSrc} alt={hostName} />
                          ) : (
                            <span className="lr-avatar-init">
                              {hostInitials}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <AnimatedWatermark text={watermarkText} />
                  <div className="lr-host-strip">
                    <span className="lr-host-name-txt">
                      <span className="lr-mic-icon">🎙️</span> You (Host)
                    </span>
                    <span className="lr-host-badge">HOST</span>
                  </div>
                </div>
                <div
                  className="lr-double-viewer"
                  style={{ position: "relative" }}
                >
                  {viewers.length > 0 ? (
                    <>
                      <div
                        id={`viewer-${viewers[0].uid}`}
                        style={{ width: "100%", height: "100%" }}
                      />
                      <AnimatedWatermark text={watermarkText} />
                      <div className="lr-host-strip">
                        <span className="lr-host-name-txt">
                          <span className="lr-mic-icon">🎙️</span>{" "}
                          {getViewerName(0)}
                        </span>
                        <span className="lr-viewer-badge">VIEWER</span>
                      </div>
                    </>
                  ) : (
                    <div className="lr-avatar-placeholder">👤</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="lr-host-full" style={{ position: "relative" }}>
                <div
                  ref={hostVideoDiv}
                  style={{ width: "100%", height: "100%" }}
                >
                  {!joined && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <div className="lr-avatar">
                        {hostAvatarSrc ? (
                          <img src={hostAvatarSrc} alt={hostName} />
                        ) : (
                          <span className="lr-avatar-init">{hostInitials}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <AnimatedWatermark text={watermarkText} />
                <div className="lr-host-strip">
                  <span className="lr-host-name-txt">
                    <span className="lr-mic-icon">🎙️</span> You (Host)
                  </span>
                  <span className="lr-host-badge">HOST</span>
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM PANEL */}
          <div className="lr-bottom">
            {roomType !== "double" && (
              <div className="lr-viewers-row">
                <span className="lr-viewers-label">
                  <span />
                  Live Viewers
                </span>
                {viewers.map((v, i) => (
                  <div className="lr-viewer-item" key={v.uid}>
                    <div className="lr-viewer-circle">
                      <div
                        id={`viewer-${v.uid}`}
                        className="lr-viewer-circle-inner"
                      >
                        <span>{getViewerName(i)[0]}</span>
                      </div>
                    </div>
                    <span className="lr-viewer-name-txt">
                      {getViewerName(i)}
                    </span>
                  </div>
                ))}
                <span className="lr-viewing-count">{viewerCount} watching</span>
              </div>
            )}
            <div className="lr-chat">
              {chat.map((m, i) => (
                <div key={i} className="lr-chat-msg">
                  <span className="lr-chat-name">{m.userName}:</span>
                  <span className="lr-chat-text">{m.message}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="lr-input-row">
              <input
                className="lr-msg-input"
                placeholder="Say something..."
                value={msgInput}
                onChange={(e) => {
                  setMsgInput(e.target.value);
                  if (chatError) setChatError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
              />
              <button className="lr-send-btn" onClick={sendChat}>
                <svg className="lr-send-icon" viewBox="0 0 24 24">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                </svg>
              </button>
            </div>
            {chatError && (
              <div
                style={{
                  color: "#ff4d4d",
                  fontSize: 12,
                  padding: "4px 10px 2px",
                  fontWeight: 700,
                }}
              >
                ⚠️ {chatError}
              </div>
            )}
            <div className="lr-controls">
              <button
                className={`lr-ctrl-btn${micOn ? "" : " off"}`}
                onClick={toggleMic}
              >
                <span style={{ fontSize: 22 }}>{micOn ? "🎙️" : "🔇"}</span>
                <span>Mic</span>
              </button>
              <button className="lr-ctrl-btn" onClick={flipCamera}>
                <span style={{ fontSize: 22 }}>📷</span>
                <span>Flip</span>
              </button>
            </div>
          </div>
        </div>

        {showEndModal && (
          <div
            className="lr-modal-overlay"
            onClick={() => setShowEndModal(false)}
          >
            <div className="lr-modal" onClick={(e) => e.stopPropagation()}>
              <div className="lr-modal-title">End Live?</div>
              <div className="lr-modal-body">
                Are you sure you want to end the live session for everyone?
              </div>
              <div className="lr-modal-actions">
                <button
                  className="lr-modal-cancel"
                  onClick={() => setShowEndModal(false)}
                >
                  Cancel
                </button>
                <button className="lr-modal-confirm" onClick={confirmEnd}>
                  End Live
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
