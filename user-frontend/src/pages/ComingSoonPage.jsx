// // //with logo v2
// // //user-frontend
// // // src/pages/ComingSoonPage.jsx
// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";

// // const COLORS = [
// //   "#FF4B6E",
// //   "#FF6B35",
// //   "#FFD93D",
// //   "#6BCB77",
// //   "#4D96FF",
// //   "#C77DFF",
// //   "#FF85A1",
// // ];

// // const PETALS = Array.from({ length: 28 }, (_, i) => ({
// //   id: i,
// //   size: (i % 3) * 6 + 8,
// //   left: `${(i * 13) % 97}%`,
// //   top: `${(i * 17) % 93}%`,
// //   color: COLORS[i % COLORS.length],
// //   delay: `${((i * 0.3) % 3).toFixed(1)}s`,
// //   duration: `${(2 + ((i * 0.17) % 2.5)).toFixed(1)}s`,
// // }));

// // // ── Shared legal layout ────────────────────────────────────────────────────────
// // function LegalPageLayout({ title, children, onBack }) {
// //   return (
// //     <div
// //       style={{
// //         minHeight: "100vh",
// //         background:
// //           "linear-gradient(135deg, #0f0015 0%, #1a0020 50%, #0f0015 100%)",
// //         color: "#fff",
// //         fontFamily: "'Nunito', sans-serif",
// //       }}
// //     >
// //       <div
// //         style={{
// //           position: "sticky",
// //           top: 0,
// //           zIndex: 20,
// //           background: "rgba(15,0,21,0.95)",
// //           backdropFilter: "blur(8px)",
// //           borderBottom: "1px solid rgba(255,75,110,0.2)",
// //           padding: "14px 20px",
// //         }}
// //       >
// //         <button
// //           onClick={onBack}
// //           style={{
// //             display: "flex",
// //             alignItems: "center",
// //             gap: 8,
// //             background: "none",
// //             border: "none",
// //             color: "#FF4B6E",
// //             cursor: "pointer",
// //             fontSize: 14,
// //             fontWeight: 700,
// //             fontFamily: "inherit",
// //           }}
// //         >
// //           <svg
// //             width="18"
// //             height="18"
// //             fill="none"
// //             stroke="currentColor"
// //             strokeWidth="2.5"
// //             viewBox="0 0 24 24"
// //           >
// //             <path
// //               strokeLinecap="round"
// //               strokeLinejoin="round"
// //               d="M15 19l-7-7 7-7"
// //             />
// //           </svg>
// //           Back
// //         </button>
// //       </div>
// //       <div
// //         style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 60px" }}
// //       >
// //         <div style={{ textAlign: "center", marginBottom: 36 }}>
// //           <h1
// //             style={{
// //               fontSize: "clamp(22px,5vw,32px)",
// //               fontWeight: 900,
// //               background: "linear-gradient(90deg,#FF4B6E,#FFD93D,#FF85A1)",
// //               WebkitBackgroundClip: "text",
// //               WebkitTextFillColor: "transparent",
// //               marginBottom: 12,
// //             }}
// //           >
// //             {title}
// //           </h1>
// //           <div
// //             style={{
// //               width: 60,
// //               height: 3,
// //               background: "linear-gradient(90deg,#FF4B6E,#4D96FF)",
// //               borderRadius: 99,
// //               margin: "0 auto",
// //             }}
// //           />
// //         </div>
// //         <div
// //           style={{
// //             background: "rgba(255,255,255,0.04)",
// //             border: "1px solid rgba(255,75,110,0.2)",
// //             borderRadius: 20,
// //             padding: "28px 24px",
// //           }}
// //         >
// //           {children}
// //         </div>
// //         {/* Age notice */}
// //         <div
// //           style={{
// //             marginTop: 20,
// //             padding: "16px 20px",
// //             background: "rgba(255,75,110,0.08)",
// //             border: "1px solid rgba(255,75,110,0.3)",
// //             borderRadius: 14,
// //             display: "flex",
// //             gap: 12,
// //             alignItems: "flex-start",
// //           }}
// //         >
// //           <span style={{ fontSize: 20 }}>⚠️</span>
// //           <div>
// //             <p
// //               style={{
// //                 color: "#FF4B6E",
// //                 fontWeight: 800,
// //                 fontSize: 14,
// //                 marginBottom: 4,
// //               }}
// //             >
// //               Age Restriction Notice
// //             </p>
// //             <p
// //               style={{
// //                 color: "rgba(255,255,255,0.6)",
// //                 fontSize: 13,
// //                 lineHeight: 1.6,
// //               }}
// //             >
// //               This platform is strictly for users{" "}
// //               <strong style={{ color: "#fff" }}>
// //                 18 years of age or older
// //               </strong>
// //               . Children and minors are prohibited.
// //             </p>
// //           </div>
// //         </div>
// //         {/* Contact */}
// //         <div
// //           style={{
// //             marginTop: 16,
// //             padding: "16px 20px",
// //             background: "rgba(77,150,255,0.06)",
// //             border: "1px solid rgba(77,150,255,0.2)",
// //             borderRadius: 14,
// //           }}
// //         >
// //           <p
// //             style={{
// //               color: "#fff",
// //               fontWeight: 800,
// //               fontSize: 14,
// //               marginBottom: 10,
// //             }}
// //           >
// //             Contact Information
// //           </p>
// //           <div
// //             style={{
// //               color: "rgba(255,255,255,0.6)",
// //               fontSize: 13,
// //               lineHeight: 1.9,
// //             }}
// //           >
// //             <p>
// //               <strong style={{ color: "#fff" }}>Redcheery</strong>
// //             </p>
// //             <p>
// //               📍 Unit No- 11/W/2, Room 2, Action Area II/04, Newtown, Kolkata –
// //               700161
// //             </p>
// //             <p>
// //               📧{" "}
// //               <a
// //                 href="mailto:customercare@redcheery.com"
// //                 style={{ color: "#4D96FF" }}
// //               >
// //                 customercare@redcheery.com
// //               </a>
// //             </p>
// //             <p>
// //               📞{" "}
// //               <a href="tel:8240210845" style={{ color: "#4D96FF" }}>
// //                 8240210845
// //               </a>
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function LS({ title, children }) {
// //   return (
// //     <div style={{ marginBottom: 24 }}>
// //       <h2
// //         style={{
// //           fontSize: 17,
// //           fontWeight: 800,
// //           color: "#FFD93D",
// //           borderBottom: "1px solid rgba(255,255,255,0.1)",
// //           paddingBottom: 8,
// //           marginBottom: 12,
// //         }}
// //       >
// //         {title}
// //       </h2>
// //       <div
// //         style={{
// //           color: "rgba(255,255,255,0.75)",
// //           fontSize: 14,
// //           lineHeight: 1.8,
// //         }}
// //       >
// //         {children}
// //       </div>
// //     </div>
// //   );
// // }

// // // ── Legal page content components ─────────────────────────────────────────────
// // function PrivacyPolicyPage({ onBack }) {
// //   return (
// //     <LegalPageLayout title="Privacy Policy & Refund Policy" onBack={onBack}>
// //       <LS title="1. Introduction">
// //         <p>
// //           Redcheery respects user privacy and is committed to protecting
// //           personal information. By using our platform, you agree to this Privacy
// //           Policy.
// //         </p>
// //       </LS>
// //       <LS title="2. Eligibility (18+ Only)">
// //         <p>
// //           Our services are strictly for individuals{" "}
// //           <strong style={{ color: "#fff" }}>18 years of age or older</strong>.
// //           We do not knowingly collect data from minors. Accounts found to belong
// //           to users under 18 may be suspended or permanently deleted.
// //         </p>
// //       </LS>
// //       <LS title="3. Information We Collect">
// //         <p>
// //           <strong style={{ color: "#FF85A1" }}>Personal:</strong> Name, date of
// //           birth, gender, email, phone, profile photo, location.
// //         </p>
// //         <p>
// //           <strong style={{ color: "#FF85A1" }}>Usage:</strong> Login details,
// //           preferences, device information.
// //         </p>
// //         <p>
// //           <strong style={{ color: "#FF85A1" }}>Automatic:</strong> Cookies, log
// //           files, usage statistics.
// //         </p>
// //       </LS>
// //       <LS title="4. How We Use Your Data">
// //         <ul style={{ paddingLeft: 20, marginTop: 4 }}>
// //           {[
// //             "Create and manage accounts",
// //             "Provide social networking features",
// //             "Improve platform experience",
// //             "Ensure safety and fraud prevention",
// //             "Comply with legal requirements",
// //           ].map((i) => (
// //             <li key={i}>{i}</li>
// //           ))}
// //         </ul>
// //       </LS>
// //       <LS title="5. Data Sharing">
// //         <p>
// //           <strong style={{ color: "#fff" }}>
// //             We do not sell or rent personal data.
// //           </strong>{" "}
// //           Data is shared only with service providers, when required by law, or
// //           with user consent.
// //         </p>
// //       </LS>
// //       <LS title="6. User Rights">
// //         <p>
// //           You may access, update, or request deletion of your data by contacting
// //           us at the email below.
// //         </p>
// //       </LS>
// //     </LegalPageLayout>
// //   );
// // }

// // function TermsConditionsPage({ onBack }) {
// //   return (
// //     <LegalPageLayout
// //       title="Terms & Conditions And Refund Policy"
// //       onBack={onBack}
// //     >
// //       <LS title="1. Acceptance of Terms">
// //         <p>
// //           By accessing Biswa Bangla Social Networking Services, you agree to
// //           comply with these Terms. If you do not agree, please do not use our
// //           services.
// //         </p>
// //       </LS>
// //       <LS title="2. Eligibility (18+ Only)">
// //         <ul style={{ paddingLeft: 20 }}>
// //           <li>
// //             Platform is strictly for individuals aged{" "}
// //             <strong style={{ color: "#FFD93D" }}>18 years or above</strong>.
// //           </li>
// //           <li>
// //             Accounts found belonging to users under 18 will be terminated
// //             without notice.
// //           </li>
// //         </ul>
// //       </LS>
// //       <LS title="3. User Responsibilities">
// //         <ul style={{ paddingLeft: 20 }}>
// //           <li>Provide accurate and truthful information</li>
// //           <li>No impersonation of others</li>
// //           <li>No illegal, obscene, or harmful content</li>
// //           <li>No harassment, exploitation, or scams</li>
// //         </ul>
// //         <p style={{ color: "#FF4B6E", marginTop: 8 }}>
// //           ⚠️ Violations may result in account suspension or termination.
// //         </p>
// //       </LS>
// //       <LS title="4. Limitation of Liability">
// //         <p>
// //           We are not responsible for user behavior or offline meetings. Use of
// //           the platform is at your own risk.
// //         </p>
// //       </LS>
// //       <div
// //         style={{
// //           height: 1,
// //           background:
// //             "linear-gradient(90deg,transparent,rgba(255,75,110,0.5),transparent)",
// //           margin: "20px 0",
// //         }}
// //       />
// //       <h2
// //         style={{
// //           fontSize: 20,
// //           fontWeight: 900,
// //           color: "#4D96FF",
// //           textAlign: "center",
// //           marginBottom: 20,
// //         }}
// //       >
// //         Refund Policy
// //       </h2>
// //       <LS title="General Policy">
// //         <p>
// //           All payments are{" "}
// //           <strong style={{ color: "#FFD93D" }}>non-refundable</strong> except
// //           where required by law.
// //         </p>
// //       </LS>
// //       <LS title="No Refund Situations">
// //         <ul style={{ paddingLeft: 20 }}>
// //           <li>Change of mind after purchase</li>
// //           <li>Inactivity or lack of usage</li>
// //           <li>Account suspension due to policy violations</li>
// //           <li>Dissatisfaction with interactions</li>
// //         </ul>
// //       </LS>
// //       <LS title="Technical Errors">
// //         <p>
// //           Refunds may be considered if a payment was deducted but service not
// //           activated, reported within 48 hours with proof. Processing takes 7–10
// //           business days if approved.
// //         </p>
// //       </LS>
// //     </LegalPageLayout>
// //   );
// // }

// // function ShippingPolicyPage({ onBack }) {
// //   return (
// //     <LegalPageLayout
// //       title="Delivery, Cancellation & Refund Policy"
// //       onBack={onBack}
// //     >
// //       <div
// //         style={{
// //           background: "rgba(77,150,255,0.08)",
// //           border: "1px solid rgba(77,150,255,0.3)",
// //           borderRadius: 16,
// //           padding: "24px",
// //           textAlign: "center",
// //           marginBottom: 24,
// //         }}
// //       >
// //         <div style={{ fontSize: 48, marginBottom: 8 }}>💻</div>
// //         <h2
// //           style={{
// //             fontSize: 20,
// //             fontWeight: 800,
// //             color: "#4D96FF",
// //             marginBottom: 8,
// //           }}
// //         >
// //           Digital-Only Platform
// //         </h2>
// //         <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
// //           Biswa Bangla Social Networking Services is a{" "}
// //           <strong style={{ color: "#fff" }}>digital-only platform</strong>.
// //         </p>
// //       </div>
// //       <LS title="No Physical Products">
// //         <ul style={{ paddingLeft: 20 }}>
// //           <li>We do not sell, ship, or deliver any physical products</li>
// //           <li>All services are online and virtual in nature</li>
// //           <li>Shipping, delivery timelines, and logistics do not apply</li>
// //         </ul>
// //       </LS>
// //       <LS title="Service Delivery">
// //         <p>
// //           All features are delivered instantly after payment — available 24/7
// //           online with no waiting required.
// //         </p>
// //       </LS>
// //       <LS title="Refund & Cancellation">
// //         <p>
// //           All payments are{" "}
// //           <strong style={{ color: "#FFD93D" }}>non-refundable</strong>. Users
// //           may cancel subscriptions at any time, but no refunds are provided for
// //           unused portions. Cancellation takes effect at end of the billing
// //           period.
// //         </p>
// //       </LS>
// //     </LegalPageLayout>
// //   );
// // }

// // function CommunityGuidelinesPage({ onBack }) {
// //   return (
// //     <LegalPageLayout title="Community Guidelines" onBack={onBack}>
// //       <LS title="1. Age Requirement">
// //         <p>
// //           This platform is strictly for individuals{" "}
// //           <strong style={{ color: "#FFD93D" }}>18 years of age or older</strong>
// //           .
// //         </p>
// //       </LS>
// //       <LS title="2. Responsible Use">
// //         <ul style={{ paddingLeft: 20 }}>
// //           <li>Use the platform respectfully and lawfully</li>
// //           <li>
// //             Avoid harassment, abuse, hate speech, or inappropriate behavior
// //           </li>
// //           <li>Share accurate information</li>
// //           <li>Respect the privacy and consent of other members</li>
// //         </ul>
// //       </LS>
// //       <LS title="3. Prohibited Activities">
// //         <p style={{ color: "#FFD93D", marginBottom: 8 }}>
// //           ⚠️ The following are strictly not allowed:
// //         </p>
// //         <ul style={{ paddingLeft: 20 }}>
// //           <li>Use by anyone under 18 years of age</li>
// //           <li>Posting illegal, obscene, or offensive content</li>
// //           <li>Impersonation, scams, or misuse of personal information</li>
// //           <li>Harassment, bullying, or threatening behavior</li>
// //           <li>Spam or unauthorized advertising</li>
// //           <li>Attempting to hack or compromise platform security</li>
// //         </ul>
// //       </LS>
// //       <LS title="4. Enforcement">
// //         <p>
// //           We reserve the right to remove content, suspend accounts, report
// //           illegal activity to authorities, and take legal action when necessary.
// //         </p>
// //       </LS>
// //     </LegalPageLayout>
// //   );
// // }

// // function ChildrenMinorsPage({ onBack }) {
// //   return (
// //     <LegalPageLayout title="Children and Minors Prohibited" onBack={onBack}>
// //       <div
// //         style={{
// //           background: "rgba(255,75,110,0.1)",
// //           border: "2px solid rgba(255,75,110,0.5)",
// //           borderRadius: 16,
// //           padding: "28px",
// //           textAlign: "center",
// //           marginBottom: 24,
// //         }}
// //       >
// //         <div style={{ fontSize: 52, marginBottom: 10 }}>🚫</div>
// //         <h2
// //           style={{
// //             fontSize: 22,
// //             fontWeight: 900,
// //             color: "#FF4B6E",
// //             marginBottom: 10,
// //           }}
// //         >
// //           STRICTLY 18+ ONLY
// //         </h2>
// //         <p
// //           style={{
// //             color: "rgba(255,255,255,0.8)",
// //             fontSize: 15,
// //             lineHeight: 1.7,
// //           }}
// //         >
// //           Children and minors are <strong>strictly prohibited</strong> from
// //           using Redcheery.
// //         </p>
// //       </div>
// //       <LS title="Age Verification">
// //         <p>
// //           By accessing this service, users confirm they are at least{" "}
// //           <strong style={{ color: "#FFD93D" }}>18 years old</strong>. This is a
// //           legal requirement and violation may result in legal consequences.
// //         </p>
// //       </LS>
// //       <LS title="Account Termination">
// //         <p style={{ color: "#FFD93D" }}>
// //           ⚠️ Any account found to be operated by a minor will be immediately
// //           suspended. All account data will be deleted, no refunds provided, and
// //           the matter may be reported to authorities.
// //         </p>
// //       </LS>
// //       <LS title="Legal Compliance">
// //         <ul style={{ paddingLeft: 20 }}>
// //           <li>Information Technology Act, 2000</li>
// //           <li>Protection of Children from Sexual Offences (POCSO) Act, 2012</li>
// //           <li>Digital Personal Data Protection Act</li>
// //           <li>Indian Child Safety Regulations</li>
// //         </ul>
// //       </LS>
// //       <div
// //         style={{
// //           background: "rgba(255,75,110,0.15)",
// //           border: "2px solid rgba(255,75,110,0.4)",
// //           borderRadius: 14,
// //           padding: "20px",
// //           display: "flex",
// //           gap: 12,
// //           alignItems: "flex-start",
// //         }}
// //       >
// //         <span style={{ fontSize: 28 }}>⛔</span>
// //         <div>
// //           <p style={{ color: "#FF6B6B", fontWeight: 800, marginBottom: 6 }}>
// //             Zero Tolerance Policy
// //           </p>
// //           <p
// //             style={{
// //               color: "rgba(255,255,255,0.7)",
// //               fontSize: 13,
// //               lineHeight: 1.7,
// //             }}
// //           >
// //             Any attempt to circumvent age verification will result in immediate
// //             account termination and may be reported to authorities.
// //           </p>
// //         </div>
// //       </div>
// //     </LegalPageLayout>
// //   );
// // }

// // function ContactUsPage({ onBack }) {
// //   return (
// //     <LegalPageLayout title="Contact Us" onBack={onBack}>
// //       <div
// //         style={{
// //           background: "rgba(77,150,255,0.08)",
// //           border: "2px solid rgba(77,150,255,0.3)",
// //           borderRadius: 16,
// //           padding: "28px",
// //           textAlign: "center",
// //           marginBottom: 24,
// //         }}
// //       >
// //         <div style={{ fontSize: 52, marginBottom: 10 }}>📧</div>
// //         <h2
// //           style={{
// //             fontSize: 20,
// //             fontWeight: 800,
// //             color: "#4D96FF",
// //             marginBottom: 8,
// //           }}
// //         >
// //           Get In Touch
// //         </h2>
// //         <p
// //           style={{
// //             color: "rgba(255,255,255,0.7)",
// //             fontSize: 14,
// //             lineHeight: 1.7,
// //           }}
// //         >
// //           We're here to help. Reach out to us through any of the channels below.
// //         </p>
// //       </div>
// //       <LS title="Biswa Bangla Social Networking Club">
// //         <div
// //           style={{
// //             background: "rgba(255,255,255,0.04)",
// //             borderRadius: 12,
// //             padding: "20px",
// //           }}
// //         >
// //           <p>📍 Building No. Unit No- 11/W/2, Room 2</p>
// //           <p style={{ paddingLeft: 20 }}>
// //             Road Street – Action Area II/04, Street No. 373
// //           </p>
// //           <p style={{ paddingLeft: 20 }}>
// //             Manicasadona, Newtown, Kolkata –{" "}
// //             <strong style={{ color: "#fff" }}>West Bengal 700161</strong>
// //           </p>
// //           <div style={{ marginTop: 16 }}>
// //             <p>
// //               📧{" "}
// //               <a href="mailto:care@redcheery.com" style={{ color: "#4D96FF" }}>
// //                 care@redcheery.com
// //               </a>
// //             </p>
// //             <p>
// //               📧{" "}
// //               <a
// //                 href="mailto:customercare@redcheery.com"
// //                 style={{ color: "#4D96FF" }}
// //               >
// //                 customercare@redcheery.com
// //               </a>
// //             </p>
// //             <p>
// //               📧{" "}
// //               <a
// //                 href="mailto:customercarebiswabanglasocialn@gmail.com"
// //                 style={{ color: "#4D96FF" }}
// //               >
// //                 customercarebiswabanglasocialn@gmail.com
// //               </a>
// //             </p>
// //           </div>
// //           <div style={{ marginTop: 12 }}>
// //             <p>
// //               📞{" "}
// //               <a
// //                 href="tel:8240210845"
// //                 style={{ color: "#4D96FF", fontWeight: 800, fontSize: 18 }}
// //               >
// //                 8240210845
// //               </a>
// //             </p>
// //           </div>
// //         </div>
// //       </LS>
// //       <LS title="Support Hours">
// //         <ul style={{ paddingLeft: 20 }}>
// //           <li>
// //             <strong style={{ color: "#fff" }}>Monday–Friday:</strong> 9:00 AM –
// //             6:00 PM IST
// //           </li>
// //           <li>
// //             <strong style={{ color: "#fff" }}>Saturday:</strong> 10:00 AM – 4:00
// //             PM IST
// //           </li>
// //           <li>
// //             <strong style={{ color: "#fff" }}>Sunday:</strong> Closed
// //           </li>
// //         </ul>
// //         <p style={{ marginTop: 8, color: "rgba(255,255,255,0.5)" }}>
// //           For urgent queries, email us and we'll respond within 24–48 hours.
// //         </p>
// //       </LS>
// //     </LegalPageLayout>
// //   );
// // }

// // // ── Main ComingSoonPage ────────────────────────────────────────────────────────
// // export default function ComingSoonPage() {
// //   const navigate = useNavigate();
// //   const [activePage, setActivePage] = useState(null);

// //   // Render legal sub-pages
// //   const back = () => setActivePage(null);
// //   if (activePage === "privacy") return <PrivacyPolicyPage onBack={back} />;
// //   if (activePage === "terms") return <TermsConditionsPage onBack={back} />;
// //   if (activePage === "shipping") return <ShippingPolicyPage onBack={back} />;
// //   if (activePage === "community")
// //     return <CommunityGuidelinesPage onBack={back} />;
// //   if (activePage === "children") return <ChildrenMinorsPage onBack={back} />;
// //   if (activePage === "contact") return <ContactUsPage onBack={back} />;

// //   const legalItems = [
// //     { key: "privacy", icon: "🔒", label: "Privacy Policy" },
// //     { key: "terms", icon: "📋", label: "Terms & Conditions" },
// //     { key: "shipping", icon: "📦", label: "Delivery, Cancellation & Refund" },
// //     { key: "community", icon: "👥", label: "Community Guidelines" },
// //     { key: "children", icon: "🚫", label: "Children and Minors Prohibited" },
// //     { key: "contact", icon: "💬", label: "Contact Us" },
// //   ];

// //   return (
// //     <div
// //       style={{
// //         minHeight: "100vh",
// //         background:
// //           "linear-gradient(135deg, #130008 0%, #3b0018 50%, #130008 100%)",
// //         display: "flex",
// //         flexDirection: "column",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         position: "relative",
// //         overflow: "hidden",
// //         fontFamily: "'Nunito', sans-serif",
// //       }}
// //     >
// //       {/* Floating blobs */}
// //       {PETALS.map((p) => (
// //         <div
// //           key={p.id}
// //           style={{
// //             position: "absolute",
// //             width: p.size,
// //             height: p.size,
// //             borderRadius: "50%",
// //             background: p.color,
// //             left: p.left,
// //             top: p.top,
// //             opacity: 0.55,
// //             filter: "blur(1.5px)",
// //             animation: `floatUp ${p.duration} ${p.delay} infinite alternate ease-in-out`,
// //             pointerEvents: "none",
// //           }}
// //         />
// //       ))}

// //       {/* Glow orbs */}
// //       <div
// //         style={{
// //           position: "absolute",
// //           width: 500,
// //           height: 500,
// //           borderRadius: "50%",
// //           background:
// //             "radial-gradient(circle, rgba(255,75,110,0.15) 0%, transparent 70%)",
// //           top: "0%",
// //           left: "0%",
// //           pointerEvents: "none",
// //         }}
// //       />
// //       <div
// //         style={{
// //           position: "absolute",
// //           width: 350,
// //           height: 350,
// //           borderRadius: "50%",
// //           background:
// //             "radial-gradient(circle, rgba(199,125,255,0.12) 0%, transparent 70%)",
// //           bottom: "0%",
// //           right: "0%",
// //           pointerEvents: "none",
// //         }}
// //       />

// //       {/* Main Card */}
// //       <div
// //         style={{
// //           position: "relative",
// //           zIndex: 10,
// //           background: "rgba(255,255,255,0.06)",
// //           border: "1px solid rgba(255,75,110,0.35)",
// //           borderRadius: 28,
// //           backdropFilter: "blur(18px)",
// //           WebkitBackdropFilter: "blur(18px)",
// //           padding: "40px 28px 32px",
// //           maxWidth: 460,
// //           width: "90%",
// //           textAlign: "center",
// //           boxShadow:
// //             "0 0 80px rgba(255,75,110,0.18), 0 24px 64px rgba(0,0,0,0.55)",
// //         }}
// //       >
// //         {/* Logo */}
// //         <div
// //           style={{
// //             width: 88,
// //             height: 88,
// //             borderRadius: "50%",
// //             background: "#fff",
// //             boxShadow: "0 0 24px rgba(255,75,110,0.6)",
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             overflow: "hidden",
// //             border: "3px solid rgba(255,255,255,0.8)",
// //             margin: "0 auto 14px",
// //           }}
// //         >
// //           <img
// //             src="/user-logo.png"
// //             alt="Red Cherry"
// //             style={{ width: 90, height: 90, objectFit: "contain" }}
// //             onError={(e) => {
// //               e.target.style.display = "none";
// //               e.target.parentNode.innerHTML = "🍒";
// //               e.target.parentNode.style.fontSize = "60px";
// //             }}
// //           />
// //         </div>

// //         {/* Brand */}
// //         <h1
// //           style={{
// //             fontSize: 28,
// //             fontWeight: 900,
// //             letterSpacing: "0.14em",
// //             background: "linear-gradient(90deg, #FF4B6E, #FFD93D, #FF85A1)",
// //             WebkitBackgroundClip: "text",
// //             WebkitTextFillColor: "transparent",
// //             margin: "0 0 6px 0",
// //             fontFamily: "Georgia, serif",
// //           }}
// //         >
// //           RED CHERRY
// //         </h1>
// //         <p
// //           style={{
// //             color: "#FFD93D",
// //             fontSize: 13,
// //             fontWeight: 700,
// //             letterSpacing: "0.08em",
// //             margin: "0 0 20px 0",
// //           }}
// //         >
// //           Welcome To The Family Of India's Largest Online Social Networking
// //           Services and Open Friendship Platform.
// //           <br />
// //           <br />
// //           Powered by Biswa Bangla Social Networking Services Club.
// //         </p>
// //         <p
// //           style={{
// //             color: "#FFD93D",
// //             fontSize: 13,
// //             fontWeight: 700,
// //             letterSpacing: "0.08em",
// //             margin: "0 0 20px 0",
// //           }}
// //         >
// //           Something Sweet Is Coming Soon!
// //         </p>

// //         {/* Government logos */}
// //         <div
// //           style={{
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             gap: 32,
// //             marginBottom: 22,
// //           }}
// //         >
// //           <div className="gov-logo-wrap" style={logoWrapStyle}>
// //             <img
// //               src="/government-of-india-logo.png"
// //               alt="Government of India"
// //               style={logoImgStyle}
// //             />
// //             <span style={logoLabelStyle}>Govt. of India</span>
// //           </div>
// //           <div className="gov-logo-wrap" style={logoWrapStyle}>
// //             <img
// //               src="/government-of-west-bengal-logo.png"
// //               alt="Government of West Bengal"
// //               style={logoImgStyle}
// //             />
// //             <span style={logoLabelStyle}>Govt. of West Bengal</span>
// //           </div>
// //         </div>

// //         {/* Divider */}
// //         <div
// //           style={{
// //             height: 1,
// //             background:
// //               "linear-gradient(90deg, transparent, rgba(255,75,110,0.5), transparent)",
// //             marginBottom: 22,
// //           }}
// //         />

// //         {/* ── Legal & Policies section ── */}
// //         <p
// //           style={{
// //             color: "rgba(255,255,255,0.45)",
// //             fontSize: 11,
// //             fontWeight: 800,
// //             letterSpacing: "0.1em",
// //             textTransform: "uppercase",
// //             marginBottom: 10,
// //             textAlign: "left",
// //           }}
// //         >
// //           Legal & Policies
// //         </p>
// //         <div
// //           style={{
// //             background: "rgba(255,255,255,0.04)",
// //             border: "1px solid rgba(255,75,110,0.2)",
// //             borderRadius: 16,
// //             overflow: "hidden",
// //             marginBottom: 24,
// //             textAlign: "left",
// //           }}
// //         >
// //           {legalItems.map((item, i) => (
// //             <div key={item.key}>
// //               <button
// //                 onClick={() => setActivePage(item.key)}
// //                 style={{
// //                   width: "100%",
// //                   display: "flex",
// //                   alignItems: "center",
// //                   gap: 12,
// //                   padding: "13px 16px",
// //                   background: "none",
// //                   border: "none",
// //                   cursor: "pointer",
// //                   fontFamily: "'Nunito', sans-serif",
// //                   transition: "background 0.15s",
// //                 }}
// //                 onMouseEnter={(e) =>
// //                   (e.currentTarget.style.background = "rgba(255,75,110,0.08)")
// //                 }
// //                 onMouseLeave={(e) =>
// //                   (e.currentTarget.style.background = "none")
// //                 }
// //               >
// //                 <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
// //                 <span
// //                   style={{
// //                     flex: 1,
// //                     fontSize: 13,
// //                     fontWeight: 700,
// //                     color: "rgba(255,255,255,0.85)",
// //                   }}
// //                 >
// //                   {item.label}
// //                 </span>
// //                 <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 18 }}>
// //                   ›
// //                 </span>
// //               </button>
// //               {i < legalItems.length - 1 && (
// //                 <div
// //                   style={{
// //                     height: 1,
// //                     background: "rgba(255,255,255,0.05)",
// //                     marginLeft: 46,
// //                   }}
// //                 />
// //               )}
// //             </div>
// //           ))}
// //         </div>

// //         {/* Enter Button */}
// //         <button
// //           onClick={() => navigate("/signin")}
// //           style={{
// //             width: "100%",
// //             padding: "15px 0",
// //             background: "linear-gradient(135deg, #FF4B6E, #FF1744)",
// //             border: "none",
// //             borderRadius: 50,
// //             color: "#fff",
// //             fontWeight: 800,
// //             fontSize: 15,
// //             letterSpacing: "0.06em",
// //             cursor: "pointer",
// //             boxShadow: "0 8px 28px rgba(255,75,110,0.45)",
// //             fontFamily: "'Nunito', sans-serif",
// //             transition: "opacity 0.2s, transform 0.1s",
// //           }}
// //           onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
// //           onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
// //           onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
// //           onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
// //         >
// //           Enter App 🚀
// //         </button>
// //       </div>

// //       {/* Footer */}
// //       <div
// //         style={{
// //           position: "relative",
// //           zIndex: 10,
// //           marginTop: 28,
// //           textAlign: "center",
// //           color: "rgba(255,255,255,0.3)",
// //           fontSize: 12,
// //           lineHeight: 1.9,
// //         }}
// //       >
// //         <div>© Red Cherry | All Rights Reserved</div>
// //         <div>Follow us for updates 🚀</div>
// //       </div>

// //       <style>{`
// //         @keyframes floatUp {
// //           from { transform: translateY(0px) rotate(0deg); }
// //           to   { transform: translateY(-22px) rotate(12deg); }
// //         }
// //         .gov-logo-wrap { transition: transform 0.25s ease, filter 0.25s ease !important; cursor: pointer; }
// //         .gov-logo-wrap:hover { transform: scale(1.18) translateY(-4px) !important; filter: drop-shadow(0 0 10px rgba(255,217,61,0.7)) !important; }
// //         .gov-logo-wrap:active { transform: scale(1.08) !important; }
// //       `}</style>
// //     </div>
// //   );
// // }

// // /* ── Shared logo styles ── */
// // const logoWrapStyle = {
// //   display: "flex",
// //   flexDirection: "column",
// //   alignItems: "center",
// //   gap: 6,
// // };
// // const logoImgStyle = {
// //   width: 70,
// //   height: 70,
// //   objectFit: "contain",
// //   borderRadius: "50%",
// //   background: "rgba(255,255,255,0.08)",
// //   padding: 4,
// //   border: "1px solid rgba(255,255,255,0.15)",
// // };
// // const logoLabelStyle = {
// //   color: "rgba(255,255,255,0.5)",
// //   fontSize: 10,
// //   fontWeight: 600,
// //   letterSpacing: "0.04em",
// //   whiteSpace: "nowrap",
// // };

// //v2
// //v2
// //user-frontend
// // src/pages/ComingSoonPage.jsx
// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";

// // const COLORS = [
// //   "#FF4B6E",
// //   "#FF6B35",
// //   "#FFD93D",
// //   "#6BCB77",
// //   "#4D96FF",
// //   "#C77DFF",
// //   "#FF85A1",
// // ];

// // const PETALS = Array.from({ length: 28 }, (_, i) => ({
// //   id: i,
// //   size: (i % 3) * 6 + 8,
// //   left: `${(i * 13) % 97}%`,
// //   top: `${(i * 17) % 93}%`,
// //   color: COLORS[i % COLORS.length],
// //   delay: `${((i * 0.3) % 3).toFixed(1)}s`,
// //   duration: `${(2 + ((i * 0.17) % 2.5)).toFixed(1)}s`,
// // }));

// // // ── Shared legal layout ────────────────────────────────────────────────────────
// // function LegalPageLayout({ title, children, onBack }) {
// //   return (
// //     <div
// //       style={{
// //         minHeight: "100vh",
// //         background:
// //           "linear-gradient(135deg, #0f0015 0%, #1a0020 50%, #0f0015 100%)",
// //         color: "#fff",
// //         fontFamily: "'Nunito', sans-serif",
// //       }}
// //     >
// //       <div
// //         style={{
// //           position: "sticky",
// //           top: 0,
// //           zIndex: 20,
// //           background: "rgba(15,0,21,0.95)",
// //           backdropFilter: "blur(8px)",
// //           borderBottom: "1px solid rgba(255,75,110,0.2)",
// //           padding: "14px 20px",
// //         }}
// //       >
// //         <button
// //           onClick={onBack}
// //           style={{
// //             display: "flex",
// //             alignItems: "center",
// //             gap: 8,
// //             background: "none",
// //             border: "none",
// //             color: "#FF4B6E",
// //             cursor: "pointer",
// //             fontSize: 14,
// //             fontWeight: 700,
// //             fontFamily: "inherit",
// //           }}
// //         >
// //           <svg
// //             width="18"
// //             height="18"
// //             fill="none"
// //             stroke="currentColor"
// //             strokeWidth="2.5"
// //             viewBox="0 0 24 24"
// //           >
// //             <path
// //               strokeLinecap="round"
// //               strokeLinejoin="round"
// //               d="M15 19l-7-7 7-7"
// //             />
// //           </svg>
// //           Back
// //         </button>
// //       </div>
// //       <div
// //         style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 60px" }}
// //       >
// //         <div style={{ textAlign: "center", marginBottom: 36 }}>
// //           <h1
// //             style={{
// //               fontSize: "clamp(22px,5vw,32px)",
// //               fontWeight: 900,
// //               background: "linear-gradient(90deg,#FF4B6E,#FFD93D,#FF85A1)",
// //               WebkitBackgroundClip: "text",
// //               WebkitTextFillColor: "transparent",
// //               marginBottom: 12,
// //             }}
// //           >
// //             {title}
// //           </h1>
// //           <div
// //             style={{
// //               width: 60,
// //               height: 3,
// //               background: "linear-gradient(90deg,#FF4B6E,#4D96FF)",
// //               borderRadius: 99,
// //               margin: "0 auto",
// //             }}
// //           />
// //         </div>
// //         <div
// //           style={{
// //             background: "rgba(255,255,255,0.04)",
// //             border: "1px solid rgba(255,75,110,0.2)",
// //             borderRadius: 20,
// //             padding: "28px 24px",
// //           }}
// //         >
// //           {children}
// //         </div>
// //         {/* Age notice */}
// //         <div
// //           style={{
// //             marginTop: 20,
// //             padding: "16px 20px",
// //             background: "rgba(255,75,110,0.08)",
// //             border: "1px solid rgba(255,75,110,0.3)",
// //             borderRadius: 14,
// //             display: "flex",
// //             gap: 12,
// //             alignItems: "flex-start",
// //           }}
// //         >
// //           <span style={{ fontSize: 20 }}>⚠️</span>
// //           <div>
// //             <p
// //               style={{
// //                 color: "#FF4B6E",
// //                 fontWeight: 800,
// //                 fontSize: 14,
// //                 marginBottom: 4,
// //               }}
// //             >
// //               Age Restriction Notice
// //             </p>
// //             <p
// //               style={{
// //                 color: "rgba(255,255,255,0.6)",
// //                 fontSize: 13,
// //                 lineHeight: 1.6,
// //               }}
// //             >
// //               This platform is strictly for users{" "}
// //               <strong style={{ color: "#fff" }}>
// //                 18 years of age or older
// //               </strong>
// //               . Children and minors are prohibited.
// //             </p>
// //           </div>
// //         </div>
// //         {/* Contact */}
// //         <div
// //           style={{
// //             marginTop: 16,
// //             padding: "16px 20px",
// //             background: "rgba(77,150,255,0.06)",
// //             border: "1px solid rgba(77,150,255,0.2)",
// //             borderRadius: 14,
// //           }}
// //         >
// //           <p
// //             style={{
// //               color: "#fff",
// //               fontWeight: 800,
// //               fontSize: 14,
// //               marginBottom: 10,
// //             }}
// //           >
// //             Contact Information
// //           </p>
// //           <div
// //             style={{
// //               color: "rgba(255,255,255,0.6)",
// //               fontSize: 13,
// //               lineHeight: 1.9,
// //             }}
// //           >
// //             <p>
// //               <strong style={{ color: "#fff" }}>Redcheery</strong>
// //             </p>
// //             <p>
// //               📍 Unit No- 11/W/2, Room 2, Action Area II/04, Newtown, Kolkata –
// //               700161
// //             </p>
// //             <p>
// //               📧{" "}
// //               <a
// //                 href="mailto:customercare@redcheery.com"
// //                 style={{ color: "#4D96FF" }}
// //               >
// //                 customercare@redcheery.com
// //               </a>
// //             </p>
// //             <p>
// //               📞{" "}
// //               <a href="tel:8240210845" style={{ color: "#4D96FF" }}>
// //                 7439529471
// //               </a>
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function LS({ title, children }) {
// //   return (
// //     <div style={{ marginBottom: 24 }}>
// //       <h2
// //         style={{
// //           fontSize: 17,
// //           fontWeight: 800,
// //           color: "#FFD93D",
// //           borderBottom: "1px solid rgba(255,255,255,0.1)",
// //           paddingBottom: 8,
// //           marginBottom: 12,
// //         }}
// //       >
// //         {title}
// //       </h2>
// //       <div
// //         style={{
// //           color: "rgba(255,255,255,0.75)",
// //           fontSize: 14,
// //           lineHeight: 1.8,
// //         }}
// //       >
// //         {children}
// //       </div>
// //     </div>
// //   );
// // }

// // // ── Legal page content components ─────────────────────────────────────────────
// // function PrivacyPolicyPage({ onBack }) {
// //   return (
// //     <LegalPageLayout title="Privacy Policy & Refund Policy" onBack={onBack}>
// //       <LS title="1. Introduction">
// //         <p>
// //           Redcheery respects user privacy and is committed to protecting
// //           personal information. By using our platform, you agree to this Privacy
// //           Policy.
// //         </p>
// //       </LS>
// //       <LS title="2. Eligibility (18+ Only)">
// //         <p>
// //           Our services are strictly for individuals{" "}
// //           <strong style={{ color: "#fff" }}>18 years of age or older</strong>.
// //           We do not knowingly collect data from minors. Accounts found to belong
// //           to users under 18 may be suspended or permanently deleted.
// //         </p>
// //       </LS>
// //       <LS title="3. Information We Collect">
// //         <p>
// //           <strong style={{ color: "#FF85A1" }}>Personal:</strong> Name, date of
// //           birth, gender, email, phone, profile photo, location.
// //         </p>
// //         <p>
// //           <strong style={{ color: "#FF85A1" }}>Usage:</strong> Login details,
// //           preferences, device information.
// //         </p>
// //         <p>
// //           <strong style={{ color: "#FF85A1" }}>Automatic:</strong> Cookies, log
// //           files, usage statistics.
// //         </p>
// //       </LS>
// //       <LS title="4. How We Use Your Data">
// //         <ul style={{ paddingLeft: 20, marginTop: 4 }}>
// //           {[
// //             "Create and manage accounts",
// //             "Provide social networking features",
// //             "Improve platform experience",
// //             "Ensure safety and fraud prevention",
// //             "Comply with legal requirements",
// //           ].map((i) => (
// //             <li key={i}>{i}</li>
// //           ))}
// //         </ul>
// //       </LS>
// //       <LS title="5. Data Sharing">
// //         <p>
// //           <strong style={{ color: "#fff" }}>
// //             We do not sell or rent personal data.
// //           </strong>{" "}
// //           Data is shared only with service providers, when required by law, or
// //           with user consent.
// //         </p>
// //       </LS>
// //       <LS title="6. User Rights">
// //         <p>
// //           You may access, update, or request deletion of your data by contacting
// //           us at the email below.
// //         </p>
// //       </LS>
// //     </LegalPageLayout>
// //   );
// // }

// // function TermsConditionsPage({ onBack }) {
// //   return (
// //     <LegalPageLayout
// //       title="Terms & Conditions And Refund Policy"
// //       onBack={onBack}
// //     >
// //       <LS title="1. Acceptance of Terms">
// //         <p>
// //           By accessing Biswa Bangla Social Networking Services, you agree to
// //           comply with these Terms. If you do not agree, please do not use our
// //           services.
// //         </p>
// //       </LS>
// //       <LS title="2. Eligibility (18+ Only)">
// //         <ul style={{ paddingLeft: 20 }}>
// //           <li>
// //             Platform is strictly for individuals aged{" "}
// //             <strong style={{ color: "#FFD93D" }}>18 years or above</strong>.
// //           </li>
// //           <li>
// //             Accounts found belonging to users under 18 will be terminated
// //             without notice.
// //           </li>
// //         </ul>
// //       </LS>
// //       <LS title="3. User Responsibilities">
// //         <ul style={{ paddingLeft: 20 }}>
// //           <li>Provide accurate and truthful information</li>
// //           <li>No impersonation of others</li>
// //           <li>No illegal, obscene, or harmful content</li>
// //           <li>No harassment, exploitation, or scams</li>
// //         </ul>
// //         <p style={{ color: "#FF4B6E", marginTop: 8 }}>
// //           ⚠️ Violations may result in account suspension or termination.
// //         </p>
// //       </LS>
// //       <LS title="4. Limitation of Liability">
// //         <p>
// //           We are not responsible for user behavior or offline meetings. Use of
// //           the platform is at your own risk.
// //         </p>
// //       </LS>
// //       <div
// //         style={{
// //           height: 1,
// //           background:
// //             "linear-gradient(90deg,transparent,rgba(255,75,110,0.5),transparent)",
// //           margin: "20px 0",
// //         }}
// //       />
// //       <h2
// //         style={{
// //           fontSize: 20,
// //           fontWeight: 900,
// //           color: "#4D96FF",
// //           textAlign: "center",
// //           marginBottom: 20,
// //         }}
// //       >
// //         Refund Policy
// //       </h2>
// //       <LS title="General Policy">
// //         <p>
// //           All payments are{" "}
// //           <strong style={{ color: "#FFD93D" }}>non-refundable</strong> except
// //           where required by law.
// //         </p>
// //       </LS>
// //       <LS title="No Refund Situations">
// //         <ul style={{ paddingLeft: 20 }}>
// //           <li>Change of mind after purchase</li>
// //           <li>Inactivity or lack of usage</li>
// //           <li>Account suspension due to policy violations</li>
// //           <li>Dissatisfaction with interactions</li>
// //         </ul>
// //       </LS>
// //       <LS title="Technical Errors">
// //         <p>
// //           Refunds may be considered if a payment was deducted but service not
// //           activated, reported within 48 hours with proof. Processing takes 7–10
// //           business days if approved.
// //         </p>
// //       </LS>
// //     </LegalPageLayout>
// //   );
// // }

// // function ShippingPolicyPage({ onBack }) {
// //   return (
// //     <LegalPageLayout
// //       title="Delivery, Cancellation & Refund Policy"
// //       onBack={onBack}
// //     >
// //       <div
// //         style={{
// //           background: "rgba(77,150,255,0.08)",
// //           border: "1px solid rgba(77,150,255,0.3)",
// //           borderRadius: 16,
// //           padding: "24px",
// //           textAlign: "center",
// //           marginBottom: 24,
// //         }}
// //       >
// //         <div style={{ fontSize: 48, marginBottom: 8 }}>💻</div>
// //         <h2
// //           style={{
// //             fontSize: 20,
// //             fontWeight: 800,
// //             color: "#4D96FF",
// //             marginBottom: 8,
// //           }}
// //         >
// //           Digital-Only Platform
// //         </h2>
// //         <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
// //           Biswa Bangla Social Networking Services is a{" "}
// //           <strong style={{ color: "#fff" }}>digital-only platform</strong>.
// //         </p>
// //       </div>
// //       <LS title="No Physical Products">
// //         <ul style={{ paddingLeft: 20 }}>
// //           <li>We do not sell, ship, or deliver any physical products</li>
// //           <li>All services are online and virtual in nature</li>
// //           <li>Shipping, delivery timelines, and logistics do not apply</li>
// //         </ul>
// //       </LS>
// //       <LS title="Service Delivery">
// //         <p>
// //           All features are delivered instantly after payment — available 24/7
// //           online with no waiting required.
// //         </p>
// //       </LS>
// //       <LS title="Refund & Cancellation">
// //         <p>
// //           All payments are{" "}
// //           <strong style={{ color: "#FFD93D" }}>non-refundable</strong>. Users
// //           may cancel subscriptions at any time, but no refunds are provided for
// //           unused portions. Cancellation takes effect at end of the billing
// //           period.
// //         </p>
// //       </LS>
// //     </LegalPageLayout>
// //   );
// // }

// // function CommunityGuidelinesPage({ onBack }) {
// //   return (
// //     <LegalPageLayout title="Community Guidelines" onBack={onBack}>
// //       <LS title="1. Age Requirement">
// //         <p>
// //           This platform is strictly for individuals{" "}
// //           <strong style={{ color: "#FFD93D" }}>18 years of age or older</strong>
// //           .
// //         </p>
// //       </LS>
// //       <LS title="2. Responsible Use">
// //         <ul style={{ paddingLeft: 20 }}>
// //           <li>Use the platform respectfully and lawfully</li>
// //           <li>
// //             Avoid harassment, abuse, hate speech, or inappropriate behavior
// //           </li>
// //           <li>Share accurate information</li>
// //           <li>Respect the privacy and consent of other members</li>
// //         </ul>
// //       </LS>
// //       <LS title="3. Prohibited Activities">
// //         <p style={{ color: "#FFD93D", marginBottom: 8 }}>
// //           ⚠️ The following are strictly not allowed:
// //         </p>
// //         <ul style={{ paddingLeft: 20 }}>
// //           <li>Use by anyone under 18 years of age</li>
// //           <li>Posting illegal, obscene, or offensive content</li>
// //           <li>Impersonation, scams, or misuse of personal information</li>
// //           <li>Harassment, bullying, or threatening behavior</li>
// //           <li>Spam or unauthorized advertising</li>
// //           <li>Attempting to hack or compromise platform security</li>
// //         </ul>
// //       </LS>
// //       <LS title="4. Enforcement">
// //         <p>
// //           We reserve the right to remove content, suspend accounts, report
// //           illegal activity to authorities, and take legal action when necessary.
// //         </p>
// //       </LS>
// //     </LegalPageLayout>
// //   );
// // }

// // function ChildrenMinorsPage({ onBack }) {
// //   return (
// //     <LegalPageLayout title="Children and Minors Prohibited" onBack={onBack}>
// //       <div
// //         style={{
// //           background: "rgba(255,75,110,0.1)",
// //           border: "2px solid rgba(255,75,110,0.5)",
// //           borderRadius: 16,
// //           padding: "28px",
// //           textAlign: "center",
// //           marginBottom: 24,
// //         }}
// //       >
// //         <div style={{ fontSize: 52, marginBottom: 10 }}>🚫</div>
// //         <h2
// //           style={{
// //             fontSize: 22,
// //             fontWeight: 900,
// //             color: "#FF4B6E",
// //             marginBottom: 10,
// //           }}
// //         >
// //           STRICTLY 18+ ONLY
// //         </h2>
// //         <p
// //           style={{
// //             color: "rgba(255,255,255,0.8)",
// //             fontSize: 15,
// //             lineHeight: 1.7,
// //           }}
// //         >
// //           Children and minors are <strong>strictly prohibited</strong> from
// //           using Redcheery.
// //         </p>
// //       </div>
// //       <LS title="Age Verification">
// //         <p>
// //           By accessing this service, users confirm they are at least{" "}
// //           <strong style={{ color: "#FFD93D" }}>18 years old</strong>. This is a
// //           legal requirement and violation may result in legal consequences.
// //         </p>
// //       </LS>
// //       <LS title="Account Termination">
// //         <p style={{ color: "#FFD93D" }}>
// //           ⚠️ Any account found to be operated by a minor will be immediately
// //           suspended. All account data will be deleted, no refunds provided, and
// //           the matter may be reported to authorities.
// //         </p>
// //       </LS>
// //       <LS title="Legal Compliance">
// //         <ul style={{ paddingLeft: 20 }}>
// //           <li>Information Technology Act, 2000</li>
// //           <li>Protection of Children from Sexual Offences (POCSO) Act, 2012</li>
// //           <li>Digital Personal Data Protection Act</li>
// //           <li>Indian Child Safety Regulations</li>
// //         </ul>
// //       </LS>
// //       <div
// //         style={{
// //           background: "rgba(255,75,110,0.15)",
// //           border: "2px solid rgba(255,75,110,0.4)",
// //           borderRadius: 14,
// //           padding: "20px",
// //           display: "flex",
// //           gap: 12,
// //           alignItems: "flex-start",
// //         }}
// //       >
// //         <span style={{ fontSize: 28 }}>⛔</span>
// //         <div>
// //           <p style={{ color: "#FF6B6B", fontWeight: 800, marginBottom: 6 }}>
// //             Zero Tolerance Policy
// //           </p>
// //           <p
// //             style={{
// //               color: "rgba(255,255,255,0.7)",
// //               fontSize: 13,
// //               lineHeight: 1.7,
// //             }}
// //           >
// //             Any attempt to circumvent age verification will result in immediate
// //             account termination and may be reported to authorities.
// //           </p>
// //         </div>
// //       </div>
// //     </LegalPageLayout>
// //   );
// // }

// // function ContactUsPage({ onBack }) {
// //   return (
// //     <LegalPageLayout title="Contact Us" onBack={onBack}>
// //       <div
// //         style={{
// //           background: "rgba(77,150,255,0.08)",
// //           border: "2px solid rgba(77,150,255,0.3)",
// //           borderRadius: 16,
// //           padding: "28px",
// //           textAlign: "center",
// //           marginBottom: 24,
// //         }}
// //       >
// //         <div style={{ fontSize: 52, marginBottom: 10 }}>📧</div>
// //         <h2
// //           style={{
// //             fontSize: 20,
// //             fontWeight: 800,
// //             color: "#4D96FF",
// //             marginBottom: 8,
// //           }}
// //         >
// //           Get In Touch
// //         </h2>
// //         <p
// //           style={{
// //             color: "rgba(255,255,255,0.7)",
// //             fontSize: 14,
// //             lineHeight: 1.7,
// //           }}
// //         >
// //           We're here to help. Reach out to us through any of the channels below.
// //         </p>
// //       </div>
// //       <LS title="Biswa Bangla Social Networking Club">
// //         <div
// //           style={{
// //             background: "rgba(255,255,255,0.04)",
// //             borderRadius: 12,
// //             padding: "20px",
// //           }}
// //         >
// //           <p>📍 Building No. Unit No- 11/W/2, Room 2</p>
// //           <p style={{ paddingLeft: 20 }}>
// //             Road Street – Action Area II/04, Street No. 373
// //           </p>
// //           <p style={{ paddingLeft: 20 }}>
// //             Manicasadona, Newtown, Kolkata –{" "}
// //             <strong style={{ color: "#fff" }}>West Bengal 700161</strong>
// //           </p>
// //           <div style={{ marginTop: 16 }}>
// //             <p>
// //               📧{" "}
// //               <a href="mailto:care@redcheery.com" style={{ color: "#4D96FF" }}>
// //                 care@redcheery.com
// //               </a>
// //             </p>
// //             <p>
// //               📧{" "}
// //               <a
// //                 href="mailto:customercare@redcheery.com"
// //                 style={{ color: "#4D96FF" }}
// //               >
// //                 customercare@redcheery.com
// //               </a>
// //             </p>
// //             <p>
// //               📧{" "}
// //               <a
// //                 href="mailto:customercarebiswabanglasocialn@gmail.com"
// //                 style={{ color: "#4D96FF" }}
// //               >
// //                 customercarebiswabanglasocialn@gmail.com
// //               </a>
// //             </p>
// //           </div>
// //           <div style={{ marginTop: 12 }}>
// //             <p>
// //               📞{" "}
// //               <a
// //                 href="tel:7439529471"
// //                 style={{ color: "#4D96FF", fontWeight: 800, fontSize: 18 }}
// //               >
// //                 7439529471
// //               </a>
// //             </p>
// //           </div>
// //         </div>
// //       </LS>
// //       <LS title="Support Hours">
// //         <ul style={{ paddingLeft: 20 }}>
// //           <li>
// //             <strong style={{ color: "#fff" }}>Monday–Friday:</strong> 9:00 AM –
// //             6:00 PM IST
// //           </li>
// //           <li>
// //             <strong style={{ color: "#fff" }}>Saturday:</strong> 10:00 AM – 4:00
// //             PM IST
// //           </li>
// //           <li>
// //             <strong style={{ color: "#fff" }}>Sunday:</strong> Closed
// //           </li>
// //         </ul>
// //         <p style={{ marginTop: 8, color: "rgba(255,255,255,0.5)" }}>
// //           For urgent queries, email us and we'll respond within 24–48 hours.
// //         </p>
// //       </LS>
// //     </LegalPageLayout>
// //   );
// // }

// // // ── Main ComingSoonPage ────────────────────────────────────────────────────────
// // export default function ComingSoonPage() {
// //   const navigate = useNavigate();
// //   const [activePage, setActivePage] = useState(null);

// //   // Render legal sub-pages
// //   const back = () => setActivePage(null);
// //   if (activePage === "privacy") return <PrivacyPolicyPage onBack={back} />;
// //   if (activePage === "terms") return <TermsConditionsPage onBack={back} />;
// //   if (activePage === "shipping") return <ShippingPolicyPage onBack={back} />;
// //   if (activePage === "community")
// //     return <CommunityGuidelinesPage onBack={back} />;
// //   if (activePage === "children") return <ChildrenMinorsPage onBack={back} />;
// //   if (activePage === "contact") return <ContactUsPage onBack={back} />;

// //   const legalItems = [
// //     { key: "privacy", icon: "🔒", label: "Privacy Policy" },
// //     { key: "terms", icon: "📋", label: "Terms & Conditions" },
// //     { key: "shipping", icon: "📦", label: "Delivery, Cancellation & Refund" },
// //     { key: "community", icon: "👥", label: "Community Guidelines" },
// //     { key: "children", icon: "🚫", label: "Children and Minors Prohibited" },
// //     { key: "contact", icon: "💬", label: "Contact Us" },
// //   ];

// //   return (
// //     <div
// //       style={{
// //         minHeight: "100vh",
// //         background:
// //           "linear-gradient(135deg, #130008 0%, #3b0018 50%, #130008 100%)",
// //         display: "flex",
// //         flexDirection: "column",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         position: "relative",
// //         overflow: "hidden",
// //         fontFamily: "'Nunito', sans-serif",
// //       }}
// //     >
// //       {/* Floating blobs */}
// //       {PETALS.map((p) => (
// //         <div
// //           key={p.id}
// //           style={{
// //             position: "absolute",
// //             width: p.size,
// //             height: p.size,
// //             borderRadius: "50%",
// //             background: p.color,
// //             left: p.left,
// //             top: p.top,
// //             opacity: 0.55,
// //             filter: "blur(1.5px)",
// //             animation: `floatUp ${p.duration} ${p.delay} infinite alternate ease-in-out`,
// //             pointerEvents: "none",
// //           }}
// //         />
// //       ))}

// //       {/* Glow orbs */}
// //       <div
// //         style={{
// //           position: "absolute",
// //           width: 500,
// //           height: 500,
// //           borderRadius: "50%",
// //           background:
// //             "radial-gradient(circle, rgba(255,75,110,0.15) 0%, transparent 70%)",
// //           top: "0%",
// //           left: "0%",
// //           pointerEvents: "none",
// //         }}
// //       />
// //       <div
// //         style={{
// //           position: "absolute",
// //           width: 350,
// //           height: 350,
// //           borderRadius: "50%",
// //           background:
// //             "radial-gradient(circle, rgba(199,125,255,0.12) 0%, transparent 70%)",
// //           bottom: "0%",
// //           right: "0%",
// //           pointerEvents: "none",
// //         }}
// //       />

// //       {/* Main Card */}
// //       <div
// //         style={{
// //           position: "relative",
// //           zIndex: 10,
// //           background: "rgba(255,255,255,0.06)",
// //           border: "1px solid rgba(255,75,110,0.35)",
// //           borderRadius: 28,
// //           backdropFilter: "blur(18px)",
// //           WebkitBackdropFilter: "blur(18px)",
// //           padding: "40px 28px 32px",
// //           maxWidth: 460,
// //           width: "90%",
// //           textAlign: "center",
// //           boxShadow:
// //             "0 0 80px rgba(255,75,110,0.18), 0 24px 64px rgba(0,0,0,0.55)",
// //         }}
// //       >
// //         {/* Top Logo (user-logo.png) */}
// //         <div
// //           style={{
// //             width: 88,
// //             height: 88,
// //             borderRadius: "50%",
// //             background: "#fff",
// //             boxShadow: "0 0 24px rgba(255,75,110,0.6)",
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             overflow: "hidden",
// //             border: "3px solid rgba(255,255,255,0.8)",
// //             margin: "0 auto 14px",
// //           }}
// //         >
// //           <img
// //             src="/user-logo.png"
// //             alt="Red Cherry"
// //             style={{ width: 90, height: 90, objectFit: "contain" }}
// //             onError={(e) => {
// //               e.target.style.display = "none";
// //               e.target.parentNode.innerHTML = "🍒";
// //               e.target.parentNode.style.fontSize = "60px";
// //             }}
// //           />
// //         </div>

// //         {/* Brand */}
// //         <h1
// //           style={{
// //             fontSize: 28,
// //             fontWeight: 900,
// //             letterSpacing: "0.14em",
// //             background: "linear-gradient(90deg, #FF4B6E, #FFD93D, #FF85A1)",
// //             WebkitBackgroundClip: "text",
// //             WebkitTextFillColor: "transparent",
// //             margin: "0 0 6px 0",
// //             fontFamily: "Georgia, serif",
// //           }}
// //         >
// //           RED CHERRY
// //         </h1>

// //         <p
// //           style={{
// //             color: "#FFD93D",
// //             fontSize: 13,
// //             fontWeight: 700,
// //             letterSpacing: "0.08em",
// //             margin: "0 0 20px 0",
// //           }}
// //         >
// //           Welcome To The Family Of India's Largest Online Social Networking
// //           Services and Open Friendship Platform.
// //           <br />
// //           <br />
// //           Powered by Biswa Bangla Social Networking Services Club.
// //         </p>

// //         <p
// //           style={{
// //             color: "#FFD93D",
// //             fontSize: 13,
// //             fontWeight: 700,
// //             letterSpacing: "0.08em",
// //             margin: "0 0 20px 0",
// //           }}
// //         >
// //           Something Sweet Is Coming Soon!
// //         </p>

// //         {/* ── logo.png centered ── */}
// //         <div
// //           style={{
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             marginBottom: 22,
// //           }}
// //         >
// //           <div className="logo-wrap" style={logoWrapStyle}>
// //             <img
// //               src="/logo.png"
// //               alt="Red Cherry Logo"
// //               style={{
// //                 width: 100,
// //                 height: 100,
// //                 objectFit: "contain",
// //                 borderRadius: "50%",
// //                 background: "rgba(255,255,255,0.06)",
// //                 padding: 4,
// //                 border: "2px solid rgba(255,75,110,0.5)",
// //                 boxShadow: "0 0 18px rgba(255,75,110,0.35)",
// //               }}
// //               onError={(e) => {
// //                 e.target.style.display = "none";
// //               }}
// //             />
// //             <span style={logoLabelStyle}>
// //               Biswa Bangla Social Networking Services Club.
// //             </span>
// //           </div>
// //         </div>

// //         {/* Divider */}
// //         <div
// //           style={{
// //             height: 1,
// //             background:
// //               "linear-gradient(90deg, transparent, rgba(255,75,110,0.5), transparent)",
// //             marginBottom: 22,
// //           }}
// //         />

// //         {/* ── Legal & Policies section ── */}
// //         <p
// //           style={{
// //             color: "rgba(255,255,255,0.45)",
// //             fontSize: 11,
// //             fontWeight: 800,
// //             letterSpacing: "0.1em",
// //             textTransform: "uppercase",
// //             marginBottom: 10,
// //             textAlign: "left",
// //           }}
// //         >
// //           Legal & Policies
// //         </p>
// //         <div
// //           style={{
// //             background: "rgba(255,255,255,0.04)",
// //             border: "1px solid rgba(255,75,110,0.2)",
// //             borderRadius: 16,
// //             overflow: "hidden",
// //             marginBottom: 24,
// //             textAlign: "left",
// //           }}
// //         >
// //           {legalItems.map((item, i) => (
// //             <div key={item.key}>
// //               <button
// //                 onClick={() => setActivePage(item.key)}
// //                 style={{
// //                   width: "100%",
// //                   display: "flex",
// //                   alignItems: "center",
// //                   gap: 12,
// //                   padding: "13px 16px",
// //                   background: "none",
// //                   border: "none",
// //                   cursor: "pointer",
// //                   fontFamily: "'Nunito', sans-serif",
// //                   transition: "background 0.15s",
// //                 }}
// //                 onMouseEnter={(e) =>
// //                   (e.currentTarget.style.background = "rgba(255,75,110,0.08)")
// //                 }
// //                 onMouseLeave={(e) =>
// //                   (e.currentTarget.style.background = "none")
// //                 }
// //               >
// //                 <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
// //                 <span
// //                   style={{
// //                     flex: 1,
// //                     fontSize: 13,
// //                     fontWeight: 700,
// //                     color: "rgba(255,255,255,0.85)",
// //                   }}
// //                 >
// //                   {item.label}
// //                 </span>
// //                 <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 18 }}>
// //                   ›
// //                 </span>
// //               </button>
// //               {i < legalItems.length - 1 && (
// //                 <div
// //                   style={{
// //                     height: 1,
// //                     background: "rgba(255,255,255,0.05)",
// //                     marginLeft: 46,
// //                   }}
// //                 />
// //               )}
// //             </div>
// //           ))}
// //         </div>

// //         {/* Enter Button */}
// //         <button
// //           onClick={() => navigate("/signin")}
// //           style={{
// //             width: "100%",
// //             padding: "15px 0",
// //             background: "linear-gradient(135deg, #FF4B6E, #FF1744)",
// //             border: "none",
// //             borderRadius: 50,
// //             color: "#fff",
// //             fontWeight: 800,
// //             fontSize: 15,
// //             letterSpacing: "0.06em",
// //             cursor: "pointer",
// //             boxShadow: "0 8px 28px rgba(255,75,110,0.45)",
// //             fontFamily: "'Nunito', sans-serif",
// //             transition: "opacity 0.2s, transform 0.1s",
// //           }}
// //           onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
// //           onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
// //           onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
// //           onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
// //         >
// //           Enter App 🚀
// //         </button>
// //       </div>

// //       {/* Footer */}
// //       <div
// //         style={{
// //           position: "relative",
// //           zIndex: 10,
// //           marginTop: 28,
// //           textAlign: "center",
// //           color: "rgba(255,255,255,0.3)",
// //           fontSize: 12,
// //           lineHeight: 1.9,
// //         }}
// //       >
// //         <div>© Red Cherry | All Rights Reserved</div>
// //         <div>Follow us for updates 🚀</div>
// //       </div>

// //       <style>{`
// //         @keyframes floatUp {
// //           from { transform: translateY(0px) rotate(0deg); }
// //           to   { transform: translateY(-22px) rotate(12deg); }
// //         }
// //         .logo-wrap { transition: transform 0.25s ease, filter 0.25s ease !important; cursor: default; }
// //         .logo-wrap:hover { transform: scale(1.08) translateY(-3px) !important; filter: drop-shadow(0 0 12px rgba(255,75,110,0.7)) !important; }
// //       `}</style>
// //     </div>
// //   );
// // }

// // /* ── Shared logo styles ── */
// // const logoWrapStyle = {
// //   display: "flex",
// //   flexDirection: "column",
// //   alignItems: "center",
// //   gap: 8,
// // };
// // const logoLabelStyle = {
// //   color: "rgba(255,255,255,0.5)",
// //   fontSize: 11,
// //   fontWeight: 600,
// //   letterSpacing: "0.05em",
// //   whiteSpace: "nowrap",
// // };

// //===========================v2
// // user-frontend
// // src/pages/ComingSoonPage.jsx
// // v3 — "View Hosting Plans" button added
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const COLORS = [
  "#FF4B6E",
  "#FF6B35",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#C77DFF",
  "#FF85A1",
];
const PETALS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  size: (i % 3) * 6 + 8,
  left: `${(i * 13) % 97}%`,
  top: `${(i * 17) % 93}%`,
  color: COLORS[i % COLORS.length],
  delay: `${((i * 0.3) % 3).toFixed(1)}s`,
  duration: `${(2 + ((i * 0.17) % 2.5)).toFixed(1)}s`,
}));

function LegalPageLayout({ title, children, onBack }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0f0015 0%,#1a0020 50%,#0f0015 100%)",
        color: "#fff",
        fontFamily: "'Nunito',sans-serif",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(15,0,21,0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255,75,110,0.2)",
          padding: "14px 20px",
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            color: "#FF4B6E",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "inherit",
          }}
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>
      <div
        style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 60px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1
            style={{
              fontSize: "clamp(22px,5vw,32px)",
              fontWeight: 900,
              background: "linear-gradient(90deg,#FF4B6E,#FFD93D,#FF85A1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 12,
            }}
          >
            {title}
          </h1>
          <div
            style={{
              width: 60,
              height: 3,
              background: "linear-gradient(90deg,#FF4B6E,#4D96FF)",
              borderRadius: 99,
              margin: "0 auto",
            }}
          />
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,75,110,0.2)",
            borderRadius: 20,
            padding: "28px 24px",
          }}
        >
          {children}
        </div>
        <div
          style={{
            marginTop: 20,
            padding: "16px 20px",
            background: "rgba(255,75,110,0.08)",
            border: "1px solid rgba(255,75,110,0.3)",
            borderRadius: 14,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <p
              style={{
                color: "#FF4B6E",
                fontWeight: 800,
                fontSize: 14,
                marginBottom: 4,
              }}
            >
              Age Restriction Notice
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              This platform is strictly for users{" "}
              <strong style={{ color: "#fff" }}>
                18 years of age or older
              </strong>
              . Children and minors are prohibited.
            </p>
          </div>
        </div>
        <div
          style={{
            marginTop: 16,
            padding: "16px 20px",
            background: "rgba(77,150,255,0.06)",
            border: "1px solid rgba(77,150,255,0.2)",
            borderRadius: 14,
          }}
        >
          <p
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 14,
              marginBottom: 10,
            }}
          >
            Contact Information
          </p>
          <div
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 13,
              lineHeight: 1.9,
            }}
          >
            <p>
              <strong style={{ color: "#fff" }}>Redcheery</strong>
            </p>
            <p>
              📍 Unit No- 11/W/2, Room 2, Action Area II/04, Newtown, Kolkata –
              700161
            </p>
            <p>
              📧{" "}
              <a
                href="mailto:customercare@redcheery.com"
                style={{ color: "#4D96FF" }}
              >
                customercare@redcheery.com
              </a>
            </p>
            <p>
              📞{" "}
              <a href="tel:8240210845" style={{ color: "#4D96FF" }}>
                8240210845
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LS({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2
        style={{
          fontSize: 17,
          fontWeight: 800,
          color: "#FFD93D",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: 8,
          marginBottom: 12,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: 14,
          lineHeight: 1.8,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function PrivacyPolicyPage({ onBack }) {
  return (
    <LegalPageLayout title="Privacy Policy & Refund Policy" onBack={onBack}>
      <LS title="1. Introduction">
        <p>
          Redcheery respects user privacy and is committed to protecting
          personal information.
        </p>
      </LS>
      <LS title="2. Eligibility (18+ Only)">
        <p>
          Our services are strictly for individuals{" "}
          <strong style={{ color: "#fff" }}>18 years of age or older</strong>.
        </p>
      </LS>
      <LS title="3. Information We Collect">
        <p>
          <strong style={{ color: "#FF85A1" }}>Personal:</strong> Name, date of
          birth, gender, email, phone, profile photo, location.
        </p>
        <p>
          <strong style={{ color: "#FF85A1" }}>Usage:</strong> Login details,
          preferences, device information.
        </p>
        <p>
          <strong style={{ color: "#FF85A1" }}>Automatic:</strong> Cookies, log
          files, usage statistics.
        </p>
      </LS>
      <LS title="4. How We Use Your Data">
        <ul style={{ paddingLeft: 20, marginTop: 4 }}>
          {[
            "Create and manage accounts",
            "Provide social networking features",
            "Improve platform experience",
            "Ensure safety and fraud prevention",
            "Comply with legal requirements",
          ].map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </LS>
      <LS title="5. Data Sharing">
        <p>
          <strong style={{ color: "#fff" }}>
            We do not sell or rent personal data.
          </strong>{" "}
          Data is shared only with service providers, when required by law, or
          with user consent.
        </p>
      </LS>
      <LS title="6. User Rights">
        <p>
          You may access, update, or request deletion of your data by contacting
          us.
        </p>
      </LS>
    </LegalPageLayout>
  );
}

function TermsConditionsPage({ onBack }) {
  return (
    <LegalPageLayout
      title="Terms & Conditions And Refund Policy"
      onBack={onBack}
    >
      <LS title="1. Acceptance of Terms">
        <p>
          By accessing Biswa Bangla Social Networking Services, you agree to
          comply with these Terms.
        </p>
      </LS>
      <LS title="2. Eligibility (18+ Only)">
        <ul style={{ paddingLeft: 20 }}>
          <li>
            Platform is strictly for individuals aged{" "}
            <strong style={{ color: "#FFD93D" }}>18 years or above</strong>.
          </li>
          <li>
            Accounts found belonging to users under 18 will be terminated
            without notice.
          </li>
        </ul>
      </LS>
      <LS title="3. User Responsibilities">
        <ul style={{ paddingLeft: 20 }}>
          <li>Provide accurate and truthful information</li>
          <li>No impersonation of others</li>
          <li>No illegal, obscene, or harmful content</li>
          <li>No harassment, exploitation, or scams</li>
        </ul>
        <p style={{ color: "#FF4B6E", marginTop: 8 }}>
          ⚠️ Violations may result in account suspension or termination.
        </p>
      </LS>
      <LS title="4. Limitation of Liability">
        <p>We are not responsible for user behavior or offline meetings.</p>
      </LS>
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg,transparent,rgba(255,75,110,0.5),transparent)",
          margin: "20px 0",
        }}
      />
      <h2
        style={{
          fontSize: 20,
          fontWeight: 900,
          color: "#4D96FF",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Refund Policy
      </h2>
      <LS title="General Policy">
        <p>
          All payments are{" "}
          <strong style={{ color: "#FFD93D" }}>non-refundable</strong> except
          where required by law.
        </p>
      </LS>
      <LS title="No Refund Situations">
        <ul style={{ paddingLeft: 20 }}>
          <li>Change of mind after purchase</li>
          <li>Inactivity or lack of usage</li>
          <li>Account suspension due to policy violations</li>
          <li>Dissatisfaction with interactions</li>
        </ul>
      </LS>
      <LS title="Technical Errors">
        <p>
          Refunds considered if payment deducted but service not activated,
          reported within 48 hours. Processing takes 7–10 business days.
        </p>
      </LS>
    </LegalPageLayout>
  );
}

function ShippingPolicyPage({ onBack }) {
  return (
    <LegalPageLayout
      title="Delivery, Cancellation & Refund Policy"
      onBack={onBack}
    >
      <div
        style={{
          background: "rgba(77,150,255,0.08)",
          border: "1px solid rgba(77,150,255,0.3)",
          borderRadius: 16,
          padding: "24px",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>💻</div>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#4D96FF",
            marginBottom: 8,
          }}
        >
          Digital-Only Platform
        </h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
          Biswa Bangla Social Networking Services is a{" "}
          <strong style={{ color: "#fff" }}>digital-only platform</strong>.
        </p>
      </div>
      <LS title="No Physical Products">
        <ul style={{ paddingLeft: 20 }}>
          <li>We do not sell, ship, or deliver any physical products</li>
          <li>All services are online and virtual in nature</li>
        </ul>
      </LS>
      <LS title="Service Delivery">
        <p>
          All features are delivered instantly after payment — available 24/7
          online.
        </p>
      </LS>
      <LS title="Refund & Cancellation">
        <p>
          All payments are{" "}
          <strong style={{ color: "#FFD93D" }}>non-refundable</strong>.
          Cancellation takes effect at end of billing period.
        </p>
      </LS>
    </LegalPageLayout>
  );
}

function CommunityGuidelinesPage({ onBack }) {
  return (
    <LegalPageLayout title="Community Guidelines" onBack={onBack}>
      <LS title="1. Age Requirement">
        <p>
          This platform is strictly for individuals{" "}
          <strong style={{ color: "#FFD93D" }}>18 years of age or older</strong>
          .
        </p>
      </LS>
      <LS title="2. Responsible Use">
        <ul style={{ paddingLeft: 20 }}>
          <li>Use the platform respectfully and lawfully</li>
          <li>Avoid harassment, abuse, hate speech</li>
          <li>Share accurate information</li>
          <li>Respect the privacy and consent of other members</li>
        </ul>
      </LS>
      <LS title="3. Prohibited Activities">
        <p style={{ color: "#FFD93D", marginBottom: 8 }}>
          ⚠️ The following are strictly not allowed:
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li>Use by anyone under 18</li>
          <li>Illegal, obscene, or offensive content</li>
          <li>Impersonation, scams</li>
          <li>Harassment, bullying</li>
          <li>Spam or unauthorized advertising</li>
        </ul>
      </LS>
      <LS title="4. Enforcement">
        <p>
          We reserve the right to remove content, suspend accounts, and report
          illegal activity.
        </p>
      </LS>
    </LegalPageLayout>
  );
}

function ChildrenMinorsPage({ onBack }) {
  return (
    <LegalPageLayout title="Children and Minors Prohibited" onBack={onBack}>
      <div
        style={{
          background: "rgba(255,75,110,0.1)",
          border: "2px solid rgba(255,75,110,0.5)",
          borderRadius: 16,
          padding: "28px",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 10 }}>🚫</div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "#FF4B6E",
            marginBottom: 10,
          }}
        >
          STRICTLY 18+ ONLY
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          Children and minors are <strong>strictly prohibited</strong> from
          using Redcheery.
        </p>
      </div>
      <LS title="Age Verification">
        <p>
          By accessing this service, users confirm they are at least{" "}
          <strong style={{ color: "#FFD93D" }}>18 years old</strong>.
        </p>
      </LS>
      <LS title="Account Termination">
        <p style={{ color: "#FFD93D" }}>
          ⚠️ Any account found to be operated by a minor will be immediately
          suspended. All data deleted, no refunds.
        </p>
      </LS>
      <LS title="Legal Compliance">
        <ul style={{ paddingLeft: 20 }}>
          <li>Information Technology Act, 2000</li>
          <li>Protection of Children from Sexual Offences (POCSO) Act, 2012</li>
          <li>Digital Personal Data Protection Act</li>
          <li>Indian Child Safety Regulations</li>
        </ul>
      </LS>
    </LegalPageLayout>
  );
}

function ContactUsPage({ onBack }) {
  return (
    <LegalPageLayout title="Contact Us" onBack={onBack}>
      <div
        style={{
          background: "rgba(77,150,255,0.08)",
          border: "2px solid rgba(77,150,255,0.3)",
          borderRadius: 16,
          padding: "28px",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 10 }}>📧</div>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#4D96FF",
            marginBottom: 8,
          }}
        >
          Get In Touch
        </h2>
      </div>
      <LS title="Biswa Bangla Social Networking Club">
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: 12,
            padding: "20px",
          }}
        >
          <p>
            📍 Unit No- 11/W/2, Room 2, Action Area II/04, Newtown, Kolkata –
            West Bengal 700161
          </p>
          <div style={{ marginTop: 16 }}>
            <p>
              📧{" "}
              <a href="mailto:care@redcheery.com" style={{ color: "#4D96FF" }}>
                care@redcheery.com
              </a>
            </p>
            <p>
              📧{" "}
              <a
                href="mailto:customercare@redcheery.com"
                style={{ color: "#4D96FF" }}
              >
                customercare@redcheery.com
              </a>
            </p>
            <p>
              📧{" "}
              <a
                href="mailto:customercarebiswabanglasocialn@gmail.com"
                style={{ color: "#4D96FF" }}
              >
                customercarebiswabanglasocialn@gmail.com
              </a>
            </p>
          </div>
          <div style={{ marginTop: 12 }}>
            <p>
              📞{" "}
              <a
                href="tel:8240210845"
                style={{ color: "#4D96FF", fontWeight: 800, fontSize: 18 }}
              >
                8240210845
              </a>
            </p>
          </div>
        </div>
      </LS>
      <LS title="Support Hours">
        <ul style={{ paddingLeft: 20 }}>
          <li>
            <strong style={{ color: "#fff" }}>Monday–Friday:</strong> 9:00 AM –
            6:00 PM IST
          </li>
          <li>
            <strong style={{ color: "#fff" }}>Saturday:</strong> 10:00 AM – 4:00
            PM IST
          </li>
          <li>
            <strong style={{ color: "#fff" }}>Sunday:</strong> Closed
          </li>
        </ul>
      </LS>
    </LegalPageLayout>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ComingSoonPage() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(null);

  const back = () => setActivePage(null);
  if (activePage === "privacy") return <PrivacyPolicyPage onBack={back} />;
  if (activePage === "terms") return <TermsConditionsPage onBack={back} />;
  if (activePage === "shipping") return <ShippingPolicyPage onBack={back} />;
  if (activePage === "community")
    return <CommunityGuidelinesPage onBack={back} />;
  if (activePage === "children") return <ChildrenMinorsPage onBack={back} />;
  if (activePage === "contact") return <ContactUsPage onBack={back} />;

  const legalItems = [
    { key: "privacy", icon: "🔒", label: "Privacy Policy" },
    { key: "terms", icon: "📋", label: "Terms & Conditions" },
    { key: "shipping", icon: "📦", label: "Delivery, Cancellation & Refund" },
    { key: "community", icon: "👥", label: "Community Guidelines" },
    { key: "children", icon: "🚫", label: "Children and Minors Prohibited" },
    { key: "contact", icon: "💬", label: "Contact Us" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#130008 0%,#3b0018 50%,#130008 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Nunito',sans-serif",
      }}
    >
      {/* Floating blobs */}
      {PETALS.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            left: p.left,
            top: p.top,
            opacity: 0.55,
            filter: "blur(1.5px)",
            animation: `floatUp ${p.duration} ${p.delay} infinite alternate ease-in-out`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Glow orbs */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(255,75,110,0.15) 0%,transparent 70%)",
          top: "0%",
          left: "0%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(199,125,255,0.12) 0%,transparent 70%)",
          bottom: "0%",
          right: "0%",
          pointerEvents: "none",
        }}
      />

      {/* Main Card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,75,110,0.35)",
          borderRadius: 28,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          padding: "40px 28px 32px",
          maxWidth: 460,
          width: "90%",
          textAlign: "center",
          boxShadow:
            "0 0 80px rgba(255,75,110,0.18),0 24px 64px rgba(0,0,0,0.55)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 0 24px rgba(255,75,110,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "3px solid rgba(255,255,255,0.8)",
            margin: "0 auto 14px",
          }}
        >
          <img
            src="/user-logo.png"
            alt="Red Cherry"
            style={{ width: 90, height: 90, objectFit: "contain" }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentNode.innerHTML = "🍒";
              e.target.parentNode.style.fontSize = "60px";
            }}
          />
        </div>

        <h1
          style={{
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: "0.14em",
            background: "linear-gradient(90deg,#FF4B6E,#FFD93D,#FF85A1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 6px 0",
            fontFamily: "Georgia,serif",
          }}
        >
          RED CHERRY
        </h1>
        <p
          style={{
            color: "#FFD93D",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            margin: "0 0 20px 0",
          }}
        >
          Welcome To The Family Of India's Largest Online Social Networking
          Services and Open Friendship Platform.
          <br />
          <br />
          Powered by Biswa Bangla Social Networking Services Club.
        </p>
        <p
          style={{
            color: "#FFD93D",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            margin: "0 0 20px 0",
          }}
        >
          Something Sweet Is Coming Soon!
        </p>

        {/* logo.png */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 22,
          }}
        >
          <div
            className="logo-wrap"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <img
              src="/logo.png"
              alt="Red Cherry Logo"
              style={{
                width: 100,
                height: 100,
                objectFit: "contain",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                padding: 4,
                border: "2px solid rgba(255,75,110,0.5)",
                boxShadow: "0 0 18px rgba(255,75,110,0.35)",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              Red Cherry
            </span>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,transparent,rgba(255,75,110,0.5),transparent)",
            marginBottom: 22,
          }}
        />

        {/* Legal */}
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 10,
            textAlign: "left",
          }}
        >
          Legal & Policies
        </p>
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,75,110,0.2)",
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 20,
            textAlign: "left",
          }}
        >
          {legalItems.map((item, i) => (
            <div key={item.key}>
              <button
                onClick={() => setActivePage(item.key)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "13px 16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Nunito',sans-serif",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,75,110,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  {item.label}
                </span>
                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 18 }}>
                  ›
                </span>
              </button>
              {i < legalItems.length - 1 && (
                <div
                  style={{
                    height: 1,
                    background: "rgba(255,255,255,0.05)",
                    marginLeft: 46,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── View Hosting Plans ── */}
        <button
          onClick={() => navigate("/hosting-plans")}
          style={{
            width: "100%",
            padding: "14px 0",
            background: "linear-gradient(135deg,#0ea5e9,#0369a1)",
            border: "none",
            borderRadius: 50,
            color: "#fff",
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: "0.06em",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(14,165,233,0.4)",
            fontFamily: "'Nunito',sans-serif",
            marginBottom: 12,
            transition: "opacity 0.2s,transform 0.1s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          🌐 View Our Service Plans
        </button>

        {/* ── Enter App ── */}
        <button
          onClick={() => navigate("/signin")}
          style={{
            width: "100%",
            padding: "15px 0",
            background: "linear-gradient(135deg,#FF4B6E,#FF1744)",
            border: "none",
            borderRadius: 50,
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: "0.06em",
            cursor: "pointer",
            boxShadow: "0 8px 28px rgba(255,75,110,0.45)",
            fontFamily: "'Nunito',sans-serif",
            transition: "opacity 0.2s,transform 0.1s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Enter App 🚀
        </button>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: 28,
          textAlign: "center",
          color: "rgba(255,255,255,0.3)",
          fontSize: 12,
          lineHeight: 1.9,
        }}
      >
        <div>© Red Cherry | All Rights Reserved</div>
        <div>Follow us for updates 🚀</div>
      </div>

      <style>{`
        @keyframes floatUp { from { transform:translateY(0px) rotate(0deg); } to { transform:translateY(-22px) rotate(12deg); } }
        .logo-wrap { transition:transform 0.25s ease,filter 0.25s ease !important; }
        .logo-wrap:hover { transform:scale(1.08) translateY(-3px) !important; filter:drop-shadow(0 0 12px rgba(255,75,110,0.7)) !important; }
      `}</style>
    </div>
  );
}

// //for eid mubarak 1

//========================================================================v2
// user-frontend
// src/pages/ComingSoonPage.jsx
// v3 — "View Hosting Plans" button added
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const COLORS = [
//   "#FF4B6E",
//   "#FF6B35",
//   "#FFD93D",
//   "#6BCB77",
//   "#4D96FF",
//   "#C77DFF",
//   "#FF85A1",
// ];
// const PETALS = Array.from({ length: 28 }, (_, i) => ({
//   id: i,
//   size: (i % 3) * 6 + 8,
//   left: `${(i * 13) % 97}%`,
//   top: `${(i * 17) % 93}%`,
//   color: COLORS[i % COLORS.length],
//   delay: `${((i * 0.3) % 3).toFixed(1)}s`,
//   duration: `${(2 + ((i * 0.17) % 2.5)).toFixed(1)}s`,
// }));

// function LegalPageLayout({ title, children, onBack }) {
//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background:
//           "linear-gradient(135deg,#0f0015 0%,#1a0020 50%,#0f0015 100%)",
//         color: "#fff",
//         fontFamily: "'Nunito',sans-serif",
//       }}
//     >
//       <div
//         style={{
//           position: "sticky",
//           top: 0,
//           zIndex: 20,
//           background: "rgba(15,0,21,0.95)",
//           backdropFilter: "blur(8px)",
//           borderBottom: "1px solid rgba(255,75,110,0.2)",
//           padding: "14px 20px",
//         }}
//       >
//         <button
//           onClick={onBack}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//             background: "none",
//             border: "none",
//             color: "#FF4B6E",
//             cursor: "pointer",
//             fontSize: 14,
//             fontWeight: 700,
//             fontFamily: "inherit",
//           }}
//         >
//           <svg
//             width="18"
//             height="18"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2.5"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M15 19l-7-7 7-7"
//             />
//           </svg>
//           Back
//         </button>
//       </div>
//       <div
//         style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 60px" }}
//       >
//         <div style={{ textAlign: "center", marginBottom: 36 }}>
//           <h1
//             style={{
//               fontSize: "clamp(22px,5vw,32px)",
//               fontWeight: 900,
//               background: "linear-gradient(90deg,#FF4B6E,#FFD93D,#FF85A1)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               marginBottom: 12,
//             }}
//           >
//             {title}
//           </h1>
//           <div
//             style={{
//               width: 60,
//               height: 3,
//               background: "linear-gradient(90deg,#FF4B6E,#4D96FF)",
//               borderRadius: 99,
//               margin: "0 auto",
//             }}
//           />
//         </div>
//         <div
//           style={{
//             background: "rgba(255,255,255,0.04)",
//             border: "1px solid rgba(255,75,110,0.2)",
//             borderRadius: 20,
//             padding: "28px 24px",
//           }}
//         >
//           {children}
//         </div>
//         <div
//           style={{
//             marginTop: 20,
//             padding: "16px 20px",
//             background: "rgba(255,75,110,0.08)",
//             border: "1px solid rgba(255,75,110,0.3)",
//             borderRadius: 14,
//             display: "flex",
//             gap: 12,
//             alignItems: "flex-start",
//           }}
//         >
//           <span style={{ fontSize: 20 }}>⚠️</span>
//           <div>
//             <p
//               style={{
//                 color: "#FF4B6E",
//                 fontWeight: 800,
//                 fontSize: 14,
//                 marginBottom: 4,
//               }}
//             >
//               Age Restriction Notice
//             </p>
//             <p
//               style={{
//                 color: "rgba(255,255,255,0.6)",
//                 fontSize: 13,
//                 lineHeight: 1.6,
//               }}
//             >
//               This platform is strictly for users{" "}
//               <strong style={{ color: "#fff" }}>
//                 18 years of age or older
//               </strong>
//               . Children and minors are prohibited.
//             </p>
//           </div>
//         </div>
//         <div
//           style={{
//             marginTop: 16,
//             padding: "16px 20px",
//             background: "rgba(77,150,255,0.06)",
//             border: "1px solid rgba(77,150,255,0.2)",
//             borderRadius: 14,
//           }}
//         >
//           <p
//             style={{
//               color: "#fff",
//               fontWeight: 800,
//               fontSize: 14,
//               marginBottom: 10,
//             }}
//           >
//             Contact Information
//           </p>
//           <div
//             style={{
//               color: "rgba(255,255,255,0.6)",
//               fontSize: 13,
//               lineHeight: 1.9,
//             }}
//           >
//             <p>
//               <strong style={{ color: "#fff" }}>Redcheery</strong>
//             </p>
//             <p>
//               📍 Unit No- 11/W/2, Room 2, Action Area II/04, Newtown, Kolkata –
//               700161
//             </p>
//             <p>
//               📧{" "}
//               <a
//                 href="mailto:customercare@redcheery.com"
//                 style={{ color: "#4D96FF" }}
//               >
//                 customercare@redcheery.com
//               </a>
//             </p>
//             <p>
//               📞{" "}
//               <a href="tel:8240210845" style={{ color: "#4D96FF" }}>
//                 8240210845
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function LS({ title, children }) {
//   return (
//     <div style={{ marginBottom: 24 }}>
//       <h2
//         style={{
//           fontSize: 17,
//           fontWeight: 800,
//           color: "#FFD93D",
//           borderBottom: "1px solid rgba(255,255,255,0.1)",
//           paddingBottom: 8,
//           marginBottom: 12,
//         }}
//       >
//         {title}
//       </h2>
//       <div
//         style={{
//           color: "rgba(255,255,255,0.75)",
//           fontSize: 14,
//           lineHeight: 1.8,
//         }}
//       >
//         {children}
//       </div>
//     </div>
//   );
// }

// function PrivacyPolicyPage({ onBack }) {
//   return (
//     <LegalPageLayout title="Privacy Policy & Refund Policy" onBack={onBack}>
//       <LS title="1. Introduction">
//         <p>
//           Redcheery respects user privacy and is committed to protecting
//           personal information.
//         </p>
//       </LS>
//       <LS title="2. Eligibility (18+ Only)">
//         <p>
//           Our services are strictly for individuals{" "}
//           <strong style={{ color: "#fff" }}>18 years of age or older</strong>.
//         </p>
//       </LS>
//       <LS title="3. Information We Collect">
//         <p>
//           <strong style={{ color: "#FF85A1" }}>Personal:</strong> Name, date of
//           birth, gender, email, phone, profile photo, location.
//         </p>
//         <p>
//           <strong style={{ color: "#FF85A1" }}>Usage:</strong> Login details,
//           preferences, device information.
//         </p>
//         <p>
//           <strong style={{ color: "#FF85A1" }}>Automatic:</strong> Cookies, log
//           files, usage statistics.
//         </p>
//       </LS>
//       <LS title="4. How We Use Your Data">
//         <ul style={{ paddingLeft: 20, marginTop: 4 }}>
//           {[
//             "Create and manage accounts",
//             "Provide social networking features",
//             "Improve platform experience",
//             "Ensure safety and fraud prevention",
//             "Comply with legal requirements",
//           ].map((i) => (
//             <li key={i}>{i}</li>
//           ))}
//         </ul>
//       </LS>
//       <LS title="5. Data Sharing">
//         <p>
//           <strong style={{ color: "#fff" }}>
//             We do not sell or rent personal data.
//           </strong>{" "}
//           Data is shared only with service providers, when required by law, or
//           with user consent.
//         </p>
//       </LS>
//       <LS title="6. User Rights">
//         <p>
//           You may access, update, or request deletion of your data by contacting
//           us.
//         </p>
//       </LS>
//     </LegalPageLayout>
//   );
// }

// function TermsConditionsPage({ onBack }) {
//   return (
//     <LegalPageLayout
//       title="Terms & Conditions And Refund Policy"
//       onBack={onBack}
//     >
//       <LS title="1. Acceptance of Terms">
//         <p>
//           By accessing Biswa Bangla Social Networking Services, you agree to
//           comply with these Terms.
//         </p>
//       </LS>
//       <LS title="2. Eligibility (18+ Only)">
//         <ul style={{ paddingLeft: 20 }}>
//           <li>
//             Platform is strictly for individuals aged{" "}
//             <strong style={{ color: "#FFD93D" }}>18 years or above</strong>.
//           </li>
//           <li>
//             Accounts found belonging to users under 18 will be terminated
//             without notice.
//           </li>
//         </ul>
//       </LS>
//       <LS title="3. User Responsibilities">
//         <ul style={{ paddingLeft: 20 }}>
//           <li>Provide accurate and truthful information</li>
//           <li>No impersonation of others</li>
//           <li>No illegal, obscene, or harmful content</li>
//           <li>No harassment, exploitation, or scams</li>
//         </ul>
//         <p style={{ color: "#FF4B6E", marginTop: 8 }}>
//           ⚠️ Violations may result in account suspension or termination.
//         </p>
//       </LS>
//       <LS title="4. Limitation of Liability">
//         <p>We are not responsible for user behavior or offline meetings.</p>
//       </LS>
//       <div
//         style={{
//           height: 1,
//           background:
//             "linear-gradient(90deg,transparent,rgba(255,75,110,0.5),transparent)",
//           margin: "20px 0",
//         }}
//       />
//       <h2
//         style={{
//           fontSize: 20,
//           fontWeight: 900,
//           color: "#4D96FF",
//           textAlign: "center",
//           marginBottom: 20,
//         }}
//       >
//         Refund Policy
//       </h2>
//       <LS title="General Policy">
//         <p>
//           All payments are{" "}
//           <strong style={{ color: "#FFD93D" }}>non-refundable</strong> except
//           where required by law.
//         </p>
//       </LS>
//       <LS title="No Refund Situations">
//         <ul style={{ paddingLeft: 20 }}>
//           <li>Change of mind after purchase</li>
//           <li>Inactivity or lack of usage</li>
//           <li>Account suspension due to policy violations</li>
//           <li>Dissatisfaction with interactions</li>
//         </ul>
//       </LS>
//       <LS title="Technical Errors">
//         <p>
//           Refunds considered if payment deducted but service not activated,
//           reported within 48 hours. Processing takes 7–10 business days.
//         </p>
//       </LS>
//     </LegalPageLayout>
//   );
// }

// function ShippingPolicyPage({ onBack }) {
//   return (
//     <LegalPageLayout
//       title="Delivery, Cancellation & Refund Policy"
//       onBack={onBack}
//     >
//       <div
//         style={{
//           background: "rgba(77,150,255,0.08)",
//           border: "1px solid rgba(77,150,255,0.3)",
//           borderRadius: 16,
//           padding: "24px",
//           textAlign: "center",
//           marginBottom: 24,
//         }}
//       >
//         <div style={{ fontSize: 48, marginBottom: 8 }}>💻</div>
//         <h2
//           style={{
//             fontSize: 20,
//             fontWeight: 800,
//             color: "#4D96FF",
//             marginBottom: 8,
//           }}
//         >
//           Digital-Only Platform
//         </h2>
//         <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
//           Biswa Bangla Social Networking Services is a{" "}
//           <strong style={{ color: "#fff" }}>digital-only platform</strong>.
//         </p>
//       </div>
//       <LS title="No Physical Products">
//         <ul style={{ paddingLeft: 20 }}>
//           <li>We do not sell, ship, or deliver any physical products</li>
//           <li>All services are online and virtual in nature</li>
//         </ul>
//       </LS>
//       <LS title="Service Delivery">
//         <p>
//           All features are delivered instantly after payment — available 24/7
//           online.
//         </p>
//       </LS>
//       <LS title="Refund & Cancellation">
//         <p>
//           All payments are{" "}
//           <strong style={{ color: "#FFD93D" }}>non-refundable</strong>.
//           Cancellation takes effect at end of billing period.
//         </p>
//       </LS>
//     </LegalPageLayout>
//   );
// }

// function CommunityGuidelinesPage({ onBack }) {
//   return (
//     <LegalPageLayout title="Community Guidelines" onBack={onBack}>
//       <LS title="1. Age Requirement">
//         <p>
//           This platform is strictly for individuals{" "}
//           <strong style={{ color: "#FFD93D" }}>18 years of age or older</strong>
//           .
//         </p>
//       </LS>
//       <LS title="2. Responsible Use">
//         <ul style={{ paddingLeft: 20 }}>
//           <li>Use the platform respectfully and lawfully</li>
//           <li>Avoid harassment, abuse, hate speech</li>
//           <li>Share accurate information</li>
//           <li>Respect the privacy and consent of other members</li>
//         </ul>
//       </LS>
//       <LS title="3. Prohibited Activities">
//         <p style={{ color: "#FFD93D", marginBottom: 8 }}>
//           ⚠️ The following are strictly not allowed:
//         </p>
//         <ul style={{ paddingLeft: 20 }}>
//           <li>Use by anyone under 18</li>
//           <li>Illegal, obscene, or offensive content</li>
//           <li>Impersonation, scams</li>
//           <li>Harassment, bullying</li>
//           <li>Spam or unauthorized advertising</li>
//         </ul>
//       </LS>
//       <LS title="4. Enforcement">
//         <p>
//           We reserve the right to remove content, suspend accounts, and report
//           illegal activity.
//         </p>
//       </LS>
//     </LegalPageLayout>
//   );
// }

// function ChildrenMinorsPage({ onBack }) {
//   return (
//     <LegalPageLayout title="Children and Minors Prohibited" onBack={onBack}>
//       <div
//         style={{
//           background: "rgba(255,75,110,0.1)",
//           border: "2px solid rgba(255,75,110,0.5)",
//           borderRadius: 16,
//           padding: "28px",
//           textAlign: "center",
//           marginBottom: 24,
//         }}
//       >
//         <div style={{ fontSize: 52, marginBottom: 10 }}>🚫</div>
//         <h2
//           style={{
//             fontSize: 22,
//             fontWeight: 900,
//             color: "#FF4B6E",
//             marginBottom: 10,
//           }}
//         >
//           STRICTLY 18+ ONLY
//         </h2>
//         <p
//           style={{
//             color: "rgba(255,255,255,0.8)",
//             fontSize: 15,
//             lineHeight: 1.7,
//           }}
//         >
//           Children and minors are <strong>strictly prohibited</strong> from
//           using Redcheery.
//         </p>
//       </div>
//       <LS title="Age Verification">
//         <p>
//           By accessing this service, users confirm they are at least{" "}
//           <strong style={{ color: "#FFD93D" }}>18 years old</strong>.
//         </p>
//       </LS>
//       <LS title="Account Termination">
//         <p style={{ color: "#FFD93D" }}>
//           ⚠️ Any account found to be operated by a minor will be immediately
//           suspended. All data deleted, no refunds.
//         </p>
//       </LS>
//       <LS title="Legal Compliance">
//         <ul style={{ paddingLeft: 20 }}>
//           <li>Information Technology Act, 2000</li>
//           <li>Protection of Children from Sexual Offences (POCSO) Act, 2012</li>
//           <li>Digital Personal Data Protection Act</li>
//           <li>Indian Child Safety Regulations</li>
//         </ul>
//       </LS>
//     </LegalPageLayout>
//   );
// }

// function ContactUsPage({ onBack }) {
//   return (
//     <LegalPageLayout title="Contact Us" onBack={onBack}>
//       <div
//         style={{
//           background: "rgba(77,150,255,0.08)",
//           border: "2px solid rgba(77,150,255,0.3)",
//           borderRadius: 16,
//           padding: "28px",
//           textAlign: "center",
//           marginBottom: 24,
//         }}
//       >
//         <div style={{ fontSize: 52, marginBottom: 10 }}>📧</div>
//         <h2
//           style={{
//             fontSize: 20,
//             fontWeight: 800,
//             color: "#4D96FF",
//             marginBottom: 8,
//           }}
//         >
//           Get In Touch
//         </h2>
//       </div>
//       <LS title="Biswa Bangla Social Networking Club">
//         <div
//           style={{
//             background: "rgba(255,255,255,0.04)",
//             borderRadius: 12,
//             padding: "20px",
//           }}
//         >
//           <p>
//             📍 Unit No- 11/W/2, Room 2, Action Area II/04, Newtown, Kolkata –
//             West Bengal 700161
//           </p>
//           <div style={{ marginTop: 16 }}>
//             <p>
//               📧{" "}
//               <a href="mailto:care@redcheery.com" style={{ color: "#4D96FF" }}>
//                 care@redcheery.com
//               </a>
//             </p>
//             <p>
//               📧{" "}
//               <a
//                 href="mailto:customercare@redcheery.com"
//                 style={{ color: "#4D96FF" }}
//               >
//                 customercare@redcheery.com
//               </a>
//             </p>
//             <p>
//               📧{" "}
//               <a
//                 href="mailto:customercarebiswabanglasocialn@gmail.com"
//                 style={{ color: "#4D96FF" }}
//               >
//                 customercarebiswabanglasocialn@gmail.com
//               </a>
//             </p>
//           </div>
//           <div style={{ marginTop: 12 }}>
//             <p>
//               📞{" "}
//               <a
//                 href="tel:8240210845"
//                 style={{ color: "#4D96FF", fontWeight: 800, fontSize: 18 }}
//               >
//                 8240210845
//               </a>
//             </p>
//           </div>
//         </div>
//       </LS>
//       <LS title="Support Hours">
//         <ul style={{ paddingLeft: 20 }}>
//           <li>
//             <strong style={{ color: "#fff" }}>Monday–Friday:</strong> 9:00 AM –
//             6:00 PM IST
//           </li>
//           <li>
//             <strong style={{ color: "#fff" }}>Saturday:</strong> 10:00 AM – 4:00
//             PM IST
//           </li>
//           <li>
//             <strong style={{ color: "#fff" }}>Sunday:</strong> Closed
//           </li>
//         </ul>
//       </LS>
//     </LegalPageLayout>
//   );
// }

// // ── Main ──────────────────────────────────────────────────────────────────────
// export default function ComingSoonPage() {
//   const navigate = useNavigate();
//   const [activePage, setActivePage] = useState(null);
//   const [showEid, setShowEid] = useState(true);

//   const back = () => setActivePage(null);
//   if (activePage === "privacy") return <PrivacyPolicyPage onBack={back} />;
//   if (activePage === "terms") return <TermsConditionsPage onBack={back} />;
//   if (activePage === "shipping") return <ShippingPolicyPage onBack={back} />;
//   if (activePage === "community")
//     return <CommunityGuidelinesPage onBack={back} />;
//   if (activePage === "children") return <ChildrenMinorsPage onBack={back} />;
//   if (activePage === "contact") return <ContactUsPage onBack={back} />;

//   const legalItems = [
//     { key: "privacy", icon: "🔒", label: "Privacy Policy" },
//     { key: "terms", icon: "📋", label: "Terms & Conditions" },
//     { key: "shipping", icon: "📦", label: "Delivery, Cancellation & Refund" },
//     { key: "community", icon: "👥", label: "Community Guidelines" },
//     { key: "children", icon: "🚫", label: "Children and Minors Prohibited" },
//     { key: "contact", icon: "💬", label: "Contact Us" },
//   ];

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background:
//           "linear-gradient(135deg,#130008 0%,#3b0018 50%,#130008 100%)",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         position: "relative",
//         overflow: "hidden",
//         fontFamily: "'Nunito',sans-serif",
//       }}
//     >
//       {/* Floating blobs */}
//       {PETALS.map((p) => (
//         <div
//           key={p.id}
//           style={{
//             position: "absolute",
//             width: p.size,
//             height: p.size,
//             borderRadius: "50%",
//             background: p.color,
//             left: p.left,
//             top: p.top,
//             opacity: 0.55,
//             filter: "blur(1.5px)",
//             animation: `floatUp ${p.duration} ${p.delay} infinite alternate ease-in-out`,
//             pointerEvents: "none",
//           }}
//         />
//       ))}

//       {/* Glow orbs */}
//       <div
//         style={{
//           position: "absolute",
//           width: 500,
//           height: 500,
//           borderRadius: "50%",
//           background:
//             "radial-gradient(circle,rgba(255,75,110,0.15) 0%,transparent 70%)",
//           top: "0%",
//           left: "0%",
//           pointerEvents: "none",
//         }}
//       />
//       <div
//         style={{
//           position: "absolute",
//           width: 350,
//           height: 350,
//           borderRadius: "50%",
//           background:
//             "radial-gradient(circle,rgba(199,125,255,0.12) 0%,transparent 70%)",
//           bottom: "0%",
//           right: "0%",
//           pointerEvents: "none",
//         }}
//       />

//       {/* Main Card */}
//       <div
//         style={{
//           position: "relative",
//           zIndex: 10,
//           background: "rgba(255,255,255,0.06)",
//           border: "1px solid rgba(255,75,110,0.35)",
//           borderRadius: 28,
//           backdropFilter: "blur(18px)",
//           WebkitBackdropFilter: "blur(18px)",
//           padding: "40px 28px 32px",
//           maxWidth: 460,
//           width: "90%",
//           textAlign: "center",
//           boxShadow:
//             "0 0 80px rgba(255,75,110,0.18),0 24px 64px rgba(0,0,0,0.55)",
//         }}
//       >
//         {/* Logo */}
//         <div
//           style={{
//             width: 88,
//             height: 88,
//             borderRadius: "50%",
//             background: "#fff",
//             boxShadow: "0 0 24px rgba(255,75,110,0.6)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             overflow: "hidden",
//             border: "3px solid rgba(255,255,255,0.8)",
//             margin: "0 auto 14px",
//           }}
//         >
//           <img
//             src="/user-logo.png"
//             alt="Red Cherry"
//             style={{ width: 90, height: 90, objectFit: "contain" }}
//             onError={(e) => {
//               e.target.style.display = "none";
//               e.target.parentNode.innerHTML = "🍒";
//               e.target.parentNode.style.fontSize = "60px";
//             }}
//           />
//         </div>

//         <h1
//           style={{
//             fontSize: 28,
//             fontWeight: 900,
//             letterSpacing: "0.14em",
//             background: "linear-gradient(90deg,#FF4B6E,#FFD93D,#FF85A1)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             margin: "0 0 6px 0",
//             fontFamily: "Georgia,serif",
//           }}
//         >
//           RED CHEERY
//         </h1>
//         <p
//           style={{
//             color: "#FFD93D",
//             fontSize: 13,
//             fontWeight: 700,
//             letterSpacing: "0.08em",
//             margin: "0 0 20px 0",
//           }}
//         >
//           Welcome To The Family Of India's Largest Online Social Networking
//           Services and Open Friendship Platform.
//           <br />
//           <br />
//           Powered by Biswa Bangla Social Networking Services Club.
//         </p>
//         <p
//           style={{
//             color: "#FFD93D",
//             fontSize: 13,
//             fontWeight: 700,
//             letterSpacing: "0.08em",
//             margin: "0 0 20px 0",
//           }}
//         >
//           Something Sweet Is Coming Soon!
//         </p>

//         {/* logo.png */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             marginBottom: 22,
//           }}
//         >
//           <div
//             className="logo-wrap"
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               gap: 8,
//             }}
//           >
//             <img
//               src="/logo.png"
//               alt="Red Cherry Logo"
//               style={{
//                 width: 100,
//                 height: 100,
//                 objectFit: "contain",
//                 borderRadius: "50%",
//                 background: "rgba(255,255,255,0.06)",
//                 padding: 4,
//                 border: "2px solid rgba(255,75,110,0.5)",
//                 boxShadow: "0 0 18px rgba(255,75,110,0.35)",
//               }}
//               onError={(e) => {
//                 e.target.style.display = "none";
//               }}
//             />
//             <span
//               style={{
//                 color: "rgba(255,255,255,0.5)",
//                 fontSize: 11,
//                 fontWeight: 600,
//                 letterSpacing: "0.05em",
//               }}
//             >
//               Red Cherry
//             </span>
//           </div>
//         </div>

//         {/* Divider */}
//         <div
//           style={{
//             height: 1,
//             background:
//               "linear-gradient(90deg,transparent,rgba(255,75,110,0.5),transparent)",
//             marginBottom: 22,
//           }}
//         />

//         {/* Legal */}
//         <p
//           style={{
//             color: "rgba(255,255,255,0.45)",
//             fontSize: 11,
//             fontWeight: 800,
//             letterSpacing: "0.1em",
//             textTransform: "uppercase",
//             marginBottom: 10,
//             textAlign: "left",
//           }}
//         >
//           Legal & Policies
//         </p>
//         <div
//           style={{
//             background: "rgba(255,255,255,0.04)",
//             border: "1px solid rgba(255,75,110,0.2)",
//             borderRadius: 16,
//             overflow: "hidden",
//             marginBottom: 20,
//             textAlign: "left",
//           }}
//         >
//           {legalItems.map((item, i) => (
//             <div key={item.key}>
//               <button
//                 onClick={() => setActivePage(item.key)}
//                 style={{
//                   width: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 12,
//                   padding: "13px 16px",
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   fontFamily: "'Nunito',sans-serif",
//                   transition: "background 0.15s",
//                 }}
//                 onMouseEnter={(e) =>
//                   (e.currentTarget.style.background = "rgba(255,75,110,0.08)")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.currentTarget.style.background = "none")
//                 }
//               >
//                 <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
//                 <span
//                   style={{
//                     flex: 1,
//                     fontSize: 13,
//                     fontWeight: 700,
//                     color: "rgba(255,255,255,0.85)",
//                   }}
//                 >
//                   {item.label}
//                 </span>
//                 <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 18 }}>
//                   ›
//                 </span>
//               </button>
//               {i < legalItems.length - 1 && (
//                 <div
//                   style={{
//                     height: 1,
//                     background: "rgba(255,255,255,0.05)",
//                     marginLeft: 46,
//                   }}
//                 />
//               )}
//             </div>
//           ))}
//         </div>

//         {/* ── View Hosting Plans ── */}
//         <button
//           onClick={() => navigate("/hosting-plans")}
//           style={{
//             width: "100%",
//             padding: "14px 0",
//             background: "linear-gradient(135deg,#0ea5e9,#0369a1)",
//             border: "none",
//             borderRadius: 50,
//             color: "#fff",
//             fontWeight: 800,
//             fontSize: 14,
//             letterSpacing: "0.06em",
//             cursor: "pointer",
//             boxShadow: "0 8px 24px rgba(14,165,233,0.4)",
//             fontFamily: "'Nunito',sans-serif",
//             marginBottom: 12,
//             transition: "opacity 0.2s,transform 0.1s",
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
//           onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
//           onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
//           onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           🌐 View Our Service Plans
//         </button>

//         {/* ── Enter App ── */}
//         <button
//           onClick={() => navigate("/signin")}
//           style={{
//             width: "100%",
//             padding: "15px 0",
//             background: "linear-gradient(135deg,#FF4B6E,#FF1744)",
//             border: "none",
//             borderRadius: 50,
//             color: "#fff",
//             fontWeight: 800,
//             fontSize: 15,
//             letterSpacing: "0.06em",
//             cursor: "pointer",
//             boxShadow: "0 8px 28px rgba(255,75,110,0.45)",
//             fontFamily: "'Nunito',sans-serif",
//             transition: "opacity 0.2s,transform 0.1s",
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
//           onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
//           onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
//           onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           Enter App 🚀
//         </button>
//       </div>

//       {/* Footer */}
//       <div
//         style={{
//           position: "relative",
//           zIndex: 10,
//           marginTop: 28,
//           textAlign: "center",
//           color: "rgba(255,255,255,0.3)",
//           fontSize: 12,
//           lineHeight: 1.9,
//         }}
//       >
//         <div>© Red Cherry | All Rights Reserved</div>
//         <div>Follow us for updates 🚀</div>
//       </div>

//       {/* ── Eid Mubarak Modal ── */}
//       {showEid && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             zIndex: 9999,
//             background: "rgba(0,0,0,0.80)",
//             backdropFilter: "blur(8px)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "12px",
//             animation: "fadeInOverlay 0.35s ease",
//           }}
//         >
//           <div
//             className="eid-modal"
//             style={{
//               position: "relative",
//               width: "100%",
//               maxWidth: 370,
//               maxHeight: "90vh",
//               borderRadius: 22,
//               overflowY: "auto",
//               boxShadow:
//                 "0 28px 90px rgba(0,0,0,0.85), 0 0 0 2px rgba(255,215,0,0.45)",
//               animation: "popIn 0.45s cubic-bezier(0.34,1.56,0.64,1)",
//               background: "#fff",
//             }}
//           >
//             {/* Close ✕ */}
//             <button
//               onClick={() => setShowEid(false)}
//               style={{
//                 position: "absolute",
//                 top: 10,
//                 right: 10,
//                 zIndex: 10,
//                 background: "rgba(0,0,0,0.50)",
//                 border: "1.5px solid rgba(255,255,255,0.55)",
//                 borderRadius: "50%",
//                 width: 32,
//                 height: 32,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//                 color: "#fff",
//                 fontSize: 16,
//                 fontWeight: 800,
//                 lineHeight: 1,
//                 transition: "background 0.2s",
//               }}
//               onMouseEnter={(e) =>
//                 (e.currentTarget.style.background = "rgba(0,0,0,0.75)")
//               }
//               onMouseLeave={(e) =>
//                 (e.currentTarget.style.background = "rgba(0,0,0,0.50)")
//               }
//               aria-label="Close"
//             >
//               ✕
//             </button>

//             {/* ── Full Eid poster image ── */}
//             <img
//               src="data:image/png;base64,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"
//               alt="ঈদ মোবারক"
//               style={{
//                 display: "block",
//                 width: "100%",
//                 height: "auto",
//                 objectFit: "cover",
//               }}
//             />

//             {/* ── Red Cherry wish section ── */}
//             <div
//               style={{
//                 background: "linear-gradient(160deg,#004d73 0%,#0097b2 100%)",
//                 padding: "18px 20px 22px",
//                 textAlign: "center",
//               }}
//             >
//               {/* Logo + name row */}
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 10,
//                   marginBottom: 12,
//                 }}
//               >
//                 <img
//                   // src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAQABAADASIAAhEBAxEB/8QAHQABAQEAAgMBAQAAAAAAAAAAAAECBQYDBAcICf/EAFMQAAIBAwEFBAYFCAgDBgUEAwABAgMEEQUGEiExQVFhcYEHEyIykaEUQlKxwQgjM2JygqLRFUNTY5KywvAkc+EWJTQ1k9JEVYOjszZUZPGUpLT/xAAbAQEAAwEBAQEAAAAAAAAAAAAAAQIDBQQGB//EADcRAQACAgAEAggGAQQCAwEAAAABAgMRBBIhMUFRBRNhcaGx0fAiMoGRweFCFCMzUgYVQ1Pxcv/aAAwDAQACEQMRAD8A/GQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//2Q=="
//                   src="/logo.png"
//                   alt="Red Cherry"
//                   style={{
//                     width: 50,
//                     height: 50,
//                     borderRadius: "50%",
//                     objectFit: "cover",
//                     boxShadow: "0 4px 14px rgba(255,75,110,0.55)",
//                   }}
//                 />
//                 <div style={{ textAlign: "left" }}>
//                   <div
//                     style={{
//                       fontWeight: 900,
//                       fontSize: 12,
//                       color: "#fff",
//                       letterSpacing: "0.05em",
//                       fontFamily: "'Nunito',sans-serif",
//                     }}
//                   >
//                     <a href="https://biswabanglasocialnetworkingservices.com/">
//                       BISWA BANGA SOCIAL NETWORKING CLUB PRIVATE LIMITED
//                     </a>
//                   </div>
//                   <div
//                     style={{
//                       fontSize: 10,
//                       color: "rgba(255,255,255,0.65)",
//                       fontWeight: 600,
//                       letterSpacing: "0.08em",
//                     }}
//                   >
//                     BISWA BANGA SOCIAL NETWORKING CLUB PRIVATE LIMITED. Platform
//                   </div>
//                 </div>
//               </div>

//               {/* Bengali Eid wish */}
//               <p
//                 style={{
//                   fontSize: 16,
//                   fontWeight: 800,
//                   color: "#FFD700",
//                   marginBottom: 6,
//                   fontFamily: "'Noto Sans Bengali','Hind Siliguri',sans-serif",
//                   textShadow: "0 1px 8px rgba(0,0,0,0.4)",
//                 }}
//               >
//                 ঈদ মোবারক ২০২৬ 🌙
//               </p>

//               <p
//                 style={{
//                   fontSize: 13,
//                   color: "rgba(255,255,255,0.92)",
//                   lineHeight: 1.75,
//                   marginBottom: 16,
//                   fontFamily: "'Nunito',sans-serif",
//                   fontStyle: "italic",
//                 }}
//               >
//                 "আপনার ও আপনার পরিবারের জন্য রইল BISWA BANGA SOCIAL NETWORKING
//                 CLUB PRIVATE LIMITED.-র পক্ষ থেকে ঈদের আন্তরিক শুভেচ্ছা। May
//                 this blessed Eid bring joy, peace &amp; love to your home! 🌸"
//               </p>

//               {/* Enter button */}
//               <button
//                 onClick={() => setShowEid(false)}
//                 style={{
//                   padding: "11px 34px",
//                   background: "linear-gradient(135deg,#FF4B6E,#FF1744)",
//                   border: "none",
//                   borderRadius: 50,
//                   color: "#fff",
//                   fontWeight: 800,
//                   fontSize: 13,
//                   cursor: "pointer",
//                   boxShadow: "0 6px 22px rgba(255,75,110,0.5)",
//                   fontFamily: "'Nunito',sans-serif",
//                   letterSpacing: "0.04em",
//                   transition: "opacity 0.2s, transform 0.1s",
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
//                 onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
//                 onMouseDown={(e) =>
//                   (e.currentTarget.style.transform = "scale(0.97)")
//                 }
//                 onMouseUp={(e) =>
//                   (e.currentTarget.style.transform = "scale(1)")
//                 }
//               >
//                 🚀 &nbsp; Enter Red Cheery
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes floatUp { from { transform:translateY(0px) rotate(0deg); } to { transform:translateY(-22px) rotate(12deg); } }
//         @keyframes fadeInOverlay { from { opacity:0; } to { opacity:1; } }
//         @keyframes popIn { from { opacity:0; transform:scale(0.7) translateY(30px); } to { opacity:1; transform:scale(1) translateY(0); } }
//         .logo-wrap { transition:transform 0.25s ease,filter 0.25s ease !important; }
//         .logo-wrap:hover { transform:scale(1.08) translateY(-3px) !important; filter:drop-shadow(0 0 12px rgba(255,75,110,0.7)) !important; }

//         /* Eid modal scrollbar — image blue/teal + gold theme */
//         .eid-modal::-webkit-scrollbar { width: 5px; }
//         .eid-modal::-webkit-scrollbar-track { background: #004d73; border-radius: 99px; }
//         .eid-modal::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#0097b2,#FFD700); border-radius: 99px; }
//         .eid-modal::-webkit-scrollbar-thumb:hover { background: #FFD700; }
//       `}</style>
//     </div>
//   );
// }

//v2
