// //////v4======v6=========//============

// // host-frontend/src/AdminDashboard.jsx
// // Complete standalone admin dashboard for Red Cherry
// // Routes: /admin  (login) → /admin/dashboard

// import { useState, useEffect, useCallback } from "react";

// const API_BASE = "/api/host/admin";
// const ADMIN_PASSWORD = "<removed>";

// // ── helpers ────────────────────────────────────────────────────────────────────
// function adminFetch(path, options = {}) {
//   return fetch(`${API_BASE}${path}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       "x-admin-key": sessionStorage.getItem("rc_admin_key") || "",
//       ...(options.headers || {}),
//     },
//     body: options.body ? JSON.stringify(options.body) : undefined,
//   }).then((r) => r.json());
// }

// function fmt(date) {
//   if (!date) return "—";
//   return new Date(date).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// }

// function imgUrl(url) {
//   if (!url) return null;
//   if (url.startsWith("http")) return url;
//   if (url.startsWith("/")) return `https://redcheery.com${url}`;
//   return `https://redcheery.com/${url}`;
// }

// // ── Badge component ────────────────────────────────────────────────────────────
// function Badge({ status }) {
//   const map = {
//     verified: { bg: "#d1fae5", color: "#065f46", label: "APPROVED" },
//     submitted: { bg: "#fef3c7", color: "#92400e", label: "PENDING" },
//     pending: { bg: "#f3f4f6", color: "#6b7280", label: "NOT SUBMITTED" },
//     rejected: { bg: "#fee2e2", color: "#991b1b", label: "REJECTED" },
//     approved: { bg: "#dbeafe", color: "#1e40af", label: "APPROVED" },
//     success: { bg: "#d1fae5", color: "#065f46", label: "PAID" },
//     failed: { bg: "#fee2e2", color: "#991b1b", label: "REJECTED" },
//     PENDING_APPROVAL: {
//       bg: "#fef3c7",
//       color: "#92400e",
//       label: "PENDING_APPROVAL",
//     },
//   };
//   const s = map[status] || { bg: "#f3f4f6", color: "#6b7280", label: status };
//   return (
//     <span
//       style={{
//         background: s.bg,
//         color: s.color,
//         padding: "3px 10px",
//         borderRadius: 20,
//         fontSize: 11,
//         fontWeight: 700,
//         letterSpacing: 0.5,
//         whiteSpace: "nowrap",
//       }}
//     >
//       {s.label}
//     </span>
//   );
// }

// // ── LOGIN PAGE ────────────────────────────────────────────────────────────────
// function LoginPage({ onLogin }) {
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setTimeout(() => {
//       if (password === ADMIN_PASSWORD) {
//         sessionStorage.setItem("rc_admin_key", password);
//         onLogin();
//       } else {
//         setError("Incorrect password.");
//       }
//       setLoading(false);
//     }, 500);
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontFamily: "'Inter', sans-serif",
//       }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 20,
//           padding: "48px 40px",
//           width: "100%",
//           maxWidth: 400,
//           boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
//         }}
//       >
//         {/* Logo */}
//         {/* <div style={{ textAlign: "center", marginBottom: 32 }}>
//           <div
//             style={{
//               width: 64,
//               height: 64,
//               background: "linear-gradient(135deg, #e11d48, #9f1239)",
//               borderRadius: 16,
//               display: "inline-flex",
//               alignItems: "center",
//               justifyContent: "center",
//               marginBottom: 16,
//             }}
//           >
//             <span style={{ fontSize: 28 }}>🍒</span>
//           </div> */}

//         <div style={{ textAlign: "center", marginBottom: 32 }}>
//           <div
//             style={{
//               width: 80,
//               height: 80,
//               borderRadius: "50%",
//               display: "inline-flex",
//               alignItems: "center",
//               justifyContent: "center",
//               marginBottom: 16,
//               overflow: "hidden",
//             }}
//           >
//             <img
//               src="/user-logo.png"
//               alt="Red Cherry Logo"
//               style={{ width: "100%", height: "100%", objectFit: "cover" }}
//             />
//           </div>
//           <h1
//             style={{
//               margin: 0,
//               fontSize: 26,
//               fontWeight: 800,
//               color: "#111",
//               letterSpacing: -0.5,
//             }}
//           >
//             Red Cherry
//           </h1>
//           <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14 }}>
//             Admin Dashboard
//           </p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: 20 }}>
//             <label
//               style={{
//                 display: "block",
//                 fontSize: 13,
//                 fontWeight: 600,
//                 color: "#374151",
//                 marginBottom: 6,
//               }}
//             >
//               Admin Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter password"
//               required
//               style={{
//                 width: "100%",
//                 padding: "12px 16px",
//                 border: `2px solid ${error ? "#ef4444" : "#e5e7eb"}`,
//                 borderRadius: 10,
//                 fontSize: 15,
//                 outline: "none",
//                 boxSizing: "border-box",
//                 transition: "border-color 0.2s",
//               }}
//               onFocus={(e) => (e.target.style.borderColor = "#e11d48")}
//               onBlur={(e) =>
//                 (e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb")
//               }
//             />
//             {error && (
//               <p style={{ color: "#ef4444", fontSize: 13, marginTop: 6 }}>
//                 {error}
//               </p>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               width: "100%",
//               padding: "13px",
//               background: loading
//                 ? "#9ca3af"
//                 : "linear-gradient(135deg, #e11d48, #9f1239)",
//               color: "#fff",
//               border: "none",
//               borderRadius: 10,
//               fontSize: 15,
//               fontWeight: 700,
//               cursor: loading ? "not-allowed" : "pointer",
//               transition: "opacity 0.2s",
//             }}
//           >
//             {loading ? "Signing in…" : "Sign In"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// // ── STAT CARD ─────────────────────────────────────────────────────────────────
// function StatCard({ icon, value, label, sub, color }) {
//   return (
//     <div
//       style={{
//         background: "#fff",
//         borderRadius: 16,
//         padding: "24px",
//         display: "flex",
//         alignItems: "center",
//         gap: 16,
//         boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
//       }}
//     >
//       <div
//         style={{
//           width: 48,
//           height: 48,
//           background: color + "18",
//           borderRadius: 12,
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
//             fontSize: 28,
//             fontWeight: 800,
//             color: "#111",
//             lineHeight: 1,
//           }}
//         >
//           {value}
//         </div>
//         <div
//           style={{
//             fontSize: 14,
//             fontWeight: 600,
//             color: "#374151",
//             marginTop: 4,
//           }}
//         >
//           {label}
//         </div>
//         {sub && (
//           <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
//             {sub}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ── HOST PROFILE MODAL ────────────────────────────────────────────────────────
// function HostModal({ host, onClose, onKYCAction, mediaLoading }) {
//   const [tab, setTab] = useState("overview");
//   const [kycLoading, setKycLoading] = useState("");

//   async function handleKYC(action) {
//     setKycLoading(action);
//     const res = await adminFetch(`/hosts/${host._id}/kyc`, {
//       method: "PATCH",
//       body: { action },
//     });
//     setKycLoading("");
//     if (res.success) {
//       onKYCAction(host._id, action === "approve" ? "verified" : "rejected");
//       alert(action === "approve" ? "✅ KYC Approved!" : "❌ KYC Rejected.");
//     } else {
//       alert("Error: " + res.message);
//     }
//   }

//   const tabs = ["overview", "media", "kyc", "bank", "activity"];
//   const kycStatus = host.kyc?.status || "pending";
//   const accountStatus =
//     kycStatus === "verified"
//       ? "approved"
//       : kycStatus === "submitted"
//         ? "PENDING_APPROVAL"
//         : kycStatus === "rejected"
//           ? "rejected"
//           : "pending";

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "rgba(0,0,0,0.6)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         zIndex: 1000,
//         padding: 20,
//       }}
//       onClick={onClose}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 20,
//           width: "100%",
//           maxWidth: 700,
//           maxHeight: "90vh",
//           overflow: "hidden",
//           display: "flex",
//           flexDirection: "column",
//           boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div
//           style={{
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             padding: "24px 28px",
//             display: "flex",
//             alignItems: "center",
//             gap: 16,
//           }}
//         >
//           <div
//             style={{
//               width: 64,
//               height: 64,
//               borderRadius: "50%",
//               overflow: "hidden",
//               background: "rgba(255,255,255,0.3)",
//               flexShrink: 0,
//               border: "3px solid rgba(255,255,255,0.5)",
//             }}
//           >
//             {host.profileImage ? (
//               <img
//                 src={imgUrl(host.profileImage)}
//                 alt=""
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               />
//             ) : (
//               <div
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 24,
//                   color: "#fff",
//                   fontWeight: 700,
//                 }}
//               >
//                 {host.firstName?.[0]?.toUpperCase() || "H"}
//               </div>
//             )}
//           </div>
//           <div style={{ flex: 1 }}>
//             <h2
//               style={{
//                 margin: 0,
//                 color: "#fff",
//                 fontSize: 22,
//                 fontWeight: 800,
//               }}
//             >
//               {host.firstName} {host.lastName}
//             </h2>
//             <p
//               style={{
//                 margin: "4px 0 8px",
//                 color: "rgba(255,255,255,0.75)",
//                 fontSize: 13,
//               }}
//             >
//               ID: {host._id}
//             </p>
//             <Badge status={accountStatus} />
//           </div>
//           <button
//             onClick={onClose}
//             style={{
//               width: 36,
//               height: 36,
//               borderRadius: "50%",
//               background: "rgba(255,255,255,0.2)",
//               border: "none",
//               cursor: "pointer",
//               color: "#fff",
//               fontSize: 18,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             ✕
//           </button>
//         </div>

//         {/* Tabs */}
//         <div
//           style={{
//             display: "flex",
//             borderBottom: "1px solid #e5e7eb",
//             background: "#fff",
//           }}
//         >
//           {tabs.map((t) => (
//             <button
//               key={t}
//               onClick={() => setTab(t)}
//               style={{
//                 padding: "14px 20px",
//                 border: "none",
//                 background: "none",
//                 cursor: "pointer",
//                 fontSize: 14,
//                 fontWeight: 600,
//                 color: tab === t ? "#e11d48" : "#6b7280",
//                 borderBottom:
//                   tab === t ? "2px solid #e11d48" : "2px solid transparent",
//                 textTransform: "capitalize",
//                 transition: "all 0.2s",
//               }}
//             >
//               {t}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <div style={{ overflowY: "auto", flex: 1, padding: 28 }}>
//           {/* OVERVIEW */}
//           {tab === "overview" && (
//             <div>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: 16,
//                   marginBottom: 24,
//                 }}
//               >
//                 {[
//                   { label: "Phone Number", value: host.phoneNumber },
//                   { label: "Email", value: host.email || "Not provided" },
//                   { label: "Registration Date", value: fmt(host.createdAt) },
//                   {
//                     label: "Last Active",
//                     value: host.updatedAt
//                       ? new Date(host.updatedAt).toLocaleString("en-IN")
//                       : "—",
//                   },
//                 ].map((item) => (
//                   <div
//                     key={item.label}
//                     style={{
//                       border: "1px solid #e5e7eb",
//                       borderRadius: 12,
//                       padding: "16px 20px",
//                     }}
//                   >
//                     <div
//                       style={{
//                         fontSize: 12,
//                         color: "#9ca3af",
//                         marginBottom: 4,
//                       }}
//                     >
//                       {item.label}
//                     </div>
//                     <div
//                       style={{ fontSize: 15, fontWeight: 600, color: "#111" }}
//                     >
//                       {item.value}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <h3
//                 style={{
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: "#111",
//                   marginBottom: 16,
//                 }}
//               >
//                 Performance Statistics
//               </h3>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr 1fr",
//                   gap: 16,
//                 }}
//               >
//                 <div
//                   style={{
//                     background: "linear-gradient(135deg,#10b981,#059669)",
//                     borderRadius: 14,
//                     padding: "20px",
//                     color: "#fff",
//                   }}
//                 >
//                   <div style={{ fontSize: 22, fontWeight: 800 }}>
//                     ₹{host.earnings || 0}
//                   </div>
//                   <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
//                     Wallet Balance
//                   </div>
//                 </div>
//                 <div
//                   style={{
//                     background: "linear-gradient(135deg,#3b82f6,#2563eb)",
//                     borderRadius: 14,
//                     padding: "20px",
//                     color: "#fff",
//                   }}
//                 >
//                   <div style={{ fontSize: 22, fontWeight: 800 }}>
//                     ₹{host.totalEarnings || host.earnings || 0}
//                   </div>
//                   <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
//                     Total Earnings
//                   </div>
//                 </div>
//                 <div
//                   style={{
//                     background: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
//                     borderRadius: 14,
//                     padding: "20px",
//                     color: "#fff",
//                   }}
//                 >
//                   <div style={{ fontSize: 22, fontWeight: 800 }}>
//                     {host.totalCalls || 0}
//                   </div>
//                   <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
//                     Total Calls
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* MEDIA */}
//           {tab === "media" && (
//             <div>
//               {/* Profile Images */}
//               <h3
//                 style={{
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: "#111",
//                   marginBottom: 16,
//                 }}
//               >
//                 📸 Profile Images
//               </h3>
//               {host.images && host.images.length > 0 ? (
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(3, 1fr)",
//                     gap: 12,
//                     marginBottom: 28,
//                   }}
//                 >
//                   {host.images.map((img, i) => {
//                     const url = imgUrl(img.url);
//                     return (
//                       <a
//                         key={img._id || i}
//                         href={url}
//                         target="_blank"
//                         rel="noreferrer"
//                         style={{
//                           display: "block",
//                           borderRadius: 12,
//                           overflow: "hidden",
//                           aspectRatio: "1",
//                           background: "#f3f4f6",
//                           border: "2px solid #e5e7eb",
//                           transition: "border-color 0.2s",
//                           cursor: "pointer",
//                         }}
//                         onMouseEnter={(e) =>
//                           (e.currentTarget.style.borderColor = "#e11d48")
//                         }
//                         onMouseLeave={(e) =>
//                           (e.currentTarget.style.borderColor = "#e5e7eb")
//                         }
//                       >
//                         <img
//                           src={url}
//                           alt={`Image ${i + 1}`}
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                             display: "block",
//                           }}
//                           onError={(e) => {
//                             e.target.style.display = "none";
//                             e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#d1d5db;font-size:13px;flex-direction:column;gap:4px"><span style="font-size:28px">🖼️</span><span>Cannot load</span></div>`;
//                           }}
//                         />
//                       </a>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div
//                   style={{
//                     background: "#f9fafb",
//                     border: "2px dashed #e5e7eb",
//                     borderRadius: 12,
//                     padding: "32px",
//                     textAlign: "center",
//                     marginBottom: 28,
//                     color: "#9ca3af",
//                     fontSize: 14,
//                   }}
//                 >
//                   <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
//                   No images uploaded yet.
//                 </div>
//               )}

//               {/* Intro Video */}
//               <h3
//                 style={{
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: "#111",
//                   marginBottom: 12,
//                 }}
//               >
//                 🎬 Intro Video
//               </h3>
//               {host.introVideo ? (
//                 <div style={{ marginBottom: 28 }}>
//                   <video
//                     src={imgUrl(host.introVideo)}
//                     controls
//                     style={{
//                       width: "100%",
//                       borderRadius: 12,
//                       background: "#000",
//                       maxHeight: 280,
//                       display: "block",
//                       border: "2px solid #e5e7eb",
//                     }}
//                     onError={(e) => {
//                       e.target.style.display = "none";
//                       e.target.nextSibling.style.display = "flex";
//                     }}
//                   />
//                   <div
//                     style={{
//                       display: "none",
//                       background: "#f9fafb",
//                       border: "2px dashed #e5e7eb",
//                       borderRadius: 12,
//                       padding: "24px",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexDirection: "column",
//                       gap: 8,
//                       color: "#6b7280",
//                       fontSize: 14,
//                     }}
//                   >
//                     <span style={{ fontSize: 24 }}>🎬</span>
//                     <span>Cannot load video.</span>
//                     <a
//                       href={imgUrl(host.introVideo)}
//                       target="_blank"
//                       rel="noreferrer"
//                       style={{
//                         color: "#e11d48",
//                         fontWeight: 700,
//                         fontSize: 13,
//                       }}
//                     >
//                       Open directly ↗
//                     </a>
//                   </div>
//                   <a
//                     href={imgUrl(host.introVideo)}
//                     target="_blank"
//                     rel="noreferrer"
//                     style={{
//                       display: "inline-block",
//                       marginTop: 8,
//                       color: "#e11d48",
//                       fontSize: 13,
//                       fontWeight: 600,
//                     }}
//                   >
//                     Open in new tab ↗
//                   </a>
//                 </div>
//               ) : (
//                 <div
//                   style={{
//                     background: "#f9fafb",
//                     border: "2px dashed #e5e7eb",
//                     borderRadius: 12,
//                     padding: "24px",
//                     textAlign: "center",
//                     marginBottom: 28,
//                     color: "#9ca3af",
//                     fontSize: 14,
//                   }}
//                 >
//                   <div style={{ fontSize: 28, marginBottom: 6 }}>🎬</div>
//                   No intro video uploaded yet.
//                 </div>
//               )}

//               {/* Audition Video */}
//               <h3
//                 style={{
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: "#111",
//                   marginBottom: 12,
//                 }}
//               >
//                 🎤 Audition Video
//               </h3>
//               {host.auditionVideo ? (
//                 <div>
//                   <video
//                     src={imgUrl(host.auditionVideo)}
//                     controls
//                     style={{
//                       width: "100%",
//                       borderRadius: 12,
//                       background: "#000",
//                       maxHeight: 280,
//                       display: "block",
//                       border: "2px solid #e5e7eb",
//                     }}
//                     onError={(e) => {
//                       e.target.style.display = "none";
//                       e.target.nextSibling.style.display = "flex";
//                     }}
//                   />
//                   <div
//                     style={{
//                       display: "none",
//                       background: "#f9fafb",
//                       border: "2px dashed #e5e7eb",
//                       borderRadius: 12,
//                       padding: "24px",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexDirection: "column",
//                       gap: 8,
//                       color: "#6b7280",
//                       fontSize: 14,
//                     }}
//                   >
//                     <span style={{ fontSize: 24 }}>🎤</span>
//                     <span>Cannot load video.</span>
//                     <a
//                       href={imgUrl(host.auditionVideo)}
//                       target="_blank"
//                       rel="noreferrer"
//                       style={{
//                         color: "#e11d48",
//                         fontWeight: 700,
//                         fontSize: 13,
//                       }}
//                     >
//                       Open directly ↗
//                     </a>
//                   </div>
//                   <a
//                     href={imgUrl(host.auditionVideo)}
//                     target="_blank"
//                     rel="noreferrer"
//                     style={{
//                       display: "inline-block",
//                       marginTop: 8,
//                       color: "#e11d48",
//                       fontSize: 13,
//                       fontWeight: 600,
//                     }}
//                   >
//                     Open in new tab ↗
//                   </a>
//                 </div>
//               ) : (
//                 <div
//                   style={{
//                     background: "#f9fafb",
//                     border: "2px dashed #e5e7eb",
//                     borderRadius: 12,
//                     padding: "24px",
//                     textAlign: "center",
//                     color: "#9ca3af",
//                     fontSize: 14,
//                   }}
//                 >
//                   <div style={{ fontSize: 28, marginBottom: 6 }}>🎤</div>
//                   No audition video uploaded yet.
//                 </div>
//               )}
//             </div>
//           )}

//           {/* KYC */}
//           {tab === "kyc" && (
//             <div>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   marginBottom: 20,
//                 }}
//               >
//                 <div>
//                   <h3
//                     style={{
//                       margin: 0,
//                       fontSize: 16,
//                       fontWeight: 700,
//                       color: "#111",
//                     }}
//                   >
//                     KYC Documents
//                   </h3>
//                   <div style={{ marginTop: 6 }}>
//                     <Badge status={kycStatus} />
//                     {host.kyc?.submittedAt && (
//                       <span
//                         style={{
//                           fontSize: 12,
//                           color: "#9ca3af",
//                           marginLeft: 8,
//                         }}
//                       >
//                         Submitted: {fmt(host.kyc.submittedAt)}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {kycStatus === "submitted" && (
//                   <div style={{ display: "flex", gap: 10 }}>
//                     <button
//                       onClick={() => handleKYC("approve")}
//                       disabled={!!kycLoading}
//                       style={{
//                         padding: "10px 20px",
//                         background:
//                           kycLoading === "approve" ? "#9ca3af" : "#10b981",
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: 8,
//                         fontWeight: 700,
//                         fontSize: 14,
//                         cursor: kycLoading ? "not-allowed" : "pointer",
//                       }}
//                     >
//                       {kycLoading === "approve" ? "…" : "✓ Approve KYC"}
//                     </button>
//                     <button
//                       onClick={() => handleKYC("reject")}
//                       disabled={!!kycLoading}
//                       style={{
//                         padding: "10px 20px",
//                         background:
//                           kycLoading === "reject" ? "#9ca3af" : "#ef4444",
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: 8,
//                         fontWeight: 700,
//                         fontSize: 14,
//                         cursor: kycLoading ? "not-allowed" : "pointer",
//                       }}
//                     >
//                       {kycLoading === "reject" ? "…" : "✕ Reject KYC"}
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: 16,
//                 }}
//               >
//                 {[
//                   { key: "aadhaarFront", label: "Aadhaar Front" },
//                   { key: "aadhaarBack", label: "Aadhaar Back" },
//                   { key: "voterFront", label: "Voter ID Front" },
//                   { key: "voterBack", label: "Voter ID Back" },
//                 ].map(({ key, label }) => (
//                   <div key={key}>
//                     <div
//                       style={{
//                         fontSize: 13,
//                         fontWeight: 600,
//                         color: "#374151",
//                         marginBottom: 8,
//                       }}
//                     >
//                       {label}
//                     </div>
//                     <div
//                       style={{
//                         border: "1px solid #e5e7eb",
//                         borderRadius: 12,
//                         overflow: "hidden",
//                         aspectRatio: "16/10",
//                         background: "#f9fafb",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       {host.kyc?.[key] ? (
//                         <a
//                           href={imgUrl(host.kyc[key])}
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           <img
//                             src={imgUrl(host.kyc[key])}
//                             alt={label}
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               objectFit: "cover",
//                             }}
//                             onError={(e) => {
//                               e.target.style.display = "none";
//                               e.target.nextSibling.style.display = "flex";
//                             }}
//                           />
//                           <div
//                             style={{
//                               display: "none",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               color: "#e11d48",
//                               fontWeight: 700,
//                               fontSize: 13,
//                             }}
//                           >
//                             View Document ↗
//                           </div>
//                         </a>
//                       ) : (
//                         <span style={{ color: "#d1d5db", fontSize: 13 }}>
//                           Not uploaded
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* BANK */}
//           {tab === "bank" && (
//             <div>
//               <h3
//                 style={{
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: "#111",
//                   marginBottom: 16,
//                 }}
//               >
//                 Bank Details
//               </h3>
//               {host.bank?.accountNumber ? (
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1fr",
//                     gap: 16,
//                   }}
//                 >
//                   {[
//                     {
//                       label: "Account Holder",
//                       value: host.bank.accountHolderName,
//                     },
//                     { label: "Bank Name", value: host.bank.bankName },
//                     { label: "Account Number", value: host.bank.accountNumber },
//                     { label: "IFSC Code", value: host.bank.ifscCode },
//                   ].map((item) => (
//                     <div
//                       key={item.label}
//                       style={{
//                         border: "1px solid #e5e7eb",
//                         borderRadius: 12,
//                         padding: "16px 20px",
//                       }}
//                     >
//                       <div
//                         style={{
//                           fontSize: 12,
//                           color: "#9ca3af",
//                           marginBottom: 4,
//                         }}
//                       >
//                         {item.label}
//                       </div>
//                       <div
//                         style={{ fontSize: 15, fontWeight: 600, color: "#111" }}
//                       >
//                         {item.value || "—"}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p style={{ color: "#9ca3af", fontSize: 14 }}>
//                   No bank details added yet.
//                 </p>
//               )}
//             </div>
//           )}

//           {/* ACTIVITY */}
//           {tab === "activity" && (
//             <div>
//               <h3
//                 style={{
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: "#111",
//                   marginBottom: 16,
//                 }}
//               >
//                 Account Activity
//               </h3>
//               <div
//                 style={{ display: "flex", flexDirection: "column", gap: 10 }}
//               >
//                 {[
//                   {
//                     label: "Account Created",
//                     value: host.createdAt
//                       ? new Date(host.createdAt).toLocaleString("en-IN")
//                       : "—",
//                     icon: "📅",
//                   },
//                   {
//                     label: "Last Updated",
//                     value: host.updatedAt
//                       ? new Date(host.updatedAt).toLocaleString("en-IN")
//                       : "—",
//                     icon: "🕐",
//                   },
//                   {
//                     label: "KYC Submitted",
//                     value: host.kyc?.submittedAt
//                       ? new Date(host.kyc.submittedAt).toLocaleString("en-IN")
//                       : "Not submitted",
//                     icon: "📋",
//                   },
//                   {
//                     label: "Total Minutes on Call",
//                     value: `${host.totalMinutes || 0} min`,
//                     icon: "⏱️",
//                   },
//                 ].map((item) => (
//                   <div
//                     key={item.label}
//                     style={{
//                       border: "1px solid #e5e7eb",
//                       borderRadius: 10,
//                       padding: "14px 18px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 14,
//                     }}
//                   >
//                     <span style={{ fontSize: 20 }}>{item.icon}</span>
//                     <div>
//                       <div style={{ fontSize: 12, color: "#9ca3af" }}>
//                         {item.label}
//                       </div>
//                       <div
//                         style={{
//                           fontSize: 14,
//                           fontWeight: 600,
//                           color: "#111",
//                           marginTop: 2,
//                         }}
//                       >
//                         {item.value}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
// function Dashboard({ onLogout }) {
//   const [tab, setTab] = useState("overview");
//   const [stats, setStats] = useState(null);
//   const [hosts, setHosts] = useState([]);
//   const [withdrawals, setWithdrawals] = useState([]);
//   const [selectedHost, setSelectedHost] = useState(null);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [kycFilter, setKycFilter] = useState("all");
//   const [accountFilter, setAccountFilter] = useState("all");

//   const loadStats = useCallback(async () => {
//     const res = await adminFetch("/stats");
//     if (res.success) setStats(res.stats);
//   }, []);

//   const loadHosts = useCallback(async () => {
//     setLoading(true);
//     const res = await adminFetch("/hosts");
//     if (res.success) setHosts(res.hosts);
//     setLoading(false);
//   }, []);

//   const loadWithdrawals = useCallback(async () => {
//     setLoading(true);
//     const res = await adminFetch("/withdrawals");
//     if (res.success) setWithdrawals(res.withdrawals);
//     setLoading(false);
//   }, []);

//   // Fetch FULL host detail (includes images, introVideo, auditionVideo)
//   const openHostModal = useCallback(async (host) => {
//     // Show modal immediately with list data, then enrich with full detail
//     setSelectedHost(host);
//     setModalLoading(true);
//     try {
//       const res = await adminFetch(`/hosts/${host._id}`);
//       if (res.success) {
//         setSelectedHost(res.host);
//       }
//     } catch (e) {
//       console.error("Failed to load host detail:", e);
//     } finally {
//       setModalLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadStats();
//     loadHosts();
//     loadWithdrawals();
//   }, []);

//   async function handleWithdrawalAction(id, action) {
//     const paths = {
//       approve: `/withdrawals/${id}/approve`,
//       "mark-paid": `/withdrawals/${id}/mark-paid`,
//       reject: `/withdrawals/${id}/reject`,
//     };
//     const res = await adminFetch(paths[action], { method: "PATCH" });
//     if (res.success) {
//       loadWithdrawals();
//       loadStats();
//       alert("✅ " + res.message);
//     } else {
//       alert("Error: " + res.message);
//     }
//   }

//   async function handleBanToggle(host) {
//     const isBanned = host.isBanned;
//     const action = isBanned ? "Unblock" : "Block";
//     if (!window.confirm(`${action} ${host.firstName} ${host.lastName}?`))
//       return;

//     const res = await adminFetch(`/hosts/${host._id}/ban`, {
//       method: "PATCH",
//       body: { banned: !isBanned },
//     });
//     if (res.success) {
//       setHosts((prev) =>
//         prev.map((h) =>
//           h._id === host._id ? { ...h, isBanned: !isBanned } : h,
//         ),
//       );
//       alert(`✅ Host ${!isBanned ? "blocked" : "unblocked"} successfully.`);
//     } else {
//       alert("Error: " + res.message);
//     }
//   }

//   async function handleDeleteHost(host) {
//     if (
//       !window.confirm(
//         `⚠️ PERMANENTLY DELETE "${host.firstName} ${host.lastName}"?\n\nThis will delete their account and all withdrawal records. This cannot be undone.`,
//       )
//     )
//       return;

//     const res = await adminFetch(`/hosts/${host._id}`, { method: "DELETE" });
//     if (res.success) {
//       setHosts((prev) => prev.filter((h) => h._id !== host._id));
//       loadStats();
//       alert("✅ " + res.message);
//     } else {
//       alert("Error: " + res.message);
//     }
//   }

//   function handleKYCAction(hostId, newStatus) {
//     setHosts((prev) =>
//       prev.map((h) =>
//         h._id === hostId
//           ? {
//               ...h,
//               kyc: { ...h.kyc, status: newStatus },
//               isVerified: newStatus === "verified",
//               accountStatus: newStatus === "verified" ? "approved" : "rejected",
//             }
//           : h,
//       ),
//     );
//     if (selectedHost?._id === hostId) {
//       setSelectedHost((prev) => ({
//         ...prev,
//         kyc: { ...prev.kyc, status: newStatus },
//         isVerified: newStatus === "verified",
//       }));
//     }
//     loadStats();
//   }

//   const filteredHosts = hosts.filter((h) => {
//     const name = `${h.firstName} ${h.lastName} ${h.phoneNumber}`.toLowerCase();
//     const matchSearch = !search || name.includes(search.toLowerCase());
//     const matchKyc = kycFilter === "all" || h.kyc?.status === kycFilter;
//     const matchAccount =
//       accountFilter === "all" ||
//       (accountFilter === "verified" && h.isVerified) ||
//       (accountFilter === "unverified" && !h.isVerified);
//     return matchSearch && matchKyc && matchAccount;
//   });

//   const pendingWithdrawals = withdrawals.filter(
//     (w) => w.status === "pending",
//   ).length;

//   const navStyle = (t) => ({
//     padding: "12px 24px",
//     border: "none",
//     background: "none",
//     cursor: "pointer",
//     fontSize: 15,
//     fontWeight: 600,
//     color: tab === t ? "#e11d48" : "#6b7280",
//     borderBottom: tab === t ? "2px solid #e11d48" : "2px solid transparent",
//     transition: "all 0.2s",
//     position: "relative",
//   });

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#f3f4f6",
//         fontFamily: "'Inter', sans-serif",
//       }}
//     >
//       {/* Top Nav */}
//       {/* <div
//         style={{
//           background: "#fff",
//           boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
//           padding: "0 32px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           height: 64,
//           position: "sticky",
//           top: 0,
//           zIndex: 100,
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <span style={{ fontSize: 22 }}>🍒</span>
//           <h1
//             style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111" }}
//           >
//             Admin Dashboard
//           </h1>
//         </div> */}

//       <div
//         style={{
//           background: "#fff",
//           boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
//           padding: "0 32px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           height: 64,
//           position: "sticky",
//           top: 0,
//           zIndex: 100,
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <img
//             src="/user-logo.png"
//             alt="Red Cherry"
//             style={{
//               width: 40,
//               height: 40,
//               borderRadius: "50%",
//               objectFit: "cover",
//             }}
//           />
//           <h1
//             style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111" }}
//           >
//             Admin Dashboard
//           </h1>
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
//           <span style={{ fontSize: 14, color: "#6b7280" }}>
//             Welcome, superadmin
//           </span>
//           <button
//             onClick={onLogout}
//             style={{
//               padding: "8px 18px",
//               background: "#e11d48",
//               color: "#fff",
//               border: "none",
//               borderRadius: 8,
//               fontWeight: 700,
//               fontSize: 14,
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//             }}
//           >
//             ⎋ Logout
//           </button>
//         </div>
//       </div>

//       {/* Tab Bar */}
//       <div
//         style={{
//           background: "#fff",
//           borderBottom: "1px solid #e5e7eb",
//           padding: "0 32px",
//           display: "flex",
//           gap: 4,
//         }}
//       >
//         <button style={navStyle("overview")} onClick={() => setTab("overview")}>
//           Overview
//         </button>
//         <button style={navStyle("hosts")} onClick={() => setTab("hosts")}>
//           Hosts
//         </button>
//         <button
//           style={navStyle("withdrawals")}
//           onClick={() => setTab("withdrawals")}
//         >
//           Withdrawals
//           {pendingWithdrawals > 0 && (
//             <span
//               style={{
//                 position: "absolute",
//                 top: 8,
//                 right: 6,
//                 background: "#e11d48",
//                 color: "#fff",
//                 borderRadius: "50%",
//                 width: 18,
//                 height: 18,
//                 fontSize: 11,
//                 fontWeight: 700,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               {pendingWithdrawals}
//             </span>
//           )}
//         </button>
//       </div>

//       <div style={{ padding: "28px 32px" }}>
//         {/* ── OVERVIEW ── */}
//         {tab === "overview" && (
//           <div>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(3, 1fr)",
//                 gap: 20,
//                 marginBottom: 28,
//               }}
//             >
//               <StatCard
//                 icon="👥"
//                 value={stats?.totalHosts ?? "…"}
//                 label="Total Hosts"
//                 sub={`${stats?.onlineHosts ?? 0} active`}
//                 color="#3b82f6"
//               />
//               <StatCard
//                 icon="🟢"
//                 value={stats?.onlineHosts ?? "…"}
//                 label="Online Now"
//                 sub="Currently available"
//                 color="#10b981"
//               />
//               <StatCard
//                 icon="📋"
//                 value={stats?.pendingKYC ?? "…"}
//                 label="Pending KYC"
//                 sub="Awaiting review"
//                 color="#f59e0b"
//               />
//               <StatCard
//                 icon="💸"
//                 value={stats?.pendingWithdrawals ?? "…"}
//                 label="Pending Withdrawals"
//                 sub="Awaiting approval"
//                 color="#ef4444"
//               />
//               <StatCard
//                 icon="📈"
//                 value={`₹${stats?.totalEarnings ?? 0}`}
//                 label="Total Earnings"
//                 sub={`${stats?.totalCalls ?? 0} calls completed`}
//                 color="#8b5cf6"
//               />
//               <StatCard
//                 icon="📞"
//                 value={stats?.totalCalls ?? "…"}
//                 label="Total Calls"
//                 sub="All time"
//                 color="#06b6d4"
//               />
//             </div>

//             {/* Quick action shortcuts */}
//             <div
//               style={{
//                 background: "#fff",
//                 borderRadius: 16,
//                 padding: "24px",
//                 boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
//               }}
//             >
//               <h3
//                 style={{
//                   margin: "0 0 16px",
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: "#111",
//                 }}
//               >
//                 Quick Actions
//               </h3>
//               <div style={{ display: "flex", gap: 12 }}>
//                 <button
//                   onClick={() => setTab("hosts")}
//                   style={{
//                     padding: "10px 20px",
//                     background: "#fef3c7",
//                     color: "#92400e",
//                     border: "none",
//                     borderRadius: 8,
//                     fontWeight: 600,
//                     fontSize: 14,
//                     cursor: "pointer",
//                   }}
//                 >
//                   📋 Review Pending KYC ({stats?.pendingKYC ?? 0})
//                 </button>
//                 <button
//                   onClick={() => setTab("withdrawals")}
//                   style={{
//                     padding: "10px 20px",
//                     background: "#fee2e2",
//                     color: "#991b1b",
//                     border: "none",
//                     borderRadius: 8,
//                     fontWeight: 600,
//                     fontSize: 14,
//                     cursor: "pointer",
//                   }}
//                 >
//                   💸 Process Withdrawals ({stats?.pendingWithdrawals ?? 0})
//                 </button>
//                 <button
//                   onClick={() => {
//                     loadStats();
//                     loadHosts();
//                     loadWithdrawals();
//                   }}
//                   style={{
//                     padding: "10px 20px",
//                     background: "#e0e7ff",
//                     color: "#3730a3",
//                     border: "none",
//                     borderRadius: 8,
//                     fontWeight: 600,
//                     fontSize: 14,
//                     cursor: "pointer",
//                   }}
//                 >
//                   🔄 Refresh All
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── HOSTS ── */}
//         {tab === "hosts" && (
//           <div
//             style={{
//               background: "#fff",
//               borderRadius: 16,
//               boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 padding: "20px 24px",
//                 borderBottom: "1px solid #e5e7eb",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: 16,
//                 }}
//               >
//                 <h2
//                   style={{
//                     margin: 0,
//                     fontSize: 18,
//                     fontWeight: 700,
//                     color: "#111",
//                   }}
//                 >
//                   Host Management
//                 </h2>
//                 <button
//                   onClick={loadHosts}
//                   style={{
//                     width: 36,
//                     height: 36,
//                     background: "#3b82f6",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: 8,
//                     cursor: "pointer",
//                     fontSize: 16,
//                   }}
//                 >
//                   🔄
//                 </button>
//               </div>

//               <div style={{ display: "flex", gap: 12 }}>
//                 <input
//                   type="text"
//                   placeholder="Search by name, phone, email…"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   style={{
//                     flex: 1,
//                     padding: "10px 16px",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: 8,
//                     fontSize: 14,
//                     outline: "none",
//                   }}
//                 />
//                 <select
//                   value={kycFilter}
//                   onChange={(e) => setKycFilter(e.target.value)}
//                   style={{
//                     padding: "10px 12px",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: 8,
//                     fontSize: 14,
//                     outline: "none",
//                     background: "#fff",
//                   }}
//                 >
//                   <option value="all">All KYC Status</option>
//                   <option value="submitted">Pending KYC</option>
//                   <option value="verified">KYC Approved</option>
//                   <option value="rejected">KYC Rejected</option>
//                   <option value="pending">Not Submitted</option>
//                 </select>
//                 <select
//                   value={accountFilter}
//                   onChange={(e) => setAccountFilter(e.target.value)}
//                   style={{
//                     padding: "10px 12px",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: 8,
//                     fontSize: 14,
//                     outline: "none",
//                     background: "#fff",
//                   }}
//                 >
//                   <option value="all">All Account Status</option>
//                   <option value="verified">Verified</option>
//                   <option value="unverified">Unverified</option>
//                 </select>
//               </div>
//             </div>

//             {loading ? (
//               <div
//                 style={{
//                   textAlign: "center",
//                   padding: 60,
//                   color: "#9ca3af",
//                   fontSize: 15,
//                 }}
//               >
//                 Loading hosts…
//               </div>
//             ) : (
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ background: "#f9fafb" }}>
//                     {[
//                       "HOST",
//                       "CONTACT",
//                       "KYC STATUS",
//                       "ACCOUNT",
//                       "WALLET",
//                       "STATS",
//                       "ACTIONS",
//                     ].map((h) => (
//                       <th
//                         key={h}
//                         style={{
//                           padding: "12px 16px",
//                           textAlign: "left",
//                           fontSize: 11,
//                           fontWeight: 700,
//                           color: "#9ca3af",
//                           letterSpacing: 0.5,
//                           borderBottom: "1px solid #e5e7eb",
//                         }}
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredHosts.map((host, i) => (
//                     <tr
//                       key={host._id}
//                       style={{
//                         borderBottom: "1px solid #f3f4f6",
//                         background: i % 2 === 0 ? "#fff" : "#fafafa",
//                       }}
//                     >
//                       <td style={{ padding: "14px 16px" }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 10,
//                           }}
//                         >
//                           <div
//                             style={{
//                               width: 38,
//                               height: 38,
//                               borderRadius: "50%",
//                               overflow: "hidden",
//                               background: "#f3f4f6",
//                               flexShrink: 0,
//                             }}
//                           >
//                             {host.profileImage ? (
//                               <img
//                                 src={imgUrl(host.profileImage)}
//                                 alt=""
//                                 style={{
//                                   width: "100%",
//                                   height: "100%",
//                                   objectFit: "cover",
//                                 }}
//                               />
//                             ) : (
//                               <div
//                                 style={{
//                                   width: "100%",
//                                   height: "100%",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   fontWeight: 700,
//                                   color: "#9ca3af",
//                                   fontSize: 14,
//                                 }}
//                               >
//                                 {host.firstName?.[0]?.toUpperCase() || "H"}
//                               </div>
//                             )}
//                           </div>
//                           <div>
//                             <div
//                               style={{
//                                 fontSize: 14,
//                                 fontWeight: 600,
//                                 color: host.isBanned ? "#9ca3af" : "#111",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 6,
//                               }}
//                             >
//                               {host.firstName} {host.lastName}
//                               {host.isBanned && (
//                                 <span
//                                   style={{
//                                     fontSize: 10,
//                                     fontWeight: 700,
//                                     background: "#fee2e2",
//                                     color: "#991b1b",
//                                     padding: "2px 6px",
//                                     borderRadius: 10,
//                                     letterSpacing: 0.5,
//                                   }}
//                                 >
//                                   BLOCKED
//                                 </span>
//                               )}
//                             </div>
//                             <div
//                               style={{
//                                 fontSize: 11,
//                                 color: "#9ca3af",
//                                 marginTop: 1,
//                               }}
//                             >
//                               ID: {host._id?.slice(-8)}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td
//                         style={{
//                           padding: "14px 16px",
//                           fontSize: 13,
//                           color: "#374151",
//                         }}
//                       >
//                         {host.phoneNumber}
//                       </td>
//                       <td style={{ padding: "14px 16px" }}>
//                         <Badge status={host.kyc?.status || "pending"} />
//                       </td>
//                       <td style={{ padding: "14px 16px" }}>
//                         <Badge
//                           status={
//                             host.isVerified
//                               ? "verified"
//                               : host.kyc?.status === "submitted"
//                                 ? "submitted"
//                                 : host.kyc?.status === "rejected"
//                                   ? "rejected"
//                                   : "pending"
//                           }
//                         />
//                       </td>
//                       <td
//                         style={{
//                           padding: "14px 16px",
//                           fontSize: 13,
//                           fontWeight: 600,
//                           color: "#111",
//                         }}
//                       >
//                         ₹{host.earnings || 0}
//                         <div
//                           style={{
//                             fontSize: 11,
//                             color: "#9ca3af",
//                             fontWeight: 400,
//                           }}
//                         >
//                           0 points
//                         </div>
//                       </td>
//                       <td
//                         style={{
//                           padding: "14px 16px",
//                           fontSize: 12,
//                           color: "#6b7280",
//                         }}
//                       >
//                         {host.totalCalls || 0} calls
//                         <br />
//                         {host.totalMinutes || 0} min
//                       </td>
//                       <td style={{ padding: "14px 16px" }}>
//                         <div
//                           style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
//                         >
//                           {/* View Profile */}
//                           <button
//                             onClick={() => openHostModal(host)}
//                             title="View Profile"
//                             style={{
//                               width: 34,
//                               height: 34,
//                               borderRadius: 8,
//                               border: "1px solid #e5e7eb",
//                               background: "#fff",
//                               cursor: "pointer",
//                               fontSize: 15,
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                             }}
//                           >
//                             👁️
//                           </button>

//                           {/* KYC Review */}
//                           {host.kyc?.status === "submitted" && (
//                             <button
//                               onClick={() => openHostModal(host)}
//                               title="Review KYC"
//                               style={{
//                                 width: 34,
//                                 height: 34,
//                                 borderRadius: 8,
//                                 border: "1px solid #f59e0b",
//                                 background: "#fef3c7",
//                                 cursor: "pointer",
//                                 fontSize: 13,
//                                 fontWeight: 700,
//                                 color: "#92400e",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                               }}
//                             >
//                               📋
//                             </button>
//                           )}

//                           {/* Block / Unblock */}
//                           <button
//                             onClick={() => handleBanToggle(host)}
//                             title={
//                               host.isBanned ? "Unblock Host" : "Block Host"
//                             }
//                             style={{
//                               width: 34,
//                               height: 34,
//                               borderRadius: 8,
//                               border: host.isBanned
//                                 ? "1px solid #10b981"
//                                 : "1px solid #f97316",
//                               background: host.isBanned ? "#d1fae5" : "#fff7ed",
//                               cursor: "pointer",
//                               fontSize: 15,
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                             }}
//                           >
//                             {host.isBanned ? "✅" : "🚫"}
//                           </button>

//                           {/* Delete */}
//                           <button
//                             onClick={() => handleDeleteHost(host)}
//                             title="Delete Host Account"
//                             style={{
//                               width: 34,
//                               height: 34,
//                               borderRadius: 8,
//                               border: "1px solid #ef4444",
//                               background: "#fef2f2",
//                               cursor: "pointer",
//                               fontSize: 15,
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                             }}
//                           >
//                             🗑️
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                   {filteredHosts.length === 0 && (
//                     <tr>
//                       <td
//                         colSpan={7}
//                         style={{
//                           textAlign: "center",
//                           padding: 40,
//                           color: "#9ca3af",
//                           fontSize: 14,
//                         }}
//                       >
//                         No hosts found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {/* ── WITHDRAWALS ── */}
//         {tab === "withdrawals" && (
//           <div
//             style={{
//               background: "#fff",
//               borderRadius: 16,
//               boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 padding: "20px 24px",
//                 borderBottom: "1px solid #e5e7eb",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <h2
//                 style={{
//                   margin: 0,
//                   fontSize: 18,
//                   fontWeight: 700,
//                   color: "#111",
//                 }}
//               >
//                 Withdrawal Requests
//               </h2>
//               <button
//                 onClick={loadWithdrawals}
//                 style={{
//                   width: 36,
//                   height: 36,
//                   background: "#3b82f6",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: 8,
//                   cursor: "pointer",
//                   fontSize: 16,
//                 }}
//               >
//                 🔄
//               </button>
//             </div>

//             {loading ? (
//               <div
//                 style={{
//                   textAlign: "center",
//                   padding: 60,
//                   color: "#9ca3af",
//                   fontSize: 15,
//                 }}
//               >
//                 Loading withdrawals…
//               </div>
//             ) : (
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ background: "#f9fafb" }}>
//                     {[
//                       "HOST",
//                       "AMOUNT",
//                       "BANK DETAILS",
//                       "WALLET BALANCE",
//                       "REQUESTED",
//                       "STATUS",
//                       "ACTIONS",
//                     ].map((h) => (
//                       <th
//                         key={h}
//                         style={{
//                           padding: "12px 16px",
//                           textAlign: "left",
//                           fontSize: 11,
//                           fontWeight: 700,
//                           color: "#9ca3af",
//                           letterSpacing: 0.5,
//                           borderBottom: "1px solid #e5e7eb",
//                         }}
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {withdrawals.map((w, i) => (
//                     <tr
//                       key={w._id}
//                       style={{
//                         borderBottom: "1px solid #f3f4f6",
//                         background: i % 2 === 0 ? "#fff" : "#fafafa",
//                       }}
//                     >
//                       <td style={{ padding: "16px" }}>
//                         <div
//                           style={{
//                             fontSize: 14,
//                             fontWeight: 600,
//                             color: "#111",
//                           }}
//                         >
//                           {w.hostName || "Unknown"}
//                         </div>
//                         <div
//                           style={{
//                             fontSize: 12,
//                             color: "#9ca3af",
//                             marginTop: 2,
//                           }}
//                         >
//                           {w.hostPhone}
//                         </div>
//                       </td>
//                       <td style={{ padding: "16px" }}>
//                         <span
//                           style={{
//                             fontSize: 17,
//                             fontWeight: 800,
//                             color: "#111",
//                           }}
//                         >
//                           ₹{w.amount}
//                         </span>
//                       </td>
//                       <td style={{ padding: "16px" }}>
//                         {w.bank?.accountNumber ? (
//                           <div style={{ fontSize: 13, lineHeight: 1.7 }}>
//                             <div style={{ fontWeight: 700, color: "#111" }}>
//                               {w.bank.accountHolderName}
//                             </div>
//                             <div style={{ color: "#6b7280" }}>
//                               {w.bank.bankName}
//                             </div>
//                             <div style={{ color: "#374151" }}>
//                               A/C: {w.bank.accountNumber}
//                             </div>
//                             <div style={{ color: "#374151" }}>
//                               IFSC: {w.bank.ifscCode}
//                             </div>
//                           </div>
//                         ) : (
//                           <div style={{ fontSize: 13, color: "#9ca3af" }}>
//                             <div>A/C:</div>
//                             <div>IFSC:</div>
//                             <div>Type:</div>
//                           </div>
//                         )}
//                       </td>
//                       <td
//                         style={{
//                           padding: "16px",
//                           fontSize: 14,
//                           fontWeight: 600,
//                           color: "#111",
//                         }}
//                       >
//                         ₹{w.currentWalletBalance || 0}
//                       </td>
//                       <td
//                         style={{
//                           padding: "16px",
//                           fontSize: 13,
//                           color: "#6b7280",
//                         }}
//                       >
//                         {fmt(w.createdAt)}
//                       </td>
//                       <td style={{ padding: "16px" }}>
//                         <Badge
//                           status={
//                             w.status === "pending"
//                               ? "submitted"
//                               : w.status === "approved"
//                                 ? "approved"
//                                 : w.status === "success"
//                                   ? "success"
//                                   : "failed"
//                           }
//                         />
//                       </td>
//                       <td style={{ padding: "16px" }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: 6,
//                             minWidth: 100,
//                           }}
//                         >
//                           {/* Separator line above actions */}
//                           <div
//                             style={{
//                               borderTop: "1px solid #e5e7eb",
//                               marginBottom: 4,
//                             }}
//                           />
//                           {w.status === "pending" && (
//                             <>
//                               <button
//                                 onClick={() =>
//                                   handleWithdrawalAction(w._id, "approve")
//                                 }
//                                 style={{
//                                   padding: "8px 16px",
//                                   background: "#10b981",
//                                   color: "#fff",
//                                   border: "none",
//                                   borderRadius: 6,
//                                   fontWeight: 700,
//                                   fontSize: 13,
//                                   cursor: "pointer",
//                                 }}
//                               >
//                                 Approve
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   handleWithdrawalAction(w._id, "reject")
//                                 }
//                                 style={{
//                                   padding: "8px 16px",
//                                   background: "#ef4444",
//                                   color: "#fff",
//                                   border: "none",
//                                   borderRadius: 6,
//                                   fontWeight: 700,
//                                   fontSize: 13,
//                                   cursor: "pointer",
//                                 }}
//                               >
//                                 Reject
//                               </button>
//                             </>
//                           )}
//                           {w.status === "approved" && (
//                             <button
//                               onClick={() =>
//                                 handleWithdrawalAction(w._id, "mark-paid")
//                               }
//                               style={{
//                                 padding: "8px 16px",
//                                 background: "#3b82f6",
//                                 color: "#fff",
//                                 border: "none",
//                                 borderRadius: 6,
//                                 fontWeight: 700,
//                                 fontSize: 13,
//                                 cursor: "pointer",
//                               }}
//                             >
//                               Mark Paid
//                             </button>
//                           )}
//                           {(w.status === "success" ||
//                             w.status === "failed") && (
//                             <span
//                               style={{
//                                 fontSize: 12,
//                                 color: "#9ca3af",
//                                 fontStyle: "italic",
//                               }}
//                             >
//                               {w.status === "success"
//                                 ? "✅ Paid"
//                                 : "❌ Rejected"}
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                   {withdrawals.length === 0 && (
//                     <tr>
//                       <td
//                         colSpan={7}
//                         style={{
//                           textAlign: "center",
//                           padding: 40,
//                           color: "#9ca3af",
//                           fontSize: 14,
//                         }}
//                       >
//                         No withdrawal requests found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Host Modal */}
//       {selectedHost && (
//         <HostModal
//           host={selectedHost}
//           onClose={() => setSelectedHost(null)}
//           onKYCAction={handleKYCAction}
//           mediaLoading={modalLoading}
//         />
//       )}
//     </div>
//   );
// }

// // ── ROOT APP ──────────────────────────────────────────────────────────────────
// export default function AdminDashboard() {
//   const [authed, setAuthed] = useState(
//     () => sessionStorage.getItem("rc_admin_key") === ADMIN_PASSWORD,
//   );

//   function handleLogin() {
//     setAuthed(true);
//   }

//   function handleLogout() {
//     sessionStorage.removeItem("rc_admin_key");
//     setAuthed(false);
//   }

//   if (!authed) return <LoginPage onLogin={handleLogin} />;
//   return <Dashboard onLogout={handleLogout} />;
// }

//admin + agency control

// ////======================v2======================
// // host-frontend/src/AdminDashboard.jsx
// // Complete standalone admin dashboard for Red Cherry
// // Routes: /admin  (login) → /admin/dashboard

// // host-frontend/src/AdminDashboard.jsx
// // Complete standalone admin dashboard for Red Cherry
// // Routes: /admin  (login) → /admin/dashboard

// import { useState, useEffect, useCallback } from "react";

// const API_BASE = "/api/host/admin";
// const ADMIN_PASSWORD = "<removed>";

// // ── helpers ────────────────────────────────────────────────────────────────────
// function adminFetch(path, options = {}) {
//   return fetch(`${API_BASE}${path}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       "x-admin-key": sessionStorage.getItem("rc_admin_key") || "",
//       ...(options.headers || {}),
//     },
//     body: options.body ? JSON.stringify(options.body) : undefined,
//   }).then((r) => r.json());
// }

// function fmt(date) {
//   if (!date) return "—";
//   return new Date(date).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// }

// function imgUrl(url) {
//   if (!url) return null;
//   if (url.startsWith("http")) return url;
//   if (url.startsWith("/")) return `https://redcheery.com${url}`;
//   return `https://redcheery.com/${url}`;
// }

// // ── Badge component ────────────────────────────────────────────────────────────
// function Badge({ status }) {
//   const map = {
//     verified: { bg: "#d1fae5", color: "#065f46", label: "APPROVED" },
//     submitted: { bg: "#fef3c7", color: "#92400e", label: "PENDING" },
//     pending: { bg: "#f3f4f6", color: "#6b7280", label: "NOT SUBMITTED" },
//     rejected: { bg: "#fee2e2", color: "#991b1b", label: "REJECTED" },
//     approved: { bg: "#dbeafe", color: "#1e40af", label: "APPROVED" },
//     success: { bg: "#d1fae5", color: "#065f46", label: "PAID" },
//     failed: { bg: "#fee2e2", color: "#991b1b", label: "REJECTED" },
//     PENDING_APPROVAL: {
//       bg: "#fef3c7",
//       color: "#92400e",
//       label: "PENDING_APPROVAL",
//     },
//   };
//   const s = map[status] || { bg: "#f3f4f6", color: "#6b7280", label: status };
//   return (
//     <span
//       style={{
//         background: s.bg,
//         color: s.color,
//         padding: "3px 10px",
//         borderRadius: 20,
//         fontSize: 11,
//         fontWeight: 700,
//         letterSpacing: 0.5,
//         whiteSpace: "nowrap",
//       }}
//     >
//       {s.label}
//     </span>
//   );
// }

// // ── LOGIN PAGE ────────────────────────────────────────────────────────────────
// function LoginPage({ onLogin }) {
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setTimeout(() => {
//       if (password === ADMIN_PASSWORD) {
//         sessionStorage.setItem("rc_admin_key", password);
//         onLogin();
//       } else {
//         setError("Incorrect password.");
//       }
//       setLoading(false);
//     }, 500);
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontFamily: "'Inter', sans-serif",
//       }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 20,
//           padding: "48px 40px",
//           width: "100%",
//           maxWidth: 400,
//           boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
//         }}
//       >
//         {/* Logo */}
//         {/* <div style={{ textAlign: "center", marginBottom: 32 }}>
//           <div
//             style={{
//               width: 64,
//               height: 64,
//               background: "linear-gradient(135deg, #e11d48, #9f1239)",
//               borderRadius: 16,
//               display: "inline-flex",
//               alignItems: "center",
//               justifyContent: "center",
//               marginBottom: 16,
//             }}
//           >
//             <span style={{ fontSize: 28 }}>🍒</span>
//           </div> */}
//         <div style={{ textAlign: "center", marginBottom: 32 }}>
//           <div
//             style={{
//               width: 80,
//               height: 80,
//               borderRadius: "50%",
//               display: "inline-flex",
//               alignItems: "center",
//               justifyContent: "center",
//               marginBottom: 16,
//               overflow: "hidden",
//             }}
//           >
//             <img
//               src="/user-logo.png"
//               alt="Red Cherry Logo"
//               style={{ width: "100%", height: "100%", objectFit: "cover" }}
//             />
//           </div>
//           <h1
//             style={{
//               margin: 0,
//               fontSize: 26,
//               fontWeight: 800,
//               color: "#111",
//               letterSpacing: -0.5,
//             }}
//           >
//             Red Cherry
//           </h1>
//           <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14 }}>
//             Admin Dashboard
//           </p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: 20 }}>
//             <label
//               style={{
//                 display: "block",
//                 fontSize: 13,
//                 fontWeight: 600,
//                 color: "#374151",
//                 marginBottom: 6,
//               }}
//             >
//               Admin Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter password"
//               required
//               style={{
//                 width: "100%",
//                 padding: "12px 16px",
//                 border: `2px solid ${error ? "#ef4444" : "#e5e7eb"}`,
//                 borderRadius: 10,
//                 fontSize: 15,
//                 outline: "none",
//                 boxSizing: "border-box",
//                 transition: "border-color 0.2s",
//               }}
//               onFocus={(e) => (e.target.style.borderColor = "#e11d48")}
//               onBlur={(e) =>
//                 (e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb")
//               }
//             />
//             {error && (
//               <p style={{ color: "#ef4444", fontSize: 13, marginTop: 6 }}>
//                 {error}
//               </p>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               width: "100%",
//               padding: "13px",
//               background: loading
//                 ? "#9ca3af"
//                 : "linear-gradient(135deg, #e11d48, #9f1239)",
//               color: "#fff",
//               border: "none",
//               borderRadius: 10,
//               fontSize: 15,
//               fontWeight: 700,
//               cursor: loading ? "not-allowed" : "pointer",
//               transition: "opacity 0.2s",
//             }}
//           >
//             {loading ? "Signing in…" : "Sign In"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// // ── STAT CARD ─────────────────────────────────────────────────────────────────
// function StatCard({ icon, value, label, sub, color }) {
//   return (
//     <div
//       style={{
//         background: "#fff",
//         borderRadius: 16,
//         padding: "24px",
//         display: "flex",
//         alignItems: "center",
//         gap: 16,
//         boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
//       }}
//     >
//       <div
//         style={{
//           width: 48,
//           height: 48,
//           background: color + "18",
//           borderRadius: 12,
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
//             fontSize: 28,
//             fontWeight: 800,
//             color: "#111",
//             lineHeight: 1,
//           }}
//         >
//           {value}
//         </div>
//         <div
//           style={{
//             fontSize: 14,
//             fontWeight: 600,
//             color: "#374151",
//             marginTop: 4,
//           }}
//         >
//           {label}
//         </div>
//         {sub && (
//           <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
//             {sub}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ── HOST PROFILE MODAL ────────────────────────────────────────────────────────
// function HostModal({ host, onClose, onKYCAction, mediaLoading }) {
//   const [tab, setTab] = useState("overview");
//   const [kycLoading, setKycLoading] = useState("");

//   async function handleKYC(action) {
//     setKycLoading(action);
//     const res = await adminFetch(`/hosts/${host._id}/kyc`, {
//       method: "PATCH",
//       body: { action },
//     });
//     setKycLoading("");
//     if (res.success) {
//       onKYCAction(host._id, action === "approve" ? "verified" : "rejected");
//       alert(action === "approve" ? "✅ KYC Approved!" : "❌ KYC Rejected.");
//     } else {
//       alert("Error: " + res.message);
//     }
//   }

//   const tabs = ["overview", "media", "kyc", "bank", "activity"];
//   const kycStatus = host.kyc?.status || "pending";
//   const accountStatus =
//     kycStatus === "verified"
//       ? "approved"
//       : kycStatus === "submitted"
//         ? "PENDING_APPROVAL"
//         : kycStatus === "rejected"
//           ? "rejected"
//           : "pending";

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "rgba(0,0,0,0.6)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         zIndex: 1000,
//         padding: 20,
//       }}
//       onClick={onClose}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 20,
//           width: "100%",
//           maxWidth: 700,
//           maxHeight: "90vh",
//           overflow: "hidden",
//           display: "flex",
//           flexDirection: "column",
//           boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div
//           style={{
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//             padding: "24px 28px",
//             display: "flex",
//             alignItems: "center",
//             gap: 16,
//           }}
//         >
//           <div
//             style={{
//               width: 64,
//               height: 64,
//               borderRadius: "50%",
//               overflow: "hidden",
//               background: "rgba(255,255,255,0.3)",
//               flexShrink: 0,
//               border: "3px solid rgba(255,255,255,0.5)",
//             }}
//           >
//             {host.profileImage ? (
//               <img
//                 src={imgUrl(host.profileImage)}
//                 alt=""
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               />
//             ) : (
//               <div
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 24,
//                   color: "#fff",
//                   fontWeight: 700,
//                 }}
//               >
//                 {host.firstName?.[0]?.toUpperCase() || "H"}
//               </div>
//             )}
//           </div>
//           <div style={{ flex: 1 }}>
//             <h2
//               style={{
//                 margin: 0,
//                 color: "#fff",
//                 fontSize: 22,
//                 fontWeight: 800,
//               }}
//             >
//               {host.firstName} {host.lastName}
//             </h2>
//             <p
//               style={{
//                 margin: "4px 0 8px",
//                 color: "rgba(255,255,255,0.75)",
//                 fontSize: 13,
//               }}
//             >
//               ID: {host._id}
//             </p>
//             <Badge status={accountStatus} />
//           </div>
//           <button
//             onClick={onClose}
//             style={{
//               width: 36,
//               height: 36,
//               borderRadius: "50%",
//               background: "rgba(255,255,255,0.2)",
//               border: "none",
//               cursor: "pointer",
//               color: "#fff",
//               fontSize: 18,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             ✕
//           </button>
//         </div>

//         {/* Tabs */}
//         <div
//           style={{
//             display: "flex",
//             borderBottom: "1px solid #e5e7eb",
//             background: "#fff",
//           }}
//         >
//           {tabs.map((t) => (
//             <button
//               key={t}
//               onClick={() => setTab(t)}
//               style={{
//                 padding: "14px 20px",
//                 border: "none",
//                 background: "none",
//                 cursor: "pointer",
//                 fontSize: 14,
//                 fontWeight: 600,
//                 color: tab === t ? "#e11d48" : "#6b7280",
//                 borderBottom:
//                   tab === t ? "2px solid #e11d48" : "2px solid transparent",
//                 textTransform: "capitalize",
//                 transition: "all 0.2s",
//               }}
//             >
//               {t}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <div style={{ overflowY: "auto", flex: 1, padding: 28 }}>
//           {/* OVERVIEW */}
//           {tab === "overview" && (
//             <div>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: 16,
//                   marginBottom: 24,
//                 }}
//               >
//                 {[
//                   { label: "Phone Number", value: host.phoneNumber },
//                   { label: "Email", value: host.email || "Not provided" },
//                   { label: "Registration Date", value: fmt(host.createdAt) },
//                   {
//                     label: "Last Active",
//                     value: host.updatedAt
//                       ? new Date(host.updatedAt).toLocaleString("en-IN")
//                       : "—",
//                   },
//                 ].map((item) => (
//                   <div
//                     key={item.label}
//                     style={{
//                       border: "1px solid #e5e7eb",
//                       borderRadius: 12,
//                       padding: "16px 20px",
//                     }}
//                   >
//                     <div
//                       style={{
//                         fontSize: 12,
//                         color: "#9ca3af",
//                         marginBottom: 4,
//                       }}
//                     >
//                       {item.label}
//                     </div>
//                     <div
//                       style={{ fontSize: 15, fontWeight: 600, color: "#111" }}
//                     >
//                       {item.value}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <h3
//                 style={{
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: "#111",
//                   marginBottom: 16,
//                 }}
//               >
//                 Performance Statistics
//               </h3>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr 1fr",
//                   gap: 16,
//                 }}
//               >
//                 <div
//                   style={{
//                     background: "linear-gradient(135deg,#10b981,#059669)",
//                     borderRadius: 14,
//                     padding: "20px",
//                     color: "#fff",
//                   }}
//                 >
//                   <div style={{ fontSize: 22, fontWeight: 800 }}>
//                     ₹{host.earnings || 0}
//                   </div>
//                   <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
//                     Wallet Balance
//                   </div>
//                 </div>
//                 <div
//                   style={{
//                     background: "linear-gradient(135deg,#3b82f6,#2563eb)",
//                     borderRadius: 14,
//                     padding: "20px",
//                     color: "#fff",
//                   }}
//                 >
//                   <div style={{ fontSize: 22, fontWeight: 800 }}>
//                     ₹{host.totalEarnings || host.earnings || 0}
//                   </div>
//                   <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
//                     Total Earnings
//                   </div>
//                 </div>
//                 <div
//                   style={{
//                     background: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
//                     borderRadius: 14,
//                     padding: "20px",
//                     color: "#fff",
//                   }}
//                 >
//                   <div style={{ fontSize: 22, fontWeight: 800 }}>
//                     {host.totalCalls || 0}
//                   </div>
//                   <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
//                     Total Calls
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* MEDIA */}
//           {tab === "media" && (
//             <div>
//               {/* Profile Images */}
//               <h3
//                 style={{
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: "#111",
//                   marginBottom: 16,
//                 }}
//               >
//                 📸 Profile Images
//               </h3>
//               {host.images && host.images.length > 0 ? (
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(3, 1fr)",
//                     gap: 12,
//                     marginBottom: 28,
//                   }}
//                 >
//                   {host.images.map((img, i) => {
//                     const url = imgUrl(img.url);
//                     return (
//                       <a
//                         key={img._id || i}
//                         href={url}
//                         target="_blank"
//                         rel="noreferrer"
//                         style={{
//                           display: "block",
//                           borderRadius: 12,
//                           overflow: "hidden",
//                           aspectRatio: "1",
//                           background: "#f3f4f6",
//                           border: "2px solid #e5e7eb",
//                           transition: "border-color 0.2s",
//                           cursor: "pointer",
//                         }}
//                         onMouseEnter={(e) =>
//                           (e.currentTarget.style.borderColor = "#e11d48")
//                         }
//                         onMouseLeave={(e) =>
//                           (e.currentTarget.style.borderColor = "#e5e7eb")
//                         }
//                       >
//                         <img
//                           src={url}
//                           alt={`Image ${i + 1}`}
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                             display: "block",
//                           }}
//                           onError={(e) => {
//                             e.target.style.display = "none";
//                             e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#d1d5db;font-size:13px;flex-direction:column;gap:4px"><span style="font-size:28px">🖼️</span><span>Cannot load</span></div>`;
//                           }}
//                         />
//                       </a>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div
//                   style={{
//                     background: "#f9fafb",
//                     border: "2px dashed #e5e7eb",
//                     borderRadius: 12,
//                     padding: "32px",
//                     textAlign: "center",
//                     marginBottom: 28,
//                     color: "#9ca3af",
//                     fontSize: 14,
//                   }}
//                 >
//                   <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
//                   No images uploaded yet.
//                 </div>
//               )}

//               {/* Intro Video */}
//               <h3
//                 style={{
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: "#111",
//                   marginBottom: 12,
//                 }}
//               >
//                 🎬 Intro Video
//               </h3>
//               {host.introVideo ? (
//                 <div style={{ marginBottom: 28 }}>
//                   <video
//                     src={imgUrl(host.introVideo)}
//                     controls
//                     style={{
//                       width: "100%",
//                       borderRadius: 12,
//                       background: "#000",
//                       maxHeight: 280,
//                       display: "block",
//                       border: "2px solid #e5e7eb",
//                     }}
//                     onError={(e) => {
//                       e.target.style.display = "none";
//                       e.target.nextSibling.style.display = "flex";
//                     }}
//                   />
//                   <div
//                     style={{
//                       display: "none",
//                       background: "#f9fafb",
//                       border: "2px dashed #e5e7eb",
//                       borderRadius: 12,
//                       padding: "24px",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexDirection: "column",
//                       gap: 8,
//                       color: "#6b7280",
//                       fontSize: 14,
//                     }}
//                   >
//                     <span style={{ fontSize: 24 }}>🎬</span>
//                     <span>Cannot load video.</span>
//                     <a
//                       href={imgUrl(host.introVideo)}
//                       target="_blank"
//                       rel="noreferrer"
//                       style={{
//                         color: "#e11d48",
//                         fontWeight: 700,
//                         fontSize: 13,
//                       }}
//                     >
//                       Open directly ↗
//                     </a>
//                   </div>
//                   <a
//                     href={imgUrl(host.introVideo)}
//                     target="_blank"
//                     rel="noreferrer"
//                     style={{
//                       display: "inline-block",
//                       marginTop: 8,
//                       color: "#e11d48",
//                       fontSize: 13,
//                       fontWeight: 600,
//                     }}
//                   >
//                     Open in new tab ↗
//                   </a>
//                 </div>
//               ) : (
//                 <div
//                   style={{
//                     background: "#f9fafb",
//                     border: "2px dashed #e5e7eb",
//                     borderRadius: 12,
//                     padding: "24px",
//                     textAlign: "center",
//                     marginBottom: 28,
//                     color: "#9ca3af",
//                     fontSize: 14,
//                   }}
//                 >
//                   <div style={{ fontSize: 28, marginBottom: 6 }}>🎬</div>
//                   No intro video uploaded yet.
//                 </div>
//               )}

//               {/* Audition Video */}
//               <h3
//                 style={{
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: "#111",
//                   marginBottom: 12,
//                 }}
//               >
//                 🎤 Audition Video
//               </h3>
//               {host.auditionVideo ? (
//                 <div>
//                   <video
//                     src={imgUrl(host.auditionVideo)}
//                     controls
//                     style={{
//                       width: "100%",
//                       borderRadius: 12,
//                       background: "#000",
//                       maxHeight: 280,
//                       display: "block",
//                       border: "2px solid #e5e7eb",
//                     }}
//                     onError={(e) => {
//                       e.target.style.display = "none";
//                       e.target.nextSibling.style.display = "flex";
//                     }}
//                   />
//                   <div
//                     style={{
//                       display: "none",
//                       background: "#f9fafb",
//                       border: "2px dashed #e5e7eb",
//                       borderRadius: 12,
//                       padding: "24px",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexDirection: "column",
//                       gap: 8,
//                       color: "#6b7280",
//                       fontSize: 14,
//                     }}
//                   >
//                     <span style={{ fontSize: 24 }}>🎤</span>
//                     <span>Cannot load video.</span>
//                     <a
//                       href={imgUrl(host.auditionVideo)}
//                       target="_blank"
//                       rel="noreferrer"
//                       style={{
//                         color: "#e11d48",
//                         fontWeight: 700,
//                         fontSize: 13,
//                       }}
//                     >
//                       Open directly ↗
//                     </a>
//                   </div>
//                   <a
//                     href={imgUrl(host.auditionVideo)}
//                     target="_blank"
//                     rel="noreferrer"
//                     style={{
//                       display: "inline-block",
//                       marginTop: 8,
//                       color: "#e11d48",
//                       fontSize: 13,
//                       fontWeight: 600,
//                     }}
//                   >
//                     Open in new tab ↗
//                   </a>
//                 </div>
//               ) : (
//                 <div
//                   style={{
//                     background: "#f9fafb",
//                     border: "2px dashed #e5e7eb",
//                     borderRadius: 12,
//                     padding: "24px",
//                     textAlign: "center",
//                     color: "#9ca3af",
//                     fontSize: 14,
//                   }}
//                 >
//                   <div style={{ fontSize: 28, marginBottom: 6 }}>🎤</div>
//                   No audition video uploaded yet.
//                 </div>
//               )}
//             </div>
//           )}

//           {/* KYC */}
//           {tab === "kyc" && (
//             <div>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   marginBottom: 20,
//                 }}
//               >
//                 <div>
//                   <h3
//                     style={{
//                       margin: 0,
//                       fontSize: 16,
//                       fontWeight: 700,
//                       color: "#111",
//                     }}
//                   >
//                     KYC Documents
//                   </h3>
//                   <div style={{ marginTop: 6 }}>
//                     <Badge status={kycStatus} />
//                     {host.kyc?.submittedAt && (
//                       <span
//                         style={{
//                           fontSize: 12,
//                           color: "#9ca3af",
//                           marginLeft: 8,
//                         }}
//                       >
//                         Submitted: {fmt(host.kyc.submittedAt)}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {kycStatus === "submitted" && (
//                   <div style={{ display: "flex", gap: 10 }}>
//                     <button
//                       onClick={() => handleKYC("approve")}
//                       disabled={!!kycLoading}
//                       style={{
//                         padding: "10px 20px",
//                         background:
//                           kycLoading === "approve" ? "#9ca3af" : "#10b981",
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: 8,
//                         fontWeight: 700,
//                         fontSize: 14,
//                         cursor: kycLoading ? "not-allowed" : "pointer",
//                       }}
//                     >
//                       {kycLoading === "approve" ? "…" : "✓ Approve KYC"}
//                     </button>
//                     <button
//                       onClick={() => handleKYC("reject")}
//                       disabled={!!kycLoading}
//                       style={{
//                         padding: "10px 20px",
//                         background:
//                           kycLoading === "reject" ? "#9ca3af" : "#ef4444",
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: 8,
//                         fontWeight: 700,
//                         fontSize: 14,
//                         cursor: kycLoading ? "not-allowed" : "pointer",
//                       }}
//                     >
//                       {kycLoading === "reject" ? "…" : "✕ Reject KYC"}
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: 16,
//                 }}
//               >
//                 {[
//                   { key: "aadhaarFront", label: "Aadhaar Front" },
//                   { key: "aadhaarBack", label: "Aadhaar Back" },
//                   { key: "voterFront", label: "Voter ID Front" },
//                   { key: "voterBack", label: "Voter ID Back" },
//                 ].map(({ key, label }) => (
//                   <div key={key}>
//                     <div
//                       style={{
//                         fontSize: 13,
//                         fontWeight: 600,
//                         color: "#374151",
//                         marginBottom: 8,
//                       }}
//                     >
//                       {label}
//                     </div>
//                     <div
//                       style={{
//                         border: "1px solid #e5e7eb",
//                         borderRadius: 12,
//                         overflow: "hidden",
//                         aspectRatio: "16/10",
//                         background: "#f9fafb",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       {host.kyc?.[key] ? (
//                         <a
//                           href={imgUrl(host.kyc[key])}
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           <img
//                             src={imgUrl(host.kyc[key])}
//                             alt={label}
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               objectFit: "cover",
//                             }}
//                             onError={(e) => {
//                               e.target.style.display = "none";
//                               e.target.nextSibling.style.display = "flex";
//                             }}
//                           />
//                           <div
//                             style={{
//                               display: "none",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               color: "#e11d48",
//                               fontWeight: 700,
//                               fontSize: 13,
//                             }}
//                           >
//                             View Document ↗
//                           </div>
//                         </a>
//                       ) : (
//                         <span style={{ color: "#d1d5db", fontSize: 13 }}>
//                           Not uploaded
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* BANK */}
//           {tab === "bank" && (
//             <div>
//               <h3
//                 style={{
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: "#111",
//                   marginBottom: 16,
//                 }}
//               >
//                 Bank Details
//               </h3>
//               {host.bank?.accountNumber ? (
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1fr",
//                     gap: 16,
//                   }}
//                 >
//                   {[
//                     {
//                       label: "Account Holder",
//                       value: host.bank.accountHolderName,
//                     },
//                     { label: "Bank Name", value: host.bank.bankName },
//                     { label: "Account Number", value: host.bank.accountNumber },
//                     { label: "IFSC Code", value: host.bank.ifscCode },
//                   ].map((item) => (
//                     <div
//                       key={item.label}
//                       style={{
//                         border: "1px solid #e5e7eb",
//                         borderRadius: 12,
//                         padding: "16px 20px",
//                       }}
//                     >
//                       <div
//                         style={{
//                           fontSize: 12,
//                           color: "#9ca3af",
//                           marginBottom: 4,
//                         }}
//                       >
//                         {item.label}
//                       </div>
//                       <div
//                         style={{ fontSize: 15, fontWeight: 600, color: "#111" }}
//                       >
//                         {item.value || "—"}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p style={{ color: "#9ca3af", fontSize: 14 }}>
//                   No bank details added yet.
//                 </p>
//               )}
//             </div>
//           )}

//           {/* ACTIVITY */}
//           {tab === "activity" && (
//             <div>
//               <h3
//                 style={{
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: "#111",
//                   marginBottom: 16,
//                 }}
//               >
//                 Account Activity
//               </h3>
//               <div
//                 style={{ display: "flex", flexDirection: "column", gap: 10 }}
//               >
//                 {[
//                   {
//                     label: "Account Created",
//                     value: host.createdAt
//                       ? new Date(host.createdAt).toLocaleString("en-IN")
//                       : "—",
//                     icon: "📅",
//                   },
//                   {
//                     label: "Last Updated",
//                     value: host.updatedAt
//                       ? new Date(host.updatedAt).toLocaleString("en-IN")
//                       : "—",
//                     icon: "🕐",
//                   },
//                   {
//                     label: "KYC Submitted",
//                     value: host.kyc?.submittedAt
//                       ? new Date(host.kyc.submittedAt).toLocaleString("en-IN")
//                       : "Not submitted",
//                     icon: "📋",
//                   },
//                   {
//                     label: "Total Minutes on Call",
//                     value: `${host.totalMinutes || 0} min`,
//                     icon: "⏱️",
//                   },
//                 ].map((item) => (
//                   <div
//                     key={item.label}
//                     style={{
//                       border: "1px solid #e5e7eb",
//                       borderRadius: 10,
//                       padding: "14px 18px",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 14,
//                     }}
//                   >
//                     <span style={{ fontSize: 20 }}>{item.icon}</span>
//                     <div>
//                       <div style={{ fontSize: 12, color: "#9ca3af" }}>
//                         {item.label}
//                       </div>
//                       <div
//                         style={{
//                           fontSize: 14,
//                           fontWeight: 600,
//                           color: "#111",
//                           marginTop: 2,
//                         }}
//                       >
//                         {item.value}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
// function Dashboard({ onLogout }) {
//   const [tab, setTab] = useState("overview");
//   const [stats, setStats] = useState(null);
//   const [hosts, setHosts] = useState([]);
//   const [withdrawals, setWithdrawals] = useState([]);
//   const [selectedHost, setSelectedHost] = useState(null);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [kycFilter, setKycFilter] = useState("all");
//   const [accountFilter, setAccountFilter] = useState("all");

//   const loadStats = useCallback(async () => {
//     const res = await adminFetch("/stats");
//     if (res.success) setStats(res.stats);
//   }, []);

//   const loadHosts = useCallback(async () => {
//     setLoading(true);
//     const res = await adminFetch("/hosts");
//     if (res.success) setHosts(res.hosts);
//     setLoading(false);
//   }, []);

//   const loadWithdrawals = useCallback(async () => {
//     setLoading(true);
//     const res = await adminFetch("/withdrawals");
//     if (res.success) setWithdrawals(res.withdrawals);
//     setLoading(false);
//   }, []);

//   // Fetch FULL host detail (includes images, introVideo, auditionVideo)
//   const openHostModal = useCallback(async (host) => {
//     // Show modal immediately with list data, then enrich with full detail
//     setSelectedHost(host);
//     setModalLoading(true);
//     try {
//       const res = await adminFetch(`/hosts/${host._id}`);
//       if (res.success) {
//         setSelectedHost(res.host);
//       }
//     } catch (e) {
//       console.error("Failed to load host detail:", e);
//     } finally {
//       setModalLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadStats();
//     loadHosts();
//     loadWithdrawals();
//   }, []);

//   async function handleWithdrawalAction(id, action) {
//     const paths = {
//       approve: `/withdrawals/${id}/approve`,
//       "mark-paid": `/withdrawals/${id}/mark-paid`,
//       reject: `/withdrawals/${id}/reject`,
//     };
//     const res = await adminFetch(paths[action], { method: "PATCH" });
//     if (res.success) {
//       loadWithdrawals();
//       loadStats();
//       alert("✅ " + res.message);
//     } else {
//       alert("Error: " + res.message);
//     }
//   }

//   function handleKYCAction(hostId, newStatus) {
//     setHosts((prev) =>
//       prev.map((h) =>
//         h._id === hostId
//           ? {
//               ...h,
//               kyc: { ...h.kyc, status: newStatus },
//               isVerified: newStatus === "verified",
//               accountStatus: newStatus === "verified" ? "approved" : "rejected",
//             }
//           : h,
//       ),
//     );
//     if (selectedHost?._id === hostId) {
//       setSelectedHost((prev) => ({
//         ...prev,
//         kyc: { ...prev.kyc, status: newStatus },
//         isVerified: newStatus === "verified",
//       }));
//     }
//     loadStats();
//   }

//   const filteredHosts = hosts.filter((h) => {
//     const name = `${h.firstName} ${h.lastName} ${h.phoneNumber}`.toLowerCase();
//     const matchSearch = !search || name.includes(search.toLowerCase());
//     const matchKyc = kycFilter === "all" || h.kyc?.status === kycFilter;
//     const matchAccount =
//       accountFilter === "all" ||
//       (accountFilter === "verified" && h.isVerified) ||
//       (accountFilter === "unverified" && !h.isVerified);
//     return matchSearch && matchKyc && matchAccount;
//   });

//   const pendingWithdrawals = withdrawals.filter(
//     (w) => w.status === "pending",
//   ).length;

//   const navStyle = (t) => ({
//     padding: "12px 24px",
//     border: "none",
//     background: "none",
//     cursor: "pointer",
//     fontSize: 15,
//     fontWeight: 600,
//     color: tab === t ? "#e11d48" : "#6b7280",
//     borderBottom: tab === t ? "2px solid #e11d48" : "2px solid transparent",
//     transition: "all 0.2s",
//     position: "relative",
//   });

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#f3f4f6",
//         fontFamily: "'Inter', sans-serif",
//       }}
//     >
//       {/* Top Nav */}
//       {/* <div
//         style={{
//           background: "#fff",
//           boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
//           padding: "0 32px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           height: 64,
//           position: "sticky",
//           top: 0,
//           zIndex: 100,
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <span style={{ fontSize: 22 }}>🍒</span>
//           <h1
//             style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111" }}
//           >
//             Admin Dashboard
//           </h1>
//         </div> */}
//       <div
//         style={{
//           background: "#fff",
//           boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
//           padding: "0 32px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           height: 64,
//           position: "sticky",
//           top: 0,
//           zIndex: 100,
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <img
//             src="/user-logo.png"
//             alt="Red Cherry"
//             style={{
//               width: 40,
//               height: 40,
//               borderRadius: "50%",
//               objectFit: "cover",
//             }}
//           />
//           <h1
//             style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111" }}
//           >
//             Admin Dashboard
//           </h1>
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
//           <span style={{ fontSize: 14, color: "#6b7280" }}>
//             Welcome, superadmin
//           </span>
//           <button
//             onClick={onLogout}
//             style={{
//               padding: "8px 18px",
//               background: "#e11d48",
//               color: "#fff",
//               border: "none",
//               borderRadius: 8,
//               fontWeight: 700,
//               fontSize: 14,
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//             }}
//           >
//             ⎋ Logout
//           </button>
//         </div>
//       </div>

//       {/* Tab Bar */}
//       <div
//         style={{
//           background: "#fff",
//           borderBottom: "1px solid #e5e7eb",
//           padding: "0 32px",
//           display: "flex",
//           gap: 4,
//         }}
//       >
//         <button style={navStyle("overview")} onClick={() => setTab("overview")}>
//           Overview
//         </button>
//         <button style={navStyle("hosts")} onClick={() => setTab("hosts")}>
//           Hosts
//         </button>
//         <button
//           style={navStyle("withdrawals")}
//           onClick={() => setTab("withdrawals")}
//         >
//           Withdrawals
//           {pendingWithdrawals > 0 && (
//             <span
//               style={{
//                 position: "absolute",
//                 top: 8,
//                 right: 6,
//                 background: "#e11d48",
//                 color: "#fff",
//                 borderRadius: "50%",
//                 width: 18,
//                 height: 18,
//                 fontSize: 11,
//                 fontWeight: 700,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               {pendingWithdrawals}
//             </span>
//           )}
//         </button>
//       </div>

//       <div style={{ padding: "28px 32px" }}>
//         {/* ── OVERVIEW ── */}
//         {tab === "overview" && (
//           <div>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(3, 1fr)",
//                 gap: 20,
//                 marginBottom: 28,
//               }}
//             >
//               <StatCard
//                 icon="👥"
//                 value={stats?.totalHosts ?? "…"}
//                 label="Total Hosts"
//                 sub={`${stats?.onlineHosts ?? 0} active`}
//                 color="#3b82f6"
//               />
//               <StatCard
//                 icon="🟢"
//                 value={stats?.onlineHosts ?? "…"}
//                 label="Online Now"
//                 sub="Currently available"
//                 color="#10b981"
//               />
//               <StatCard
//                 icon="📋"
//                 value={stats?.pendingKYC ?? "…"}
//                 label="Pending KYC"
//                 sub="Awaiting review"
//                 color="#f59e0b"
//               />
//               <StatCard
//                 icon="💸"
//                 value={stats?.pendingWithdrawals ?? "…"}
//                 label="Pending Withdrawals"
//                 sub="Awaiting approval"
//                 color="#ef4444"
//               />
//               <StatCard
//                 icon="📈"
//                 value={`₹${stats?.totalEarnings ?? 0}`}
//                 label="Total Earnings"
//                 sub={`${stats?.totalCalls ?? 0} calls completed`}
//                 color="#8b5cf6"
//               />
//               <StatCard
//                 icon="📞"
//                 value={stats?.totalCalls ?? "…"}
//                 label="Total Calls"
//                 sub="All time"
//                 color="#06b6d4"
//               />
//             </div>

//             {/* Quick action shortcuts */}
//             <div
//               style={{
//                 background: "#fff",
//                 borderRadius: 16,
//                 padding: "24px",
//                 boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
//               }}
//             >
//               <h3
//                 style={{
//                   margin: "0 0 16px",
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: "#111",
//                 }}
//               >
//                 Quick Actions
//               </h3>
//               <div style={{ display: "flex", gap: 12 }}>
//                 <button
//                   onClick={() => setTab("hosts")}
//                   style={{
//                     padding: "10px 20px",
//                     background: "#fef3c7",
//                     color: "#92400e",
//                     border: "none",
//                     borderRadius: 8,
//                     fontWeight: 600,
//                     fontSize: 14,
//                     cursor: "pointer",
//                   }}
//                 >
//                   📋 Review Pending KYC ({stats?.pendingKYC ?? 0})
//                 </button>
//                 <button
//                   onClick={() => setTab("withdrawals")}
//                   style={{
//                     padding: "10px 20px",
//                     background: "#fee2e2",
//                     color: "#991b1b",
//                     border: "none",
//                     borderRadius: 8,
//                     fontWeight: 600,
//                     fontSize: 14,
//                     cursor: "pointer",
//                   }}
//                 >
//                   💸 Process Withdrawals ({stats?.pendingWithdrawals ?? 0})
//                 </button>
//                 <button
//                   onClick={() => {
//                     loadStats();
//                     loadHosts();
//                     loadWithdrawals();
//                   }}
//                   style={{
//                     padding: "10px 20px",
//                     background: "#e0e7ff",
//                     color: "#3730a3",
//                     border: "none",
//                     borderRadius: 8,
//                     fontWeight: 600,
//                     fontSize: 14,
//                     cursor: "pointer",
//                   }}
//                 >
//                   🔄 Refresh All
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── HOSTS ── */}
//         {tab === "hosts" && (
//           <div
//             style={{
//               background: "#fff",
//               borderRadius: 16,
//               boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 padding: "20px 24px",
//                 borderBottom: "1px solid #e5e7eb",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: 16,
//                 }}
//               >
//                 <h2
//                   style={{
//                     margin: 0,
//                     fontSize: 18,
//                     fontWeight: 700,
//                     color: "#111",
//                   }}
//                 >
//                   Host Management
//                 </h2>
//                 <button
//                   onClick={loadHosts}
//                   style={{
//                     width: 36,
//                     height: 36,
//                     background: "#3b82f6",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: 8,
//                     cursor: "pointer",
//                     fontSize: 16,
//                   }}
//                 >
//                   🔄
//                 </button>
//               </div>

//               <div style={{ display: "flex", gap: 12 }}>
//                 <input
//                   type="text"
//                   placeholder="Search by name, phone, email…"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   style={{
//                     flex: 1,
//                     padding: "10px 16px",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: 8,
//                     fontSize: 14,
//                     outline: "none",
//                   }}
//                 />
//                 <select
//                   value={kycFilter}
//                   onChange={(e) => setKycFilter(e.target.value)}
//                   style={{
//                     padding: "10px 12px",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: 8,
//                     fontSize: 14,
//                     outline: "none",
//                     background: "#fff",
//                   }}
//                 >
//                   <option value="all">All KYC Status</option>
//                   <option value="submitted">Pending KYC</option>
//                   <option value="verified">KYC Approved</option>
//                   <option value="rejected">KYC Rejected</option>
//                   <option value="pending">Not Submitted</option>
//                 </select>
//                 <select
//                   value={accountFilter}
//                   onChange={(e) => setAccountFilter(e.target.value)}
//                   style={{
//                     padding: "10px 12px",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: 8,
//                     fontSize: 14,
//                     outline: "none",
//                     background: "#fff",
//                   }}
//                 >
//                   <option value="all">All Account Status</option>
//                   <option value="verified">Verified</option>
//                   <option value="unverified">Unverified</option>
//                 </select>
//               </div>
//             </div>

//             {loading ? (
//               <div
//                 style={{
//                   textAlign: "center",
//                   padding: 60,
//                   color: "#9ca3af",
//                   fontSize: 15,
//                 }}
//               >
//                 Loading hosts…
//               </div>
//             ) : (
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ background: "#f9fafb" }}>
//                     {[
//                       "HOST",
//                       "CONTACT",
//                       "KYC STATUS",
//                       "ACCOUNT",
//                       "WALLET",
//                       "STATS",
//                       "ACTIONS",
//                     ].map((h) => (
//                       <th
//                         key={h}
//                         style={{
//                           padding: "12px 16px",
//                           textAlign: "left",
//                           fontSize: 11,
//                           fontWeight: 700,
//                           color: "#9ca3af",
//                           letterSpacing: 0.5,
//                           borderBottom: "1px solid #e5e7eb",
//                         }}
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredHosts.map((host, i) => (
//                     <tr
//                       key={host._id}
//                       style={{
//                         borderBottom: "1px solid #f3f4f6",
//                         background: i % 2 === 0 ? "#fff" : "#fafafa",
//                       }}
//                     >
//                       <td style={{ padding: "14px 16px" }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 10,
//                           }}
//                         >
//                           <div
//                             style={{
//                               width: 38,
//                               height: 38,
//                               borderRadius: "50%",
//                               overflow: "hidden",
//                               background: "#f3f4f6",
//                               flexShrink: 0,
//                             }}
//                           >
//                             {host.profileImage ? (
//                               <img
//                                 src={imgUrl(host.profileImage)}
//                                 alt=""
//                                 style={{
//                                   width: "100%",
//                                   height: "100%",
//                                   objectFit: "cover",
//                                 }}
//                               />
//                             ) : (
//                               <div
//                                 style={{
//                                   width: "100%",
//                                   height: "100%",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   fontWeight: 700,
//                                   color: "#9ca3af",
//                                   fontSize: 14,
//                                 }}
//                               >
//                                 {host.firstName?.[0]?.toUpperCase() || "H"}
//                               </div>
//                             )}
//                           </div>
//                           <div>
//                             <div
//                               style={{
//                                 fontSize: 14,
//                                 fontWeight: 600,
//                                 color: "#111",
//                               }}
//                             >
//                               {host.firstName} {host.lastName}
//                             </div>
//                             <div
//                               style={{
//                                 fontSize: 11,
//                                 color: "#9ca3af",
//                                 marginTop: 1,
//                               }}
//                             >
//                               ID: {host._id?.slice(-8)}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td
//                         style={{
//                           padding: "14px 16px",
//                           fontSize: 13,
//                           color: "#374151",
//                         }}
//                       >
//                         {host.phoneNumber}
//                       </td>
//                       <td style={{ padding: "14px 16px" }}>
//                         <Badge status={host.kyc?.status || "pending"} />
//                       </td>
//                       <td style={{ padding: "14px 16px" }}>
//                         <Badge
//                           status={
//                             host.isVerified
//                               ? "verified"
//                               : host.kyc?.status === "submitted"
//                                 ? "submitted"
//                                 : host.kyc?.status === "rejected"
//                                   ? "rejected"
//                                   : "pending"
//                           }
//                         />
//                       </td>
//                       <td
//                         style={{
//                           padding: "14px 16px",
//                           fontSize: 13,
//                           fontWeight: 600,
//                           color: "#111",
//                         }}
//                       >
//                         ₹{host.earnings || 0}
//                         <div
//                           style={{
//                             fontSize: 11,
//                             color: "#9ca3af",
//                             fontWeight: 400,
//                           }}
//                         >
//                           0 points
//                         </div>
//                       </td>
//                       <td
//                         style={{
//                           padding: "14px 16px",
//                           fontSize: 12,
//                           color: "#6b7280",
//                         }}
//                       >
//                         {host.totalCalls || 0} calls
//                         <br />
//                         {host.totalMinutes || 0} min
//                       </td>
//                       <td style={{ padding: "14px 16px" }}>
//                         <div style={{ display: "flex", gap: 6 }}>
//                           <button
//                             onClick={() => openHostModal(host)}
//                             title="View Profile"
//                             style={{
//                               width: 34,
//                               height: 34,
//                               borderRadius: 8,
//                               border: "1px solid #e5e7eb",
//                               background: "#fff",
//                               cursor: "pointer",
//                               fontSize: 15,
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                             }}
//                           >
//                             👁️
//                           </button>
//                           {host.kyc?.status === "submitted" && (
//                             <button
//                               onClick={() => openHostModal(host)}
//                               title="Review KYC"
//                               style={{
//                                 width: 34,
//                                 height: 34,
//                                 borderRadius: 8,
//                                 border: "1px solid #f59e0b",
//                                 background: "#fef3c7",
//                                 cursor: "pointer",
//                                 fontSize: 13,
//                                 fontWeight: 700,
//                                 color: "#92400e",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                               }}
//                             >
//                               📋
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                   {filteredHosts.length === 0 && (
//                     <tr>
//                       <td
//                         colSpan={7}
//                         style={{
//                           textAlign: "center",
//                           padding: 40,
//                           color: "#9ca3af",
//                           fontSize: 14,
//                         }}
//                       >
//                         No hosts found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {/* ── WITHDRAWALS ── */}
//         {tab === "withdrawals" && (
//           <div
//             style={{
//               background: "#fff",
//               borderRadius: 16,
//               boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 padding: "20px 24px",
//                 borderBottom: "1px solid #e5e7eb",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <h2
//                 style={{
//                   margin: 0,
//                   fontSize: 18,
//                   fontWeight: 700,
//                   color: "#111",
//                 }}
//               >
//                 Withdrawal Requests
//               </h2>
//               <button
//                 onClick={loadWithdrawals}
//                 style={{
//                   width: 36,
//                   height: 36,
//                   background: "#3b82f6",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: 8,
//                   cursor: "pointer",
//                   fontSize: 16,
//                 }}
//               >
//                 🔄
//               </button>
//             </div>

//             {loading ? (
//               <div
//                 style={{
//                   textAlign: "center",
//                   padding: 60,
//                   color: "#9ca3af",
//                   fontSize: 15,
//                 }}
//               >
//                 Loading withdrawals…
//               </div>
//             ) : (
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ background: "#f9fafb" }}>
//                     {[
//                       "HOST",
//                       "AMOUNT",
//                       "BANK DETAILS",
//                       "WALLET BALANCE",
//                       "REQUESTED",
//                       "STATUS",
//                       "ACTIONS",
//                     ].map((h) => (
//                       <th
//                         key={h}
//                         style={{
//                           padding: "12px 16px",
//                           textAlign: "left",
//                           fontSize: 11,
//                           fontWeight: 700,
//                           color: "#9ca3af",
//                           letterSpacing: 0.5,
//                           borderBottom: "1px solid #e5e7eb",
//                         }}
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {withdrawals.map((w, i) => (
//                     <tr
//                       key={w._id}
//                       style={{
//                         borderBottom: "1px solid #f3f4f6",
//                         background: i % 2 === 0 ? "#fff" : "#fafafa",
//                       }}
//                     >
//                       <td style={{ padding: "16px" }}>
//                         <div
//                           style={{
//                             fontSize: 14,
//                             fontWeight: 600,
//                             color: "#111",
//                           }}
//                         >
//                           {w.hostName || "Unknown"}
//                         </div>
//                         <div
//                           style={{
//                             fontSize: 12,
//                             color: "#9ca3af",
//                             marginTop: 2,
//                           }}
//                         >
//                           {w.hostPhone}
//                         </div>
//                       </td>
//                       <td style={{ padding: "16px" }}>
//                         <span
//                           style={{
//                             fontSize: 17,
//                             fontWeight: 800,
//                             color: "#111",
//                           }}
//                         >
//                           ₹{w.amount}
//                         </span>
//                       </td>
//                       <td style={{ padding: "16px" }}>
//                         {w.bank?.accountNumber ? (
//                           <div style={{ fontSize: 13, lineHeight: 1.7 }}>
//                             <div style={{ fontWeight: 700, color: "#111" }}>
//                               {w.bank.accountHolderName}
//                             </div>
//                             <div style={{ color: "#6b7280" }}>
//                               {w.bank.bankName}
//                             </div>
//                             <div style={{ color: "#374151" }}>
//                               A/C: {w.bank.accountNumber}
//                             </div>
//                             <div style={{ color: "#374151" }}>
//                               IFSC: {w.bank.ifscCode}
//                             </div>
//                           </div>
//                         ) : (
//                           <div style={{ fontSize: 13, color: "#9ca3af" }}>
//                             <div>A/C:</div>
//                             <div>IFSC:</div>
//                             <div>Type:</div>
//                           </div>
//                         )}
//                       </td>
//                       <td
//                         style={{
//                           padding: "16px",
//                           fontSize: 14,
//                           fontWeight: 600,
//                           color: "#111",
//                         }}
//                       >
//                         ₹{w.currentWalletBalance || 0}
//                       </td>
//                       <td
//                         style={{
//                           padding: "16px",
//                           fontSize: 13,
//                           color: "#6b7280",
//                         }}
//                       >
//                         {fmt(w.createdAt)}
//                       </td>
//                       <td style={{ padding: "16px" }}>
//                         <Badge
//                           status={
//                             w.status === "pending"
//                               ? "submitted"
//                               : w.status === "approved"
//                                 ? "approved"
//                                 : w.status === "success"
//                                   ? "success"
//                                   : "failed"
//                           }
//                         />
//                       </td>
//                       <td style={{ padding: "16px" }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: 6,
//                             minWidth: 100,
//                           }}
//                         >
//                           {/* Separator line above actions */}
//                           <div
//                             style={{
//                               borderTop: "1px solid #e5e7eb",
//                               marginBottom: 4,
//                             }}
//                           />
//                           {w.status === "pending" && (
//                             <>
//                               <button
//                                 onClick={() =>
//                                   handleWithdrawalAction(w._id, "approve")
//                                 }
//                                 style={{
//                                   padding: "8px 16px",
//                                   background: "#10b981",
//                                   color: "#fff",
//                                   border: "none",
//                                   borderRadius: 6,
//                                   fontWeight: 700,
//                                   fontSize: 13,
//                                   cursor: "pointer",
//                                 }}
//                               >
//                                 Approve
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   handleWithdrawalAction(w._id, "reject")
//                                 }
//                                 style={{
//                                   padding: "8px 16px",
//                                   background: "#ef4444",
//                                   color: "#fff",
//                                   border: "none",
//                                   borderRadius: 6,
//                                   fontWeight: 700,
//                                   fontSize: 13,
//                                   cursor: "pointer",
//                                 }}
//                               >
//                                 Reject
//                               </button>
//                             </>
//                           )}
//                           {w.status === "approved" && (
//                             <button
//                               onClick={() =>
//                                 handleWithdrawalAction(w._id, "mark-paid")
//                               }
//                               style={{
//                                 padding: "8px 16px",
//                                 background: "#3b82f6",
//                                 color: "#fff",
//                                 border: "none",
//                                 borderRadius: 6,
//                                 fontWeight: 700,
//                                 fontSize: 13,
//                                 cursor: "pointer",
//                               }}
//                             >
//                               Mark Paid
//                             </button>
//                           )}
//                           {(w.status === "success" ||
//                             w.status === "failed") && (
//                             <span
//                               style={{
//                                 fontSize: 12,
//                                 color: "#9ca3af",
//                                 fontStyle: "italic",
//                               }}
//                             >
//                               {w.status === "success"
//                                 ? "✅ Paid"
//                                 : "❌ Rejected"}
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                   {withdrawals.length === 0 && (
//                     <tr>
//                       <td
//                         colSpan={7}
//                         style={{
//                           textAlign: "center",
//                           padding: 40,
//                           color: "#9ca3af",
//                           fontSize: 14,
//                         }}
//                       >
//                         No withdrawal requests found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Host Modal */}
//       {selectedHost && (
//         <HostModal
//           host={selectedHost}
//           onClose={() => setSelectedHost(null)}
//           onKYCAction={handleKYCAction}
//           mediaLoading={modalLoading}
//         />
//       )}
//     </div>
//   );
// }

// // ── ROOT APP ──────────────────────────────────────────────────────────────────
// export default function AdminDashboard() {
//   const [authed, setAuthed] = useState(
//     () => sessionStorage.getItem("rc_admin_key") === ADMIN_PASSWORD,
//   );

//   function handleLogin() {
//     setAuthed(true);
//   }

//   function handleLogout() {
//     sessionStorage.removeItem("rc_admin_key");
//     setAuthed(false);
//   }

//   if (!authed) return <LoginPage onLogin={handleLogin} />;
//   return <Dashboard onLogout={handleLogout} />;
// }

//////v4======v6=========//============

// host-frontend/src/AdminDashboard.jsx
// Complete standalone admin dashboard for Red Cherry
// Routes: /admin  (login) → /admin/dashboard

import { useState, useEffect, useCallback } from "react";

const API_BASE = "/api/host/admin";
// sessionStorage "rc_admin_key" holds the session token from
// POST /api/host/admin/login — the username and password are checked by the
// backend, never stored here.

// ── helpers ────────────────────────────────────────────────────────────────────
function adminFetch(path, options = {}) {
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": sessionStorage.getItem("rc_admin_key") || "",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  }).then((r) => {
    // Session expired (12h) — back to the login page
    if (r.status === 401 && sessionStorage.getItem("rc_admin_key")) {
      sessionStorage.removeItem("rc_admin_key");
      window.location.reload();
    }
    return r.json();
  });
}

function fmt(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function imgUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `https://redcheery.com${url}`;
  return `https://redcheery.com/${url}`;
}

// ── Badge component ────────────────────────────────────────────────────────────
function Badge({ status }) {
  const map = {
    verified: { bg: "#d1fae5", color: "#065f46", label: "APPROVED" },
    submitted: { bg: "#fef3c7", color: "#92400e", label: "PENDING" },
    pending: { bg: "#f3f4f6", color: "#6b7280", label: "NOT SUBMITTED" },
    rejected: { bg: "#fee2e2", color: "#991b1b", label: "REJECTED" },
    approved: { bg: "#dbeafe", color: "#1e40af", label: "APPROVED" },
    success: { bg: "#d1fae5", color: "#065f46", label: "PAID" },
    failed: { bg: "#fee2e2", color: "#991b1b", label: "REJECTED" },
    PENDING_APPROVAL: {
      bg: "#fef3c7",
      color: "#92400e",
      label: "PENDING_APPROVAL",
    },
  };
  const s = map[status] || { bg: "#f3f4f6", color: "#6b7280", label: status };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

// ── LOGIN PAGE ────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
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
      sessionStorage.setItem("rc_admin_key", data.token);
      onLogin();
    } catch (err) {
      setError(err.message || "Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "48px 40px",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
        }}
      >
        {/* Logo */}
        {/* <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: "linear-gradient(135deg, #e11d48, #9f1239)",
              borderRadius: 16,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 28 }}>🍒</span>
          </div> */}

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              overflow: "hidden",
            }}
          >
            <img
              src="/user-logo.png"
              alt="Red Cherry Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 800,
              color: "#111",
              letterSpacing: -0.5,
            }}
          >
            Red Cherry
          </h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14 }}>
            Admin Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 6,
              }}
            >
              Admin Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              autoFocus
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                border: `2px solid ${error ? "#ef4444" : "#e5e7eb"}`,
                borderRadius: 10,
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#e11d48")}
              onBlur={(e) =>
                (e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb")
              }
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 6,
              }}
            >
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                border: `2px solid ${error ? "#ef4444" : "#e5e7eb"}`,
                borderRadius: 10,
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#e11d48")}
              onBlur={(e) =>
                (e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb")
              }
            />
            {error && (
              <p style={{ color: "#ef4444", fontSize: 13, marginTop: 6 }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: loading
                ? "#9ca3af"
                : "linear-gradient(135deg, #e11d48, #9f1239)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, sub, color }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          background: color + "18",
          borderRadius: 12,
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
            fontSize: 28,
            fontWeight: 800,
            color: "#111",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#374151",
            marginTop: 4,
          }}
        >
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// ── HOST PROFILE MODAL ────────────────────────────────────────────────────────
function HostModal({ host, onClose, onKYCAction, mediaLoading }) {
  const [tab, setTab] = useState("overview");
  const [kycLoading, setKycLoading] = useState("");

  async function handleKYC(action) {
    setKycLoading(action);
    const res = await adminFetch(`/hosts/${host._id}/kyc`, {
      method: "PATCH",
      body: { action },
    });
    setKycLoading("");
    if (res.success) {
      onKYCAction(host._id, action === "approve" ? "verified" : "rejected");
      alert(action === "approve" ? "✅ KYC Approved!" : "❌ KYC Rejected.");
    } else {
      alert("Error: " + res.message);
    }
  }

  const tabs = ["overview", "media", "kyc", "bank", "activity"];
  const kycStatus = host.kyc?.status || "pending";
  const accountStatus =
    kycStatus === "verified"
      ? "approved"
      : kycStatus === "submitted"
        ? "PENDING_APPROVAL"
        : kycStatus === "rejected"
          ? "rejected"
          : "pending";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 700,
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "24px 28px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              overflow: "hidden",
              background: "rgba(255,255,255,0.3)",
              flexShrink: 0,
              border: "3px solid rgba(255,255,255,0.5)",
            }}
          >
            {host.profileImage ? (
              <img
                src={imgUrl(host.profileImage)}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                {host.firstName?.[0]?.toUpperCase() || "H"}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                margin: 0,
                color: "#fff",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              {host.firstName} {host.lastName}
            </h2>
            <p
              style={{
                margin: "4px 0 8px",
                color: "rgba(255,255,255,0.75)",
                fontSize: 13,
              }}
            >
              ID: {host._id}
            </p>
            <Badge status={accountStatus} />
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #e5e7eb",
            background: "#fff",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "14px 20px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                color: tab === t ? "#e11d48" : "#6b7280",
                borderBottom:
                  tab === t ? "2px solid #e11d48" : "2px solid transparent",
                textTransform: "capitalize",
                transition: "all 0.2s",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ overflowY: "auto", flex: 1, padding: 28 }}>
          {/* OVERVIEW */}
          {tab === "overview" && (
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                {[
                  { label: "Phone Number", value: host.phoneNumber },
                  { label: "Email", value: host.email || "Not provided" },
                  { label: "Registration Date", value: fmt(host.createdAt) },
                  {
                    label: "Last Active",
                    value: host.updatedAt
                      ? new Date(host.updatedAt).toLocaleString("en-IN")
                      : "—",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 12,
                      padding: "16px 20px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: "#9ca3af",
                        marginBottom: 4,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{ fontSize: 15, fontWeight: 600, color: "#111" }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111",
                  marginBottom: 16,
                }}
              >
                Performance Statistics
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg,#10b981,#059669)",
                    borderRadius: 14,
                    padding: "20px",
                    color: "#fff",
                  }}
                >
                  <div style={{ fontSize: 22, fontWeight: 800 }}>
                    ₹{host.earnings || 0}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
                    Wallet Balance
                  </div>
                </div>
                <div
                  style={{
                    background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                    borderRadius: 14,
                    padding: "20px",
                    color: "#fff",
                  }}
                >
                  <div style={{ fontSize: 22, fontWeight: 800 }}>
                    ₹{host.totalEarnings || host.earnings || 0}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
                    Total Earnings
                  </div>
                </div>
                <div
                  style={{
                    background: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
                    borderRadius: 14,
                    padding: "20px",
                    color: "#fff",
                  }}
                >
                  <div style={{ fontSize: 22, fontWeight: 800 }}>
                    {host.totalCalls || 0}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
                    Total Calls
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MEDIA */}
          {tab === "media" && (
            <div>
              {/* Profile Images */}
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111",
                  marginBottom: 16,
                }}
              >
                📸 Profile Images
              </h3>
              {host.images && host.images.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 12,
                    marginBottom: 28,
                  }}
                >
                  {host.images.map((img, i) => {
                    const url = imgUrl(img.url);
                    return (
                      <a
                        key={img._id || i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "block",
                          borderRadius: 12,
                          overflow: "hidden",
                          aspectRatio: "1",
                          background: "#f3f4f6",
                          border: "2px solid #e5e7eb",
                          transition: "border-color 0.2s",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.borderColor = "#e11d48")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.borderColor = "#e5e7eb")
                        }
                      >
                        <img
                          src={url}
                          alt={`Image ${i + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#d1d5db;font-size:13px;flex-direction:column;gap:4px"><span style="font-size:28px">🖼️</span><span>Cannot load</span></div>`;
                          }}
                        />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div
                  style={{
                    background: "#f9fafb",
                    border: "2px dashed #e5e7eb",
                    borderRadius: 12,
                    padding: "32px",
                    textAlign: "center",
                    marginBottom: 28,
                    color: "#9ca3af",
                    fontSize: 14,
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
                  No images uploaded yet.
                </div>
              )}

              {/* Intro Video */}
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111",
                  marginBottom: 12,
                }}
              >
                🎬 Intro Video
              </h3>
              {host.introVideo ? (
                <div style={{ marginBottom: 28 }}>
                  <video
                    src={imgUrl(host.introVideo)}
                    controls
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      background: "#000",
                      maxHeight: 280,
                      display: "block",
                      border: "2px solid #e5e7eb",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    style={{
                      display: "none",
                      background: "#f9fafb",
                      border: "2px dashed #e5e7eb",
                      borderRadius: 12,
                      padding: "24px",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 8,
                      color: "#6b7280",
                      fontSize: 14,
                    }}
                  >
                    <span style={{ fontSize: 24 }}>🎬</span>
                    <span>Cannot load video.</span>
                    <a
                      href={imgUrl(host.introVideo)}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#e11d48",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      Open directly ↗
                    </a>
                  </div>
                  <a
                    href={imgUrl(host.introVideo)}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: 8,
                      color: "#e11d48",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Open in new tab ↗
                  </a>
                </div>
              ) : (
                <div
                  style={{
                    background: "#f9fafb",
                    border: "2px dashed #e5e7eb",
                    borderRadius: 12,
                    padding: "24px",
                    textAlign: "center",
                    marginBottom: 28,
                    color: "#9ca3af",
                    fontSize: 14,
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>🎬</div>
                  No intro video uploaded yet.
                </div>
              )}

              {/* Audition Video */}
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111",
                  marginBottom: 12,
                }}
              >
                🎤 Audition Video
              </h3>
              {host.auditionVideo ? (
                <div>
                  <video
                    src={imgUrl(host.auditionVideo)}
                    controls
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      background: "#000",
                      maxHeight: 280,
                      display: "block",
                      border: "2px solid #e5e7eb",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    style={{
                      display: "none",
                      background: "#f9fafb",
                      border: "2px dashed #e5e7eb",
                      borderRadius: 12,
                      padding: "24px",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 8,
                      color: "#6b7280",
                      fontSize: 14,
                    }}
                  >
                    <span style={{ fontSize: 24 }}>🎤</span>
                    <span>Cannot load video.</span>
                    <a
                      href={imgUrl(host.auditionVideo)}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#e11d48",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      Open directly ↗
                    </a>
                  </div>
                  <a
                    href={imgUrl(host.auditionVideo)}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: 8,
                      color: "#e11d48",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Open in new tab ↗
                  </a>
                </div>
              ) : (
                <div
                  style={{
                    background: "#f9fafb",
                    border: "2px dashed #e5e7eb",
                    borderRadius: 12,
                    padding: "24px",
                    textAlign: "center",
                    color: "#9ca3af",
                    fontSize: 14,
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>🎤</div>
                  No audition video uploaded yet.
                </div>
              )}
            </div>
          )}

          {/* KYC */}
          {tab === "kyc" && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#111",
                    }}
                  >
                    KYC Documents
                  </h3>
                  <div style={{ marginTop: 6 }}>
                    <Badge status={kycStatus} />
                    {host.kyc?.submittedAt && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#9ca3af",
                          marginLeft: 8,
                        }}
                      >
                        Submitted: {fmt(host.kyc.submittedAt)}
                      </span>
                    )}
                  </div>
                </div>

                {kycStatus === "submitted" && (
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => handleKYC("approve")}
                      disabled={!!kycLoading}
                      style={{
                        padding: "10px 20px",
                        background:
                          kycLoading === "approve" ? "#9ca3af" : "#10b981",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: kycLoading ? "not-allowed" : "pointer",
                      }}
                    >
                      {kycLoading === "approve" ? "…" : "✓ Approve KYC"}
                    </button>
                    <button
                      onClick={() => handleKYC("reject")}
                      disabled={!!kycLoading}
                      style={{
                        padding: "10px 20px",
                        background:
                          kycLoading === "reject" ? "#9ca3af" : "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: kycLoading ? "not-allowed" : "pointer",
                      }}
                    >
                      {kycLoading === "reject" ? "…" : "✕ Reject KYC"}
                    </button>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {[
                  { key: "aadhaarFront", label: "Aadhaar Front" },
                  { key: "aadhaarBack", label: "Aadhaar Back" },
                  { key: "voterFront", label: "Voter ID Front" },
                  { key: "voterBack", label: "Voter ID Back" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: 8,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        overflow: "hidden",
                        aspectRatio: "16/10",
                        background: "#f9fafb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {host.kyc?.[key] ? (
                        <a
                          href={imgUrl(host.kyc[key])}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={imgUrl(host.kyc[key])}
                            alt={label}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div
                            style={{
                              display: "none",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#e11d48",
                              fontWeight: 700,
                              fontSize: 13,
                            }}
                          >
                            View Document ↗
                          </div>
                        </a>
                      ) : (
                        <span style={{ color: "#d1d5db", fontSize: 13 }}>
                          Not uploaded
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BANK */}
          {tab === "bank" && (
            <div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111",
                  marginBottom: 16,
                }}
              >
                Bank Details
              </h3>
              {host.bank?.accountNumber ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  {[
                    {
                      label: "Account Holder",
                      value: host.bank.accountHolderName,
                    },
                    { label: "Bank Name", value: host.bank.bankName },
                    { label: "Account Number", value: host.bank.accountNumber },
                    { label: "IFSC Code", value: host.bank.ifscCode },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        padding: "16px 20px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: "#9ca3af",
                          marginBottom: 4,
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{ fontSize: 15, fontWeight: 600, color: "#111" }}
                      >
                        {item.value || "—"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#9ca3af", fontSize: 14 }}>
                  No bank details added yet.
                </p>
              )}
            </div>
          )}

          {/* ACTIVITY */}
          {tab === "activity" && (
            <div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111",
                  marginBottom: 16,
                }}
              >
                Account Activity
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[
                  {
                    label: "Account Created",
                    value: host.createdAt
                      ? new Date(host.createdAt).toLocaleString("en-IN")
                      : "—",
                    icon: "📅",
                  },
                  {
                    label: "Last Updated",
                    value: host.updatedAt
                      ? new Date(host.updatedAt).toLocaleString("en-IN")
                      : "—",
                    icon: "🕐",
                  },
                  {
                    label: "KYC Submitted",
                    value: host.kyc?.submittedAt
                      ? new Date(host.kyc.submittedAt).toLocaleString("en-IN")
                      : "Not submitted",
                    icon: "📋",
                  },
                  {
                    label: "Total Minutes on Call",
                    value: `${host.totalMinutes || 0} min`,
                    icon: "⏱️",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#111",
                          marginTop: 2,
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
function Dashboard({ onLogout }) {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [hosts, setHosts] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedHost, setSelectedHost] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState("all");
  const [accountFilter, setAccountFilter] = useState("all");

  // ── Agency state ───────────────────────────────────────────────────────────
  const [agencies, setAgencies] = useState([]);
  const [agencyLoading, setAgencyLoading] = useState(false);
  const [newAgencyName, setNewAgencyName] = useState("");
  const [newAgencyPass, setNewAgencyPass] = useState("");
  const [agencyMsg, setAgencyMsg] = useState({ text: "", ok: true });
  const [showAgencyPass, setShowAgencyPass] = useState(false);

  const loadStats = useCallback(async () => {
    const res = await adminFetch("/stats");
    if (res.success) setStats(res.stats);
  }, []);

  const loadHosts = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch("/hosts");
    if (res.success) setHosts(res.hosts);
    setLoading(false);
  }, []);

  const loadWithdrawals = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch("/withdrawals");
    if (res.success) setWithdrawals(res.withdrawals);
    setLoading(false);
  }, []);

  const loadAgencies = useCallback(async () => {
    try {
      const res = await adminFetch("/agencies");
      if (res.success) setAgencies(res.agencies);
    } catch (e) {
      console.error("Failed to load agencies:", e);
    }
  }, []);

  // Fetch FULL host detail (includes images, introVideo, auditionVideo)
  const openHostModal = useCallback(async (host) => {
    // Show modal immediately with list data, then enrich with full detail
    setSelectedHost(host);
    setModalLoading(true);
    try {
      const res = await adminFetch(`/hosts/${host._id}`);
      if (res.success) {
        setSelectedHost(res.host);
      }
    } catch (e) {
      console.error("Failed to load host detail:", e);
    } finally {
      setModalLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadHosts();
    loadWithdrawals();
  }, []);

  async function handleWithdrawalAction(id, action) {
    const paths = {
      approve: `/withdrawals/${id}/approve`,
      "mark-paid": `/withdrawals/${id}/mark-paid`,
      reject: `/withdrawals/${id}/reject`,
    };
    const res = await adminFetch(paths[action], { method: "PATCH" });
    if (res.success) {
      loadWithdrawals();
      loadStats();
      alert("✅ " + res.message);
    } else {
      alert("Error: " + res.message);
    }
  }

  async function handleBanToggle(host) {
    const isBanned = host.isBanned;
    const action = isBanned ? "Unblock" : "Block";
    if (!window.confirm(`${action} ${host.firstName} ${host.lastName}?`))
      return;

    const res = await adminFetch(`/hosts/${host._id}/ban`, {
      method: "PATCH",
      body: { banned: !isBanned },
    });
    if (res.success) {
      setHosts((prev) =>
        prev.map((h) =>
          h._id === host._id ? { ...h, isBanned: !isBanned } : h,
        ),
      );
      alert(`✅ Host ${!isBanned ? "blocked" : "unblocked"} successfully.`);
    } else {
      alert("Error: " + res.message);
    }
  }

  async function handleDeleteHost(host) {
    if (
      !window.confirm(
        `⚠️ PERMANENTLY DELETE "${host.firstName} ${host.lastName}"?\n\nThis will delete their account and all withdrawal records. This cannot be undone.`,
      )
    )
      return;

    const res = await adminFetch(`/hosts/${host._id}`, { method: "DELETE" });
    if (res.success) {
      setHosts((prev) => prev.filter((h) => h._id !== host._id));
      loadStats();
      alert("✅ " + res.message);
    } else {
      alert("Error: " + res.message);
    }
  }

  function handleKYCAction(hostId, newStatus) {
    setHosts((prev) =>
      prev.map((h) =>
        h._id === hostId
          ? {
              ...h,
              kyc: { ...h.kyc, status: newStatus },
              isVerified: newStatus === "verified",
              accountStatus: newStatus === "verified" ? "approved" : "rejected",
            }
          : h,
      ),
    );
    if (selectedHost?._id === hostId) {
      setSelectedHost((prev) => ({
        ...prev,
        kyc: { ...prev.kyc, status: newStatus },
        isVerified: newStatus === "verified",
      }));
    }
    loadStats();
  }

  const filteredHosts = hosts.filter((h) => {
    const name = `${h.firstName} ${h.lastName} ${h.phoneNumber}`.toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase());
    const matchKyc = kycFilter === "all" || h.kyc?.status === kycFilter;
    const matchAccount =
      accountFilter === "all" ||
      (accountFilter === "verified" && h.isVerified) ||
      (accountFilter === "unverified" && !h.isVerified);
    return matchSearch && matchKyc && matchAccount;
  });

  const pendingWithdrawals = withdrawals.filter(
    (w) => w.status === "pending",
  ).length;

  const navStyle = (t) => ({
    padding: "12px 24px",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 600,
    color: tab === t ? "#e11d48" : "#6b7280",
    borderBottom: tab === t ? "2px solid #e11d48" : "2px solid transparent",
    transition: "all 0.2s",
    position: "relative",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Top Nav */}
      {/* <div
        style={{
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>🍒</span>
          <h1
            style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111" }}
          >
            Admin Dashboard
          </h1>
        </div> */}

      <div
        style={{
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/user-logo.png"
            alt="Red Cherry"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <h1
            style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111" }}
          >
            Admin Dashboard
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14, color: "#6b7280" }}>
            Welcome, superadmin
          </span>
          <button
            onClick={onLogout}
            style={{
              padding: "8px 18px",
              background: "#e11d48",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ⎋ Logout
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 32px",
          display: "flex",
          gap: 4,
        }}
      >
        <button style={navStyle("overview")} onClick={() => setTab("overview")}>
          Overview
        </button>
        <button style={navStyle("hosts")} onClick={() => setTab("hosts")}>
          Hosts
        </button>
        <button
          style={navStyle("withdrawals")}
          onClick={() => setTab("withdrawals")}
        >
          Withdrawals
          {pendingWithdrawals > 0 && (
            <span
              style={{
                position: "absolute",
                top: 8,
                right: 6,
                background: "#e11d48",
                color: "#fff",
                borderRadius: "50%",
                width: 18,
                height: 18,
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {pendingWithdrawals}
            </span>
          )}
        </button>
        <button
          style={navStyle("agencies")}
          onClick={() => {
            setTab("agencies");
            loadAgencies();
          }}
        >
          Agencies
          {agencies.length > 0 && (
            <span
              style={{
                marginLeft: 6,
                background: "#f3f4f6",
                color: "#6b7280",
                borderRadius: 10,
                padding: "1px 7px",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {agencies.length}
            </span>
          )}
        </button>
      </div>

      <div style={{ padding: "28px 32px" }}>
        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 20,
                marginBottom: 28,
              }}
            >
              <StatCard
                icon="👥"
                value={stats?.totalHosts ?? "…"}
                label="Total Hosts"
                sub={`${stats?.onlineHosts ?? 0} active`}
                color="#3b82f6"
              />
              <StatCard
                icon="🟢"
                value={stats?.onlineHosts ?? "…"}
                label="Online Now"
                sub="Currently available"
                color="#10b981"
              />
              <StatCard
                icon="📋"
                value={stats?.pendingKYC ?? "…"}
                label="Pending KYC"
                sub="Awaiting review"
                color="#f59e0b"
              />
              <StatCard
                icon="💸"
                value={stats?.pendingWithdrawals ?? "…"}
                label="Pending Withdrawals"
                sub="Awaiting approval"
                color="#ef4444"
              />
              <StatCard
                icon="📈"
                value={`₹${stats?.totalEarnings ?? 0}`}
                label="Total Earnings"
                sub={`${stats?.totalCalls ?? 0} calls completed`}
                color="#8b5cf6"
              />
              <StatCard
                icon="📞"
                value={stats?.totalCalls ?? "…"}
                label="Total Calls"
                sub="All time"
                color="#06b6d4"
              />
            </div>

            {/* Quick action shortcuts */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "24px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 16px",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111",
                }}
              >
                Quick Actions
              </h3>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setTab("hosts")}
                  style={{
                    padding: "10px 20px",
                    background: "#fef3c7",
                    color: "#92400e",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  📋 Review Pending KYC ({stats?.pendingKYC ?? 0})
                </button>
                <button
                  onClick={() => setTab("withdrawals")}
                  style={{
                    padding: "10px 20px",
                    background: "#fee2e2",
                    color: "#991b1b",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  💸 Process Withdrawals ({stats?.pendingWithdrawals ?? 0})
                </button>
                <button
                  onClick={() => {
                    loadStats();
                    loadHosts();
                    loadWithdrawals();
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "#e0e7ff",
                    color: "#3730a3",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  🔄 Refresh All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── HOSTS ── */}
        {tab === "hosts" && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#111",
                  }}
                >
                  Host Management
                </h2>
                <button
                  onClick={loadHosts}
                  style={{
                    width: 36,
                    height: 36,
                    background: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  🔄
                </button>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <input
                  type="text"
                  placeholder="Search by name, phone, email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                  }}
                />
                <select
                  value={kycFilter}
                  onChange={(e) => setKycFilter(e.target.value)}
                  style={{
                    padding: "10px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                    background: "#fff",
                  }}
                >
                  <option value="all">All KYC Status</option>
                  <option value="submitted">Pending KYC</option>
                  <option value="verified">KYC Approved</option>
                  <option value="rejected">KYC Rejected</option>
                  <option value="pending">Not Submitted</option>
                </select>
                <select
                  value={accountFilter}
                  onChange={(e) => setAccountFilter(e.target.value)}
                  style={{
                    padding: "10px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                    background: "#fff",
                  }}
                >
                  <option value="all">All Account Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  color: "#9ca3af",
                  fontSize: 15,
                }}
              >
                Loading hosts…
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {[
                      "HOST",
                      "CONTACT",
                      "KYC STATUS",
                      "ACCOUNT",
                      "WALLET",
                      "STATS",
                      "ACTIONS",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#9ca3af",
                          letterSpacing: 0.5,
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredHosts.map((host, i) => (
                    <tr
                      key={host._id}
                      style={{
                        borderBottom: "1px solid #f3f4f6",
                        background: i % 2 === 0 ? "#fff" : "#fafafa",
                      }}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              overflow: "hidden",
                              background: "#f3f4f6",
                              flexShrink: 0,
                            }}
                          >
                            {host.profileImage ? (
                              <img
                                src={imgUrl(host.profileImage)}
                                alt=""
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 700,
                                  color: "#9ca3af",
                                  fontSize: 14,
                                }}
                              >
                                {host.firstName?.[0]?.toUpperCase() || "H"}
                              </div>
                            )}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: host.isBanned ? "#9ca3af" : "#111",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              {host.firstName} {host.lastName}
                              {host.isBanned && (
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    background: "#fee2e2",
                                    color: "#991b1b",
                                    padding: "2px 6px",
                                    borderRadius: 10,
                                    letterSpacing: 0.5,
                                  }}
                                >
                                  BLOCKED
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "#9ca3af",
                                marginTop: 1,
                              }}
                            >
                              ID: {host._id?.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: 13,
                          color: "#374151",
                        }}
                      >
                        {host.phoneNumber}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <Badge status={host.kyc?.status || "pending"} />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <Badge
                          status={
                            host.isVerified
                              ? "verified"
                              : host.kyc?.status === "submitted"
                                ? "submitted"
                                : host.kyc?.status === "rejected"
                                  ? "rejected"
                                  : "pending"
                          }
                        />
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#111",
                        }}
                      >
                        ₹{host.earnings || 0}
                        <div
                          style={{
                            fontSize: 11,
                            color: "#9ca3af",
                            fontWeight: 400,
                          }}
                        >
                          0 points
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: 12,
                          color: "#6b7280",
                        }}
                      >
                        {host.totalCalls || 0} calls
                        <br />
                        {host.totalMinutes || 0} min
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                        >
                          {/* View Profile */}
                          <button
                            onClick={() => openHostModal(host)}
                            title="View Profile"
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 8,
                              border: "1px solid #e5e7eb",
                              background: "#fff",
                              cursor: "pointer",
                              fontSize: 15,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            👁️
                          </button>

                          {/* KYC Review */}
                          {host.kyc?.status === "submitted" && (
                            <button
                              onClick={() => openHostModal(host)}
                              title="Review KYC"
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 8,
                                border: "1px solid #f59e0b",
                                background: "#fef3c7",
                                cursor: "pointer",
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#92400e",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              📋
                            </button>
                          )}

                          {/* Block / Unblock */}
                          <button
                            onClick={() => handleBanToggle(host)}
                            title={
                              host.isBanned ? "Unblock Host" : "Block Host"
                            }
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 8,
                              border: host.isBanned
                                ? "1px solid #10b981"
                                : "1px solid #f97316",
                              background: host.isBanned ? "#d1fae5" : "#fff7ed",
                              cursor: "pointer",
                              fontSize: 15,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {host.isBanned ? "✅" : "🚫"}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteHost(host)}
                            title="Delete Host Account"
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 8,
                              border: "1px solid #ef4444",
                              background: "#fef2f2",
                              cursor: "pointer",
                              fontSize: 15,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredHosts.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          textAlign: "center",
                          padding: 40,
                          color: "#9ca3af",
                          fontSize: 14,
                        }}
                      >
                        No hosts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── WITHDRAWALS ── */}
        {tab === "withdrawals" && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#111",
                }}
              >
                Withdrawal Requests
              </h2>
              <button
                onClick={loadWithdrawals}
                style={{
                  width: 36,
                  height: 36,
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                🔄
              </button>
            </div>

            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  color: "#9ca3af",
                  fontSize: 15,
                }}
              >
                Loading withdrawals…
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {[
                      "HOST",
                      "AMOUNT",
                      "BANK DETAILS",
                      "WALLET BALANCE",
                      "REQUESTED",
                      "STATUS",
                      "ACTIONS",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#9ca3af",
                          letterSpacing: 0.5,
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((w, i) => (
                    <tr
                      key={w._id}
                      style={{
                        borderBottom: "1px solid #f3f4f6",
                        background: i % 2 === 0 ? "#fff" : "#fafafa",
                      }}
                    >
                      <td style={{ padding: "16px" }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#111",
                          }}
                        >
                          {w.hostName || "Unknown"}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#9ca3af",
                            marginTop: 2,
                          }}
                        >
                          {w.hostPhone}
                        </div>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span
                          style={{
                            fontSize: 17,
                            fontWeight: 800,
                            color: "#111",
                          }}
                        >
                          ₹{w.amount}
                        </span>
                      </td>
                      <td style={{ padding: "16px" }}>
                        {w.bank?.accountNumber ? (
                          <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                            <div style={{ fontWeight: 700, color: "#111" }}>
                              {w.bank.accountHolderName}
                            </div>
                            <div style={{ color: "#6b7280" }}>
                              {w.bank.bankName}
                            </div>
                            <div style={{ color: "#374151" }}>
                              A/C: {w.bank.accountNumber}
                            </div>
                            <div style={{ color: "#374151" }}>
                              IFSC: {w.bank.ifscCode}
                            </div>
                          </div>
                        ) : (
                          <div style={{ fontSize: 13, color: "#9ca3af" }}>
                            <div>A/C:</div>
                            <div>IFSC:</div>
                            <div>Type:</div>
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#111",
                        }}
                      >
                        ₹{w.currentWalletBalance || 0}
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          fontSize: 13,
                          color: "#6b7280",
                        }}
                      >
                        {fmt(w.createdAt)}
                      </td>
                      <td style={{ padding: "16px" }}>
                        <Badge
                          status={
                            w.status === "pending"
                              ? "submitted"
                              : w.status === "approved"
                                ? "approved"
                                : w.status === "success"
                                  ? "success"
                                  : "failed"
                          }
                        />
                      </td>
                      <td style={{ padding: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            minWidth: 100,
                          }}
                        >
                          {/* Separator line above actions */}
                          <div
                            style={{
                              borderTop: "1px solid #e5e7eb",
                              marginBottom: 4,
                            }}
                          />
                          {w.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleWithdrawalAction(w._id, "approve")
                                }
                                style={{
                                  padding: "8px 16px",
                                  background: "#10b981",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: 6,
                                  fontWeight: 700,
                                  fontSize: 13,
                                  cursor: "pointer",
                                }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleWithdrawalAction(w._id, "reject")
                                }
                                style={{
                                  padding: "8px 16px",
                                  background: "#ef4444",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: 6,
                                  fontWeight: 700,
                                  fontSize: 13,
                                  cursor: "pointer",
                                }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {w.status === "approved" && (
                            <button
                              onClick={() =>
                                handleWithdrawalAction(w._id, "mark-paid")
                              }
                              style={{
                                padding: "8px 16px",
                                background: "#3b82f6",
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                fontWeight: 700,
                                fontSize: 13,
                                cursor: "pointer",
                              }}
                            >
                              Mark Paid
                            </button>
                          )}
                          {(w.status === "success" ||
                            w.status === "failed") && (
                            <span
                              style={{
                                fontSize: 12,
                                color: "#9ca3af",
                                fontStyle: "italic",
                              }}
                            >
                              {w.status === "success"
                                ? "✅ Paid"
                                : "❌ Rejected"}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {withdrawals.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          textAlign: "center",
                          padding: 40,
                          color: "#9ca3af",
                          fontSize: 14,
                        }}
                      >
                        No withdrawal requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── AGENCIES TAB ─────────────────────────────────────────────────── */}
        {tab === "agencies" && (
          <div>
            {/* ── Create Agency Card ── */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "24px 28px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "#fce7f3",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  🏢
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#111",
                    }}
                  >
                    Create New Agency
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
                    Agency will get a read-only view of all hosts
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  alignItems: "flex-end",
                }}
              >
                {/* Agency Name */}
                <div style={{ flex: "1 1 200px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#6b7280",
                      marginBottom: 6,
                      letterSpacing: 0.5,
                    }}
                  >
                    AGENCY NAME
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. StarAgency"
                    value={newAgencyName}
                    onChange={(e) => setNewAgencyName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      border: "1.5px solid #e5e7eb",
                      borderRadius: 10,
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "'Inter', sans-serif",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#e11d48")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>

                {/* Password */}
                <div style={{ flex: "1 1 200px", position: "relative" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#6b7280",
                      marginBottom: 6,
                      letterSpacing: 0.5,
                    }}
                  >
                    PASSWORD
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showAgencyPass ? "text" : "password"}
                      placeholder="e.g. Agency@1234"
                      value={newAgencyPass}
                      onChange={(e) => setNewAgencyPass(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "11px 42px 11px 14px",
                        border: "1.5px solid #e5e7eb",
                        borderRadius: 10,
                        fontSize: 14,
                        outline: "none",
                        boxSizing: "border-box",
                        fontFamily: "'Inter', sans-serif",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#e11d48")}
                      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowAgencyPass((p) => !p)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 16,
                        color: "#9ca3af",
                        padding: 0,
                        lineHeight: 1,
                      }}
                    >
                      {showAgencyPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={async () => {
                    if (!newAgencyName.trim() || !newAgencyPass.trim()) {
                      setAgencyMsg({
                        text: "⚠️ Both agency name and password are required.",
                        ok: false,
                      });
                      return;
                    }
                    if (newAgencyPass.length < 6) {
                      setAgencyMsg({
                        text: "⚠️ Password must be at least 6 characters.",
                        ok: false,
                      });
                      return;
                    }
                    setAgencyLoading(true);
                    setAgencyMsg({ text: "", ok: true });
                    try {
                      const res = await adminFetch("/agencies", {
                        method: "POST",
                        body: {
                          name: newAgencyName.trim(),
                          password: newAgencyPass.trim(),
                        },
                      });
                      if (res.success) {
                        setAgencyMsg({
                          text: `✅ Agency "${res.agency.name}" created successfully!`,
                          ok: true,
                        });
                        setNewAgencyName("");
                        setNewAgencyPass("");
                        loadAgencies();
                      } else {
                        setAgencyMsg({ text: "❌ " + res.message, ok: false });
                      }
                    } catch {
                      setAgencyMsg({
                        text: "❌ Network error. Please try again.",
                        ok: false,
                      });
                    } finally {
                      setAgencyLoading(false);
                    }
                  }}
                  disabled={agencyLoading}
                  style={{
                    padding: "11px 28px",
                    background: agencyLoading
                      ? "#9ca3af"
                      : "linear-gradient(135deg, #e11d48, #9f1239)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: agencyLoading ? "not-allowed" : "pointer",
                    whiteSpace: "nowrap",
                    height: 44,
                    transition: "opacity 0.2s",
                    letterSpacing: 0.3,
                  }}
                >
                  {agencyLoading ? "Creating…" : "➕ Create Agency"}
                </button>
              </div>

              {/* Feedback message */}
              {agencyMsg.text && (
                <div
                  style={{
                    marginTop: 14,
                    padding: "10px 16px",
                    borderRadius: 10,
                    background: agencyMsg.ok ? "#d1fae5" : "#fee2e2",
                    color: agencyMsg.ok ? "#065f46" : "#991b1b",
                    fontSize: 13,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {agencyMsg.text}
                </div>
              )}

              {/* Info box */}
              <div
                style={{
                  marginTop: 16,
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  fontSize: 12,
                  color: "#1e40af",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 14 }}>ℹ️</span>
                <div>
                  <strong>Agency Login URL:</strong>{" "}
                  <a
                    href="https://redcheery.com/host/agency"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#2563eb", fontWeight: 700 }}
                  >
                    https://redcheery.com/host/agency
                  </a>
                  <br />
                  Agencies get a <strong>read-only</strong> host list view — no
                  KYC actions, no ban, no withdrawals access.
                </div>
              </div>
            </div>

            {/* ── Agency List Table ── */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "18px 24px",
                  borderBottom: "1px solid #f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111",
                  }}
                >
                  Agency Accounts
                  <span
                    style={{
                      marginLeft: 10,
                      fontSize: 12,
                      color: "#9ca3af",
                      background: "#f3f4f6",
                      padding: "2px 8px",
                      borderRadius: 10,
                      fontWeight: 600,
                    }}
                  >
                    {agencies.length}
                  </span>
                </h3>
                <button
                  onClick={loadAgencies}
                  style={{
                    width: 34,
                    height: 34,
                    background: "#f3f4f6",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 15,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Refresh"
                >
                  🔄
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: 600,
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f9fafb" }}>
                      {[
                        "AGENCY NAME",
                        "STATUS",
                        "CREATED ON",
                        "LOGIN URL",
                        "ACTION",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 20px",
                            textAlign: "left",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#9ca3af",
                            letterSpacing: 0.8,
                            borderBottom: "1px solid #e5e7eb",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {agencies.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            textAlign: "center",
                            padding: "48px 0",
                            color: "#9ca3af",
                            fontSize: 14,
                          }}
                        >
                          <div style={{ fontSize: 32, marginBottom: 10 }}>
                            🏢
                          </div>
                          No agencies created yet. Use the form above to add
                          one.
                        </td>
                      </tr>
                    ) : (
                      agencies.map((ag, i) => (
                        <tr
                          key={ag._id}
                          style={{
                            borderBottom: "1px solid #f3f4f6",
                            background: i % 2 === 0 ? "#fff" : "#fafafa",
                          }}
                        >
                          {/* Agency Name */}
                          <td style={{ padding: "14px 20px" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <div
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 10,
                                  background: ag.isActive
                                    ? "#fce7f3"
                                    : "#f3f4f6",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 18,
                                  flexShrink: 0,
                                }}
                              >
                                🏢
                              </div>
                              <div>
                                <div
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: ag.isActive ? "#111" : "#9ca3af",
                                  }}
                                >
                                  {ag.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: 11,
                                    color: "#9ca3af",
                                    marginTop: 1,
                                  }}
                                >
                                  ID: {ag._id?.slice(-8)}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td style={{ padding: "14px 20px" }}>
                            <span
                              style={{
                                background: ag.isActive ? "#d1fae5" : "#fee2e2",
                                color: ag.isActive ? "#065f46" : "#991b1b",
                                padding: "3px 10px",
                                borderRadius: 20,
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: 0.5,
                              }}
                            >
                              {ag.isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </td>

                          {/* Created */}
                          <td
                            style={{
                              padding: "14px 20px",
                              fontSize: 13,
                              color: "#6b7280",
                            }}
                          >
                            {new Date(ag.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>

                          {/* Login URL */}
                          <td style={{ padding: "14px 20px" }}>
                            <a
                              href="https://redcheery.com/host/agency"
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                fontSize: 12,
                                color: "#3b82f6",
                                fontWeight: 600,
                                textDecoration: "none",
                              }}
                            >
                              /host/agency ↗
                            </a>
                          </td>

                          {/* Action */}
                          <td style={{ padding: "14px 20px" }}>
                            {ag.isActive ? (
                              <button
                                onClick={async () => {
                                  if (
                                    !window.confirm(
                                      `Deactivate agency "${ag.name}"?\n\nThey will no longer be able to log in.`,
                                    )
                                  )
                                    return;
                                  const res = await adminFetch(
                                    `/agencies/${ag._id}`,
                                    {
                                      method: "DELETE",
                                    },
                                  );
                                  if (res.success) {
                                    loadAgencies();
                                    setAgencyMsg({
                                      text: `✅ Agency "${ag.name}" deactivated.`,
                                      ok: true,
                                    });
                                  } else {
                                    alert("Error: " + res.message);
                                  }
                                }}
                                style={{
                                  padding: "7px 16px",
                                  background: "#fee2e2",
                                  color: "#991b1b",
                                  border: "1px solid #fca5a5",
                                  borderRadius: 8,
                                  fontWeight: 700,
                                  fontSize: 12,
                                  cursor: "pointer",
                                  transition: "background 0.15s",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.background = "#fecaca")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.background = "#fee2e2")
                                }
                              >
                                Deactivate
                              </button>
                            ) : (
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "#9ca3af",
                                  fontStyle: "italic",
                                }}
                              >
                                Deactivated
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Host Modal */}
      {selectedHost && (
        <HostModal
          host={selectedHost}
          onClose={() => setSelectedHost(null)}
          onKYCAction={handleKYCAction}
          mediaLoading={modalLoading}
        />
      )}
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(
    () => !!sessionStorage.getItem("rc_admin_key"),
  );

  function handleLogin() {
    setAuthed(true);
  }

  function handleLogout() {
    sessionStorage.removeItem("rc_admin_key");
    setAuthed(false);
  }

  if (!authed) return <LoginPage onLogin={handleLogin} />;
  return <Dashboard onLogout={handleLogout} />;
}
