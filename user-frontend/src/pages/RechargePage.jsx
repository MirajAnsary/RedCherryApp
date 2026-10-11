// //v2 for my upid then
// // user-frontend/src/pages/RechargePage.jsx
// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const PLANS = [
//   {
//     id: "single",
//     title: "Single Host Room",
//     emoji: "👤",
//     priceTotal: 720,
//     minutes: 15,
//     perMinute: 48,
//     color: "#f472b6",
//     gradient: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)",
//     badge: "Basic",
//     description: "1-on-1 private session with a host",
//   },
//   {
//     id: "double",
//     title: "Double Host Room",
//     emoji: "👥",
//     priceTotal: 1500,
//     minutes: 15,
//     perMinute: 100,
//     color: "#a855f7",
//     gradient: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
//     badge: "Popular",
//     description: "Join a room with 2 hosts simultaneously",
//   },
//   {
//     id: "multiple",
//     title: "Multiple Host Room",
//     emoji: "🎉",
//     priceTotal: 3510,
//     minutes: 15,
//     perMinute: 234,
//     color: "#f59e0b",
//     gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
//     badge: "Premium",
//     description: "Group room with multiple hosts & users",
//   },
// ];

// // ── UPI QR Modal ──────────────────────────────────────────────────────────────
// function QRModal({ plan, onClose }) {
//   const [timeLeft, setTimeLeft] = useState(120);
//   const [utrInput, setUtrInput] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState("");
//   const timerRef = useRef(null);

//   // ✅ Real UPI ID
//   const UPI_ID = "spm38432@okicici";
//   const UPI_NAME = "Redcherry";
//   const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${plan.priceTotal}&cu=INR&tn=${encodeURIComponent(plan.title)}`;
//   const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;

//   useEffect(() => {
//     timerRef.current = setInterval(() => {
//       setTimeLeft((t) => {
//         if (t <= 1) {
//           clearInterval(timerRef.current);
//           return 0;
//         }
//         return t - 1;
//       });
//     }, 1000);
//     return () => clearInterval(timerRef.current);
//   }, []);

//   const handleUTRSubmit = async () => {
//     if (!utrInput.trim()) {
//       setError("Please enter your UTR / transaction ID.");
//       return;
//     }
//     setSubmitting(true);
//     setError("");
//     try {
//       setSubmitted(true);
//     } catch {
//       setError("Submission failed. Please try again.");
//     }
//     setSubmitting(false);
//   };

//   const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
//   const ss = String(timeLeft % 60).padStart(2, "0");
//   const expired = timeLeft === 0;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 1000,
//         background: "rgba(0,0,0,0.65)",
//         backdropFilter: "blur(6px)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "16px",
//       }}
//       onClick={onClose}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 24,
//           width: "100%",
//           maxWidth: 420,
//           boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
//           overflow: "hidden",
//           animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div
//           style={{
//             background: plan.gradient,
//             padding: "20px 24px 16px",
//             position: "relative",
//           }}
//         >
//           <button
//             onClick={onClose}
//             style={{
//               position: "absolute",
//               top: 14,
//               right: 14,
//               background: "rgba(255,255,255,0.25)",
//               border: "none",
//               borderRadius: "50%",
//               width: 32,
//               height: 32,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//               color: "#fff",
//               fontSize: 18,
//               lineHeight: 1,
//             }}
//           >
//             ×
//           </button>
//           <p
//             style={{
//               color: "rgba(255,255,255,0.8)",
//               fontSize: 12,
//               fontWeight: 700,
//               letterSpacing: 2,
//               textTransform: "uppercase",
//               margin: "0 0 4px",
//             }}
//           >
//             Scan & Pay via UPI
//           </p>
//           <h3
//             style={{ color: "#fff", fontWeight: 900, fontSize: 22, margin: 0 }}
//           >
//             ₹{plan.priceTotal}
//           </h3>
//           <p
//             style={{
//               color: "rgba(255,255,255,0.75)",
//               fontSize: 13,
//               margin: "2px 0 0",
//             }}
//           >
//             {plan.title}
//           </p>
//         </div>

//         <div style={{ padding: "20px 24px 24px" }}>
//           {submitted ? (
//             <div style={{ textAlign: "center", padding: "20px 0" }}>
//               <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
//               <h3
//                 style={{
//                   fontWeight: 900,
//                   color: "#16a34a",
//                   fontSize: 20,
//                   marginBottom: 8,
//                 }}
//               >
//                 Submitted!
//               </h3>
//               <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
//                 Your payment is under review. Balance will be credited after
//                 verification (usually within 15 minutes).
//               </p>
//               <button
//                 onClick={onClose}
//                 style={{
//                   marginTop: 20,
//                   padding: "12px 32px",
//                   background: "linear-gradient(135deg, #f472b6, #ec4899)",
//                   border: "none",
//                   borderRadius: 50,
//                   color: "#fff",
//                   fontWeight: 800,
//                   fontSize: 14,
//                   cursor: "pointer",
//                 }}
//               >
//                 Done
//               </button>
//             </div>
//           ) : (
//             <>
//               {/* QR Code */}
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   background: "#fafafa",
//                   borderRadius: 16,
//                   padding: "16px",
//                   border: "1.5px solid #f1f5f9",
//                   marginBottom: 16,
//                 }}
//               >
//                 <img
//                   src={qrUrl}
//                   alt="UPI QR Code"
//                   style={{ width: 200, height: 200, borderRadius: 8 }}
//                 />
//                 <div
//                   style={{
//                     marginTop: 12,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 6,
//                     background: expired ? "#fee2e2" : "#fef3c7",
//                     borderRadius: 50,
//                     padding: "5px 14px",
//                   }}
//                 >
//                   <span style={{ fontSize: 13 }}>⏱</span>
//                   <span
//                     style={{
//                       fontSize: 14,
//                       fontWeight: 800,
//                       color: expired ? "#dc2626" : "#b45309",
//                     }}
//                   >
//                     {expired ? "QR Expired" : `${mm}:${ss} left`}
//                   </span>
//                 </div>
//               </div>

//               {/* UPI ID */}
//               <div
//                 style={{
//                   background: "#f8fafc",
//                   borderRadius: 12,
//                   padding: "10px 14px",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: 16,
//                   border: "1px solid #e2e8f0",
//                 }}
//               >
//                 <div style={{ flex: 1, minWidth: 0, marginRight: 10 }}>
//                   <p
//                     style={{
//                       color: "#94a3b8",
//                       fontSize: 11,
//                       fontWeight: 700,
//                       textTransform: "uppercase",
//                       letterSpacing: 1,
//                       margin: "0 0 2px",
//                     }}
//                   >
//                     UPI ID
//                   </p>
//                   <p
//                     style={{
//                       color: "#1e293b",
//                       fontWeight: 800,
//                       fontSize: 13,
//                       margin: 0,
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {UPI_ID}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => navigator.clipboard?.writeText(UPI_ID)}
//                   style={{
//                     background: "none",
//                     border: "1px solid #e2e8f0",
//                     borderRadius: 8,
//                     padding: "5px 10px",
//                     fontSize: 12,
//                     fontWeight: 700,
//                     color: "#64748b",
//                     cursor: "pointer",
//                     flexShrink: 0,
//                   }}
//                 >
//                   Copy
//                 </button>
//               </div>

//               {/* Open UPI App */}
//               <a
//                 href={upiUrl}
//                 style={{
//                   display: "block",
//                   textAlign: "center",
//                   padding: "13px",
//                   borderRadius: 12,
//                   background: plan.gradient,
//                   color: "#fff",
//                   fontWeight: 800,
//                   fontSize: 14,
//                   textDecoration: "none",
//                   marginBottom: 16,
//                   boxShadow: `0 6px 20px ${plan.color}44`,
//                 }}
//               >
//                 📱 Open UPI App
//               </a>

//               {/* UTR Input */}
//               <div>
//                 <label
//                   style={{
//                     fontSize: 12,
//                     fontWeight: 700,
//                     color: "#64748b",
//                     textTransform: "uppercase",
//                     letterSpacing: 1,
//                   }}
//                 >
//                   After payment, enter UTR / Transaction ID
//                 </label>
//                 <input
//                   value={utrInput}
//                   onChange={(e) => setUtrInput(e.target.value)}
//                   placeholder="e.g. 407812345678"
//                   style={{
//                     width: "100%",
//                     marginTop: 8,
//                     padding: "11px 14px",
//                     borderRadius: 10,
//                     border: "1.5px solid #e2e8f0",
//                     fontSize: 14,
//                     color: "#1e293b",
//                     outline: "none",
//                     boxSizing: "border-box",
//                     fontFamily: "inherit",
//                   }}
//                 />
//                 {error && (
//                   <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
//                     {error}
//                   </p>
//                 )}
//                 <button
//                   onClick={handleUTRSubmit}
//                   disabled={submitting || expired}
//                   style={{
//                     width: "100%",
//                     marginTop: 10,
//                     padding: "13px",
//                     borderRadius: 12,
//                     border: "none",
//                     background:
//                       submitting || expired
//                         ? "#e2e8f0"
//                         : "linear-gradient(135deg, #f472b6, #ec4899)",
//                     color: submitting || expired ? "#94a3b8" : "#fff",
//                     fontWeight: 800,
//                     fontSize: 14,
//                     cursor: submitting || expired ? "not-allowed" : "pointer",
//                   }}
//                 >
//                   {submitting ? "Submitting..." : "Confirm Payment"}
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Payment Method Modal ──────────────────────────────────────────────────────
// function PaymentMethodModal({ plan, onClose, onSelectRazorpay, onSelectQR }) {
//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 999,
//         background: "rgba(0,0,0,0.6)",
//         backdropFilter: "blur(6px)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 16,
//       }}
//       onClick={onClose}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 28,
//           width: "100%",
//           maxWidth: 400,
//           boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
//           overflow: "hidden",
//           animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div style={{ height: 6, background: plan.gradient }} />
//         <div style={{ padding: "28px 28px 32px" }}>
//           <div style={{ textAlign: "center", marginBottom: 24 }}>
//             <div style={{ fontSize: 36, marginBottom: 8 }}>💳</div>
//             <h2
//               style={{
//                 fontWeight: 900,
//                 fontSize: 20,
//                 color: "#0f172a",
//                 margin: "0 0 6px",
//               }}
//             >
//               Select Payment Method
//             </h2>
//             <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
//               {plan.title} ·{" "}
//               <strong style={{ color: plan.color }}>₹{plan.priceTotal}</strong>
//             </p>
//           </div>

//           {/* UPI QR */}
//           <button
//             onClick={onSelectQR}
//             style={{
//               width: "100%",
//               padding: "16px 20px",
//               background: plan.gradient,
//               border: "none",
//               borderRadius: 16,
//               display: "flex",
//               alignItems: "center",
//               gap: 14,
//               cursor: "pointer",
//               marginBottom: 12,
//               boxShadow: `0 8px 24px ${plan.color}44`,
//               transition: "transform 0.15s",
//             }}
//             onMouseEnter={(e) =>
//               (e.currentTarget.style.transform = "scale(1.02)")
//             }
//             onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//           >
//             <div
//               style={{
//                 width: 44,
//                 height: 44,
//                 borderRadius: 12,
//                 background: "rgba(255,255,255,0.25)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: 22,
//                 flexShrink: 0,
//               }}
//             >
//               📱
//             </div>
//             <div style={{ textAlign: "left" }}>
//               <p
//                 style={{
//                   color: "#fff",
//                   fontWeight: 900,
//                   fontSize: 16,
//                   margin: "0 0 2px",
//                 }}
//               >
//                 UPI / QR Pay
//               </p>
//               <p
//                 style={{
//                   color: "rgba(255,255,255,0.8)",
//                   fontSize: 12,
//                   margin: 0,
//                 }}
//               >
//                 GPay, PhonePe, Paytm & any UPI app
//               </p>
//             </div>
//             <svg
//               style={{ marginLeft: "auto", color: "#fff", opacity: 0.8 }}
//               width="18"
//               height="18"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2.5}
//                 d="M9 5l7 7-7 7"
//               />
//             </svg>
//           </button>

//           {/* Razorpay */}
//           <button
//             onClick={onSelectRazorpay}
//             style={{
//               width: "100%",
//               padding: "16px 20px",
//               background: "#fff",
//               border: "2px solid #e2e8f0",
//               borderRadius: 16,
//               display: "flex",
//               alignItems: "center",
//               gap: 14,
//               cursor: "pointer",
//               marginBottom: 20,
//               transition: "all 0.15s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.borderColor = plan.color;
//               e.currentTarget.style.transform = "scale(1.02)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.borderColor = "#e2e8f0";
//               e.currentTarget.style.transform = "scale(1)";
//             }}
//           >
//             <div
//               style={{
//                 width: 44,
//                 height: 44,
//                 borderRadius: 12,
//                 background: "#f1f5f9",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: 22,
//                 flexShrink: 0,
//               }}
//             >
//               🏦
//             </div>
//             <div style={{ textAlign: "left" }}>
//               <p
//                 style={{
//                   color: "#0f172a",
//                   fontWeight: 900,
//                   fontSize: 16,
//                   margin: "0 0 2px",
//                 }}
//               >
//                 Razorpay
//               </p>
//               <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>
//                 Cards, Net Banking, Wallets & UPI
//               </p>
//             </div>
//             <svg
//               style={{ marginLeft: "auto", color: "#94a3b8" }}
//               width="18"
//               height="18"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2.5}
//                 d="M9 5l7 7-7 7"
//               />
//             </svg>
//           </button>

//           <button
//             onClick={onClose}
//             style={{
//               width: "100%",
//               padding: "11px",
//               background: "none",
//               border: "none",
//               color: "#94a3b8",
//               fontWeight: 700,
//               fontSize: 14,
//               cursor: "pointer",
//             }}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Main RechargePage ─────────────────────────────────────────────────────────
// export default function RechargePage() {
//   const navigate = useNavigate();
//   const { user, token, updateUser } = useAuth();

//   const [methodModalPlan, setMethodModalPlan] = useState(null);
//   const [qrModalPlan, setQrModalPlan] = useState(null);
//   const [razorpayLoading, setRazorpayLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!window.Razorpay) {
//       const s = document.createElement("script");
//       s.src = "https://checkout.razorpay.com/v1/checkout.js";
//       document.body.appendChild(s);
//     }
//   }, []);

//   const handlePlanSelect = (plan) => {
//     if (!user) {
//       navigate("/signin");
//       return;
//     }
//     setError("");
//     setMethodModalPlan(plan);
//   };

//   const handleRazorpay = async (plan) => {
//     setMethodModalPlan(null);
//     setRazorpayLoading(true);
//     setError("");
//     try {
//       const res = await fetch("/api/payment/create-order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ planId: plan.id, amount: plan.priceTotal }),
//       });
//       const data = await res.json();
//       if (!data.success)
//         throw new Error(data.message || "Order creation failed");

//       const options = {
//         key: data.keyId,
//         amount: data.order.amount,
//         currency: "INR",
//         name: "Red Cherry",
//         description: `${plan.title} – ${plan.minutes} min`,
//         order_id: data.order.id,
//         prefill: {
//           name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
//           contact: user.phoneNumber || "",
//         },
//         theme: { color: plan.color },
//         handler: async (response) => {
//           const verifyRes = await fetch("/api/payment/verify", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               planId: plan.id,
//               amount: plan.priceTotal,
//             }),
//           });
//           const verifyData = await verifyRes.json();
//           if (verifyData.success) {
//             if (updateUser)
//               updateUser({ talktimeBalance: verifyData.newBalance });
//             navigate("/recharge-success", {
//               state: { plan, newBalance: verifyData.newBalance },
//             });
//           } else {
//             setError("Payment verification failed. Contact support.");
//           }
//           setRazorpayLoading(false);
//         },
//         modal: { ondismiss: () => setRazorpayLoading(false) },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       setError(err.message || "Payment failed. Try again.");
//       setRazorpayLoading(false);
//     }
//   };

//   return (
//     <>
//       <style>{`
//         @keyframes slideUp {
//           from { opacity: 0; transform: translateY(40px) scale(0.95); }
//           to   { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(16px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .plan-card { animation: fadeIn 0.4s ease both; }
//         .plan-card:nth-child(1) { animation-delay: 0.05s; }
//         .plan-card:nth-child(2) { animation-delay: 0.12s; }
//         .plan-card:nth-child(3) { animation-delay: 0.19s; }
//       `}</style>

//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           minHeight: "100vh",
//           background: "#0f0f0f",
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             width: "100%",
//             position: "sticky",
//             top: 0,
//             zIndex: 40,
//             background: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)",
//             boxShadow: "0 4px 20px rgba(244,114,182,0.4)",
//           }}
//         >
//           <div
//             style={{
//               maxWidth: 900,
//               margin: "0 auto",
//               padding: "14px 20px",
//               display: "flex",
//               alignItems: "center",
//               gap: 12,
//             }}
//           >
//             <button
//               onClick={() => navigate(-1)}
//               style={{
//                 width: 36,
//                 height: 36,
//                 borderRadius: "50%",
//                 border: "none",
//                 background: "rgba(255,255,255,0.2)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//               }}
//             >
//               <svg
//                 width="18"
//                 height="18"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="#fff"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2.5}
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//             </button>
//             <div>
//               <p
//                 style={{
//                   color: "rgba(255,255,255,0.7)",
//                   fontSize: 11,
//                   fontWeight: 700,
//                   letterSpacing: 3,
//                   textTransform: "uppercase",
//                   margin: 0,
//                 }}
//               >
//                 Choose Plan
//               </p>
//               <h1
//                 style={{
//                   color: "#fff",
//                   fontWeight: 900,
//                   fontSize: 20,
//                   margin: 0,
//                   lineHeight: 1.2,
//                 }}
//               >
//                 Recharge Wallet
//               </h1>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div
//           style={{
//             maxWidth: 900,
//             margin: "0 auto",
//             width: "100%",
//             padding: "28px 20px 60px",
//           }}
//         >
//           {/* Info banner */}
//           <div
//             style={{
//               borderRadius: 16,
//               padding: "14px 18px",
//               marginBottom: 28,
//               background: "rgba(244,114,182,0.1)",
//               border: "1px solid rgba(244,114,182,0.2)",
//               display: "flex",
//               alignItems: "center",
//               gap: 12,
//             }}
//           >
//             <span style={{ fontSize: 24 }}>⏱</span>
//             <div>
//               <p
//                 style={{
//                   color: "#fff",
//                   fontWeight: 800,
//                   fontSize: 14,
//                   margin: "0 0 2px",
//                 }}
//               >
//                 15-minute talktime sessions
//               </p>
//               <p
//                 style={{
//                   color: "rgba(255,255,255,0.45)",
//                   fontSize: 12,
//                   margin: 0,
//                 }}
//               >
//                 Balance credited instantly after payment
//               </p>
//             </div>
//           </div>

//           {error && (
//             <div
//               style={{
//                 borderRadius: 12,
//                 padding: "12px 16px",
//                 marginBottom: 16,
//                 textAlign: "center",
//                 background: "rgba(239,68,68,0.12)",
//                 border: "1px solid rgba(239,68,68,0.3)",
//               }}
//             >
//               <p
//                 style={{
//                   color: "#f87171",
//                   fontSize: 14,
//                   fontWeight: 700,
//                   margin: 0,
//                 }}
//               >
//                 {error}
//               </p>
//             </div>
//           )}

//           {/* Plans Grid */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
//               gap: 20,
//             }}
//           >
//             {PLANS.map((plan) => (
//               <div
//                 key={plan.id}
//                 className="plan-card"
//                 style={{
//                   borderRadius: 22,
//                   overflow: "hidden",
//                   background: "rgba(255,255,255,0.04)",
//                   border: "1.5px solid rgba(255,255,255,0.09)",
//                   display: "flex",
//                   flexDirection: "column",
//                   transition: "transform 0.2s, box-shadow 0.2s",
//                   cursor: "pointer",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = "translateY(-4px)";
//                   e.currentTarget.style.boxShadow = `0 16px 48px ${plan.color}33`;
//                   e.currentTarget.style.borderColor = plan.color + "66";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "translateY(0)";
//                   e.currentTarget.style.boxShadow = "none";
//                   e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
//                 }}
//               >
//                 <div style={{ height: 5, background: plan.gradient }} />
//                 <div
//                   style={{
//                     padding: "20px 20px 22px",
//                     display: "flex",
//                     flexDirection: "column",
//                     flex: 1,
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: 14,
//                     }}
//                   >
//                     <span style={{ fontSize: 26 }}>{plan.emoji}</span>
//                     <span
//                       style={{
//                         fontSize: 11,
//                         fontWeight: 800,
//                         padding: "3px 10px",
//                         borderRadius: 50,
//                         letterSpacing: 1,
//                         textTransform: "uppercase",
//                         background: plan.color + "22",
//                         color: plan.color,
//                       }}
//                     >
//                       {plan.badge}
//                     </span>
//                   </div>
//                   <h3
//                     style={{
//                       color: "#fff",
//                       fontWeight: 900,
//                       fontSize: 17,
//                       margin: "0 0 4px",
//                     }}
//                   >
//                     {plan.title}
//                   </h3>
//                   <p
//                     style={{
//                       color: "rgba(255,255,255,0.45)",
//                       fontSize: 13,
//                       margin: "0 0 16px",
//                       lineHeight: 1.5,
//                     }}
//                   >
//                     {plan.description}
//                   </p>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "flex-end",
//                       gap: 8,
//                       marginBottom: 16,
//                     }}
//                   >
//                     <span
//                       style={{
//                         color: "#fff",
//                         fontWeight: 900,
//                         fontSize: 32,
//                         lineHeight: 1,
//                       }}
//                     >
//                       ₹{plan.priceTotal.toLocaleString()}
//                     </span>
//                     <span
//                       style={{
//                         color: "rgba(255,255,255,0.4)",
//                         fontSize: 13,
//                         paddingBottom: 4,
//                       }}
//                     >
//                       / {plan.minutes} min
//                     </span>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 8,
//                       marginBottom: 20,
//                       background: "rgba(255,255,255,0.06)",
//                       borderRadius: 10,
//                       padding: "8px 12px",
//                     }}
//                   >
//                     <span style={{ color: plan.color, fontSize: 14 }}>💰</span>
//                     <span
//                       style={{
//                         color: "rgba(255,255,255,0.6)",
//                         fontSize: 13,
//                         fontWeight: 600,
//                       }}
//                     >
//                       ₹{plan.perMinute} / minute
//                     </span>
//                   </div>
//                   <button
//                     onClick={() => handlePlanSelect(plan)}
//                     disabled={razorpayLoading}
//                     style={{
//                       marginTop: "auto",
//                       width: "100%",
//                       padding: "14px",
//                       background: razorpayLoading
//                         ? "rgba(255,255,255,0.1)"
//                         : plan.gradient,
//                       border: "none",
//                       borderRadius: 14,
//                       color: "#fff",
//                       fontWeight: 900,
//                       fontSize: 15,
//                       cursor: razorpayLoading ? "not-allowed" : "pointer",
//                       boxShadow: razorpayLoading
//                         ? "none"
//                         : `0 8px 24px ${plan.color}44`,
//                       transition: "all 0.2s",
//                       letterSpacing: 0.5,
//                     }}
//                   >
//                     {razorpayLoading
//                       ? "Processing..."
//                       : `Pay ₹${plan.priceTotal.toLocaleString()}`}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Security note */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 6,
//               marginTop: 28,
//             }}
//           >
//             <span style={{ color: "#4ade80", fontSize: 14 }}>🔒</span>
//             <p
//               style={{
//                 color: "rgba(255,255,255,0.3)",
//                 fontSize: 12,
//                 margin: 0,
//               }}
//             >
//               Secured by Razorpay & UPI · 256-bit SSL
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Payment Method Modal */}
//       {methodModalPlan && (
//         <PaymentMethodModal
//           plan={methodModalPlan}
//           onClose={() => setMethodModalPlan(null)}
//           onSelectQR={() => {
//             setMethodModalPlan(null);
//             setQrModalPlan(methodModalPlan);
//           }}
//           onSelectRazorpay={() => handleRazorpay(methodModalPlan)}
//         />
//       )}

//       {/* QR Modal */}
//       {qrModalPlan && (
//         <QRModal plan={qrModalPlan} onClose={() => setQrModalPlan(null)} />
//       )}
//     </>
//   );
// }

//=============v2 manaual reacharge admin

// user-frontend/src/pages/RechargePage.jsx

// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const PLANS = [
//   {
//     id: "single",
//     title: "Single Host Room",
//     emoji: "👤",
//     priceTotal: 720,
//     minutes: 15,
//     perMinute: 48,
//     color: "#f472b6",
//     gradient: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)",
//     badge: "Basic",
//     description: "1-on-1 private session with a host",
//   },
//   {
//     id: "double",
//     title: "Double Host Room",
//     emoji: "👥",
//     priceTotal: 1500,
//     minutes: 15,
//     perMinute: 100,
//     color: "#a855f7",
//     gradient: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
//     badge: "Popular",
//     description: "Join a room with 2 hosts simultaneously",
//   },
//   {
//     id: "multiple",
//     title: "Multiple Host Room",
//     emoji: "🎉",
//     priceTotal: 3510,
//     minutes: 15,
//     perMinute: 234,
//     color: "#f59e0b",
//     gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
//     badge: "Premium",
//     description: "Group room with multiple hosts & users",
//   },
// ];

// // ── UPI / QR Modal ────────────────────────────────────────────────────────────
// function QRModal({ plan, onClose, token }) {
//   const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
//   const [utrInput, setUtrInput] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState("");
//   const timerRef = useRef(null);

//   const UPI_ID = "spm38432@okicici";
//   const UPI_NAME = "Redcherry";
//   const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${plan.priceTotal}&cu=INR&tn=${encodeURIComponent(plan.title)}`;
//   const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;

//   useEffect(() => {
//     timerRef.current = setInterval(() => {
//       setTimeLeft((t) => {
//         if (t <= 1) {
//           clearInterval(timerRef.current);
//           return 0;
//         }
//         return t - 1;
//       });
//     }, 1000);
//     return () => clearInterval(timerRef.current);
//   }, []);

//   const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
//   const ss = String(timeLeft % 60).padStart(2, "0");
//   const expired = timeLeft === 0;

//   const handleUTRSubmit = async () => {
//     const utr = utrInput.trim();
//     if (!utr) {
//       setError("Please enter your UTR / transaction ID.");
//       return;
//     }
//     if (!/^\d{12}$/.test(utr)) {
//       setError("UTR must be exactly 12 digits (numbers only).");
//       return;
//     }
//     setSubmitting(true);
//     setError("");
//     try {
//       const res = await fetch("/api/recharge/manual/submit", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ amount: plan.priceTotal, utrNumber: utr }),
//       });
//       const data = await res.json();
//       if (!data.success) {
//         setError(data.message || "Submission failed. Please try again.");
//       } else {
//         setSubmitted(true);
//       }
//     } catch {
//       setError("Network error. Please try again.");
//     }
//     setSubmitting(false);
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 1000,
//         background: "rgba(0,0,0,0.65)",
//         backdropFilter: "blur(6px)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "16px",
//       }}
//       onClick={onClose}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: 24,
//           width: "100%",
//           maxWidth: 420,
//           boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
//           overflow: "hidden",
//           animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div
//           style={{
//             background: plan.gradient,
//             padding: "20px 24px 16px",
//             position: "relative",
//           }}
//         >
//           <button
//             onClick={onClose}
//             style={{
//               position: "absolute",
//               top: 14,
//               right: 14,
//               background: "rgba(255,255,255,0.25)",
//               border: "none",
//               borderRadius: "50%",
//               width: 32,
//               height: 32,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//               color: "#fff",
//               fontSize: 18,
//               lineHeight: 1,
//             }}
//           >
//             ×
//           </button>
//           <p
//             style={{
//               color: "rgba(255,255,255,0.8)",
//               fontSize: 12,
//               fontWeight: 700,
//               letterSpacing: 2,
//               textTransform: "uppercase",
//               margin: "0 0 4px",
//             }}
//           >
//             Scan & Pay via UPI
//           </p>
//           <h3
//             style={{ color: "#fff", fontWeight: 900, fontSize: 22, margin: 0 }}
//           >
//             ₹{plan.priceTotal.toLocaleString()}
//           </h3>
//           <p
//             style={{
//               color: "rgba(255,255,255,0.75)",
//               fontSize: 13,
//               margin: "2px 0 0",
//             }}
//           >
//             {plan.title}
//           </p>
//         </div>

//         <div style={{ padding: "20px 24px 24px" }}>
//           {submitted ? (
//             <div style={{ textAlign: "center", padding: "20px 0" }}>
//               <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
//               <h3
//                 style={{
//                   fontWeight: 900,
//                   color: "#16a34a",
//                   fontSize: 20,
//                   marginBottom: 8,
//                 }}
//               >
//                 Submitted!
//               </h3>
//               <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
//                 Your payment is under review. Balance will be credited after
//                 verification (usually within a few hours).
//               </p>
//               <button
//                 onClick={onClose}
//                 style={{
//                   marginTop: 20,
//                   padding: "12px 32px",
//                   background: plan.gradient,
//                   border: "none",
//                   borderRadius: 50,
//                   color: "#fff",
//                   fontWeight: 800,
//                   fontSize: 14,
//                   cursor: "pointer",
//                 }}
//               >
//                 Done
//               </button>
//             </div>
//           ) : (
//             <>
//               {/* QR Code */}
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   background: "#fafafa",
//                   borderRadius: 16,
//                   padding: "16px",
//                   border: "1.5px solid #f1f5f9",
//                   marginBottom: 16,
//                 }}
//               >
//                 <img
//                   src={qrUrl}
//                   alt="UPI QR Code"
//                   style={{ width: 200, height: 200, borderRadius: 8 }}
//                 />
//                 <div
//                   style={{
//                     marginTop: 12,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 6,
//                     background: expired ? "#fee2e2" : "#fef3c7",
//                     borderRadius: 50,
//                     padding: "5px 14px",
//                   }}
//                 >
//                   <span style={{ fontSize: 13 }}>⏱</span>
//                   <span
//                     style={{
//                       fontSize: 14,
//                       fontWeight: 800,
//                       color: expired ? "#dc2626" : "#b45309",
//                     }}
//                   >
//                     {expired ? "QR Expired" : `${mm}:${ss} left`}
//                   </span>
//                 </div>
//               </div>

//               {/* UPI ID */}
//               <div
//                 style={{
//                   background: "#f8fafc",
//                   borderRadius: 12,
//                   padding: "10px 14px",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: 16,
//                   border: "1px solid #e2e8f0",
//                 }}
//               >
//                 <div style={{ flex: 1, minWidth: 0, marginRight: 10 }}>
//                   <p
//                     style={{
//                       color: "#94a3b8",
//                       fontSize: 11,
//                       fontWeight: 700,
//                       textTransform: "uppercase",
//                       letterSpacing: 1,
//                       margin: "0 0 2px",
//                     }}
//                   >
//                     UPI ID
//                   </p>
//                   <p
//                     style={{
//                       color: "#1e293b",
//                       fontWeight: 800,
//                       fontSize: 13,
//                       margin: 0,
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {UPI_ID}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => navigator.clipboard?.writeText(UPI_ID)}
//                   style={{
//                     background: "none",
//                     border: "1px solid #e2e8f0",
//                     borderRadius: 8,
//                     padding: "5px 10px",
//                     fontSize: 12,
//                     fontWeight: 700,
//                     color: "#64748b",
//                     cursor: "pointer",
//                     flexShrink: 0,
//                   }}
//                 >
//                   Copy
//                 </button>
//               </div>

//               {/* Open UPI App */}
//               <a
//                 href={upiUrl}
//                 style={{
//                   display: "block",
//                   textAlign: "center",
//                   padding: "13px",
//                   borderRadius: 12,
//                   background: plan.gradient,
//                   color: "#fff",
//                   fontWeight: 800,
//                   fontSize: 14,
//                   textDecoration: "none",
//                   marginBottom: 16,
//                   boxShadow: `0 6px 20px ${plan.color}44`,
//                 }}
//               >
//                 📱 Open UPI App
//               </a>

//               {/* UTR Input */}
//               <div>
//                 <label
//                   style={{
//                     fontSize: 12,
//                     fontWeight: 700,
//                     color: "#64748b",
//                     textTransform: "uppercase",
//                     letterSpacing: 1,
//                   }}
//                 >
//                   After payment, enter UTR / Transaction ID
//                 </label>
//                 <p
//                   style={{
//                     fontSize: 12,
//                     color: "#94a3b8",
//                     margin: "4px 0 8px",
//                   }}
//                 >
//                   12-digit number from your UPI app payment receipt
//                 </p>
//                 <input
//                   value={utrInput}
//                   onChange={(e) => {
//                     // Only allow digits
//                     const val = e.target.value.replace(/\D/g, "").slice(0, 12);
//                     setUtrInput(val);
//                     setError("");
//                   }}
//                   placeholder="e.g. 407812345678"
//                   maxLength={12}
//                   inputMode="numeric"
//                   style={{
//                     width: "100%",
//                     marginTop: 4,
//                     padding: "11px 14px",
//                     borderRadius: 10,
//                     border: `1.5px solid ${error ? "#ef4444" : "#e2e8f0"}`,
//                     fontSize: 16,
//                     color: "#1e293b",
//                     outline: "none",
//                     boxSizing: "border-box",
//                     fontFamily: "monospace",
//                     letterSpacing: 2,
//                   }}
//                 />
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginTop: 4,
//                   }}
//                 >
//                   {error ? (
//                     <p style={{ color: "#ef4444", fontSize: 12, margin: 0 }}>
//                       {error}
//                     </p>
//                   ) : (
//                     <span />
//                   )}
//                   <p
//                     style={{
//                       color: utrInput.length === 12 ? "#16a34a" : "#94a3b8",
//                       fontSize: 12,
//                       margin: 0,
//                     }}
//                   >
//                     {utrInput.length}/12
//                   </p>
//                 </div>
//                 <button
//                   onClick={handleUTRSubmit}
//                   disabled={submitting || expired || utrInput.length !== 12}
//                   style={{
//                     width: "100%",
//                     marginTop: 12,
//                     padding: "13px",
//                     borderRadius: 12,
//                     border: "none",
//                     background:
//                       submitting || expired || utrInput.length !== 12
//                         ? "#e2e8f0"
//                         : plan.gradient,
//                     color:
//                       submitting || expired || utrInput.length !== 12
//                         ? "#94a3b8"
//                         : "#fff",
//                     fontWeight: 800,
//                     fontSize: 14,
//                     cursor:
//                       submitting || expired || utrInput.length !== 12
//                         ? "not-allowed"
//                         : "pointer",
//                     transition: "all 0.2s",
//                   }}
//                 >
//                   {submitting ? "Submitting…" : "✅ Confirm Payment"}
//                 </button>
//                 {expired && (
//                   <p
//                     style={{
//                       textAlign: "center",
//                       color: "#ef4444",
//                       fontSize: 12,
//                       marginTop: 8,
//                     }}
//                   >
//                     QR has expired. Please close and try again.
//                   </p>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Main RechargePage ─────────────────────────────────────────────────────────
// export default function RechargePage() {
//   const navigate = useNavigate();
//   const { user, token } = useAuth();

//   const [qrModalPlan, setQrModalPlan] = useState(null);
//   const [error, setError] = useState("");

//   const handlePlanSelect = (plan) => {
//     if (!user) {
//       navigate("/signin");
//       return;
//     }
//     setError("");
//     setQrModalPlan(plan);
//   };

//   return (
//     <>
//       <style>{`
//         @keyframes slideUp {
//           from { opacity: 0; transform: translateY(40px) scale(0.95); }
//           to   { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(16px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .plan-card { animation: fadeIn 0.4s ease both; }
//         .plan-card:nth-child(1) { animation-delay: 0.05s; }
//         .plan-card:nth-child(2) { animation-delay: 0.12s; }
//         .plan-card:nth-child(3) { animation-delay: 0.19s; }
//       `}</style>

//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           minHeight: "100vh",
//           background: "#0f0f0f",
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             width: "100%",
//             position: "sticky",
//             top: 0,
//             zIndex: 40,
//             background: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)",
//             boxShadow: "0 4px 20px rgba(244,114,182,0.4)",
//           }}
//         >
//           <div
//             style={{
//               maxWidth: 900,
//               margin: "0 auto",
//               padding: "14px 20px",
//               display: "flex",
//               alignItems: "center",
//               gap: 12,
//             }}
//           >
//             <button
//               onClick={() => navigate(-1)}
//               style={{
//                 width: 36,
//                 height: 36,
//                 borderRadius: "50%",
//                 border: "none",
//                 background: "rgba(255,255,255,0.2)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//               }}
//             >
//               <svg
//                 width="18"
//                 height="18"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="#fff"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2.5}
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//             </button>
//             <div>
//               <p
//                 style={{
//                   color: "rgba(255,255,255,0.7)",
//                   fontSize: 11,
//                   fontWeight: 700,
//                   letterSpacing: 3,
//                   textTransform: "uppercase",
//                   margin: 0,
//                 }}
//               >
//                 Choose Plan
//               </p>
//               <h1
//                 style={{
//                   color: "#fff",
//                   fontWeight: 900,
//                   fontSize: 20,
//                   margin: 0,
//                   lineHeight: 1.2,
//                 }}
//               >
//                 Recharge Wallet
//               </h1>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div
//           style={{
//             maxWidth: 900,
//             margin: "0 auto",
//             width: "100%",
//             padding: "28px 20px 60px",
//           }}
//         >
//           {/* Info banner */}
//           <div
//             style={{
//               borderRadius: 16,
//               padding: "14px 18px",
//               marginBottom: 16,
//               background: "rgba(244,114,182,0.1)",
//               border: "1px solid rgba(244,114,182,0.2)",
//               display: "flex",
//               alignItems: "center",
//               gap: 12,
//             }}
//           >
//             <span style={{ fontSize: 24 }}>⏱</span>
//             <div>
//               <p
//                 style={{
//                   color: "#fff",
//                   fontWeight: 800,
//                   fontSize: 14,
//                   margin: "0 0 2px",
//                 }}
//               >
//                 15-minute talktime sessions
//               </p>
//               <p
//                 style={{
//                   color: "rgba(255,255,255,0.45)",
//                   fontSize: 12,
//                   margin: 0,
//                 }}
//               >
//                 Balance credited instantly after admin verification
//               </p>
//             </div>
//           </div>

//           {/* Payment method notice */}
//           <div
//             style={{
//               borderRadius: 14,
//               padding: "12px 16px",
//               marginBottom: 28,
//               background: "rgba(251,191,36,0.1)",
//               border: "1px solid rgba(251,191,36,0.25)",
//               display: "flex",
//               alignItems: "center",
//               gap: 10,
//             }}
//           >
//             <span style={{ fontSize: 20 }}>📱</span>
//             <p
//               style={{
//                 color: "rgba(255,255,255,0.7)",
//                 fontSize: 13,
//                 margin: 0,
//               }}
//             >
//               Pay via{" "}
//               <strong style={{ color: "#fbbf24" }}>UPI / QR Code</strong> —
//               scan, pay, enter your UTR number, and your wallet will be credited
//               after verification.
//             </p>
//           </div>

//           {error && (
//             <div
//               style={{
//                 borderRadius: 12,
//                 padding: "12px 16px",
//                 marginBottom: 16,
//                 background: "rgba(239,68,68,0.12)",
//                 border: "1px solid rgba(239,68,68,0.3)",
//               }}
//             >
//               <p
//                 style={{
//                   color: "#f87171",
//                   fontSize: 14,
//                   fontWeight: 700,
//                   margin: 0,
//                 }}
//               >
//                 {error}
//               </p>
//             </div>
//           )}

//           {/* Plans Grid */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
//               gap: 20,
//             }}
//           >
//             {PLANS.map((plan) => (
//               <div
//                 key={plan.id}
//                 className="plan-card"
//                 style={{
//                   borderRadius: 22,
//                   overflow: "hidden",
//                   background: "rgba(255,255,255,0.04)",
//                   border: "1.5px solid rgba(255,255,255,0.09)",
//                   display: "flex",
//                   flexDirection: "column",
//                   transition: "transform 0.2s, box-shadow 0.2s",
//                   cursor: "pointer",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = "translateY(-4px)";
//                   e.currentTarget.style.boxShadow = `0 16px 48px ${plan.color}33`;
//                   e.currentTarget.style.borderColor = plan.color + "66";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "translateY(0)";
//                   e.currentTarget.style.boxShadow = "none";
//                   e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
//                 }}
//               >
//                 <div style={{ height: 5, background: plan.gradient }} />
//                 <div
//                   style={{
//                     padding: "20px 20px 22px",
//                     display: "flex",
//                     flexDirection: "column",
//                     flex: 1,
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: 14,
//                     }}
//                   >
//                     <span style={{ fontSize: 26 }}>{plan.emoji}</span>
//                     <span
//                       style={{
//                         fontSize: 11,
//                         fontWeight: 800,
//                         padding: "3px 10px",
//                         borderRadius: 50,
//                         letterSpacing: 1,
//                         textTransform: "uppercase",
//                         background: plan.color + "22",
//                         color: plan.color,
//                       }}
//                     >
//                       {plan.badge}
//                     </span>
//                   </div>
//                   <h3
//                     style={{
//                       color: "#fff",
//                       fontWeight: 900,
//                       fontSize: 17,
//                       margin: "0 0 4px",
//                     }}
//                   >
//                     {plan.title}
//                   </h3>
//                   <p
//                     style={{
//                       color: "rgba(255,255,255,0.45)",
//                       fontSize: 13,
//                       margin: "0 0 16px",
//                       lineHeight: 1.5,
//                     }}
//                   >
//                     {plan.description}
//                   </p>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "flex-end",
//                       gap: 8,
//                       marginBottom: 16,
//                     }}
//                   >
//                     <span
//                       style={{
//                         color: "#fff",
//                         fontWeight: 900,
//                         fontSize: 32,
//                         lineHeight: 1,
//                       }}
//                     >
//                       ₹{plan.priceTotal.toLocaleString()}
//                     </span>
//                     <span
//                       style={{
//                         color: "rgba(255,255,255,0.4)",
//                         fontSize: 13,
//                         paddingBottom: 4,
//                       }}
//                     >
//                       / {plan.minutes} min
//                     </span>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 8,
//                       marginBottom: 20,
//                       background: "rgba(255,255,255,0.06)",
//                       borderRadius: 10,
//                       padding: "8px 12px",
//                     }}
//                   >
//                     <span style={{ color: plan.color, fontSize: 14 }}>💰</span>
//                     <span
//                       style={{
//                         color: "rgba(255,255,255,0.6)",
//                         fontSize: 13,
//                         fontWeight: 600,
//                       }}
//                     >
//                       ₹{plan.perMinute} / minute
//                     </span>
//                   </div>

//                   {/* QR Pay Button — active */}
//                   <button
//                     onClick={() => handlePlanSelect(plan)}
//                     style={{
//                       marginTop: "auto",
//                       width: "100%",
//                       padding: "14px",
//                       background: plan.gradient,
//                       border: "none",
//                       borderRadius: 14,
//                       color: "#fff",
//                       fontWeight: 900,
//                       fontSize: 15,
//                       cursor: "pointer",
//                       boxShadow: `0 8px 24px ${plan.color}44`,
//                       transition: "all 0.2s",
//                       letterSpacing: 0.5,
//                       marginBottom: 10,
//                     }}
//                   >
//                     📱 Pay ₹{plan.priceTotal.toLocaleString()} via UPI
//                   </button>

//                   {/* Razorpay — disabled with coming soon label */}
//                   <button
//                     disabled
//                     title="Coming soon"
//                     style={{
//                       width: "100%",
//                       padding: "12px",
//                       background: "rgba(255,255,255,0.04)",
//                       border: "1.5px dashed rgba(255,255,255,0.15)",
//                       borderRadius: 14,
//                       color: "rgba(255,255,255,0.25)",
//                       fontWeight: 700,
//                       fontSize: 13,
//                       cursor: "not-allowed",
//                       letterSpacing: 0.3,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: 8,
//                     }}
//                   >
//                     <span>🏦</span>
//                     <span>Razorpay — Coming Soon</span>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Security note */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 6,
//               marginTop: 28,
//             }}
//           >
//             <span style={{ color: "#4ade80", fontSize: 14 }}>🔒</span>
//             <p
//               style={{
//                 color: "rgba(255,255,255,0.3)",
//                 fontSize: 12,
//                 margin: 0,
//               }}
//             >
//               Pay via UPI · Verified by Admin · 100% Secure
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* QR Modal */}
//       {qrModalPlan && (
//         <QRModal
//           plan={qrModalPlan}
//           token={token}
//           onClose={() => setQrModalPlan(null)}
//         />
//       )}
//     </>
//   );
// }

///remove QR CODE
import { useNavigate } from "react-router-dom";

const PLANS = [
  {
    id: "single",
    title: "Single Host Room",
    emoji: "👤",
    priceTotal: 720,
    minutes: 15,
    perMinute: 48,
    color: "#f472b6",
    gradient: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)",
    badge: "Basic",
    description: "1-on-1 private session with a host",
  },
  {
    id: "double",
    title: "Double Host Room",
    emoji: "👥",
    priceTotal: 1500,
    minutes: 15,
    perMinute: 100,
    color: "#a855f7",
    gradient: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
    badge: "Popular",
    description: "Join a room with 2 hosts simultaneously",
  },
  {
    id: "multiple",
    title: "Multiple Host Room",
    emoji: "🎉",
    priceTotal: 3510,
    minutes: 15,
    perMinute: 234,
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    badge: "Premium",
    description: "Group room with multiple hosts & users",
  },
];

export default function RechargePage() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .plan-card { animation: fadeIn 0.4s ease both; }
        .plan-card:nth-child(1) { animation-delay: 0.05s; }
        .plan-card:nth-child(2) { animation-delay: 0.12s; }
        .plan-card:nth-child(3) { animation-delay: 0.19s; }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "#0f0f0f",
        }}
      >
        {/* Header */}
        <div
          style={{
            width: "100%",
            position: "sticky",
            top: 0,
            zIndex: 40,
            background: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)",
            boxShadow: "0 4px 20px rgba(244,114,182,0.4)",
          }}
        >
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <button
              onClick={() => navigate(-1)}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#fff"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Choose Plan
              </p>
              <h1
                style={{
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 20,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Recharge Wallet
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            width: "100%",
            padding: "28px 20px 60px",
          }}
        >
          {/* Info banner */}
          <div
            style={{
              borderRadius: 16,
              padding: "14px 18px",
              marginBottom: 28,
              background: "rgba(244,114,182,0.1)",
              border: "1px solid rgba(244,114,182,0.2)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 24 }}>⏱</span>
            <div>
              <p
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 14,
                  margin: "0 0 2px",
                }}
              >
                15-minute talktime sessions
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 12,
                  margin: 0,
                }}
              >
                Payment gateway coming soon — stay tuned!
              </p>
            </div>
          </div>

          {/* Plans Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="plan-card"
                style={{
                  borderRadius: 22,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.04)",
                  border: "1.5px solid rgba(255,255,255,0.09)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 16px 48px ${plan.color}33`;
                  e.currentTarget.style.borderColor = plan.color + "66";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                }}
              >
                <div style={{ height: 5, background: plan.gradient }} />
                <div
                  style={{
                    padding: "20px 20px 22px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 14,
                    }}
                  >
                    <span style={{ fontSize: 26 }}>{plan.emoji}</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "3px 10px",
                        borderRadius: 50,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        background: plan.color + "22",
                        color: plan.color,
                      }}
                    >
                      {plan.badge}
                    </span>
                  </div>
                  <h3
                    style={{
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: 17,
                      margin: "0 0 4px",
                    }}
                  >
                    {plan.title}
                  </h3>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: 13,
                      margin: "0 0 16px",
                      lineHeight: 1.5,
                    }}
                  >
                    {plan.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    <span
                      style={{
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: 32,
                        lineHeight: 1,
                      }}
                    >
                      ₹{plan.priceTotal.toLocaleString()}
                    </span>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: 13,
                        paddingBottom: 4,
                      }}
                    >
                      / {plan.minutes} min
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 20,
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 10,
                      padding: "8px 12px",
                    }}
                  >
                    <span style={{ color: plan.color, fontSize: 14 }}>💰</span>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      ₹{plan.perMinute} / minute
                    </span>
                  </div>

                  {/* Razorpay — Coming Soon */}
                  <button
                    disabled
                    title="Coming soon"
                    style={{
                      marginTop: "auto",
                      width: "100%",
                      padding: "14px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1.5px dashed rgba(255,255,255,0.2)",
                      borderRadius: 14,
                      color: "rgba(255,255,255,0.3)",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "not-allowed",
                      letterSpacing: 0.3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <span>🏦</span>
                    <span>Razorpay — Coming Soon</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Security note */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              marginTop: 28,
            }}
          >
            <span style={{ color: "#4ade80", fontSize: 14 }}>🔒</span>
            <p
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: 12,
                margin: 0,
              }}
            >
              Secured by Razorpay · 256-bit SSL · Coming Soon
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
