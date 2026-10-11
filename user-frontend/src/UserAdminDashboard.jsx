// // ══════════════════════════════════════════════════════════════════════════════
// // UserAdminDashboard.jsx  —  user-frontend/src/UserAdminDashboard.jsx
// //
// // ROUTE:  /user-admin   (add to user-frontend App.jsx)
// //   { path: "/user-admin", element: <UserAdminDashboard /> }
// //
// // PASSWORD:  <removed>
// // SESSION KEY:  rc_user_admin_key  (stored in sessionStorage)
// // ══════════════════════════════════════════════════════════════════════════════

// import { useState, useEffect, useCallback, useRef } from "react";

// // ── Constants ──────────────────────────────────────────────────────────────────
// const USER_ADMIN_PASSWORD = "<removed>";
// const SESSION_KEY = "rc_user_admin_key";
// const API_BASE = "/api/admin/users";

// // ── API helper ─────────────────────────────────────────────────────────────────
// function uaFetch(path, options = {}) {
//   return fetch(`${API_BASE}${path}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       "x-admin-key": sessionStorage.getItem(SESSION_KEY) || "",
//       ...(options.headers || {}),
//     },
//     body: options.body ? JSON.stringify(options.body) : undefined,
//   }).then((r) => r.json());
// }

// // ── Formatters ─────────────────────────────────────────────────────────────────
// function fmt(date) {
//   if (!date) return "—";
//   return new Date(date).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// }
// function fmtTime(date) {
//   if (!date) return "—";
//   return new Date(date).toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // SHARED UI PRIMITIVES
// // ══════════════════════════════════════════════════════════════════════════════

// const CHERRY = "#e63950";
// const CHERRY_DARK = "#c0273d";

// function Badge({ value }) {
//   const map = {
//     active: { bg: "#d1fae5", color: "#065f46", label: "ACTIVE" },
//     banned: { bg: "#fee2e2", color: "#991b1b", label: "BANNED" },
//     true: { bg: "#d1fae5", color: "#065f46", label: "ACTIVE" },
//     false: { bg: "#fee2e2", color: "#991b1b", label: "BANNED" },
//     credit: { bg: "#dbeafe", color: "#1e40af", label: "CREDIT" },
//     debit: { bg: "#fef3c7", color: "#92400e", label: "DEBIT" },
//     success: { bg: "#d1fae5", color: "#065f46", label: "SUCCESS" },
//     failed: { bg: "#fee2e2", color: "#991b1b", label: "FAILED" },
//     pending: { bg: "#fef3c7", color: "#92400e", label: "PENDING" },
//     under_review: { bg: "#dbeafe", color: "#1e40af", label: "REVIEWING" },
//     resolved: { bg: "#d1fae5", color: "#065f46", label: "RESOLVED" },
//     rejected: { bg: "#fee2e2", color: "#991b1b", label: "REJECTED" },
//   };
//   const key = String(value).toLowerCase();
//   const s = map[key] || {
//     bg: "#f3f4f6",
//     color: "#6b7280",
//     label: String(value).toUpperCase(),
//   };
//   return (
//     <span
//       style={{
//         background: s.bg,
//         color: s.color,
//         padding: "3px 10px",
//         borderRadius: 20,
//         fontSize: 10,
//         fontWeight: 700,
//         letterSpacing: 0.5,
//         whiteSpace: "nowrap",
//       }}
//     >
//       {s.label}
//     </span>
//   );
// }

// function Btn({
//   children,
//   onClick,
//   color = CHERRY,
//   outline = false,
//   small = false,
//   disabled = false,
//   fullWidth = false,
// }) {
//   const [hover, setHover] = useState(false);
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       onMouseEnter={() => setHover(true)}
//       onMouseLeave={() => setHover(false)}
//       style={{
//         padding: small ? "6px 14px" : "10px 20px",
//         borderRadius: 10,
//         border: outline ? `2px solid ${color}` : "none",
//         background: outline
//           ? hover
//             ? color + "15"
//             : "transparent"
//           : hover
//             ? CHERRY_DARK
//             : color,
//         color: outline ? color : "#fff",
//         fontWeight: 700,
//         fontSize: small ? 11 : 13,
//         cursor: disabled ? "not-allowed" : "pointer",
//         opacity: disabled ? 0.5 : 1,
//         transition: "all 0.15s",
//         width: fullWidth ? "100%" : undefined,
//         letterSpacing: 0.3,
//       }}
//     >
//       {children}
//     </button>
//   );
// }

// const TH = ({ children }) => (
//   <th
//     style={{
//       padding: "11px 14px",
//       textAlign: "left",
//       fontSize: 11,
//       fontWeight: 700,
//       color: "#9ca3af",
//       letterSpacing: 0.5,
//       borderBottom: "1px solid #e5e7eb",
//       background: "#f9fafb",
//       whiteSpace: "nowrap",
//       position: "sticky",
//       top: 0,
//     }}
//   >
//     {children}
//   </th>
// );

// const TD = ({ children, style = {} }) => (
//   <td
//     style={{
//       padding: "12px 14px",
//       fontSize: 13,
//       color: "#374151",
//       borderBottom: "1px solid #f3f4f6",
//       ...style,
//     }}
//   >
//     {children}
//   </td>
// );

// function Pagination({ page, total, limit, onPage }) {
//   const totalPages = Math.ceil(total / limit);
//   if (totalPages <= 1) return null;
//   return (
//     <div
//       style={{
//         display: "flex",
//         gap: 6,
//         alignItems: "center",
//         padding: "14px 0",
//         justifyContent: "flex-end",
//       }}
//     >
//       <Btn
//         small
//         outline
//         color="#6b7280"
//         disabled={page <= 1}
//         onClick={() => onPage(page - 1)}
//       >
//         ← Prev
//       </Btn>
//       <span style={{ fontSize: 13, color: "#6b7280", padding: "0 6px" }}>
//         Page <strong>{page}</strong> of <strong>{totalPages}</strong>
//         <span style={{ color: "#9ca3af", fontSize: 11, marginLeft: 8 }}>
//           ({total} total)
//         </span>
//       </span>
//       <Btn
//         small
//         outline
//         color="#6b7280"
//         disabled={page >= totalPages}
//         onClick={() => onPage(page + 1)}
//       >
//         Next →
//       </Btn>
//     </div>
//   );
// }

// function StatCard({ icon, label, value, color = CHERRY, sub }) {
//   return (
//     <div
//       style={{
//         background: "#fff",
//         borderRadius: 16,
//         padding: "20px 22px",
//         boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//         display: "flex",
//         alignItems: "center",
//         gap: 16,
//         flex: 1,
//         minWidth: 160,
//         borderTop: `3px solid ${color}`,
//       }}
//     >
//       <div
//         style={{
//           width: 48,
//           height: 48,
//           borderRadius: 14,
//           background: color + "18",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontSize: 22,
//           flexShrink: 0,
//         }}
//       >
//         {icon}
//       </div>
//       <div>
//         <div
//           style={{
//             fontSize: 24,
//             fontWeight: 900,
//             color: "#111",
//             lineHeight: 1.1,
//           }}
//         >
//           {value ?? "—"}
//         </div>
//         <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
//           {label}
//         </div>
//         {sub && (
//           <div
//             style={{
//               fontSize: 11,
//               color: color,
//               marginTop: 2,
//               fontWeight: 700,
//             }}
//           >
//             {sub}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // LOGIN PAGE
// // ══════════════════════════════════════════════════════════════════════════════
// function LoginPage({ onLogin }) {
//   const [password, setPassword] = useState("");
//   const [show, setShow] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [shake, setShake] = useState(false);

//   function handleSubmit() {
//     if (!password) return setError("Please enter the admin password.");
//     setLoading(true);
//     setError("");
//     setTimeout(() => {
//       if (password === USER_ADMIN_PASSWORD) {
//         sessionStorage.setItem(SESSION_KEY, password);
//         onLogin();
//       } else {
//         setError("Incorrect password. Try again.");
//         setShake(true);
//         setTimeout(() => setShake(false), 500);
//       }
//       setLoading(false);
//     }, 400);
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background:
//           "linear-gradient(135deg, #1a0a0e 0%, #2d0f1c 50%, #1a0a0e 100%)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontFamily: "'Segoe UI', system-ui, sans-serif",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* Background blobs */}
//       <div
//         style={{
//           position: "absolute",
//           width: 400,
//           height: 400,
//           borderRadius: "50%",
//           background:
//             "radial-gradient(circle, rgba(230,57,80,0.15) 0%, transparent 70%)",
//           top: "10%",
//           left: "10%",
//           pointerEvents: "none",
//         }}
//       />
//       <div
//         style={{
//           position: "absolute",
//           width: 300,
//           height: 300,
//           borderRadius: "50%",
//           background:
//             "radial-gradient(circle, rgba(230,57,80,0.1) 0%, transparent 70%)",
//           bottom: "15%",
//           right: "15%",
//           pointerEvents: "none",
//         }}
//       />

//       {/* Card */}
//       <div
//         style={{
//           background: "rgba(255,255,255,0.04)",
//           backdropFilter: "blur(20px)",
//           border: "1px solid rgba(255,255,255,0.08)",
//           borderRadius: 24,
//           padding: "44px 40px",
//           width: "100%",
//           maxWidth: 400,
//           boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
//           animation: shake ? "shake 0.4s ease" : "fadeIn 0.4s ease",
//           position: "relative",
//         }}
//       >
//         <style>{`
//           @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
//           @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
//         `}</style>

//         {/* Logo */}
//         {/* <div style={{ textAlign: "center", marginBottom: 32 }}>
//           <div
//             style={{
//               width: 70,
//               height: 70,
//               borderRadius: 20,
//               margin: "0 auto 14px",
//               background: "linear-gradient(135deg, #e63950, #ff6b85)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: 32,
//               boxShadow: "0 8px 24px rgba(230,57,80,0.4)",
//             }}
//           >
//             🍒
//           </div>
//           <h1
//             style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: 0 }}
//           >
//             User Admin Panel
//           </h1>
//           <p
//             style={{
//               color: "rgba(255,255,255,0.4)",
//               fontSize: 13,
//               marginTop: 6,
//             }}
//           >
//             Red Cherry Platform
//           </p>
//         </div> */}
//         {/* new */}
//         <div style={{ textAlign: "center", marginBottom: 32 }}>
//           <div style={{ margin: "0 auto 14px", width: 80, height: 80 }}>
//             <img
//               src="/user-logo.png"
//               alt="Red Cherry"
//               style={{ width: "100%", height: "100%", objectFit: "contain" }}
//             />
//           </div>
//           <h1
//             style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: 0 }}
//           >
//             User Admin Panel
//           </h1>
//           <p
//             style={{
//               color: "rgba(255,255,255,0.4)",
//               fontSize: 13,
//               marginTop: 6,
//             }}
//           >
//             Red Cherry Platform
//           </p>
//         </div>
//         {/* end */}

//         {/* Password field */}
//         <div style={{ marginBottom: 20 }}>
//           <label
//             style={{
//               display: "block",
//               color: "rgba(255,255,255,0.6)",
//               fontSize: 12,
//               fontWeight: 700,
//               marginBottom: 8,
//               letterSpacing: 0.5,
//             }}
//           >
//             ADMIN PASSWORD
//           </label>
//           <div style={{ position: "relative" }}>
//             <input
//               type={show ? "text" : "password"}
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//                 setError("");
//               }}
//               onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//               placeholder="Enter admin password"
//               autoFocus
//               style={{
//                 width: "100%",
//                 padding: "13px 44px 13px 16px",
//                 borderRadius: 12,
//                 border: error
//                   ? "1.5px solid #e63950"
//                   : "1.5px solid rgba(255,255,255,0.12)",
//                 background: "rgba(255,255,255,0.06)",
//                 color: "#fff",
//                 fontSize: 15,
//                 outline: "none",
//                 boxSizing: "border-box",
//                 transition: "border 0.2s",
//               }}
//             />
//             <button
//               onClick={() => setShow(!show)}
//               style={{
//                 position: "absolute",
//                 right: 12,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 color: "rgba(255,255,255,0.4)",
//                 fontSize: 16,
//                 padding: 4,
//               }}
//             >
//               {show ? "🙈" : "👁️"}
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div
//             style={{
//               background: "rgba(220,38,38,0.15)",
//               border: "1px solid rgba(220,38,38,0.3)",
//               color: "#fca5a5",
//               borderRadius: 10,
//               padding: "10px 14px",
//               fontSize: 13,
//               marginBottom: 16,
//               fontWeight: 600,
//             }}
//           >
//             ⚠️ {error}
//           </div>
//         )}

//         <button
//           onClick={handleSubmit}
//           disabled={loading || !password}
//           style={{
//             width: "100%",
//             padding: "14px",
//             background:
//               loading || !password
//                 ? "rgba(230,57,80,0.4)"
//                 : "linear-gradient(135deg, #e63950, #ff6b85)",
//             color: "#fff",
//             border: "none",
//             borderRadius: 12,
//             fontSize: 15,
//             fontWeight: 800,
//             cursor: loading || !password ? "not-allowed" : "pointer",
//             letterSpacing: 0.5,
//             transition: "all 0.2s",
//             boxShadow:
//               loading || !password ? "none" : "0 4px 16px rgba(230,57,80,0.4)",
//           }}
//         >
//           {loading ? "Verifying…" : "🔐 Sign In"}
//         </button>

//         <p
//           style={{
//             textAlign: "center",
//             color: "rgba(255,255,255,0.2)",
//             fontSize: 12,
//             marginTop: 24,
//             marginBottom: 0,
//           }}
//         >
//           🔒 Secure Admin Access · Red Cherry
//         </p>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // STATS TAB
// // ══════════════════════════════════════════════════════════════════════════════
// function StatsTab() {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     uaFetch("/stats").then((r) => {
//       if (r.success) setStats(r.stats);
//       setLoading(false);
//     });
//   }, []);

//   if (loading)
//     return (
//       <div style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>
//         Loading stats…
//       </div>
//     );
//   if (!stats)
//     return (
//       <div style={{ padding: 40, color: "#dc2626" }}>Failed to load stats.</div>
//     );

//   return (
//     <div>
//       <div
//         style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 24 }}
//       >
//         <StatCard
//           icon="👥"
//           label="Total Users"
//           value={stats.totalUsers?.toLocaleString()}
//           color="#6366f1"
//         />
//         <StatCard
//           icon="✅"
//           label="Active Users"
//           value={stats.activeUsers?.toLocaleString()}
//           color="#16a34a"
//         />
//         <StatCard
//           icon="🚫"
//           label="Banned Users"
//           value={stats.bannedUsers?.toLocaleString()}
//           color="#dc2626"
//         />
//         <StatCard
//           icon="💳"
//           label="Total Recharged"
//           value={`₹${(stats.totalRechargeRevenue || 0).toLocaleString("en-IN")}`}
//           color="#0ea5e9"
//         />
//         <StatCard
//           icon="📞"
//           label="Talktime Spent"
//           value={`₹${(stats.totalTalktimeDeducted || 0).toLocaleString("en-IN")}`}
//           color="#f59e0b"
//         />
//         <StatCard
//           icon="🚨"
//           label="Pending Grievances"
//           value={stats.pendingGrievances}
//           color={CHERRY}
//           sub={stats.pendingGrievances > 0 ? "Needs attention" : "All clear"}
//         />
//       </div>

//       {/* Quick summary */}
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 16,
//           padding: 24,
//           boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//         }}
//       >
//         <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>
//           📈 Quick Summary
//         </div>
//         <div
//           style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
//         >
//           {[
//             {
//               label: "Revenue collected via recharge",
//               value: `₹${(stats.totalRechargeRevenue || 0).toLocaleString("en-IN")}`,
//               color: "#16a34a",
//             },
//             {
//               label: "Talktime consumed by users",
//               value: `₹${(stats.totalTalktimeDeducted || 0).toLocaleString("en-IN")}`,
//               color: "#f59e0b",
//             },
//             {
//               label: "Balance remaining in wallets",
//               value: `₹${Math.max(0, (stats.totalRechargeRevenue || 0) - (stats.totalTalktimeDeducted || 0)).toLocaleString("en-IN")}`,
//               color: "#6366f1",
//             },
//             {
//               label: "Ban rate",
//               value: stats.totalUsers
//                 ? `${((stats.bannedUsers / stats.totalUsers) * 100).toFixed(1)}%`
//                 : "0%",
//               color: "#dc2626",
//             },
//           ].map((item) => (
//             <div
//               key={item.label}
//               style={{
//                 background: "#f9fafb",
//                 borderRadius: 12,
//                 padding: "14px 16px",
//                 borderLeft: `3px solid ${item.color}`,
//               }}
//             >
//               <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
//                 {item.label}
//               </div>
//               <div style={{ fontSize: 20, fontWeight: 800, color: item.color }}>
//                 {item.value}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // USER MODAL
// // ══════════════════════════════════════════════════════════════════════════════
// function UserModal({ userId, onClose, onRefresh }) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [balType, setBalType] = useState("credit");
//   const [balAmt, setBalAmt] = useState("");
//   const [balReason, setBalReason] = useState("");
//   const [balLoading, setBalLoading] = useState(false);
//   const [msg, setMsg] = useState(null);
//   const [txPage, setTxPage] = useState(0);
//   const TX_PER_PAGE = 10;

//   const load = useCallback(async () => {
//     setLoading(true);
//     const res = await uaFetch(`/${userId}`);
//     if (res.success) setData(res);
//     setLoading(false);
//   }, [userId]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   async function handleBan(ban) {
//     if (!confirm(`${ban ? "Ban" : "Unban"} this user?`)) return;
//     const res = await uaFetch(`/${userId}/ban`, {
//       method: "PATCH",
//       body: { ban },
//     });
//     setMsg(
//       res.success
//         ? { ok: true, text: res.message }
//         : { ok: false, text: res.message },
//     );
//     if (res.success) {
//       load();
//       onRefresh();
//     }
//   }

//   async function handleBalance() {
//     const amt = Number(balAmt);
//     if (!amt || amt <= 0)
//       return setMsg({ ok: false, text: "Enter a valid positive amount." });
//     if (!balReason.trim())
//       return setMsg({ ok: false, text: "Please enter a reason." });
//     setBalLoading(true);
//     const res = await uaFetch(`/${userId}/balance`, {
//       method: "PATCH",
//       body: { type: balType, amount: amt, reason: balReason },
//     });
//     setBalLoading(false);
//     setMsg(
//       res.success
//         ? { ok: true, text: res.message }
//         : { ok: false, text: res.message },
//     );
//     if (res.success) {
//       setBalAmt("");
//       setBalReason("");
//       load();
//       onRefresh();
//     }
//   }

//   const user = data?.user;
//   const txSlice =
//     data?.transactions?.slice(
//       txPage * TX_PER_PAGE,
//       (txPage + 1) * TX_PER_PAGE,
//     ) || [];
//   const txTotalPages = Math.ceil(
//     (data?.transactions?.length || 0) / TX_PER_PAGE,
//   );

//   return (
//     <div
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "rgba(0,0,0,0.5)",
//         zIndex: 1000,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 16,
//       }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 20,
//           width: "100%",
//           maxWidth: 720,
//           maxHeight: "92vh",
//           overflowY: "auto",
//           boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
//         }}
//       >
//         {/* Modal header */}
//         <div
//           style={{
//             padding: "18px 24px",
//             borderBottom: "1px solid #f3f4f6",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             position: "sticky",
//             top: 0,
//             background: "#fff",
//             zIndex: 2,
//             borderRadius: "20px 20px 0 0",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div
//               style={{
//                 width: 36,
//                 height: 36,
//                 borderRadius: 10,
//                 background: "linear-gradient(135deg, #e63950, #ff6b85)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: 18,
//               }}
//             >
//               👤
//             </div>
//             <div>
//               <div style={{ fontWeight: 800, fontSize: 16 }}>User Details</div>
//               {user && (
//                 <div style={{ fontSize: 11, color: "#9ca3af" }}>
//                   ID: {user._id}
//                 </div>
//               )}
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             style={{
//               background: "#f3f4f6",
//               border: "none",
//               width: 32,
//               height: 32,
//               borderRadius: "50%",
//               cursor: "pointer",
//               fontSize: 16,
//               color: "#6b7280",
//             }}
//           >
//             ×
//           </button>
//         </div>

//         {loading ? (
//           <div style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>
//             <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
//             Loading user data…
//           </div>
//         ) : !user ? (
//           <div style={{ padding: 40, textAlign: "center", color: "#dc2626" }}>
//             User not found.
//           </div>
//         ) : (
//           <div
//             style={{
//               padding: "22px 24px",
//               display: "flex",
//               flexDirection: "column",
//               gap: 22,
//             }}
//           >
//             {/* Profile header */}
//             <div
//               style={{
//                 background: "linear-gradient(135deg, #1a0a0e 0%, #2d0f1c 100%)",
//                 borderRadius: 16,
//                 padding: 20,
//                 display: "flex",
//                 gap: 16,
//                 alignItems: "flex-start",
//               }}
//             >
//               <div
//                 style={{
//                   width: 64,
//                   height: 64,
//                   borderRadius: 18,
//                   flexShrink: 0,
//                   background: "#fce7ef",
//                   overflow: "hidden",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 26,
//                   fontWeight: 900,
//                   color: CHERRY,
//                   border: "3px solid rgba(230,57,80,0.3)",
//                 }}
//               >
//                 {user.profilePicture ? (
//                   <img
//                     src={`https://redcheery.com${user.profilePicture}`}
//                     alt=""
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                     }}
//                     onError={(e) => {
//                       e.target.style.display = "none";
//                     }}
//                   />
//                 ) : (
//                   user.firstName?.[0] || "U"
//                 )}
//               </div>
//               <div style={{ flex: 1 }}>
//                 <div style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>
//                   {user.firstName} {user.lastName}
//                 </div>
//                 <div
//                   style={{
//                     color: "rgba(255,255,255,0.5)",
//                     fontSize: 13,
//                     marginTop: 2,
//                   }}
//                 >
//                   📱 {user.phoneNumber}
//                   {user.email && <> · ✉️ {user.email}</>}
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 6,
//                     marginTop: 8,
//                     flexWrap: "wrap",
//                   }}
//                 >
//                   <Badge value={user.isActive ? "active" : "banned"} />
//                   {user.gender && (
//                     <span
//                       style={{
//                         background: "rgba(255,255,255,0.1)",
//                         color: "rgba(255,255,255,0.7)",
//                         padding: "3px 8px",
//                         borderRadius: 20,
//                         fontSize: 11,
//                       }}
//                     >
//                       {user.gender}
//                     </span>
//                   )}
//                   {user.age && (
//                     <span
//                       style={{
//                         background: "rgba(255,255,255,0.1)",
//                         color: "rgba(255,255,255,0.7)",
//                         padding: "3px 8px",
//                         borderRadius: 20,
//                         fontSize: 11,
//                       }}
//                     >
//                       Age {user.age}
//                     </span>
//                   )}
//                   {user.isVerified && (
//                     <span
//                       style={{
//                         background: "rgba(34,197,94,0.2)",
//                         color: "#86efac",
//                         padding: "3px 8px",
//                         borderRadius: 20,
//                         fontSize: 11,
//                       }}
//                     >
//                       ✓ Verified
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div style={{ textAlign: "right" }}>
//                 <div
//                   style={{ color: "#ff6b85", fontSize: 30, fontWeight: 900 }}
//                 >
//                   ₹{(user.talktimeBalance || 0).toLocaleString("en-IN")}
//                 </div>
//                 <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
//                   Wallet Balance
//                 </div>
//               </div>
//             </div>

//             {/* Summary boxes */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
//                 gap: 10,
//               }}
//             >
//               {[
//                 { label: "Joined", value: fmt(user.createdAt), icon: "📅" },
//                 { label: "Last Login", value: fmt(user.lastLogin), icon: "🔑" },
//                 {
//                   label: "Total Recharged",
//                   value: `₹${(data.summary?.totalRecharged || 0).toLocaleString("en-IN")}`,
//                   icon: "💳",
//                   green: true,
//                 },
//                 {
//                   label: "Total Spent",
//                   value: `₹${(data.summary?.totalSpent || 0).toLocaleString("en-IN")}`,
//                   icon: "📞",
//                   amber: true,
//                 },
//               ].map((item) => (
//                 <div
//                   key={item.label}
//                   style={{
//                     background: item.green
//                       ? "#f0fdf4"
//                       : item.amber
//                         ? "#fffbeb"
//                         : "#f9fafb",
//                     borderRadius: 12,
//                     padding: "12px 14px",
//                   }}
//                 >
//                   <div style={{ fontSize: 11, color: "#9ca3af" }}>
//                     {item.icon} {item.label}
//                   </div>
//                   <div
//                     style={{
//                       fontWeight: 800,
//                       fontSize: 14,
//                       marginTop: 2,
//                       color: item.green
//                         ? "#16a34a"
//                         : item.amber
//                           ? "#d97706"
//                           : "#111",
//                     }}
//                   >
//                     {item.value}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Ban / Unban */}
//             <div style={{ display: "flex", gap: 10 }}>
//               {user.isActive ? (
//                 <Btn color="#dc2626" onClick={() => handleBan(true)}>
//                   🚫 Ban This User
//                 </Btn>
//               ) : (
//                 <Btn color="#16a34a" onClick={() => handleBan(false)}>
//                   ✅ Unban User
//                 </Btn>
//               )}
//             </div>

//             {/* Adjust Balance */}
//             <div
//               style={{
//                 background: "#f9fafb",
//                 borderRadius: 14,
//                 padding: 18,
//                 border: "1px solid #e5e7eb",
//               }}
//             >
//               <div
//                 style={{
//                   fontWeight: 800,
//                   marginBottom: 14,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                 }}
//               >
//                 <span style={{ fontSize: 18 }}>💰</span> Adjust Wallet Balance
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   gap: 10,
//                   flexWrap: "wrap",
//                   alignItems: "flex-end",
//                 }}
//               >
//                 <div>
//                   <div
//                     style={{
//                       fontSize: 11,
//                       color: "#9ca3af",
//                       marginBottom: 5,
//                       fontWeight: 700,
//                     }}
//                   >
//                     TYPE
//                   </div>
//                   <select
//                     value={balType}
//                     onChange={(e) => setBalType(e.target.value)}
//                     style={{
//                       padding: "9px 12px",
//                       borderRadius: 9,
//                       border: "1.5px solid #e5e7eb",
//                       fontSize: 13,
//                       background: "#fff",
//                       fontWeight: 700,
//                     }}
//                   >
//                     <option value="credit">➕ Credit</option>
//                     <option value="debit">➖ Debit</option>
//                   </select>
//                 </div>
//                 <div>
//                   <div
//                     style={{
//                       fontSize: 11,
//                       color: "#9ca3af",
//                       marginBottom: 5,
//                       fontWeight: 700,
//                     }}
//                   >
//                     AMOUNT (₹)
//                   </div>
//                   <input
//                     type="number"
//                     min="1"
//                     value={balAmt}
//                     onChange={(e) => setBalAmt(e.target.value)}
//                     placeholder="500"
//                     style={{
//                       padding: "9px 12px",
//                       borderRadius: 9,
//                       border: "1.5px solid #e5e7eb",
//                       width: 110,
//                       fontSize: 13,
//                     }}
//                   />
//                 </div>
//                 <div style={{ flex: 1, minWidth: 160 }}>
//                   <div
//                     style={{
//                       fontSize: 11,
//                       color: "#9ca3af",
//                       marginBottom: 5,
//                       fontWeight: 700,
//                     }}
//                   >
//                     REASON
//                   </div>
//                   <input
//                     value={balReason}
//                     onChange={(e) => setBalReason(e.target.value)}
//                     placeholder="Support refund, bonus, correction…"
//                     style={{
//                       padding: "9px 12px",
//                       borderRadius: 9,
//                       border: "1.5px solid #e5e7eb",
//                       width: "100%",
//                       fontSize: 13,
//                       boxSizing: "border-box",
//                     }}
//                   />
//                 </div>
//                 <Btn
//                   onClick={handleBalance}
//                   disabled={balLoading}
//                   color={balType === "credit" ? "#16a34a" : "#f59e0b"}
//                 >
//                   {balLoading ? "…" : balType === "credit" ? "Credit" : "Debit"}
//                 </Btn>
//               </div>
//             </div>

//             {/* Feedback message */}
//             {msg && (
//               <div
//                 style={{
//                   background: msg.ok ? "#d1fae5" : "#fee2e2",
//                   color: msg.ok ? "#065f46" : "#991b1b",
//                   borderRadius: 10,
//                   padding: "11px 16px",
//                   fontSize: 13,
//                   fontWeight: 700,
//                 }}
//               >
//                 {msg.ok ? "✅" : "❌"} {msg.text}
//               </div>
//             )}

//             {/* Transactions */}
//             <div>
//               <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}>
//                 📋 Transactions ({data.transactions?.length || 0})
//               </div>
//               {data.transactions?.length === 0 ? (
//                 <div
//                   style={{ color: "#9ca3af", fontSize: 13, padding: "16px 0" }}
//                 >
//                   No transactions yet.
//                 </div>
//               ) : (
//                 <>
//                   <div
//                     style={{
//                       overflowX: "auto",
//                       borderRadius: 12,
//                       border: "1px solid #e5e7eb",
//                     }}
//                   >
//                     <table
//                       style={{ width: "100%", borderCollapse: "collapse" }}
//                     >
//                       <thead>
//                         <tr>
//                           <TH>Type</TH>
//                           <TH>Amount</TH>
//                           <TH>Plan</TH>
//                           <TH>Status</TH>
//                           <TH>Description</TH>
//                           <TH>Date</TH>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {txSlice.map((t, i) => (
//                           <tr
//                             key={t._id}
//                             style={{
//                               background: i % 2 === 0 ? "#fff" : "#fafafa",
//                             }}
//                           >
//                             <TD>
//                               <Badge value={t.type} />
//                             </TD>
//                             <TD
//                               style={{
//                                 fontWeight: 800,
//                                 color:
//                                   t.type === "credit" ? "#16a34a" : "#dc2626",
//                               }}
//                             >
//                               {t.type === "credit" ? "+" : "−"}₹{t.amount}
//                             </TD>
//                             <TD style={{ fontSize: 12 }}>
//                               {t.planLabel || t.planId || "—"}
//                             </TD>
//                             <TD>
//                               <Badge value={t.status} />
//                             </TD>
//                             <TD
//                               style={{
//                                 maxWidth: 160,
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                                 whiteSpace: "nowrap",
//                                 fontSize: 12,
//                               }}
//                             >
//                               {t.description || "—"}
//                             </TD>
//                             <TD style={{ whiteSpace: "nowrap", fontSize: 12 }}>
//                               {fmtTime(t.createdAt)}
//                             </TD>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                   {txTotalPages > 1 && (
//                     <div
//                       style={{
//                         display: "flex",
//                         gap: 6,
//                         justifyContent: "flex-end",
//                         paddingTop: 8,
//                       }}
//                     >
//                       <Btn
//                         small
//                         outline
//                         color="#6b7280"
//                         disabled={txPage === 0}
//                         onClick={() => setTxPage((p) => p - 1)}
//                       >
//                         ← Prev
//                       </Btn>
//                       <span
//                         style={{
//                           fontSize: 12,
//                           color: "#9ca3af",
//                           alignSelf: "center",
//                         }}
//                       >
//                         Page {txPage + 1}/{txTotalPages}
//                       </span>
//                       <Btn
//                         small
//                         outline
//                         color="#6b7280"
//                         disabled={txPage >= txTotalPages - 1}
//                         onClick={() => setTxPage((p) => p + 1)}
//                       >
//                         Next →
//                       </Btn>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>

//             {/* Grievances */}
//             {data.grievances?.length > 0 && (
//               <div>
//                 <div
//                   style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}
//                 >
//                   🚨 Grievances ({data.grievances.length})
//                 </div>
//                 {data.grievances.map((g) => (
//                   <div
//                     key={g._id}
//                     style={{
//                       background: "#fef9f9",
//                       border: "1px solid #fecdd3",
//                       borderLeft: `4px solid ${CHERRY}`,
//                       borderRadius: 12,
//                       padding: "14px 16px",
//                       marginBottom: 10,
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginBottom: 6,
//                       }}
//                     >
//                       <div
//                         style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
//                       >
//                         {g.categories?.map((c) => (
//                           <span
//                             key={c}
//                             style={{
//                               background: "#fee2e2",
//                               color: "#991b1b",
//                               padding: "2px 8px",
//                               borderRadius: 12,
//                               fontSize: 11,
//                               fontWeight: 700,
//                             }}
//                           >
//                             {c}
//                           </span>
//                         ))}
//                       </div>
//                       <Badge value={g.status} />
//                     </div>
//                     <div style={{ fontSize: 13, color: "#374151" }}>
//                       {g.description}
//                     </div>
//                     {g.adminNote && (
//                       <div
//                         style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}
//                       >
//                         📝 {g.adminNote}
//                       </div>
//                     )}
//                     <div
//                       style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}
//                     >
//                       {fmtTime(g.createdAt)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // USERS TAB
// // ══════════════════════════════════════════════════════════════════════════════
// function UsersTab({ onRefresh }) {
//   const [users, setUsers] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     const p = new URLSearchParams({ page, limit: 20 });
//     if (search) p.set("search", search);
//     const res = await uaFetch(`/?${p}`);
//     if (res.success) {
//       setUsers(res.users);
//       setTotal(res.total);
//     }
//     setLoading(false);
//   }, [page, search]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   function doSearch(e) {
//     e.preventDefault();
//     setPage(1);
//     setSearch(searchInput.trim());
//   }

//   async function quickBan(id, ban, name) {
//     if (!confirm(`${ban ? "Ban" : "Unban"} ${name}?`)) return;
//     const res = await uaFetch(`/${id}/ban`, { method: "PATCH", body: { ban } });
//     if (res.success) {
//       load();
//       onRefresh();
//     } else alert("❌ " + res.message);
//   }

//   return (
//     <div>
//       {/* Search */}
//       <form
//         onSubmit={doSearch}
//         style={{ display: "flex", gap: 8, marginBottom: 18 }}
//       >
//         <input
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//           placeholder="🔍  Search by name or phone number…"
//           style={{
//             flex: 1,
//             padding: "10px 16px",
//             borderRadius: 11,
//             border: "1.5px solid #e5e7eb",
//             fontSize: 13,
//             outline: "none",
//             background: "#fafafa",
//           }}
//         />
//         <Btn onClick={() => {}}>Search</Btn>
//         {search && (
//           <Btn
//             outline
//             color="#6b7280"
//             onClick={() => {
//               setSearch("");
//               setSearchInput("");
//               setPage(1);
//             }}
//           >
//             ✕ Clear
//           </Btn>
//         )}
//       </form>

//       <div
//         style={{
//           overflowX: "auto",
//           borderRadius: 14,
//           border: "1px solid #e5e7eb",
//           background: "#fff",
//         }}
//       >
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <TH>User</TH>
//               <TH>Phone</TH>
//               <TH>Balance</TH>
//               <TH>Status</TH>
//               <TH>Joined</TH>
//               <TH>Last Login</TH>
//               <TH>Actions</TH>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td
//                   colSpan={7}
//                   style={{ padding: 50, textAlign: "center", color: "#9ca3af" }}
//                 >
//                   Loading users…
//                 </td>
//               </tr>
//             ) : users.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={7}
//                   style={{ padding: 50, textAlign: "center", color: "#9ca3af" }}
//                 >
//                   No users found{search ? ` for "${search}"` : ""}.
//                 </td>
//               </tr>
//             ) : (
//               users.map((u, i) => (
//                 <tr
//                   key={u._id}
//                   style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}
//                 >
//                   <TD>
//                     <div
//                       style={{ display: "flex", alignItems: "center", gap: 10 }}
//                     >
//                       <div
//                         style={{
//                           width: 38,
//                           height: 38,
//                           borderRadius: 12,
//                           flexShrink: 0,
//                           overflow: "hidden",
//                           background: "#fce7ef",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           fontWeight: 800,
//                           color: CHERRY,
//                           fontSize: 15,
//                         }}
//                       >
//                         {u.profilePicture ? (
//                           <img
//                             src={`https://redcheery.com${u.profilePicture}`}
//                             alt=""
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               objectFit: "cover",
//                             }}
//                             onError={(e) => {
//                               e.target.style.display = "none";
//                             }}
//                           />
//                         ) : (
//                           u.firstName?.[0] || "U"
//                         )}
//                       </div>
//                       <div>
//                         <div style={{ fontWeight: 700, fontSize: 13 }}>
//                           {u.firstName} {u.lastName}
//                         </div>
//                         {u.email && (
//                           <div style={{ fontSize: 11, color: "#9ca3af" }}>
//                             {u.email}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </TD>
//                   <TD style={{ fontFamily: "monospace", fontSize: 12 }}>
//                     {u.phoneNumber}
//                   </TD>
//                   <TD style={{ fontWeight: 800, color: "#0ea5e9" }}>
//                     ₹{(u.talktimeBalance || 0).toLocaleString("en-IN")}
//                   </TD>
//                   <TD>
//                     <Badge value={u.isActive ? "active" : "banned"} />
//                   </TD>
//                   <TD style={{ whiteSpace: "nowrap", fontSize: 12 }}>
//                     {fmt(u.createdAt)}
//                   </TD>
//                   <TD style={{ whiteSpace: "nowrap", fontSize: 12 }}>
//                     {fmt(u.lastLogin)}
//                   </TD>
//                   <TD>
//                     <div style={{ display: "flex", gap: 6 }}>
//                       <Btn small onClick={() => setSelectedId(u._id)}>
//                         View
//                       </Btn>
//                       {u.isActive ? (
//                         <Btn
//                           small
//                           outline
//                           color="#dc2626"
//                           onClick={() => quickBan(u._id, true, u.firstName)}
//                         >
//                           Ban
//                         </Btn>
//                       ) : (
//                         <Btn
//                           small
//                           outline
//                           color="#16a34a"
//                           onClick={() => quickBan(u._id, false, u.firstName)}
//                         >
//                           Unban
//                         </Btn>
//                       )}
//                     </div>
//                   </TD>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <Pagination page={page} total={total} limit={20} onPage={setPage} />

//       {selectedId && (
//         <UserModal
//           userId={selectedId}
//           onClose={() => setSelectedId(null)}
//           onRefresh={() => {
//             load();
//             onRefresh();
//           }}
//         />
//       )}
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // TRANSACTIONS TAB
// // ══════════════════════════════════════════════════════════════════════════════
// function TransactionsTab() {
//   const [txns, setTxns] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [typeF, setTypeF] = useState("");
//   const [statusF, setStatusF] = useState("");
//   const [uidInput, setUidInput] = useState("");
//   const [uidFilter, setUidFilter] = useState("");
//   const [loading, setLoading] = useState(false);

//   const load = useCallback(async () => {
//     setLoading(true);
//     const p = new URLSearchParams({ page, limit: 30 });
//     if (typeF) p.set("type", typeF);
//     if (statusF) p.set("status", statusF);
//     if (uidFilter) p.set("userId", uidFilter);
//     const res = await uaFetch(`/transactions?${p}`);
//     if (res.success) {
//       setTxns(res.transactions);
//       setTotal(res.total);
//     }
//     setLoading(false);
//   }, [page, typeF, statusF, uidFilter]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const selStyle = {
//     padding: "9px 12px",
//     borderRadius: 10,
//     border: "1.5px solid #e5e7eb",
//     fontSize: 13,
//     background: "#fff",
//     cursor: "pointer",
//   };

//   const hasFilter = typeF || statusF || uidFilter;

//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           gap: 8,
//           flexWrap: "wrap",
//           marginBottom: 18,
//           alignItems: "center",
//         }}
//       >
//         <select
//           value={typeF}
//           onChange={(e) => {
//             setTypeF(e.target.value);
//             setPage(1);
//           }}
//           style={selStyle}
//         >
//           <option value="">All Types</option>
//           <option value="credit">Credit</option>
//           <option value="debit">Debit</option>
//         </select>
//         <select
//           value={statusF}
//           onChange={(e) => {
//             setStatusF(e.target.value);
//             setPage(1);
//           }}
//           style={selStyle}
//         >
//           <option value="">All Statuses</option>
//           <option value="success">Success</option>
//           <option value="failed">Failed</option>
//           <option value="pending">Pending</option>
//         </select>
//         <input
//           value={uidInput}
//           onChange={(e) => setUidInput(e.target.value)}
//           placeholder="Filter by User ID…"
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               setUidFilter(uidInput.trim());
//               setPage(1);
//             }
//           }}
//           style={{ ...selStyle, flex: 1, minWidth: 180 }}
//         />
//         <Btn
//           small
//           onClick={() => {
//             setUidFilter(uidInput.trim());
//             setPage(1);
//           }}
//         >
//           Apply
//         </Btn>
//         {hasFilter && (
//           <Btn
//             small
//             outline
//             color="#6b7280"
//             onClick={() => {
//               setTypeF("");
//               setStatusF("");
//               setUidFilter("");
//               setUidInput("");
//               setPage(1);
//             }}
//           >
//             ✕ Reset
//           </Btn>
//         )}
//       </div>

//       <div
//         style={{
//           overflowX: "auto",
//           borderRadius: 14,
//           border: "1px solid #e5e7eb",
//           background: "#fff",
//         }}
//       >
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <TH>User</TH>
//               <TH>Type</TH>
//               <TH>Amount</TH>
//               <TH>Plan</TH>
//               <TH>Status</TH>
//               <TH>Description</TH>
//               <TH>Razorpay ID</TH>
//               <TH>Date</TH>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td
//                   colSpan={8}
//                   style={{ padding: 50, textAlign: "center", color: "#9ca3af" }}
//                 >
//                   Loading…
//                 </td>
//               </tr>
//             ) : txns.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={8}
//                   style={{ padding: 50, textAlign: "center", color: "#9ca3af" }}
//                 >
//                   No transactions found.
//                 </td>
//               </tr>
//             ) : (
//               txns.map((t, i) => (
//                 <tr
//                   key={t._id}
//                   style={{
//                     background:
//                       t.type === "credit"
//                         ? "#f0fdf4"
//                         : i % 2 === 0
//                           ? "#fff"
//                           : "#fafafa",
//                   }}
//                 >
//                   <TD>
//                     {t.user ? (
//                       <div>
//                         <div style={{ fontWeight: 700, fontSize: 12 }}>
//                           {t.user.firstName} {t.user.lastName}
//                         </div>
//                         <div
//                           style={{
//                             fontSize: 11,
//                             color: "#9ca3af",
//                             fontFamily: "monospace",
//                           }}
//                         >
//                           {t.user.phoneNumber}
//                         </div>
//                       </div>
//                     ) : (
//                       <span
//                         style={{
//                           fontSize: 11,
//                           color: "#9ca3af",
//                           fontFamily: "monospace",
//                         }}
//                       >
//                         …{String(t.userId).slice(-8)}
//                       </span>
//                     )}
//                   </TD>
//                   <TD>
//                     <Badge value={t.type} />
//                   </TD>
//                   <TD
//                     style={{
//                       fontWeight: 900,
//                       color: t.type === "credit" ? "#16a34a" : "#dc2626",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {t.type === "credit" ? "+" : "−"}₹{t.amount}
//                   </TD>
//                   <TD style={{ fontSize: 12 }}>
//                     {t.planLabel || t.planId || "—"}
//                   </TD>
//                   <TD>
//                     <Badge value={t.status} />
//                   </TD>
//                   <TD
//                     style={{
//                       fontSize: 12,
//                       maxWidth: 160,
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {t.description || "—"}
//                   </TD>
//                   <TD
//                     style={{
//                       fontSize: 11,
//                       color: "#9ca3af",
//                       fontFamily: "monospace",
//                     }}
//                   >
//                     {t.razorpayPaymentId
//                       ? `…${t.razorpayPaymentId.slice(-8)}`
//                       : "—"}
//                   </TD>
//                   <TD style={{ whiteSpace: "nowrap", fontSize: 12 }}>
//                     {fmtTime(t.createdAt)}
//                   </TD>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//       <Pagination page={page} total={total} limit={30} onPage={setPage} />
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // GRIEVANCES TAB
// // ══════════════════════════════════════════════════════════════════════════════
// function GrievancesTab() {
//   const [list, setList] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [statusF, setStatusF] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [editing, setEditing] = useState({});
//   const [saving, setSaving] = useState({});

//   const load = useCallback(async () => {
//     setLoading(true);
//     const p = new URLSearchParams({ page, limit: 15 });
//     if (statusF) p.set("status", statusF);
//     const res = await uaFetch(`/grievances?${p}`);
//     if (res.success) {
//       setList(res.grievances);
//       setTotal(res.total);
//     }
//     setLoading(false);
//   }, [page, statusF]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   function getEdit(g) {
//     return editing[g._id] ?? { status: g.status, adminNote: g.adminNote || "" };
//   }
//   function setField(id, field, val) {
//     setEditing((prev) => ({
//       ...prev,
//       [id]: {
//         ...getEdit({ _id: id, status: "", adminNote: "" }),
//         ...prev[id],
//         [field]: val,
//       },
//     }));
//   }

//   async function save(g) {
//     const e = getEdit(g);
//     setSaving((p) => ({ ...p, [g._id]: true }));
//     const res = await uaFetch(`/grievances/${g._id}`, {
//       method: "PATCH",
//       body: { status: e.status, adminNote: e.adminNote },
//     });
//     setSaving((p) => ({ ...p, [g._id]: false }));
//     if (res.success) {
//       load();
//       setEditing((p) => {
//         const n = { ...p };
//         delete n[g._id];
//         return n;
//       });
//     } else alert("❌ " + res.message);
//   }

//   const STATUS_TABS = [
//     { value: "", label: "All" },
//     { value: "pending", label: "🟡 Pending" },
//     { value: "under_review", label: "🔵 Reviewing" },
//     { value: "resolved", label: "🟢 Resolved" },
//     { value: "rejected", label: "🔴 Rejected" },
//   ];

//   const BORDER_COLORS = {
//     pending: "#f59e0b",
//     under_review: "#3b82f6",
//     resolved: "#16a34a",
//     rejected: "#dc2626",
//   };

//   return (
//     <div>
//       {/* Filter tabs */}
//       <div
//         style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}
//       >
//         {STATUS_TABS.map((s) => (
//           <button
//             key={s.value}
//             onClick={() => {
//               setStatusF(s.value);
//               setPage(1);
//             }}
//             style={{
//               padding: "8px 16px",
//               borderRadius: 20,
//               border: "none",
//               background: statusF === s.value ? CHERRY : "#f3f4f6",
//               color: statusF === s.value ? "#fff" : "#6b7280",
//               fontWeight: 700,
//               fontSize: 12,
//               cursor: "pointer",
//               transition: "all 0.15s",
//             }}
//           >
//             {s.label}
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <div style={{ padding: 50, textAlign: "center", color: "#9ca3af" }}>
//           Loading…
//         </div>
//       ) : list.length === 0 ? (
//         <div style={{ padding: 50, textAlign: "center", color: "#9ca3af" }}>
//           No grievances found.
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//           {list.map((g) => {
//             const e = getEdit(g);
//             const borderColor = BORDER_COLORS[g.status] || "#e5e7eb";
//             return (
//               <div
//                 key={g._id}
//                 style={{
//                   background: "#fff",
//                   borderRadius: 16,
//                   border: "1px solid #e5e7eb",
//                   borderLeft: `5px solid ${borderColor}`,
//                   padding: "18px 20px",
//                   boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
//                 }}
//               >
//                 {/* Top row */}
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     flexWrap: "wrap",
//                     gap: 8,
//                     marginBottom: 10,
//                   }}
//                 >
//                   <div>
//                     <span style={{ fontWeight: 800, fontSize: 15 }}>
//                       {g.firstName} {g.lastName}
//                     </span>
//                     <span
//                       style={{ fontSize: 12, color: "#9ca3af", marginLeft: 10 }}
//                     >
//                       📱 {g.phone}
//                     </span>
//                     {g.email && (
//                       <span
//                         style={{
//                           fontSize: 12,
//                           color: "#9ca3af",
//                           marginLeft: 10,
//                         }}
//                       >
//                         ✉️ {g.email}
//                       </span>
//                     )}
//                     {g.appUserId && (
//                       <span
//                         style={{
//                           fontSize: 11,
//                           color: "#9ca3af",
//                           marginLeft: 10,
//                         }}
//                       >
//                         🆔 {g.appUserId}
//                       </span>
//                     )}
//                   </div>
//                   <div
//                     style={{ display: "flex", gap: 6, alignItems: "center" }}
//                   >
//                     <Badge value={g.status} />
//                     <span style={{ fontSize: 11, color: "#9ca3af" }}>
//                       {fmtTime(g.createdAt)}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Category pills */}
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 6,
//                     flexWrap: "wrap",
//                     marginBottom: 10,
//                   }}
//                 >
//                   {g.categories?.map((c) => (
//                     <span
//                       key={c}
//                       style={{
//                         background: "#fef2f2",
//                         color: "#b91c1c",
//                         padding: "3px 10px",
//                         borderRadius: 12,
//                         fontSize: 11,
//                         fontWeight: 700,
//                         border: "1px solid #fecaca",
//                       }}
//                     >
//                       {c}
//                     </span>
//                   ))}
//                 </div>

//                 {/* Description */}
//                 <p
//                   style={{
//                     fontSize: 13,
//                     color: "#374151",
//                     lineHeight: 1.6,
//                     margin: "0 0 10px",
//                   }}
//                 >
//                   {g.description}
//                 </p>

//                 {/* Evidence */}
//                 {g.evidenceFile && (
//                   <a
//                     href={`https://redcheery.com${g.evidenceFile}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{
//                       display: "inline-flex",
//                       alignItems: "center",
//                       gap: 4,
//                       fontSize: 12,
//                       color: "#0ea5e9",
//                       marginBottom: 12,
//                       fontWeight: 700,
//                     }}
//                   >
//                     📎 View Attached Evidence ↗
//                   </a>
//                 )}

//                 {/* Existing admin note */}
//                 {g.adminNote && !editing[g._id] && (
//                   <div
//                     style={{
//                       background: "#f9fafb",
//                       borderRadius: 10,
//                       padding: "10px 14px",
//                       fontSize: 12,
//                       color: "#6b7280",
//                       marginBottom: 12,
//                       borderLeft: "3px solid #e5e7eb",
//                     }}
//                   >
//                     📝 <strong>Admin Note:</strong> {g.adminNote}
//                   </div>
//                 )}

//                 {/* Edit controls */}
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 10,
//                     flexWrap: "wrap",
//                     alignItems: "flex-end",
//                   }}
//                 >
//                   <div>
//                     <div
//                       style={{
//                         fontSize: 11,
//                         color: "#9ca3af",
//                         fontWeight: 700,
//                         marginBottom: 4,
//                       }}
//                     >
//                       STATUS
//                     </div>
//                     <select
//                       value={e.status}
//                       onChange={(ev) =>
//                         setField(g._id, "status", ev.target.value)
//                       }
//                       style={{
//                         padding: "8px 12px",
//                         borderRadius: 9,
//                         border: "1.5px solid #e5e7eb",
//                         fontSize: 13,
//                         background: "#fff",
//                       }}
//                     >
//                       <option value="pending">🟡 Pending</option>
//                       <option value="under_review">🔵 Under Review</option>
//                       <option value="resolved">🟢 Resolved</option>
//                       <option value="rejected">🔴 Rejected</option>
//                     </select>
//                   </div>
//                   <div style={{ flex: 1, minWidth: 200 }}>
//                     <div
//                       style={{
//                         fontSize: 11,
//                         color: "#9ca3af",
//                         fontWeight: 700,
//                         marginBottom: 4,
//                       }}
//                     >
//                       ADMIN NOTE
//                     </div>
//                     <input
//                       value={e.adminNote}
//                       onChange={(ev) =>
//                         setField(g._id, "adminNote", ev.target.value)
//                       }
//                       placeholder="Add a note for this grievance…"
//                       style={{
//                         padding: "8px 12px",
//                         borderRadius: 9,
//                         border: "1.5px solid #e5e7eb",
//                         width: "100%",
//                         fontSize: 13,
//                         boxSizing: "border-box",
//                       }}
//                     />
//                   </div>
//                   <Btn onClick={() => save(g)} disabled={saving[g._id]}>
//                     {saving[g._id] ? "Saving…" : "💾 Save"}
//                   </Btn>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//       <Pagination page={page} total={total} limit={15} onPage={setPage} />
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // MAIN DASHBOARD (after login)
// // ══════════════════════════════════════════════════════════════════════════════
// function Dashboard({ onLogout }) {
//   const [tab, setTab] = useState("stats");
//   const [statsKey, setStatsKey] = useState(0); // bump to refresh stats

//   const TABS = [
//     { id: "stats", icon: "📊", label: "Stats" },
//     { id: "users", icon: "👥", label: "Users" },
//     { id: "transactions", icon: "💳", label: "Transactions" },
//     { id: "grievances", icon: "🚨", label: "Grievances" },
//   ];

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#f8f9fb",
//         fontFamily: "'Segoe UI', system-ui, sans-serif",
//       }}
//     >
//       {/* Top navbar */}
//       <div
//         style={{
//           background: "#fff",
//           borderBottom: "1px solid #e5e7eb",
//           padding: "0 24px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           height: 60,
//           position: "sticky",
//           top: 0,
//           zIndex: 100,
//           boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <div
//             style={{
//               width: 44,
//               height: 44,
//               borderRadius: 10,
//               overflow: "hidden",
//               flexShrink: 0,
//             }}
//           >
//             <img
//               src="/user-logo.png"
//               alt="Red Cherry"
//               style={{ width: "100%", height: "100%", objectFit: "contain" }}
//             />
//           </div>
//           <div>
//             <div style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>
//               Red Cherry
//             </div>
//             <div style={{ fontSize: 11, color: "#9ca3af", marginTop: -2 }}>
//               User Admin Panel
//             </div>
//           </div>
//         </div>
//         <button
//           onClick={onLogout}
//           style={{
//             padding: "8px 16px",
//             borderRadius: 10,
//             border: "1.5px solid #e5e7eb",
//             background: "#fff",
//             color: "#6b7280",
//             fontWeight: 700,
//             fontSize: 13,
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//           }}
//         >
//           🚪 Logout
//         </button>
//       </div>
//       {/* end */}

//       <div
//         style={{
//           display: "flex",
//           maxWidth: 1280,
//           margin: "0 auto",
//           padding: "24px 20px",
//           gap: 20,
//         }}
//       >
//         {/* Sidebar */}
//         <div style={{ width: 200, flexShrink: 0 }}>
//           <nav
//             style={{
//               background: "#fff",
//               borderRadius: 16,
//               border: "1px solid #e5e7eb",
//               overflow: "hidden",
//               boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
//             }}
//           >
//             {TABS.map((t, i) => (
//               <button
//                 key={t.id}
//                 onClick={() => setTab(t.id)}
//                 style={{
//                   width: "100%",
//                   padding: "14px 18px",
//                   border: "none",
//                   borderBottom:
//                     i < TABS.length - 1 ? "1px solid #f3f4f6" : "none",
//                   background: tab === t.id ? "#fff5f6" : "#fff",
//                   color: tab === t.id ? CHERRY : "#6b7280",
//                   fontWeight: tab === t.id ? 800 : 600,
//                   fontSize: 13,
//                   cursor: "pointer",
//                   textAlign: "left",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 10,
//                   borderLeft:
//                     tab === t.id
//                       ? `3px solid ${CHERRY}`
//                       : "3px solid transparent",
//                   transition: "all 0.15s",
//                 }}
//               >
//                 <span style={{ fontSize: 16 }}>{t.icon}</span>
//                 {t.label}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Main content */}
//         <div style={{ flex: 1, minWidth: 0 }}>
//           {/* Page title */}
//           <div style={{ marginBottom: 20 }}>
//             <h2
//               style={{
//                 margin: 0,
//                 fontSize: 22,
//                 fontWeight: 900,
//                 color: "#111",
//               }}
//             >
//               {TABS.find((t) => t.id === tab)?.icon}{" "}
//               {TABS.find((t) => t.id === tab)?.label}
//             </h2>
//             <p style={{ margin: "4px 0 0", color: "#9ca3af", fontSize: 13 }}>
//               {tab === "stats" && "Platform overview and key metrics"}
//               {tab === "users" && "Manage user accounts, balances and bans"}
//               {tab === "transactions" &&
//                 "View all recharge and talktime transactions"}
//               {tab === "grievances" && "Review and respond to user complaints"}
//             </p>
//           </div>

//           {tab === "stats" && <StatsTab key={statsKey} />}
//           {tab === "users" && (
//             <UsersTab onRefresh={() => setStatsKey((k) => k + 1)} />
//           )}
//           {tab === "transactions" && <TransactionsTab />}
//           {tab === "grievances" && <GrievancesTab />}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // ROOT EXPORT — handles login gate
// // ══════════════════════════════════════════════════════════════════════════════
// export default function UserAdminDashboard() {
//   const [authed, setAuthed] = useState(
//     () => sessionStorage.getItem(SESSION_KEY) === USER_ADMIN_PASSWORD,
//   );

//   function handleLogin() {
//     setAuthed(true);
//   }

//   function handleLogout() {
//     sessionStorage.removeItem(SESSION_KEY);
//     setAuthed(false);
//   }

//   if (!authed) return <LoginPage onLogin={handleLogin} />;
//   return <Dashboard onLogout={handleLogout} />;
// }

//v2 =manaualy
// ══════════════════════════════════════════════════════════════════════════════
// UserAdminDashboard.jsx  —  user-frontend/src/UserAdminDashboard.jsx
//
// ROUTE:  /user-admin   (add to user-frontend App.jsx)
//   { path: "/user-admin", element: <UserAdminDashboard /> }
//
// PASSWORD:  <removed>
// SESSION KEY:  rc_user_admin_key  (stored in sessionStorage)
// ══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from "react";

// ── Constants ──────────────────────────────────────────────────────────────────
// Holds the session token from POST /api/admin/users/login (the username and
// password are checked by the backend, never stored here).
const SESSION_KEY = "rc_user_admin_key";
const API_BASE = "/api/admin/users";

// ── API helper ─────────────────────────────────────────────────────────────────
function uaFetch(path, options = {}) {
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": sessionStorage.getItem(SESSION_KEY) || "",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  }).then((r) => {
    // Session expired (12h) — back to the login page
    if (r.status === 401 && sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.removeItem(SESSION_KEY);
      window.location.reload();
    }
    return r.json();
  });
}

// ── Formatters ─────────────────────────────────────────────────────────────────
function fmt(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function fmtTime(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SHARED UI PRIMITIVES
// ══════════════════════════════════════════════════════════════════════════════

const CHERRY = "#e63950";
const CHERRY_DARK = "#c0273d";

function Badge({ value }) {
  const map = {
    active: { bg: "#d1fae5", color: "#065f46", label: "ACTIVE" },
    banned: { bg: "#fee2e2", color: "#991b1b", label: "BANNED" },
    true: { bg: "#d1fae5", color: "#065f46", label: "ACTIVE" },
    false: { bg: "#fee2e2", color: "#991b1b", label: "BANNED" },
    credit: { bg: "#dbeafe", color: "#1e40af", label: "CREDIT" },
    debit: { bg: "#fef3c7", color: "#92400e", label: "DEBIT" },
    success: { bg: "#d1fae5", color: "#065f46", label: "SUCCESS" },
    failed: { bg: "#fee2e2", color: "#991b1b", label: "FAILED" },
    pending: { bg: "#fef3c7", color: "#92400e", label: "PENDING" },
    under_review: { bg: "#dbeafe", color: "#1e40af", label: "REVIEWING" },
    resolved: { bg: "#d1fae5", color: "#065f46", label: "RESOLVED" },
    rejected: { bg: "#fee2e2", color: "#991b1b", label: "REJECTED" },
  };
  const key = String(value).toLowerCase();
  const s = map[key] || {
    bg: "#f3f4f6",
    color: "#6b7280",
    label: String(value).toUpperCase(),
  };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.5,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

function Btn({
  children,
  onClick,
  color = CHERRY,
  outline = false,
  small = false,
  disabled = false,
  fullWidth = false,
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: small ? "6px 14px" : "10px 20px",
        borderRadius: 10,
        border: outline ? `2px solid ${color}` : "none",
        background: outline
          ? hover
            ? color + "15"
            : "transparent"
          : hover
            ? CHERRY_DARK
            : color,
        color: outline ? color : "#fff",
        fontWeight: 700,
        fontSize: small ? 11 : 13,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s",
        width: fullWidth ? "100%" : undefined,
        letterSpacing: 0.3,
      }}
    >
      {children}
    </button>
  );
}

const TH = ({ children }) => (
  <th
    style={{
      padding: "11px 14px",
      textAlign: "left",
      fontSize: 11,
      fontWeight: 700,
      color: "#9ca3af",
      letterSpacing: 0.5,
      borderBottom: "1px solid #e5e7eb",
      background: "#f9fafb",
      whiteSpace: "nowrap",
      position: "sticky",
      top: 0,
    }}
  >
    {children}
  </th>
);

const TD = ({ children, style = {} }) => (
  <td
    style={{
      padding: "12px 14px",
      fontSize: 13,
      color: "#374151",
      borderBottom: "1px solid #f3f4f6",
      ...style,
    }}
  >
    {children}
  </td>
);

function Pagination({ page, total, limit, onPage }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        alignItems: "center",
        padding: "14px 0",
        justifyContent: "flex-end",
      }}
    >
      <Btn
        small
        outline
        color="#6b7280"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      >
        ← Prev
      </Btn>
      <span style={{ fontSize: 13, color: "#6b7280", padding: "0 6px" }}>
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        <span style={{ color: "#9ca3af", fontSize: 11, marginLeft: 8 }}>
          ({total} total)
        </span>
      </span>
      <Btn
        small
        outline
        color="#6b7280"
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
      >
        Next →
      </Btn>
    </div>
  );
}

function StatCard({ icon, label, value, color = CHERRY, sub }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "20px 22px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        gap: 16,
        flex: 1,
        minWidth: 160,
        borderTop: `3px solid ${color}`,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: color + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: "#111",
            lineHeight: 1.1,
          }}
        >
          {value ?? "—"}
        </div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
          {label}
        </div>
        {sub && (
          <div
            style={{
              fontSize: 11,
              color: color,
              marginTop: 2,
              fontWeight: 700,
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  async function handleSubmit() {
    if (!username.trim()) return setError("Please enter the admin username.");
    if (!password) return setError("Please enter the admin password.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.token)
        throw new Error(data.message || "Incorrect username or password.");
      sessionStorage.setItem(SESSION_KEY, data.token);
      onLogin();
    } catch (err) {
      setError(err.message || "Network error. Try again.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1a0a0e 0%, #2d0f1c 50%, #1a0a0e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(230,57,80,0.15) 0%, transparent 70%)",
          top: "10%",
          left: "10%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(230,57,80,0.1) 0%, transparent 70%)",
          bottom: "15%",
          right: "15%",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: "44px 40px",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
          animation: shake ? "shake 0.4s ease" : "fadeIn 0.4s ease",
          position: "relative",
        }}
      >
        <style>{`
          @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        `}</style>

        {/* Logo */}
        {/* <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 20,
              margin: "0 auto 14px",
              background: "linear-gradient(135deg, #e63950, #ff6b85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              boxShadow: "0 8px 24px rgba(230,57,80,0.4)",
            }}
          >
            🍒
          </div>
          <h1
            style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: 0 }}
          >
            User Admin Panel
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 13,
              marginTop: 6,
            }}
          >
            Red Cherry Platform
          </p>
        </div> */}
        {/* new */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ margin: "0 auto 14px", width: 80, height: 80 }}>
            <img
              src="/user-logo.png"
              alt="Red Cherry"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <h1
            style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: 0 }}
          >
            User Admin Panel
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 13,
              marginTop: 6,
            }}
          >
            Red Cherry Platform
          </p>
        </div>
        {/* end */}

        {/* Username field */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              color: "rgba(255,255,255,0.6)",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 8,
              letterSpacing: 0.5,
            }}
          >
            ADMIN USERNAME
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Enter admin username"
            autoComplete="username"
            autoFocus
            style={{
              width: "100%",
              padding: "13px 16px",
              borderRadius: 12,
              border: error
                ? "1.5px solid #e63950"
                : "1.5px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              fontSize: 15,
              outline: "none",
              boxSizing: "border-box",
              transition: "border 0.2s",
            }}
          />
        </div>

        {/* Password field */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              color: "rgba(255,255,255,0.6)",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 8,
              letterSpacing: 0.5,
            }}
          >
            ADMIN PASSWORD
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Enter admin password"
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "13px 44px 13px 16px",
                borderRadius: 12,
                border: error
                  ? "1.5px solid #e63950"
                  : "1.5px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
                transition: "border 0.2s",
              }}
            />
            <button
              onClick={() => setShow(!show)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.4)",
                fontSize: 16,
                padding: 4,
              }}
            >
              {show ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(220,38,38,0.15)",
              border: "1px solid rgba(220,38,38,0.3)",
              color: "#fca5a5",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 13,
              marginBottom: 16,
              fontWeight: 600,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !username || !password}
          style={{
            width: "100%",
            padding: "14px",
            background:
              loading || !username || !password
                ? "rgba(230,57,80,0.4)"
                : "linear-gradient(135deg, #e63950, #ff6b85)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 800,
            cursor: loading || !username || !password ? "not-allowed" : "pointer",
            letterSpacing: 0.5,
            transition: "all 0.2s",
            boxShadow:
              loading || !username || !password ? "none" : "0 4px 16px rgba(230,57,80,0.4)",
          }}
        >
          {loading ? "Verifying…" : "🔐 Sign In"}
        </button>

        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.2)",
            fontSize: 12,
            marginTop: 24,
            marginBottom: 0,
          }}
        >
          🔒 Secure Admin Access · Red Cherry
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STATS TAB
// ══════════════════════════════════════════════════════════════════════════════
function StatsTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    uaFetch("/stats").then((r) => {
      if (r.success) setStats(r.stats);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>
        Loading stats…
      </div>
    );
  if (!stats)
    return (
      <div style={{ padding: 40, color: "#dc2626" }}>Failed to load stats.</div>
    );

  return (
    <div>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 24 }}
      >
        <StatCard
          icon="👥"
          label="Total Users"
          value={stats.totalUsers?.toLocaleString()}
          color="#6366f1"
        />
        <StatCard
          icon="✅"
          label="Active Users"
          value={stats.activeUsers?.toLocaleString()}
          color="#16a34a"
        />
        <StatCard
          icon="🚫"
          label="Banned Users"
          value={stats.bannedUsers?.toLocaleString()}
          color="#dc2626"
        />
        <StatCard
          icon="💳"
          label="Total Recharged"
          value={`₹${(stats.totalRechargeRevenue || 0).toLocaleString("en-IN")}`}
          color="#0ea5e9"
        />
        <StatCard
          icon="📞"
          label="Talktime Spent"
          value={`₹${(stats.totalTalktimeDeducted || 0).toLocaleString("en-IN")}`}
          color="#f59e0b"
        />
        <StatCard
          icon="🚨"
          label="Pending Grievances"
          value={stats.pendingGrievances}
          color={CHERRY}
          sub={stats.pendingGrievances > 0 ? "Needs attention" : "All clear"}
        />
      </div>

      {/* Quick summary */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>
          📈 Quick Summary
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          {[
            {
              label: "Revenue collected via recharge",
              value: `₹${(stats.totalRechargeRevenue || 0).toLocaleString("en-IN")}`,
              color: "#16a34a",
            },
            {
              label: "Talktime consumed by users",
              value: `₹${(stats.totalTalktimeDeducted || 0).toLocaleString("en-IN")}`,
              color: "#f59e0b",
            },
            {
              label: "Balance remaining in wallets",
              value: `₹${Math.max(0, (stats.totalRechargeRevenue || 0) - (stats.totalTalktimeDeducted || 0)).toLocaleString("en-IN")}`,
              color: "#6366f1",
            },
            {
              label: "Ban rate",
              value: stats.totalUsers
                ? `${((stats.bannedUsers / stats.totalUsers) * 100).toFixed(1)}%`
                : "0%",
              color: "#dc2626",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "#f9fafb",
                borderRadius: 12,
                padding: "14px 16px",
                borderLeft: `3px solid ${item.color}`,
              }}
            >
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: item.color }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// USER MODAL
// ══════════════════════════════════════════════════════════════════════════════
function UserModal({ userId, onClose, onRefresh }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balType, setBalType] = useState("credit");
  const [balAmt, setBalAmt] = useState("");
  const [balReason, setBalReason] = useState("");
  const [balLoading, setBalLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [txPage, setTxPage] = useState(0);
  const TX_PER_PAGE = 10;

  const load = useCallback(async () => {
    setLoading(true);
    const res = await uaFetch(`/${userId}`);
    if (res.success) setData(res);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleBan(ban) {
    if (!confirm(`${ban ? "Ban" : "Unban"} this user?`)) return;
    const res = await uaFetch(`/${userId}/ban`, {
      method: "PATCH",
      body: { ban },
    });
    setMsg(
      res.success
        ? { ok: true, text: res.message }
        : { ok: false, text: res.message },
    );
    if (res.success) {
      load();
      onRefresh();
    }
  }

  async function handleBalance() {
    const amt = Number(balAmt);
    if (!amt || amt <= 0)
      return setMsg({ ok: false, text: "Enter a valid positive amount." });
    if (!balReason.trim())
      return setMsg({ ok: false, text: "Please enter a reason." });
    setBalLoading(true);
    const res = await uaFetch(`/${userId}/balance`, {
      method: "PATCH",
      body: { type: balType, amount: amt, reason: balReason },
    });
    setBalLoading(false);
    setMsg(
      res.success
        ? { ok: true, text: res.message }
        : { ok: false, text: res.message },
    );
    if (res.success) {
      setBalAmt("");
      setBalReason("");
      load();
      onRefresh();
    }
  }

  const user = data?.user;
  const txSlice =
    data?.transactions?.slice(
      txPage * TX_PER_PAGE,
      (txPage + 1) * TX_PER_PAGE,
    ) || [];
  const txTotalPages = Math.ceil(
    (data?.transactions?.length || 0) / TX_PER_PAGE,
  );

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 720,
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
        }}
      >
        {/* Modal header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 2,
            borderRadius: "20px 20px 0 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #e63950, #ff6b85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              👤
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>User Details</div>
              {user && (
                <div style={{ fontSize: 11, color: "#9ca3af" }}>
                  ID: {user._id}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f3f4f6",
              border: "none",
              width: 32,
              height: 32,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: 16,
              color: "#6b7280",
            }}
          >
            ×
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            Loading user data…
          </div>
        ) : !user ? (
          <div style={{ padding: 40, textAlign: "center", color: "#dc2626" }}>
            User not found.
          </div>
        ) : (
          <div
            style={{
              padding: "22px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            {/* Profile header */}
            <div
              style={{
                background: "linear-gradient(135deg, #1a0a0e 0%, #2d0f1c 100%)",
                borderRadius: 16,
                padding: 20,
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  flexShrink: 0,
                  background: "#fce7ef",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  fontWeight: 900,
                  color: CHERRY,
                  border: "3px solid rgba(230,57,80,0.3)",
                }}
              >
                {user.profilePicture ? (
                  <img
                    src={`https://redcheery.com${user.profilePicture}`}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  user.firstName?.[0] || "U"
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>
                  {user.firstName} {user.lastName}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  📱 {user.phoneNumber}
                  {user.email && <> · ✉️ {user.email}</>}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginTop: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <Badge value={user.isActive ? "active" : "banned"} />
                  {user.gender && (
                    <span
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.7)",
                        padding: "3px 8px",
                        borderRadius: 20,
                        fontSize: 11,
                      }}
                    >
                      {user.gender}
                    </span>
                  )}
                  {user.age && (
                    <span
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.7)",
                        padding: "3px 8px",
                        borderRadius: 20,
                        fontSize: 11,
                      }}
                    >
                      Age {user.age}
                    </span>
                  )}
                  {user.isVerified && (
                    <span
                      style={{
                        background: "rgba(34,197,94,0.2)",
                        color: "#86efac",
                        padding: "3px 8px",
                        borderRadius: 20,
                        fontSize: 11,
                      }}
                    >
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{ color: "#ff6b85", fontSize: 30, fontWeight: 900 }}
                >
                  ₹{(user.talktimeBalance || 0).toLocaleString("en-IN")}
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
                  Wallet Balance
                </div>
              </div>
            </div>

            {/* Summary boxes */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: 10,
              }}
            >
              {[
                { label: "Joined", value: fmt(user.createdAt), icon: "📅" },
                { label: "Last Login", value: fmt(user.lastLogin), icon: "🔑" },
                {
                  label: "Total Recharged",
                  value: `₹${(data.summary?.totalRecharged || 0).toLocaleString("en-IN")}`,
                  icon: "💳",
                  green: true,
                },
                {
                  label: "Total Spent",
                  value: `₹${(data.summary?.totalSpent || 0).toLocaleString("en-IN")}`,
                  icon: "📞",
                  amber: true,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: item.green
                      ? "#f0fdf4"
                      : item.amber
                        ? "#fffbeb"
                        : "#f9fafb",
                    borderRadius: 12,
                    padding: "12px 14px",
                  }}
                >
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>
                    {item.icon} {item.label}
                  </div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 14,
                      marginTop: 2,
                      color: item.green
                        ? "#16a34a"
                        : item.amber
                          ? "#d97706"
                          : "#111",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Ban / Unban */}
            <div style={{ display: "flex", gap: 10 }}>
              {user.isActive ? (
                <Btn color="#dc2626" onClick={() => handleBan(true)}>
                  🚫 Ban This User
                </Btn>
              ) : (
                <Btn color="#16a34a" onClick={() => handleBan(false)}>
                  ✅ Unban User
                </Btn>
              )}
            </div>

            {/* Adjust Balance */}
            <div
              style={{
                background: "#f9fafb",
                borderRadius: 14,
                padding: 18,
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 18 }}>💰</span> Adjust Wallet Balance
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                      marginBottom: 5,
                      fontWeight: 700,
                    }}
                  >
                    TYPE
                  </div>
                  <select
                    value={balType}
                    onChange={(e) => setBalType(e.target.value)}
                    style={{
                      padding: "9px 12px",
                      borderRadius: 9,
                      border: "1.5px solid #e5e7eb",
                      fontSize: 13,
                      background: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    <option value="credit">➕ Credit</option>
                    <option value="debit">➖ Debit</option>
                  </select>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                      marginBottom: 5,
                      fontWeight: 700,
                    }}
                  >
                    AMOUNT (₹)
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={balAmt}
                    onChange={(e) => setBalAmt(e.target.value)}
                    placeholder="500"
                    style={{
                      padding: "9px 12px",
                      borderRadius: 9,
                      border: "1.5px solid #e5e7eb",
                      width: 110,
                      fontSize: 13,
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                      marginBottom: 5,
                      fontWeight: 700,
                    }}
                  >
                    REASON
                  </div>
                  <input
                    value={balReason}
                    onChange={(e) => setBalReason(e.target.value)}
                    placeholder="Support refund, bonus, correction…"
                    style={{
                      padding: "9px 12px",
                      borderRadius: 9,
                      border: "1.5px solid #e5e7eb",
                      width: "100%",
                      fontSize: 13,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <Btn
                  onClick={handleBalance}
                  disabled={balLoading}
                  color={balType === "credit" ? "#16a34a" : "#f59e0b"}
                >
                  {balLoading ? "…" : balType === "credit" ? "Credit" : "Debit"}
                </Btn>
              </div>
            </div>

            {/* Feedback message */}
            {msg && (
              <div
                style={{
                  background: msg.ok ? "#d1fae5" : "#fee2e2",
                  color: msg.ok ? "#065f46" : "#991b1b",
                  borderRadius: 10,
                  padding: "11px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {msg.ok ? "✅" : "❌"} {msg.text}
              </div>
            )}

            {/* Transactions */}
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}>
                📋 Transactions ({data.transactions?.length || 0})
              </div>
              {data.transactions?.length === 0 ? (
                <div
                  style={{ color: "#9ca3af", fontSize: 13, padding: "16px 0" }}
                >
                  No transactions yet.
                </div>
              ) : (
                <>
                  <div
                    style={{
                      overflowX: "auto",
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          <TH>Type</TH>
                          <TH>Amount</TH>
                          <TH>Plan</TH>
                          <TH>Status</TH>
                          <TH>Description</TH>
                          <TH>Date</TH>
                        </tr>
                      </thead>
                      <tbody>
                        {txSlice.map((t, i) => (
                          <tr
                            key={t._id}
                            style={{
                              background: i % 2 === 0 ? "#fff" : "#fafafa",
                            }}
                          >
                            <TD>
                              <Badge value={t.type} />
                            </TD>
                            <TD
                              style={{
                                fontWeight: 800,
                                color:
                                  t.type === "credit" ? "#16a34a" : "#dc2626",
                              }}
                            >
                              {t.type === "credit" ? "+" : "−"}₹{t.amount}
                            </TD>
                            <TD style={{ fontSize: 12 }}>
                              {t.planLabel || t.planId || "—"}
                            </TD>
                            <TD>
                              <Badge value={t.status} />
                            </TD>
                            <TD
                              style={{
                                maxWidth: 160,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontSize: 12,
                              }}
                            >
                              {t.description || "—"}
                            </TD>
                            <TD style={{ whiteSpace: "nowrap", fontSize: 12 }}>
                              {fmtTime(t.createdAt)}
                            </TD>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {txTotalPages > 1 && (
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        justifyContent: "flex-end",
                        paddingTop: 8,
                      }}
                    >
                      <Btn
                        small
                        outline
                        color="#6b7280"
                        disabled={txPage === 0}
                        onClick={() => setTxPage((p) => p - 1)}
                      >
                        ← Prev
                      </Btn>
                      <span
                        style={{
                          fontSize: 12,
                          color: "#9ca3af",
                          alignSelf: "center",
                        }}
                      >
                        Page {txPage + 1}/{txTotalPages}
                      </span>
                      <Btn
                        small
                        outline
                        color="#6b7280"
                        disabled={txPage >= txTotalPages - 1}
                        onClick={() => setTxPage((p) => p + 1)}
                      >
                        Next →
                      </Btn>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Grievances */}
            {data.grievances?.length > 0 && (
              <div>
                <div
                  style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}
                >
                  🚨 Grievances ({data.grievances.length})
                </div>
                {data.grievances.map((g) => (
                  <div
                    key={g._id}
                    style={{
                      background: "#fef9f9",
                      border: "1px solid #fecdd3",
                      borderLeft: `4px solid ${CHERRY}`,
                      borderRadius: 12,
                      padding: "14px 16px",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <div
                        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                      >
                        {g.categories?.map((c) => (
                          <span
                            key={c}
                            style={{
                              background: "#fee2e2",
                              color: "#991b1b",
                              padding: "2px 8px",
                              borderRadius: 12,
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                      <Badge value={g.status} />
                    </div>
                    <div style={{ fontSize: 13, color: "#374151" }}>
                      {g.description}
                    </div>
                    {g.adminNote && (
                      <div
                        style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}
                      >
                        📝 {g.adminNote}
                      </div>
                    )}
                    <div
                      style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}
                    >
                      {fmtTime(g.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// USERS TAB
// ══════════════════════════════════════════════════════════════════════════════
function UsersTab({ onRefresh }) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page, limit: 20 });
    if (search) p.set("search", search);
    const res = await uaFetch(`/?${p}`);
    if (res.success) {
      setUsers(res.users);
      setTotal(res.total);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  function doSearch(e) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  async function quickBan(id, ban, name) {
    if (!confirm(`${ban ? "Ban" : "Unban"} ${name}?`)) return;
    const res = await uaFetch(`/${id}/ban`, { method: "PATCH", body: { ban } });
    if (res.success) {
      load();
      onRefresh();
    } else alert("❌ " + res.message);
  }

  return (
    <div>
      {/* Search */}
      <form
        onSubmit={doSearch}
        style={{ display: "flex", gap: 8, marginBottom: 18 }}
      >
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="🔍  Search by name or phone number…"
          style={{
            flex: 1,
            padding: "10px 16px",
            borderRadius: 11,
            border: "1.5px solid #e5e7eb",
            fontSize: 13,
            outline: "none",
            background: "#fafafa",
          }}
        />
        <Btn onClick={() => {}}>Search</Btn>
        {search && (
          <Btn
            outline
            color="#6b7280"
            onClick={() => {
              setSearch("");
              setSearchInput("");
              setPage(1);
            }}
          >
            ✕ Clear
          </Btn>
        )}
      </form>

      <div
        style={{
          overflowX: "auto",
          borderRadius: 14,
          border: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <TH>User</TH>
              <TH>Phone</TH>
              <TH>Balance</TH>
              <TH>Status</TH>
              <TH>Joined</TH>
              <TH>Last Login</TH>
              <TH>Actions</TH>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ padding: 50, textAlign: "center", color: "#9ca3af" }}
                >
                  Loading users…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ padding: 50, textAlign: "center", color: "#9ca3af" }}
                >
                  No users found{search ? ` for "${search}"` : ""}.
                </td>
              </tr>
            ) : (
              users.map((u, i) => (
                <tr
                  key={u._id}
                  style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}
                >
                  <TD>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 12,
                          flexShrink: 0,
                          overflow: "hidden",
                          background: "#fce7ef",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          color: CHERRY,
                          fontSize: 15,
                        }}
                      >
                        {u.profilePicture ? (
                          <img
                            src={`https://redcheery.com${u.profilePicture}`}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          u.firstName?.[0] || "U"
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>
                          {u.firstName} {u.lastName}
                        </div>
                        {u.email && (
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>
                            {u.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </TD>
                  <TD style={{ fontFamily: "monospace", fontSize: 12 }}>
                    {u.phoneNumber}
                  </TD>
                  <TD style={{ fontWeight: 800, color: "#0ea5e9" }}>
                    ₹{(u.talktimeBalance || 0).toLocaleString("en-IN")}
                  </TD>
                  <TD>
                    <Badge value={u.isActive ? "active" : "banned"} />
                  </TD>
                  <TD style={{ whiteSpace: "nowrap", fontSize: 12 }}>
                    {fmt(u.createdAt)}
                  </TD>
                  <TD style={{ whiteSpace: "nowrap", fontSize: 12 }}>
                    {fmt(u.lastLogin)}
                  </TD>
                  <TD>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn small onClick={() => setSelectedId(u._id)}>
                        View
                      </Btn>
                      {u.isActive ? (
                        <Btn
                          small
                          outline
                          color="#dc2626"
                          onClick={() => quickBan(u._id, true, u.firstName)}
                        >
                          Ban
                        </Btn>
                      ) : (
                        <Btn
                          small
                          outline
                          color="#16a34a"
                          onClick={() => quickBan(u._id, false, u.firstName)}
                        >
                          Unban
                        </Btn>
                      )}
                    </div>
                  </TD>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} total={total} limit={20} onPage={setPage} />

      {selectedId && (
        <UserModal
          userId={selectedId}
          onClose={() => setSelectedId(null)}
          onRefresh={() => {
            load();
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TRANSACTIONS TAB
// ══════════════════════════════════════════════════════════════════════════════
function TransactionsTab() {
  const [txns, setTxns] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [typeF, setTypeF] = useState("");
  const [statusF, setStatusF] = useState("");
  const [uidInput, setUidInput] = useState("");
  const [uidFilter, setUidFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page, limit: 30 });
    if (typeF) p.set("type", typeF);
    if (statusF) p.set("status", statusF);
    if (uidFilter) p.set("userId", uidFilter);
    const res = await uaFetch(`/transactions?${p}`);
    if (res.success) {
      setTxns(res.transactions);
      setTotal(res.total);
    }
    setLoading(false);
  }, [page, typeF, statusF, uidFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const selStyle = {
    padding: "9px 12px",
    borderRadius: 10,
    border: "1.5px solid #e5e7eb",
    fontSize: 13,
    background: "#fff",
    cursor: "pointer",
  };

  const hasFilter = typeF || statusF || uidFilter;

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 18,
          alignItems: "center",
        }}
      >
        <select
          value={typeF}
          onChange={(e) => {
            setTypeF(e.target.value);
            setPage(1);
          }}
          style={selStyle}
        >
          <option value="">All Types</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <select
          value={statusF}
          onChange={(e) => {
            setStatusF(e.target.value);
            setPage(1);
          }}
          style={selStyle}
        >
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>
        <input
          value={uidInput}
          onChange={(e) => setUidInput(e.target.value)}
          placeholder="Filter by User ID…"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setUidFilter(uidInput.trim());
              setPage(1);
            }
          }}
          style={{ ...selStyle, flex: 1, minWidth: 180 }}
        />
        <Btn
          small
          onClick={() => {
            setUidFilter(uidInput.trim());
            setPage(1);
          }}
        >
          Apply
        </Btn>
        {hasFilter && (
          <Btn
            small
            outline
            color="#6b7280"
            onClick={() => {
              setTypeF("");
              setStatusF("");
              setUidFilter("");
              setUidInput("");
              setPage(1);
            }}
          >
            ✕ Reset
          </Btn>
        )}
      </div>

      <div
        style={{
          overflowX: "auto",
          borderRadius: 14,
          border: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <TH>User</TH>
              <TH>Type</TH>
              <TH>Amount</TH>
              <TH>Plan</TH>
              <TH>Status</TH>
              <TH>Description</TH>
              <TH>Razorpay ID</TH>
              <TH>Date</TH>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  style={{ padding: 50, textAlign: "center", color: "#9ca3af" }}
                >
                  Loading…
                </td>
              </tr>
            ) : txns.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{ padding: 50, textAlign: "center", color: "#9ca3af" }}
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              txns.map((t, i) => (
                <tr
                  key={t._id}
                  style={{
                    background:
                      t.type === "credit"
                        ? "#f0fdf4"
                        : i % 2 === 0
                          ? "#fff"
                          : "#fafafa",
                  }}
                >
                  <TD>
                    {t.user ? (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 12 }}>
                          {t.user.firstName} {t.user.lastName}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#9ca3af",
                            fontFamily: "monospace",
                          }}
                        >
                          {t.user.phoneNumber}
                        </div>
                      </div>
                    ) : (
                      <span
                        style={{
                          fontSize: 11,
                          color: "#9ca3af",
                          fontFamily: "monospace",
                        }}
                      >
                        …{String(t.userId).slice(-8)}
                      </span>
                    )}
                  </TD>
                  <TD>
                    <Badge value={t.type} />
                  </TD>
                  <TD
                    style={{
                      fontWeight: 900,
                      color: t.type === "credit" ? "#16a34a" : "#dc2626",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.type === "credit" ? "+" : "−"}₹{t.amount}
                  </TD>
                  <TD style={{ fontSize: 12 }}>
                    {t.planLabel || t.planId || "—"}
                  </TD>
                  <TD>
                    <Badge value={t.status} />
                  </TD>
                  <TD
                    style={{
                      fontSize: 12,
                      maxWidth: 160,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.description || "—"}
                  </TD>
                  <TD
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                      fontFamily: "monospace",
                    }}
                  >
                    {t.razorpayPaymentId
                      ? `…${t.razorpayPaymentId.slice(-8)}`
                      : "—"}
                  </TD>
                  <TD style={{ whiteSpace: "nowrap", fontSize: 12 }}>
                    {fmtTime(t.createdAt)}
                  </TD>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={total} limit={30} onPage={setPage} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GRIEVANCES TAB
// ══════════════════════════════════════════════════════════════════════════════
function GrievancesTab() {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusF, setStatusF] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState({});
  const [saving, setSaving] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page, limit: 15 });
    if (statusF) p.set("status", statusF);
    const res = await uaFetch(`/grievances?${p}`);
    if (res.success) {
      setList(res.grievances);
      setTotal(res.total);
    }
    setLoading(false);
  }, [page, statusF]);

  useEffect(() => {
    load();
  }, [load]);

  function getEdit(g) {
    return editing[g._id] ?? { status: g.status, adminNote: g.adminNote || "" };
  }
  function setField(id, field, val) {
    setEditing((prev) => ({
      ...prev,
      [id]: {
        ...getEdit({ _id: id, status: "", adminNote: "" }),
        ...prev[id],
        [field]: val,
      },
    }));
  }

  async function save(g) {
    const e = getEdit(g);
    setSaving((p) => ({ ...p, [g._id]: true }));
    const res = await uaFetch(`/grievances/${g._id}`, {
      method: "PATCH",
      body: { status: e.status, adminNote: e.adminNote },
    });
    setSaving((p) => ({ ...p, [g._id]: false }));
    if (res.success) {
      load();
      setEditing((p) => {
        const n = { ...p };
        delete n[g._id];
        return n;
      });
    } else alert("❌ " + res.message);
  }

  const STATUS_TABS = [
    { value: "", label: "All" },
    { value: "pending", label: "🟡 Pending" },
    { value: "under_review", label: "🔵 Reviewing" },
    { value: "resolved", label: "🟢 Resolved" },
    { value: "rejected", label: "🔴 Rejected" },
  ];

  const BORDER_COLORS = {
    pending: "#f59e0b",
    under_review: "#3b82f6",
    resolved: "#16a34a",
    rejected: "#dc2626",
  };

  return (
    <div>
      {/* Filter tabs */}
      <div
        style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}
      >
        {STATUS_TABS.map((s) => (
          <button
            key={s.value}
            onClick={() => {
              setStatusF(s.value);
              setPage(1);
            }}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: "none",
              background: statusF === s.value ? CHERRY : "#f3f4f6",
              color: statusF === s.value ? "#fff" : "#6b7280",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 50, textAlign: "center", color: "#9ca3af" }}>
          Loading…
        </div>
      ) : list.length === 0 ? (
        <div style={{ padding: 50, textAlign: "center", color: "#9ca3af" }}>
          No grievances found.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {list.map((g) => {
            const e = getEdit(g);
            const borderColor = BORDER_COLORS[g.status] || "#e5e7eb";
            return (
              <div
                key={g._id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid #e5e7eb",
                  borderLeft: `5px solid ${borderColor}`,
                  padding: "18px 20px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {/* Top row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 800, fontSize: 15 }}>
                      {g.firstName} {g.lastName}
                    </span>
                    <span
                      style={{ fontSize: 12, color: "#9ca3af", marginLeft: 10 }}
                    >
                      📱 {g.phone}
                    </span>
                    {g.email && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#9ca3af",
                          marginLeft: 10,
                        }}
                      >
                        ✉️ {g.email}
                      </span>
                    )}
                    {g.appUserId && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "#9ca3af",
                          marginLeft: 10,
                        }}
                      >
                        🆔 {g.appUserId}
                      </span>
                    )}
                  </div>
                  <div
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    <Badge value={g.status} />
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>
                      {fmtTime(g.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Category pills */}
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginBottom: 10,
                  }}
                >
                  {g.categories?.map((c) => (
                    <span
                      key={c}
                      style={{
                        background: "#fef2f2",
                        color: "#b91c1c",
                        padding: "3px 10px",
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 700,
                        border: "1px solid #fecaca",
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: 13,
                    color: "#374151",
                    lineHeight: 1.6,
                    margin: "0 0 10px",
                  }}
                >
                  {g.description}
                </p>

                {/* Evidence */}
                {g.evidenceFile && (
                  <a
                    href={`https://redcheery.com${g.evidenceFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      color: "#0ea5e9",
                      marginBottom: 12,
                      fontWeight: 700,
                    }}
                  >
                    📎 View Attached Evidence ↗
                  </a>
                )}

                {/* Existing admin note */}
                {g.adminNote && !editing[g._id] && (
                  <div
                    style={{
                      background: "#f9fafb",
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 12,
                      color: "#6b7280",
                      marginBottom: 12,
                      borderLeft: "3px solid #e5e7eb",
                    }}
                  >
                    📝 <strong>Admin Note:</strong> {g.adminNote}
                  </div>
                )}

                {/* Edit controls */}
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    alignItems: "flex-end",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#9ca3af",
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      STATUS
                    </div>
                    <select
                      value={e.status}
                      onChange={(ev) =>
                        setField(g._id, "status", ev.target.value)
                      }
                      style={{
                        padding: "8px 12px",
                        borderRadius: 9,
                        border: "1.5px solid #e5e7eb",
                        fontSize: 13,
                        background: "#fff",
                      }}
                    >
                      <option value="pending">🟡 Pending</option>
                      <option value="under_review">🔵 Under Review</option>
                      <option value="resolved">🟢 Resolved</option>
                      <option value="rejected">🔴 Rejected</option>
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#9ca3af",
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      ADMIN NOTE
                    </div>
                    <input
                      value={e.adminNote}
                      onChange={(ev) =>
                        setField(g._id, "adminNote", ev.target.value)
                      }
                      placeholder="Add a note for this grievance…"
                      style={{
                        padding: "8px 12px",
                        borderRadius: 9,
                        border: "1.5px solid #e5e7eb",
                        width: "100%",
                        fontSize: 13,
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <Btn onClick={() => save(g)} disabled={saving[g._id]}>
                    {saving[g._id] ? "Saving…" : "💾 Save"}
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Pagination page={page} total={total} limit={15} onPage={setPage} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MANUAL RECHARGES TAB
// ══════════════════════════════════════════════════════════════════════════════
function ManualRechargesTab({ onPendingChange }) {
  const [recharges, setRecharges] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusF, setStatusF] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [rejectNote, setRejectNote] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page, limit: 20 });
    if (statusF) p.set("status", statusF);
    const res = await uaFetch(`/manual-recharges?${p}`);
    if (res.success) {
      setRecharges(res.recharges);
      setTotal(res.total);
      if (onPendingChange) onPendingChange(res.pendingCount || 0);
    }
    setLoading(false);
  }, [page, statusF]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleApprove(id, name, amount) {
    if (!confirm(`Approve ₹${amount} recharge for ${name}?`)) return;
    setActionLoading((p) => ({ ...p, [id]: "approve" }));
    setMsg(null);
    const res = await uaFetch(`/manual-recharges/${id}/approve`, {
      method: "PATCH",
    });
    setActionLoading((p) => ({ ...p, [id]: null }));
    if (res.success) {
      setMsg({ ok: true, text: res.message });
      load();
    } else {
      setMsg({ ok: false, text: res.message });
    }
  }

  async function handleReject(id) {
    setActionLoading((p) => ({ ...p, [id]: "reject" }));
    setMsg(null);
    const res = await uaFetch(`/manual-recharges/${id}/reject`, {
      method: "PATCH",
      body: { adminNote: rejectNote },
    });
    setActionLoading((p) => ({ ...p, [id]: null }));
    setRejectId(null);
    setRejectNote("");
    if (res.success) {
      setMsg({ ok: true, text: "Request rejected." });
      load();
    } else {
      setMsg({ ok: false, text: res.message });
    }
  }

  function fmtAmt(n) {
    return `₹${Number(n).toLocaleString("en-IN")}`;
  }

  const selStyle = {
    padding: "9px 12px",
    borderRadius: 10,
    border: "1.5px solid #e5e7eb",
    fontSize: 13,
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <div>
      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 18,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <select
          value={statusF}
          onChange={(e) => {
            setStatusF(e.target.value);
            setPage(1);
          }}
          style={selStyle}
        >
          <option value="">All</option>
          <option value="pending">⏳ Pending</option>
          <option value="approved">✅ Approved</option>
          <option value="rejected">❌ Rejected</option>
        </select>
        <Btn small outline color="#6b7280" onClick={load}>
          🔄 Refresh
        </Btn>
      </div>

      {/* Flash message */}
      {msg && (
        <div
          style={{
            padding: "11px 16px",
            borderRadius: 11,
            marginBottom: 16,
            background: msg.ok ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${msg.ok ? "#bbf7d0" : "#fecaca"}`,
            color: msg.ok ? "#16a34a" : "#dc2626",
            fontWeight: 700,
            fontSize: 13,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {msg.ok ? "✅ " : "❌ "}
          {msg.text}
          <button
            onClick={() => setMsg(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 16,
              color: "inherit",
              opacity: 0.6,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Table */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: 14,
          border: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <TH>User</TH>
              <TH>Phone</TH>
              <TH>Amount</TH>
              <TH>UTR Number</TH>
              <TH>Submitted</TH>
              <TH>Status</TH>
              <TH>Actions</TH>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ padding: 50, textAlign: "center", color: "#9ca3af" }}
                >
                  Loading…
                </td>
              </tr>
            ) : recharges.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ padding: 50, textAlign: "center", color: "#9ca3af" }}
                >
                  No {statusF || ""} recharge requests found.
                </td>
              </tr>
            ) : (
              recharges.map((r, i) => (
                <>
                  <tr
                    key={r._id}
                    style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}
                  >
                    {/* User */}
                    <TD>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>
                        {r.user
                          ? `${r.user.firstName} ${r.user.lastName}`
                          : "Unknown"}
                      </div>
                    </TD>
                    {/* Phone */}
                    <TD style={{ fontFamily: "monospace", fontSize: 12 }}>
                      {r.user?.phoneNumber || "—"}
                    </TD>
                    {/* Amount */}
                    <TD
                      style={{
                        fontWeight: 900,
                        color: "#16a34a",
                        fontSize: 15,
                      }}
                    >
                      {fmtAmt(r.amount)}
                    </TD>
                    {/* UTR */}
                    <TD>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 13,
                          background: "#f3f4f6",
                          padding: "3px 8px",
                          borderRadius: 6,
                          letterSpacing: 1,
                        }}
                      >
                        {r.utrNumber}
                      </span>
                    </TD>
                    {/* Submitted */}
                    <TD style={{ fontSize: 12, whiteSpace: "nowrap" }}>
                      {fmtTime(r.createdAt)}
                    </TD>
                    {/* Status */}
                    <TD>
                      <Badge value={r.status} />
                      {r.adminNote && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "#9ca3af",
                            marginTop: 3,
                          }}
                        >
                          📝 {r.adminNote}
                        </div>
                      )}
                    </TD>
                    {/* Actions */}
                    <TD>
                      {r.status === "pending" ? (
                        <div
                          style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                        >
                          <Btn
                            small
                            color="#16a34a"
                            disabled={!!actionLoading[r._id]}
                            onClick={() =>
                              handleApprove(
                                r._id,
                                r.user
                                  ? `${r.user.firstName} ${r.user.lastName}`
                                  : "user",
                                r.amount,
                              )
                            }
                          >
                            {actionLoading[r._id] === "approve"
                              ? "…"
                              : "✅ Approve"}
                          </Btn>
                          <Btn
                            small
                            outline
                            color="#dc2626"
                            disabled={!!actionLoading[r._id]}
                            onClick={() => {
                              setRejectId(r._id);
                              setRejectNote("");
                            }}
                          >
                            ❌ Reject
                          </Btn>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>
                          {r.status === "approved"
                            ? `✅ ${fmt(r.approvedAt)}`
                            : `❌ ${fmt(r.rejectedAt)}`}
                        </span>
                      )}
                    </TD>
                  </tr>
                  {/* Inline reject note row */}
                  {rejectId === r._id && (
                    <tr
                      key={`reject-${r._id}`}
                      style={{ background: "#fef2f2" }}
                    >
                      <td
                        colSpan={7}
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid #fecaca",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#dc2626",
                            }}
                          >
                            Rejection reason (optional):
                          </span>
                          <input
                            value={rejectNote}
                            onChange={(e) => setRejectNote(e.target.value)}
                            placeholder="e.g. UTR not found in bank records"
                            style={{
                              flex: 1,
                              minWidth: 200,
                              padding: "8px 12px",
                              borderRadius: 8,
                              border: "1.5px solid #fecaca",
                              fontSize: 13,
                              outline: "none",
                            }}
                          />
                          <Btn
                            small
                            color="#dc2626"
                            disabled={actionLoading[r._id] === "reject"}
                            onClick={() => handleReject(r._id)}
                          >
                            {actionLoading[r._id] === "reject"
                              ? "…"
                              : "Confirm Reject"}
                          </Btn>
                          <Btn
                            small
                            outline
                            color="#6b7280"
                            onClick={() => setRejectId(null)}
                          >
                            Cancel
                          </Btn>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} total={total} limit={20} onPage={setPage} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD (after login)
// ══════════════════════════════════════════════════════════════════════════════
function Dashboard({ onLogout }) {
  const [tab, setTab] = useState("stats");
  const [statsKey, setStatsKey] = useState(0); // bump to refresh stats

  const [pendingCount, setPendingCount] = useState(0);

  // Fetch pending manual recharge count for badge
  useEffect(() => {
    uaFetch("/manual-recharges?status=pending&limit=1")
      .then((r) => {
        if (r.success) setPendingCount(r.pendingCount || 0);
      })
      .catch(() => {});
  }, []);

  const TABS = [
    { id: "stats", icon: "📊", label: "Stats" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "transactions", icon: "💳", label: "Transactions" },
    { id: "grievances", icon: "🚨", label: "Grievances" },
    {
      id: "manual-recharges",
      icon: "📋",
      label: "Manual Recharges",
      badge: pendingCount,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fb",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Top navbar */}
      {/* <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #e63950, #ff6b85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🍒
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>
              Red Cherry
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: -2 }}>
              User Admin Panel
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: "8px 16px",
            borderRadius: 10,
            border: "1.5px solid #e5e7eb",
            background: "#fff",
            color: "#6b7280",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          🚪 Logout
        </button>
      </div> */}
      {/* New */}
      {/* Top navbar */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src="/logo.png"
              alt="Red Cherry"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>
              Red Cherry
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: -2 }}>
              User Admin Panel
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: "8px 16px",
            borderRadius: 10,
            border: "1.5px solid #e5e7eb",
            background: "#fff",
            color: "#6b7280",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          🚪 Logout
        </button>
      </div>
      {/* end */}

      <div
        style={{
          display: "flex",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "24px 20px",
          gap: 20,
        }}
      >
        {/* Sidebar */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <nav
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #e5e7eb",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            {TABS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  border: "none",
                  borderBottom:
                    i < TABS.length - 1 ? "1px solid #f3f4f6" : "none",
                  background: tab === t.id ? "#fff5f6" : "#fff",
                  color: tab === t.id ? CHERRY : "#6b7280",
                  fontWeight: tab === t.id ? 800 : 600,
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderLeft:
                    tab === t.id
                      ? `3px solid ${CHERRY}`
                      : "3px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 16 }}>{t.icon}</span>
                <span style={{ flex: 1 }}>{t.label}</span>
                {t.badge > 0 && (
                  <span
                    style={{
                      background: CHERRY,
                      color: "#fff",
                      borderRadius: 20,
                      fontSize: 10,
                      fontWeight: 900,
                      padding: "2px 7px",
                      minWidth: 18,
                      textAlign: "center",
                    }}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Page title */}
          <div style={{ marginBottom: 20 }}>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 900,
                color: "#111",
              }}
            >
              {TABS.find((t) => t.id === tab)?.icon}{" "}
              {TABS.find((t) => t.id === tab)?.label}
            </h2>
            <p style={{ margin: "4px 0 0", color: "#9ca3af", fontSize: 13 }}>
              {tab === "stats" && "Platform overview and key metrics"}
              {tab === "users" && "Manage user accounts, balances and bans"}
              {tab === "transactions" &&
                "View all recharge and talktime transactions"}
              {tab === "grievances" && "Review and respond to user complaints"}
              {tab === "manual-recharges" &&
                "Verify QR/UPI payments and credit user wallets"}
            </p>
          </div>

          {tab === "stats" && <StatsTab key={statsKey} />}
          {tab === "users" && (
            <UsersTab onRefresh={() => setStatsKey((k) => k + 1)} />
          )}
          {tab === "transactions" && <TransactionsTab />}
          {tab === "grievances" && <GrievancesTab />}
          {tab === "manual-recharges" && (
            <ManualRechargesTab onPendingChange={setPendingCount} />
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT EXPORT — handles login gate
// ══════════════════════════════════════════════════════════════════════════════
export default function UserAdminDashboard() {
  const [authed, setAuthed] = useState(
    () => !!sessionStorage.getItem(SESSION_KEY),
  );

  function handleLogin() {
    setAuthed(true);
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }

  if (!authed) return <LoginPage onLogin={handleLogin} />;
  return <Dashboard onLogout={handleLogout} />;
}
