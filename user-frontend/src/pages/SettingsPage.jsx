// // src/pages/SettingsPage.jsx
// // User frontend Settings page with Legal & Policies section

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// // ── Legal Page Components ──────────────────────────────────────────────────────

// function LegalPageLayout({ title, children, onBack }) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
//       <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
//           <button
//             onClick={onBack}
//             className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//             <span className="text-sm font-medium">Back</span>
//           </button>
//         </div>
//       </div>
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-20">
//         <div className="text-center mb-8 sm:mb-12">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
//             {title}
//           </h1>
//           <div className="mt-6 w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
//         </div>
//         <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl space-y-8">
//           {children}
//         </div>
//         <div className="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
//           <div className="flex items-start gap-3">
//             <div className="text-2xl">⚠️</div>
//             <div>
//               <h3 className="text-lg font-bold text-red-400 mb-2">
//                 Age Restriction Notice
//               </h3>
//               <p className="text-gray-300 text-sm">
//                 This platform is strictly for users{" "}
//                 <strong>18 years of age or older</strong>. Children and minors
//                 are prohibited from using this service.
//               </p>
//             </div>
//           </div>
//         </div>
//         <LegalContactInfo />
//       </div>
//     </div>
//   );
// }

// function LegalSection({ title, children }) {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-gray-700 pb-2">
//         {title}
//       </h2>
//       <div className="space-y-4 text-gray-300">{children}</div>
//     </div>
//   );
// }

// function LegalContactInfo() {
//   return (
//     <div className="mt-8 p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
//       <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
//       <div className="space-y-2 text-sm text-gray-300">
//         <p>
//           <strong>Biswa Bangla Social Networking Club</strong>
//         </p>
//         <p>📍 Building No. Unit No- 11/W/2, Room 2</p>
//         <p className="ml-4">Road Street – Action Area II/04, Street No. 373</p>
//         <p className="ml-4">Manicasadona, Newtown</p>
//         <p className="ml-4">Kolkata, West Bengal – 700161</p>
//         <div className="pt-3 space-y-1">
//           <p>
//             📧{" "}
//             <a
//               href="mailto:customercare@biswabanglasocialnetworkingservices.com"
//               className="text-cyan-400 hover:text-cyan-300 underline"
//             >
//               customercare@biswabanglasocialnetworkingservices.com
//             </a>
//           </p>
//           <p>
//             📧{" "}
//             <a
//               href="mailto:customercarebiswabanglasocialn@gmail.com"
//               className="text-cyan-400 hover:text-cyan-300 underline"
//             >
//               customercarebiswabanglasocialn@gmail.com
//             </a>
//           </p>
//           <p>
//             📞{" "}
//             <a
//               href="tel:8240210845"
//               className="text-cyan-400 hover:text-cyan-300"
//             >
//               8240210845
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Privacy Policy Page ────────────────────────────────────────────────────────
// function PrivacyPolicyPage({ onBack }) {
//   function SubSection({ title, children }) {
//     return (
//       <div className="mt-4">
//         <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
//         <div className="text-gray-300">{children}</div>
//       </div>
//     );
//   }
//   return (
//     <LegalPageLayout title="Privacy Policy & Refund Policy" onBack={onBack}>
//       <LegalSection title="1. Introduction">
//         <p>
//           Biswa Bangla Social Networking Services ("we", "our", "us", or "the
//           Platform") respects the privacy of its users and is committed to
//           protecting their personal information. This Privacy Policy explains
//           how we collect, use, store, share, and protect user data when you
//           access or use our social networking and online friendship services.
//         </p>
//         <p>
//           By accessing or using our website, mobile application, or related
//           services, you agree to the terms of this Privacy Policy.
//         </p>
//       </LegalSection>
//       <LegalSection title="2. Eligibility (18+ Only)">
//         <p>
//           Our services are strictly intended for individuals who are{" "}
//           <strong>18 years of age or older</strong>.
//         </p>
//         <p>By registering or using the Platform, you confirm that:</p>
//         <ul className="list-disc pl-6 space-y-2 mt-2">
//           <li>You are at least 18 years old</li>
//           <li>You have the legal capacity to enter into this agreement</li>
//         </ul>
//         <p className="mt-3 text-yellow-400">
//           ⚠️ We do not knowingly collect data from minors. Accounts found to
//           belong to users under 18 may be suspended or permanently deleted.
//         </p>
//       </LegalSection>
//       <LegalSection title="3. Information We Collect">
//         <SubSection title="a) Personal Information">
//           <ul className="list-disc pl-6 space-y-1">
//             <li>Name or nickname</li>
//             <li>Date of birth / age confirmation</li>
//             <li>Gender</li>
//             <li>Email address</li>
//             <li>Phone number</li>
//             <li>Profile photographs</li>
//             <li>Location (city/state)</li>
//           </ul>
//         </SubSection>
//         <SubSection title="b) Account & Usage Information">
//           <ul className="list-disc pl-6 space-y-1">
//             <li>Login details</li>
//             <li>Messages, chats, and interactions (subject to law)</li>
//             <li>Preferences and interests</li>
//             <li>
//               Device information (IP address, browser type, operating system)
//             </li>
//           </ul>
//         </SubSection>
//         <SubSection title="c) Automatically Collected Information">
//           <ul className="list-disc pl-6 space-y-1">
//             <li>Cookies and similar tracking technologies</li>
//             <li>Log files</li>
//             <li>App or website usage statistics</li>
//           </ul>
//         </SubSection>
//       </LegalSection>
//       <LegalSection title="4. Purpose of Data Collection">
//         <p>We use your information to:</p>
//         <ul className="list-disc pl-6 space-y-2 mt-2">
//           <li>Create and manage user accounts</li>
//           <li>Provide social networking and friendship features</li>
//           <li>Enable communication between users</li>
//           <li>Improve platform functionality and user experience</li>
//           <li>Ensure safety, security, and fraud prevention</li>
//           <li>Comply with legal and regulatory requirements</li>
//           <li>Respond to customer support queries</li>
//         </ul>
//       </LegalSection>
//       <LegalSection title="5. Sharing of Information">
//         <p>
//           <strong>
//             We do not sell or rent personal data to third parties.
//           </strong>
//         </p>
//         <p>Information may be shared only:</p>
//         <ul className="list-disc pl-6 space-y-2 mt-2">
//           <li>With service providers (hosting, payment, technical support)</li>
//           <li>When required by law, court order, or government authority</li>
//           <li>To protect our legal rights, safety, and platform integrity</li>
//           <li>With user consent</li>
//         </ul>
//       </LegalSection>
//       <LegalSection title="6. User Rights">
//         <p>You have the right to:</p>
//         <ul className="list-disc pl-6 space-y-2 mt-2">
//           <li>Access your personal data</li>
//           <li>Update or correct information</li>
//           <li>Request deletion of your account</li>
//           <li>Withdraw consent (where applicable)</li>
//         </ul>
//         <p className="mt-3">
//           Requests can be made by contacting us at the email addresses below.
//         </p>
//       </LegalSection>
//     </LegalPageLayout>
//   );
// }

// // ── Terms & Conditions Page ────────────────────────────────────────────────────
// function TermsConditionsPage({ onBack }) {
//   function Divider() {
//     return (
//       <div className="my-8">
//         <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
//       </div>
//     );
//   }
//   return (
//     <LegalPageLayout
//       title="Terms & Conditions And Refund Policy"
//       onBack={onBack}
//     >
//       <LegalSection title="1. Acceptance of Terms">
//         <p>
//           By accessing or using Biswa Bangla Social Networking Services ("the
//           Platform", "we", "us", "our"), you agree to comply with and be bound
//           by these Terms & Conditions.
//         </p>
//         <p className="text-yellow-400">
//           If you do not agree, please do not use our services.
//         </p>
//       </LegalSection>
//       <LegalSection title="2. Eligibility (18+ Only)">
//         <ul className="list-disc pl-6 space-y-2">
//           <li>
//             This Platform is strictly for individuals aged{" "}
//             <strong className="text-cyan-400">18 years or above</strong>.
//           </li>
//           <li>
//             By registering, you confirm that you are legally eligible to use the
//             service.
//           </li>
//           <li>
//             Accounts found to belong to users under 18 will be terminated
//             without notice.
//           </li>
//         </ul>
//       </LegalSection>
//       <LegalSection title="3. Nature of Service">
//         <ul className="list-disc pl-6 space-y-2">
//           <li>
//             The Platform provides social networking and online friendship
//             services.
//           </li>
//           <li>
//             We do not guarantee friendships, relationships, or personal
//             outcomes.
//           </li>
//           <li>
//             All interactions are voluntary and at the user's own discretion and
//             risk.
//           </li>
//         </ul>
//       </LegalSection>
//       <LegalSection title="4. User Responsibilities">
//         <p>Users agree:</p>
//         <ul className="list-disc pl-6 space-y-2 mt-2">
//           <li>To provide accurate and truthful information</li>
//           <li>Not to impersonate others</li>
//           <li>
//             Not to upload or share illegal, obscene, abusive, threatening,
//             misleading, or harmful content
//           </li>
//           <li>Not to harass, exploit, or scam other users</li>
//           <li>
//             Not to misuse the platform for commercial, illegal, or fraudulent
//             purposes
//           </li>
//         </ul>
//         <p className="mt-3 text-red-400">
//           ⚠️ Violation of these rules may result in account suspension or
//           permanent termination.
//         </p>
//       </LegalSection>
//       <LegalSection title="5. Limitation of Liability">
//         <ul className="list-disc pl-6 space-y-2">
//           <li>
//             We are not responsible for user behavior, communications, or offline
//             meetings.
//           </li>
//           <li>We do not guarantee uninterrupted, error-free service.</li>
//           <li>Use of the platform is at your own risk.</li>
//         </ul>
//       </LegalSection>
//       <Divider />
//       <h2 className="text-3xl font-bold text-cyan-400 text-center mb-6">
//         Refund Policy
//       </h2>
//       <LegalSection title="1. General Policy">
//         <p className="text-lg">
//           All payments made on the Platform are{" "}
//           <strong className="text-yellow-400">non-refundable</strong>, except
//           where required by law or explicitly stated otherwise.
//         </p>
//       </LegalSection>
//       <LegalSection title="2. No Refund Situations">
//         <p>Refunds will not be provided for:</p>
//         <ul className="list-disc pl-6 space-y-2 mt-2">
//           <li>Change of mind after purchase</li>
//           <li>Inactivity or lack of usage</li>
//           <li>Account suspension or termination due to policy violations</li>
//           <li>Dissatisfaction with matches, friendships, or interactions</li>
//           <li>Failure to read Terms & Conditions before purchase</li>
//         </ul>
//       </LegalSection>
//       <LegalSection title="3. Technical Errors">
//         <p>Refunds may be considered only if:</p>
//         <ul className="list-disc pl-6 space-y-2 mt-2">
//           <li>
//             A payment was deducted but the service was not activated due to a
//             technical error
//           </li>
//           <li>The issue is reported within 48 hours of the transaction</li>
//           <li>Proof of payment is provided</li>
//         </ul>
//         <p className="mt-3 text-gray-400">
//           Approval of such refunds is at the sole discretion of management.
//         </p>
//       </LegalSection>
//       <LegalSection title="4. Refund Processing">
//         <p>If approved:</p>
//         <ul className="list-disc pl-6 space-y-2 mt-2">
//           <li>Refunds will be processed to the original payment method</li>
//           <li>Processing time may take 7–10 business days</li>
//         </ul>
//       </LegalSection>
//     </LegalPageLayout>
//   );
// }

// // ── Shipping/Delivery Policy Page ─────────────────────────────────────────────
// function ShippingPolicyPage({ onBack }) {
//   return (
//     <LegalPageLayout
//       title="Delivery, Cancellation & Refund Policy"
//       onBack={onBack}
//     >
//       <div className="bg-blue-500/10 border-2 border-blue-500/50 rounded-xl p-8 text-center mb-8">
//         <div className="text-6xl mb-4">💻</div>
//         <h2 className="text-3xl font-bold text-blue-400 mb-4">
//           Digital-Only Platform
//         </h2>
//         <p className="text-xl text-gray-200 leading-relaxed">
//           Biswa Bangla Social Networking Services is a{" "}
//           <strong>digital-only platform</strong>.
//         </p>
//       </div>
//       <LegalSection title="No Physical Products">
//         <ul className="list-disc pl-6 space-y-2">
//           <li>
//             We do <strong>not</strong> sell, ship, or deliver any physical
//             products
//           </li>
//           <li>
//             There is <strong>no shipping policy</strong>, as no physical goods
//             are offered or dispatched
//           </li>
//           <li>All services provided are online and virtual in nature only</li>
//         </ul>
//       </LegalSection>
//       <LegalSection title="Service Delivery">
//         <p>
//           All features, subscriptions, and services are delivered instantly
//           through our online platform.
//         </p>
//         <ul className="list-disc pl-6 space-y-2 mt-2">
//           <li>✅ Instant access after payment</li>
//           <li>✅ No waiting for physical delivery</li>
//           <li>✅ Available 24/7 online</li>
//         </ul>
//       </LegalSection>
//       <LegalSection title="Refund Policy">
//         <p className="mb-3">
//           <strong>All payments made on the Platform are non-refundable</strong>,
//           except where required by law or explicitly stated otherwise.
//         </p>
//         <h3 className="text-xl font-semibold text-white mb-2 mt-4">
//           No Refund Situations
//         </h3>
//         <ul className="list-disc pl-6 space-y-2">
//           <li>Change of mind after purchase</li>
//           <li>Inactivity or lack of usage</li>
//           <li>Account suspension or termination due to policy violations</li>
//           <li>Dissatisfaction with matches, friendships, or interactions</li>
//         </ul>
//         <h3 className="text-xl font-semibold text-white mb-2 mt-4">
//           Technical Errors
//         </h3>
//         <p>
//           Refunds may be considered only if a payment was deducted but the
//           service was not activated due to a technical error. The issue must be
//           reported within 48 hours of the transaction.
//         </p>
//       </LegalSection>
//       <LegalSection title="Cancellation Policy">
//         <p>Users may cancel their subscription at any time. However:</p>
//         <ul className="list-disc pl-6 space-y-2 mt-2">
//           <li>
//             No refunds will be provided for unused portions of subscriptions
//           </li>
//           <li>
//             Cancellation takes effect at the end of the current billing period
//           </li>
//           <li>Access to premium features continues until the period ends</li>
//         </ul>
//       </LegalSection>
//     </LegalPageLayout>
//   );
// }

// // ── Community Guidelines Page ──────────────────────────────────────────────────
// function CommunityGuidelinesPage({ onBack }) {
//   return (
//     <LegalPageLayout title="Community Guidelines" onBack={onBack}>
//       <LegalSection title="1. Age Requirement">
//         <p>
//           Biswa Bangla Social Networking Services is strictly intended only for
//           individuals who are{" "}
//           <strong className="text-cyan-400">18 years of age or older</strong>.
//         </p>
//         <p className="mt-3">
//           By accessing or using this platform, users confirm that they meet the
//           minimum age requirement.
//         </p>
//       </LegalSection>
//       <LegalSection title="2. Responsible Use">
//         <p className="mb-3">Users are expected to:</p>
//         <ul className="list-disc pl-6 space-y-2">
//           <li>Use the platform respectfully and lawfully</li>
//           <li>
//             Avoid harassment, abuse, hate speech, or inappropriate behavior
//           </li>
//           <li>
//             Share accurate information and refrain from misleading or fraudulent
//             activity
//           </li>
//           <li>Respect the privacy and consent of other members</li>
//           <li>Treat all users with dignity and courtesy</li>
//           <li>Report any suspicious or harmful behavior immediately</li>
//         </ul>
//       </LegalSection>
//       <LegalSection title="3. Prohibited Activities">
//         <p className="mb-3 text-yellow-400">
//           ⚠️ The following activities are strictly not allowed:
//         </p>
//         <ul className="list-disc pl-6 space-y-2">
//           <li>Use of the service by anyone under 18 years of age</li>
//           <li>Posting or sharing illegal, obscene, or offensive content</li>
//           <li>Impersonation, scams, or misuse of personal information</li>
//           <li>Any activity that violates applicable laws or regulations</li>
//           <li>Harassment, bullying, or threatening behavior</li>
//           <li>Sharing explicit adult content or nudity</li>
//           <li>Spam, commercial solicitation, or advertising</li>
//           <li>Attempting to hack or compromise platform security</li>
//         </ul>
//         <p className="mt-3 text-red-400">
//           ⚠️ Violation of these rules may result in immediate account suspension
//           or permanent termination.
//         </p>
//       </LegalSection>
//       <LegalSection title="4. Account Responsibility">
//         <p>
//           Each user is responsible for maintaining the confidentiality of their
//           account details and for all activities conducted through their
//           account.
//         </p>
//         <ul className="list-disc pl-6 space-y-2 mt-3">
//           <li>Keep your password secure and do not share it with others</li>
//           <li>
//             Report any unauthorized access immediately to our support team
//           </li>
//           <li>Do not create multiple accounts or use fake identities</li>
//         </ul>
//       </LegalSection>
//       <LegalSection title="5. Safety & Privacy">
//         <ul className="list-disc pl-6 space-y-2">
//           <li>
//             <strong>Never share:</strong> OTP codes, passwords, bank details, or
//             credit card information
//           </li>
//           <li>Be cautious when sharing personal information</li>
//           <li>Report suspicious users or behavior immediately</li>
//         </ul>
//       </LegalSection>
//       <LegalSection title="6. Reporting & Support">
//         <p>
//           For any queries, concerns, or complaints, users may contact customer
//           support using the contact details provided below.
//         </p>
//         <p className="mt-3">
//           If you encounter inappropriate behavior, use the{" "}
//           <strong className="text-cyan-400">Report</strong> feature or contact
//           us immediately.
//         </p>
//       </LegalSection>
//       <LegalSection title="7. Enforcement">
//         <p>We reserve the right to:</p>
//         <ul className="list-disc pl-6 space-y-2 mt-3">
//           <li>Remove any content that violates these guidelines</li>
//           <li>Suspend or terminate accounts that breach our policies</li>
//           <li>Report illegal activity to law enforcement</li>
//           <li>Take legal action when necessary</li>
//         </ul>
//       </LegalSection>
//     </LegalPageLayout>
//   );
// }

// // ── Children and Minors Page ───────────────────────────────────────────────────
// function ChildrenMinorsPage({ onBack }) {
//   return (
//     <LegalPageLayout title="Children and Minors Prohibited" onBack={onBack}>
//       <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-8 text-center mb-8">
//         <div className="text-6xl mb-4">🚫</div>
//         <h2 className="text-3xl font-bold text-red-400 mb-4">
//           STRICTLY 18+ ONLY
//         </h2>
//         <p className="text-xl text-gray-200 leading-relaxed">
//           Children and minors are <strong>strictly prohibited</strong> from
//           using Biswa Bangla Social Networking Services and the online
//           friendship website.
//         </p>
//       </div>
//       <LegalSection title="Age Verification">
//         <p>
//           This platform is intended only for individuals who are{" "}
//           <strong className="text-cyan-400">18 years of age or older</strong>.
//         </p>
//         <p className="mt-3">
//           By accessing or using this service, users confirm that they are at
//           least 18 years old.
//         </p>
//         <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
//           <p className="text-yellow-300">
//             ⚠️ <strong>Important:</strong> This is a legal requirement and
//             violation may result in legal consequences.
//           </p>
//         </div>
//       </LegalSection>
//       <LegalSection title="Account Termination">
//         <p className="text-yellow-400 mb-3">
//           ⚠️ Any account found to be operated by a minor may be{" "}
//           <strong>suspended or terminated without notice</strong>.
//         </p>
//         <ul className="list-disc pl-6 space-y-2 mt-3">
//           <li>The account will be immediately suspended</li>
//           <li>All account data will be deleted</li>
//           <li>No refunds will be provided for any paid services</li>
//           <li>The matter may be reported to appropriate authorities</li>
//         </ul>
//       </LegalSection>
//       <LegalSection title="Legal Compliance">
//         <p className="mb-3">This policy is in compliance with:</p>
//         <ul className="list-disc pl-6 space-y-2">
//           <li>
//             <strong>Information Technology Act, 2000</strong>
//           </li>
//           <li>
//             <strong>
//               Protection of Children from Sexual Offences (POCSO) Act, 2012
//             </strong>
//           </li>
//           <li>
//             <strong>Indian Child Safety Regulations</strong>
//           </li>
//           <li>
//             <strong>Digital Personal Data Protection Act</strong>
//           </li>
//         </ul>
//       </LegalSection>
//       <LegalSection title="Reporting Underage Users">
//         <p className="mb-3">
//           If you suspect a user is under 18 years old, please report it
//           immediately:
//         </p>
//         <ul className="list-disc pl-6 space-y-2">
//           <li>Use the in-app reporting feature</li>
//           <li>Contact our support team with details</li>
//           <li>
//             Email us at:{" "}
//             <a
//               href="mailto:customercare@biswabanglasocialnetworkingservices.com"
//               className="text-cyan-400 hover:text-cyan-300 underline"
//             >
//               customercare@biswabanglasocialnetworkingservices.com
//             </a>
//           </li>
//         </ul>
//       </LegalSection>
//       <div className="mt-8 p-6 bg-red-500/20 border-2 border-red-500/50 rounded-xl">
//         <div className="flex items-start gap-3">
//           <div className="text-3xl">⛔</div>
//           <div>
//             <h3 className="text-xl font-bold text-red-300 mb-2">
//               Zero Tolerance Policy
//             </h3>
//             <p className="text-gray-200 text-sm leading-relaxed">
//               We have a <strong>zero-tolerance policy</strong> for underage
//               usage. Any attempt to circumvent age verification or misrepresent
//               age will result in immediate account termination and may be
//               reported to authorities.
//             </p>
//           </div>
//         </div>
//       </div>
//     </LegalPageLayout>
//   );
// }

// // ── Contact Us Page ────────────────────────────────────────────────────────────
// function ContactUsPage({ onBack }) {
//   return (
//     <LegalPageLayout title="Contact Us" onBack={onBack}>
//       <div className="bg-cyan-500/10 border-2 border-cyan-500/50 rounded-xl p-8 text-center mb-8">
//         <div className="text-6xl mb-4">📧</div>
//         <h2 className="text-3xl font-bold text-cyan-400 mb-4">Get In Touch</h2>
//         <p className="text-xl text-gray-200 leading-relaxed">
//           Biswa Bangla Social Networking Services is an online friendship and
//           social networking platform strictly for users aged{" "}
//           <strong>18 years and above</strong>.
//         </p>
//       </div>
//       <LegalSection title="Contact Information">
//         <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
//           <h3 className="text-2xl font-bold text-white mb-4">
//             Biswa Bangla Social Networking Club
//           </h3>
//           <div className="space-y-4 text-gray-300">
//             <div>
//               <p className="text-cyan-400 font-semibold mb-2">
//                 📍 Registered Address:
//               </p>
//               <p>Building No. Unit No- 11/W/2, Room 2</p>
//               <p>Road Street – Action Area II/04</p>
//               <p>Street No. 373, Manicasadona</p>
//               <p>Newtown, Kolkata</p>
//               <p>
//                 <strong>West Bengal – 700161</strong>
//               </p>
//             </div>
//             <div>
//               <p className="text-cyan-400 font-semibold mb-2">
//                 📧 Email Support:
//               </p>
//               <p>
//                 <a
//                   href="mailto:care@biswabanglasocialnetworkingservices.com"
//                   className="hover:text-cyan-300 underline"
//                 >
//                   care@biswabanglasocialnetworkingservices.com
//                 </a>
//               </p>
//               <p>
//                 <a
//                   href="mailto:customercare@biswabanglasocialnetworkingservices.com"
//                   className="hover:text-cyan-300 underline"
//                 >
//                   customercare@biswabanglasocialnetworkingservices.com
//                 </a>
//               </p>
//               <p>
//                 <a
//                   href="mailto:customercarebiswabanglasocialn@gmail.com"
//                   className="hover:text-cyan-300 underline"
//                 >
//                   customercarebiswabanglasocialn@gmail.com
//                 </a>
//               </p>
//             </div>
//             <div>
//               <p className="text-cyan-400 font-semibold mb-2">
//                 📞 Customer Care:
//               </p>
//               <p className="text-2xl font-bold">
//                 <a href="tel:8240210845" className="hover:text-cyan-300">
//                   8240210845
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>
//       </LegalSection>
//       <LegalSection title="Customer Support Hours">
//         <p>Our customer support team is available:</p>
//         <ul className="list-disc pl-6 space-y-2 mt-2">
//           <li>
//             <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM IST
//           </li>
//           <li>
//             <strong>Saturday:</strong> 10:00 AM - 4:00 PM IST
//           </li>
//           <li>
//             <strong>Sunday:</strong> Closed
//           </li>
//         </ul>
//         <p className="mt-3 text-gray-400">
//           For urgent queries, please email us and we'll respond within 24-48
//           hours.
//         </p>
//       </LegalSection>
//     </LegalPageLayout>
//   );
// }

// // ── Delete Account Confirmation Modal ─────────────────────────────────────────
// function DeleteAccountModal({ onConfirm, onCancel, loading }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
//       <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
//         <div className="text-center mb-4">
//           <div className="text-5xl mb-3">⚠️</div>
//           <h2 className="text-xl font-bold text-gray-900 mb-2">
//             Delete Account?
//           </h2>
//           <p className="text-gray-500 text-sm leading-relaxed">
//             This action is <strong>permanent and irreversible</strong>. All your
//             data, wallet balance, and history will be permanently deleted.
//           </p>
//         </div>
//         <div className="flex flex-col gap-3 mt-6">
//           <button
//             onClick={onConfirm}
//             disabled={loading}
//             style={{ background: "#e8334a" }}
//             className="w-full py-3 rounded-xl text-white font-bold text-sm disabled:opacity-60"
//           >
//             {loading ? "Deleting…" : "Yes, Delete My Account"}
//           </button>
//           <button
//             onClick={onCancel}
//             disabled={loading}
//             className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Main Settings Page ─────────────────────────────────────────────────────────
// export default function SettingsPage() {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const [activePage, setActivePage] = useState(null); // which legal page is open
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleting, setDeleting] = useState(false);

//   const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   const handleDeleteAccount = async () => {
//     setDeleting(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_BASE}/api/auth/delete-account`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         await logout();
//         navigate("/signin", { replace: true });
//       } else {
//         alert("Failed to delete account. Please try again or contact support.");
//       }
//     } catch {
//       alert("Network error. Please try again.");
//     } finally {
//       setDeleting(false);
//       setShowDeleteModal(false);
//     }
//   };

//   // Render a legal sub-page if one is active
//   const handleBack = () => setActivePage(null);
//   if (activePage === "privacy")
//     return <PrivacyPolicyPage onBack={handleBack} />;
//   if (activePage === "terms")
//     return <TermsConditionsPage onBack={handleBack} />;
//   if (activePage === "shipping")
//     return <ShippingPolicyPage onBack={handleBack} />;
//   if (activePage === "community")
//     return <CommunityGuidelinesPage onBack={handleBack} />;
//   if (activePage === "children")
//     return <ChildrenMinorsPage onBack={handleBack} />;
//   if (activePage === "contact") return <ContactUsPage onBack={handleBack} />;

//   const legalItems = [
//     { key: "privacy", icon: "🔒", label: "Privacy Policy" },
//     { key: "terms", icon: "📋", label: "Terms & Conditions" },
//     { key: "shipping", icon: "📦", label: "Delivery, Cancellation & Refund" },
//     { key: "community", icon: "👥", label: "Community Guidelines" },
//     { key: "children", icon: "🚫", label: "Children and Minors Prohibited" },
//     { key: "contact", icon: "💬", label: "Contact Us" },
//   ];

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
//         *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
//         .sett-page{min-height:100vh;background:#fdf5f8;font-family:'Nunito',sans-serif;display:flex;justify-content:center;padding-bottom:24px}
//         .sett-wrap{width:100%;max-width:520px;display:flex;flex-direction:column}
//         .sett-hdr{background:linear-gradient(135deg,#f9c846 0%,#f9a050 40%,#f47eb0 100%);position:relative;display:flex;align-items:center;padding:48px 16px 20px;gap:12px}
//         .sett-back{background:rgba(255,255,255,0.25);border:none;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}
//         .sett-htitle{color:#fff;font-family:'Playfair Display',serif;font-weight:800;font-size:clamp(20px,5vw,26px)}
//         .sett-logo{display:flex;flex-direction:column;align-items:center;padding:24px 16px 8px;gap:10px}
//         .sett-logoimg{width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid #f9c846;box-shadow:0 4px 16px rgba(249,200,70,0.3)}
//         .sett-logofallback{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#f9c846,#f47eb0);display:flex;align-items:center;justify-content:center;font-size:32px;border:3px solid #f9c846;box-shadow:0 4px 16px rgba(249,200,70,0.3)}
//         .sett-section-label{font-size:13px;font-weight:800;color:#f47eb0;text-transform:uppercase;letter-spacing:0.08em;padding:16px 16px 8px}
//         .sett-card{background:#fff;border-radius:16px;margin:0 12px;overflow:hidden;box-shadow:0 2px 12px rgba(244,126,176,0.08)}
//         .sett-row{width:100%;display:flex;align-items:center;gap:14px;padding:14px 16px;background:none;border:none;cursor:pointer;text-align:left;font-family:'Nunito',sans-serif;transition:background .15s}
//         .sett-row:hover{background:#fff5f8}
//         .sett-row-icon{width:40px;height:40px;border-radius:10px;background:#fce4ec;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
//         .sett-row-label{flex:1;font-size:clamp(13px,3.5vw,15px);font-weight:700;color:#1a1a1a}
//         .sett-chev{font-size:20px;color:#ddd}
//         .sett-rowdiv{height:1px;background:#fdf0f5;margin-left:70px}
//         .sett-delete{width:calc(100% - 24px);margin:12px 12px 0;padding:15px 0;border-radius:14px;border:none;background:linear-gradient(135deg,#e8334a,#c0112d);color:#fff;font-weight:900;font-size:clamp(14px,3.5vw,16px);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:'Nunito',sans-serif;box-shadow:0 4px 16px rgba(232,51,74,0.3);transition:opacity .2s}
//         .sett-delete:hover{opacity:0.9}
//         .sett-footer{text-align:center;font-size:clamp(10px,2vw,12px);color:#c0a0b0;padding:20px 16px;line-height:1.8}
//         @media(min-width:768px){
//           .sett-wrap{max-width:700px}
//           .sett-card{margin:0}
//           .sett-delete{width:100%;margin:12px 0 0}
//           .sett-section-label{padding:20px 0 8px}
//         }
//       `}</style>

//       {showDeleteModal && (
//         <DeleteAccountModal
//           onConfirm={handleDeleteAccount}
//           onCancel={() => setShowDeleteModal(false)}
//           loading={deleting}
//         />
//       )}

//       <div className="sett-page">
//         <div className="sett-wrap">
//           {/* Header */}
//           <div className="sett-hdr">
//             <button className="sett-back" onClick={() => navigate(-1)}>
//               <svg
//                 width="18"
//                 height="18"
//                 fill="none"
//                 stroke="#fff"
//                 strokeWidth="2.5"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//             </button>
//             <span className="sett-htitle">Settings</span>
//           </div>

//           {/* Logo */}
//           <div className="sett-logo">
//             <div className="sett-logofallback">🌐</div>
//           </div>

//           {/* Legal & Policies */}
//           <div className="sett-section-label">Legal & Policies</div>
//           <div className="sett-card">
//             {legalItems.map((item, i) => (
//               <div key={item.key}>
//                 <button
//                   className="sett-row"
//                   onClick={() => setActivePage(item.key)}
//                 >
//                   <div className="sett-row-icon">{item.icon}</div>
//                   <span className="sett-row-label">{item.label}</span>
//                   <span className="sett-chev">›</span>
//                 </button>
//                 {i < legalItems.length - 1 && <div className="sett-rowdiv" />}
//               </div>
//             ))}
//           </div>

//           {/* Account Actions */}
//           <div className="sett-section-label">Account Actions</div>
//           <button
//             className="sett-delete"
//             onClick={() => setShowDeleteModal(true)}
//           >
//             🗑️ Delete Account
//           </button>

//           <p className="sett-footer">
//             © 2026 Biswa Bangla Social Networking Club.
//             <br />
//             All rights reserved.
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }

//v2 ==///
// src/pages/SettingsPage.jsx
// User frontend Settings page with Legal & Policies section

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── Legal Page Components ──────────────────────────────────────────────────────

function LegalPageLayout({ title, children, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-20">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl space-y-8">
          {children}
        </div>
        <div className="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-2">
                Age Restriction Notice
              </h3>
              <p className="text-gray-300 text-sm">
                This platform is strictly for users{" "}
                <strong>18 years of age or older</strong>. Children and minors
                are prohibited from using this service.
              </p>
            </div>
          </div>
        </div>
        <LegalContactInfo />
      </div>
    </div>
  );
}

function LegalSection({ title, children }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-gray-700 pb-2">
        {title}
      </h2>
      <div className="space-y-4 text-gray-300">{children}</div>
    </div>
  );
}

function LegalContactInfo() {
  return (
    <div className="mt-8 p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
      <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
      <div className="space-y-2 text-sm text-gray-300">
        <p>
          <strong>Biswa Bangla Social Networking Club</strong>
        </p>
        <p>📍 Building No. Unit No- 11/W/2, Room 2</p>
        <p className="ml-4">Road Street – Action Area II/04, Street No. 373</p>
        <p className="ml-4">Manicasadona, Newtown</p>
        <p className="ml-4">Kolkata, West Bengal – 700161</p>
        <div className="pt-3 space-y-1">
          <p>
            📧{" "}
            <a
              href="mailto:customercare@biswabanglasocialnetworkingservices.com"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              customercare@biswabanglasocialnetworkingservices.com
            </a>
          </p>
          <p>
            📧{" "}
            <a
              href="mailto:customercarebiswabanglasocialn@gmail.com"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              customercarebiswabanglasocialn@gmail.com
            </a>
          </p>
          <p>
            📞{" "}
            <a
              href="tel:8240210845"
              className="text-cyan-400 hover:text-cyan-300"
            >
              8240210845
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Privacy Policy Page ────────────────────────────────────────────────────────
function PrivacyPolicyPage({ onBack }) {
  function SubSection({ title, children }) {
    return (
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <div className="text-gray-300">{children}</div>
      </div>
    );
  }
  return (
    <LegalPageLayout title="Privacy Policy & Refund Policy" onBack={onBack}>
      <LegalSection title="1. Introduction">
        <p>
          Biswa Bangla Social Networking Services ("we", "our", "us", or "the
          Platform") respects the privacy of its users and is committed to
          protecting their personal information. This Privacy Policy explains
          how we collect, use, store, share, and protect user data when you
          access or use our social networking and online friendship services.
        </p>
        <p>
          By accessing or using our website, mobile application, or related
          services, you agree to the terms of this Privacy Policy.
        </p>
      </LegalSection>
      <LegalSection title="2. Eligibility (18+ Only)">
        <p>
          Our services are strictly intended for individuals who are{" "}
          <strong>18 years of age or older</strong>.
        </p>
        <p>By registering or using the Platform, you confirm that:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>You are at least 18 years old</li>
          <li>You have the legal capacity to enter into this agreement</li>
        </ul>
        <p className="mt-3 text-yellow-400">
          ⚠️ We do not knowingly collect data from minors. Accounts found to
          belong to users under 18 may be suspended or permanently deleted.
        </p>
      </LegalSection>
      <LegalSection title="3. Information We Collect">
        <SubSection title="a) Personal Information">
          <ul className="list-disc pl-6 space-y-1">
            <li>Name or nickname</li>
            <li>Date of birth / age confirmation</li>
            <li>Gender</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Profile photographs</li>
            <li>Location (city/state)</li>
          </ul>
        </SubSection>
        <SubSection title="b) Account & Usage Information">
          <ul className="list-disc pl-6 space-y-1">
            <li>Login details</li>
            <li>Messages, chats, and interactions (subject to law)</li>
            <li>Preferences and interests</li>
            <li>
              Device information (IP address, browser type, operating system)
            </li>
          </ul>
        </SubSection>
        <SubSection title="c) Automatically Collected Information">
          <ul className="list-disc pl-6 space-y-1">
            <li>Cookies and similar tracking technologies</li>
            <li>Log files</li>
            <li>App or website usage statistics</li>
          </ul>
        </SubSection>
      </LegalSection>
      <LegalSection title="4. Purpose of Data Collection">
        <p>We use your information to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Create and manage user accounts</li>
          <li>Provide social networking and friendship features</li>
          <li>Enable communication between users</li>
          <li>Improve platform functionality and user experience</li>
          <li>Ensure safety, security, and fraud prevention</li>
          <li>Comply with legal and regulatory requirements</li>
          <li>Respond to customer support queries</li>
        </ul>
      </LegalSection>
      <LegalSection title="5. Sharing of Information">
        <p>
          <strong>
            We do not sell or rent personal data to third parties.
          </strong>
        </p>
        <p>Information may be shared only:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>With service providers (hosting, payment, technical support)</li>
          <li>When required by law, court order, or government authority</li>
          <li>To protect our legal rights, safety, and platform integrity</li>
          <li>With user consent</li>
        </ul>
      </LegalSection>
      <LegalSection title="6. User Rights">
        <p>You have the right to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Access your personal data</li>
          <li>Update or correct information</li>
          <li>Request deletion of your account</li>
          <li>Withdraw consent (where applicable)</li>
        </ul>
        <p className="mt-3">
          Requests can be made by contacting us at the email addresses below.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

// ── Terms & Conditions Page ────────────────────────────────────────────────────
function TermsConditionsPage({ onBack }) {
  function Divider() {
    return (
      <div className="my-8">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
      </div>
    );
  }
  return (
    <LegalPageLayout
      title="Terms & Conditions And Refund Policy"
      onBack={onBack}
    >
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing or using Biswa Bangla Social Networking Services ("the
          Platform", "we", "us", "our"), you agree to comply with and be bound
          by these Terms & Conditions.
        </p>
        <p className="text-yellow-400">
          If you do not agree, please do not use our services.
        </p>
      </LegalSection>
      <LegalSection title="2. Eligibility (18+ Only)">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            This Platform is strictly for individuals aged{" "}
            <strong className="text-cyan-400">18 years or above</strong>.
          </li>
          <li>
            By registering, you confirm that you are legally eligible to use the
            service.
          </li>
          <li>
            Accounts found to belong to users under 18 will be terminated
            without notice.
          </li>
        </ul>
      </LegalSection>
      <LegalSection title="3. Nature of Service">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            The Platform provides social networking and online friendship
            services.
          </li>
          <li>
            We do not guarantee friendships, relationships, or personal
            outcomes.
          </li>
          <li>
            All interactions are voluntary and at the user's own discretion and
            risk.
          </li>
        </ul>
      </LegalSection>
      <LegalSection title="4. User Responsibilities">
        <p>Users agree:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>To provide accurate and truthful information</li>
          <li>Not to impersonate others</li>
          <li>
            Not to upload or share illegal, obscene, abusive, threatening,
            misleading, or harmful content
          </li>
          <li>Not to harass, exploit, or scam other users</li>
          <li>
            Not to misuse the platform for commercial, illegal, or fraudulent
            purposes
          </li>
        </ul>
        <p className="mt-3 text-red-400">
          ⚠️ Violation of these rules may result in account suspension or
          permanent termination.
        </p>
      </LegalSection>
      <LegalSection title="5. Limitation of Liability">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            We are not responsible for user behavior, communications, or offline
            meetings.
          </li>
          <li>We do not guarantee uninterrupted, error-free service.</li>
          <li>Use of the platform is at your own risk.</li>
        </ul>
      </LegalSection>
      <Divider />
      <h2 className="text-3xl font-bold text-cyan-400 text-center mb-6">
        Refund Policy
      </h2>
      <LegalSection title="1. General Policy">
        <p className="text-lg">
          All payments made on the Platform are{" "}
          <strong className="text-yellow-400">non-refundable</strong>, except
          where required by law or explicitly stated otherwise.
        </p>
      </LegalSection>
      <LegalSection title="2. No Refund Situations">
        <p>Refunds will not be provided for:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Change of mind after purchase</li>
          <li>Inactivity or lack of usage</li>
          <li>Account suspension or termination due to policy violations</li>
          <li>Dissatisfaction with matches, friendships, or interactions</li>
          <li>Failure to read Terms & Conditions before purchase</li>
        </ul>
      </LegalSection>
      <LegalSection title="3. Technical Errors">
        <p>Refunds may be considered only if:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            A payment was deducted but the service was not activated due to a
            technical error
          </li>
          <li>The issue is reported within 48 hours of the transaction</li>
          <li>Proof of payment is provided</li>
        </ul>
        <p className="mt-3 text-gray-400">
          Approval of such refunds is at the sole discretion of management.
        </p>
      </LegalSection>
      <LegalSection title="4. Refund Processing">
        <p>If approved:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Refunds will be processed to the original payment method</li>
          <li>Processing time may take 7–10 business days</li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  );
}

// ── Shipping/Delivery Policy Page ─────────────────────────────────────────────
function ShippingPolicyPage({ onBack }) {
  return (
    <LegalPageLayout
      title="Delivery, Cancellation & Refund Policy"
      onBack={onBack}
    >
      <div className="bg-blue-500/10 border-2 border-blue-500/50 rounded-xl p-8 text-center mb-8">
        <div className="text-6xl mb-4">💻</div>
        <h2 className="text-3xl font-bold text-blue-400 mb-4">
          Digital-Only Platform
        </h2>
        <p className="text-xl text-gray-200 leading-relaxed">
          Biswa Bangla Social Networking Services is a{" "}
          <strong>digital-only platform</strong>.
        </p>
      </div>
      <LegalSection title="No Physical Products">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            We do <strong>not</strong> sell, ship, or deliver any physical
            products
          </li>
          <li>
            There is <strong>no shipping policy</strong>, as no physical goods
            are offered or dispatched
          </li>
          <li>All services provided are online and virtual in nature only</li>
        </ul>
      </LegalSection>
      <LegalSection title="Service Delivery">
        <p>
          All features, subscriptions, and services are delivered instantly
          through our online platform.
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>✅ Instant access after payment</li>
          <li>✅ No waiting for physical delivery</li>
          <li>✅ Available 24/7 online</li>
        </ul>
      </LegalSection>
      <LegalSection title="Refund Policy">
        <p className="mb-3">
          <strong>All payments made on the Platform are non-refundable</strong>,
          except where required by law or explicitly stated otherwise.
        </p>
        <h3 className="text-xl font-semibold text-white mb-2 mt-4">
          No Refund Situations
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Change of mind after purchase</li>
          <li>Inactivity or lack of usage</li>
          <li>Account suspension or termination due to policy violations</li>
          <li>Dissatisfaction with matches, friendships, or interactions</li>
        </ul>
        <h3 className="text-xl font-semibold text-white mb-2 mt-4">
          Technical Errors
        </h3>
        <p>
          Refunds may be considered only if a payment was deducted but the
          service was not activated due to a technical error. The issue must be
          reported within 48 hours of the transaction.
        </p>
      </LegalSection>
      <LegalSection title="Cancellation Policy">
        <p>Users may cancel their subscription at any time. However:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            No refunds will be provided for unused portions of subscriptions
          </li>
          <li>
            Cancellation takes effect at the end of the current billing period
          </li>
          <li>Access to premium features continues until the period ends</li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  );
}

// ── Community Guidelines Page ──────────────────────────────────────────────────
function CommunityGuidelinesPage({ onBack }) {
  return (
    <LegalPageLayout title="Community Guidelines" onBack={onBack}>
      <LegalSection title="1. Age Requirement">
        <p>
          Biswa Bangla Social Networking Services is strictly intended only for
          individuals who are{" "}
          <strong className="text-cyan-400">18 years of age or older</strong>.
        </p>
        <p className="mt-3">
          By accessing or using this platform, users confirm that they meet the
          minimum age requirement.
        </p>
      </LegalSection>
      <LegalSection title="2. Responsible Use">
        <p className="mb-3">Users are expected to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the platform respectfully and lawfully</li>
          <li>
            Avoid harassment, abuse, hate speech, or inappropriate behavior
          </li>
          <li>
            Share accurate information and refrain from misleading or fraudulent
            activity
          </li>
          <li>Respect the privacy and consent of other members</li>
          <li>Treat all users with dignity and courtesy</li>
          <li>Report any suspicious or harmful behavior immediately</li>
        </ul>
      </LegalSection>
      <LegalSection title="3. Prohibited Activities">
        <p className="mb-3 text-yellow-400">
          ⚠️ The following activities are strictly not allowed:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use of the service by anyone under 18 years of age</li>
          <li>Posting or sharing illegal, obscene, or offensive content</li>
          <li>Impersonation, scams, or misuse of personal information</li>
          <li>Any activity that violates applicable laws or regulations</li>
          <li>Harassment, bullying, or threatening behavior</li>
          <li>Sharing explicit adult content or nudity</li>
          <li>Spam, commercial solicitation, or advertising</li>
          <li>Attempting to hack or compromise platform security</li>
        </ul>
        <p className="mt-3 text-red-400">
          ⚠️ Violation of these rules may result in immediate account suspension
          or permanent termination.
        </p>
      </LegalSection>
      <LegalSection title="4. Account Responsibility">
        <p>
          Each user is responsible for maintaining the confidentiality of their
          account details and for all activities conducted through their
          account.
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>Keep your password secure and do not share it with others</li>
          <li>
            Report any unauthorized access immediately to our support team
          </li>
          <li>Do not create multiple accounts or use fake identities</li>
        </ul>
      </LegalSection>
      <LegalSection title="5. Safety & Privacy">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Never share:</strong> OTP codes, passwords, bank details, or
            credit card information
          </li>
          <li>Be cautious when sharing personal information</li>
          <li>Report suspicious users or behavior immediately</li>
        </ul>
      </LegalSection>
      <LegalSection title="6. Reporting & Support">
        <p>
          For any queries, concerns, or complaints, users may contact customer
          support using the contact details provided below.
        </p>
        <p className="mt-3">
          If you encounter inappropriate behavior, use the{" "}
          <strong className="text-cyan-400">Report</strong> feature or contact
          us immediately.
        </p>
      </LegalSection>
      <LegalSection title="7. Enforcement">
        <p>We reserve the right to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>Remove any content that violates these guidelines</li>
          <li>Suspend or terminate accounts that breach our policies</li>
          <li>Report illegal activity to law enforcement</li>
          <li>Take legal action when necessary</li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  );
}

// ── Children and Minors Page ───────────────────────────────────────────────────
function ChildrenMinorsPage({ onBack }) {
  return (
    <LegalPageLayout title="Children and Minors Prohibited" onBack={onBack}>
      <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-8 text-center mb-8">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-3xl font-bold text-red-400 mb-4">
          STRICTLY 18+ ONLY
        </h2>
        <p className="text-xl text-gray-200 leading-relaxed">
          Children and minors are <strong>strictly prohibited</strong> from
          using Biswa Bangla Social Networking Services and the online
          friendship website.
        </p>
      </div>
      <LegalSection title="Age Verification">
        <p>
          This platform is intended only for individuals who are{" "}
          <strong className="text-cyan-400">18 years of age or older</strong>.
        </p>
        <p className="mt-3">
          By accessing or using this service, users confirm that they are at
          least 18 years old.
        </p>
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-300">
            ⚠️ <strong>Important:</strong> This is a legal requirement and
            violation may result in legal consequences.
          </p>
        </div>
      </LegalSection>
      <LegalSection title="Account Termination">
        <p className="text-yellow-400 mb-3">
          ⚠️ Any account found to be operated by a minor may be{" "}
          <strong>suspended or terminated without notice</strong>.
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>The account will be immediately suspended</li>
          <li>All account data will be deleted</li>
          <li>No refunds will be provided for any paid services</li>
          <li>The matter may be reported to appropriate authorities</li>
        </ul>
      </LegalSection>
      <LegalSection title="Legal Compliance">
        <p className="mb-3">This policy is in compliance with:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Information Technology Act, 2000</strong>
          </li>
          <li>
            <strong>
              Protection of Children from Sexual Offences (POCSO) Act, 2012
            </strong>
          </li>
          <li>
            <strong>Indian Child Safety Regulations</strong>
          </li>
          <li>
            <strong>Digital Personal Data Protection Act</strong>
          </li>
        </ul>
      </LegalSection>
      <LegalSection title="Reporting Underage Users">
        <p className="mb-3">
          If you suspect a user is under 18 years old, please report it
          immediately:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the in-app reporting feature</li>
          <li>Contact our support team with details</li>
          <li>
            Email us at:{" "}
            <a
              href="mailto:customercare@biswabanglasocialnetworkingservices.com"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              customercare@biswabanglasocialnetworkingservices.com
            </a>
          </li>
        </ul>
      </LegalSection>
      <div className="mt-8 p-6 bg-red-500/20 border-2 border-red-500/50 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="text-3xl">⛔</div>
          <div>
            <h3 className="text-xl font-bold text-red-300 mb-2">
              Zero Tolerance Policy
            </h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              We have a <strong>zero-tolerance policy</strong> for underage
              usage. Any attempt to circumvent age verification or misrepresent
              age will result in immediate account termination and may be
              reported to authorities.
            </p>
          </div>
        </div>
      </div>
    </LegalPageLayout>
  );
}

// ── Contact Us Page ────────────────────────────────────────────────────────────
function ContactUsPage({ onBack }) {
  return (
    <LegalPageLayout title="Contact Us" onBack={onBack}>
      <div className="bg-cyan-500/10 border-2 border-cyan-500/50 rounded-xl p-8 text-center mb-8">
        <div className="text-6xl mb-4">📧</div>
        <h2 className="text-3xl font-bold text-cyan-400 mb-4">Get In Touch</h2>
        <p className="text-xl text-gray-200 leading-relaxed">
          Biswa Bangla Social Networking Services is an online friendship and
          social networking platform strictly for users aged{" "}
          <strong>18 years and above</strong>.
        </p>
      </div>
      <LegalSection title="Contact Information">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">
            Biswa Bangla Social Networking Club
          </h3>
          <div className="space-y-4 text-gray-300">
            <div>
              <p className="text-cyan-400 font-semibold mb-2">
                📍 Registered Address:
              </p>
              <p>Building No. Unit No- 11/W/2, Room 2</p>
              <p>Road Street – Action Area II/04</p>
              <p>Street No. 373, Manicasadona</p>
              <p>Newtown, Kolkata</p>
              <p>
                <strong>West Bengal – 700161</strong>
              </p>
            </div>
            <div>
              <p className="text-cyan-400 font-semibold mb-2">
                📧 Email Support:
              </p>
              <p>
                <a
                  href="mailto:care@biswabanglasocialnetworkingservices.com"
                  className="hover:text-cyan-300 underline"
                >
                  care@biswabanglasocialnetworkingservices.com
                </a>
              </p>
              <p>
                <a
                  href="mailto:customercare@biswabanglasocialnetworkingservices.com"
                  className="hover:text-cyan-300 underline"
                >
                  customercare@biswabanglasocialnetworkingservices.com
                </a>
              </p>
              <p>
                <a
                  href="mailto:customercarebiswabanglasocialn@gmail.com"
                  className="hover:text-cyan-300 underline"
                >
                  customercarebiswabanglasocialn@gmail.com
                </a>
              </p>
            </div>
            <div>
              <p className="text-cyan-400 font-semibold mb-2">
                📞 Customer Care:
              </p>
              <p className="text-2xl font-bold">
                <a href="tel:8240210845" className="hover:text-cyan-300">
                  8240210845
                </a>
              </p>
            </div>
          </div>
        </div>
      </LegalSection>
      <LegalSection title="Customer Support Hours">
        <p>Our customer support team is available:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM IST
          </li>
          <li>
            <strong>Saturday:</strong> 10:00 AM - 4:00 PM IST
          </li>
          <li>
            <strong>Sunday:</strong> Closed
          </li>
        </ul>
        <p className="mt-3 text-gray-400">
          For urgent queries, please email us and we'll respond within 24-48
          hours.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

// ── Delete Account Confirmation Modal ─────────────────────────────────────────
function DeleteAccountModal({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="text-center mb-4">
          <div className="text-5xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Delete Account?
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            This action is <strong>permanent and irreversible</strong>. All your
            data, wallet balance, and history will be permanently deleted.
          </p>
        </div>
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{ background: "#e8334a" }}
            className="w-full py-3 rounded-xl text-white font-bold text-sm disabled:opacity-60"
          >
            {loading ? "Deleting…" : "Yes, Delete My Account"}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Settings Page ─────────────────────────────────────────────────────────
export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activePage, setActivePage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "";

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("rc_token");
      const res = await fetch(`${API_BASE}/api/auth/delete-account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await logout();
        navigate("/signin", { replace: true });
      } else {
        alert("Failed to delete account. Please try again or contact support.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleBack = () => setActivePage(null);
  if (activePage === "privacy")
    return <PrivacyPolicyPage onBack={handleBack} />;
  if (activePage === "terms")
    return <TermsConditionsPage onBack={handleBack} />;
  if (activePage === "shipping")
    return <ShippingPolicyPage onBack={handleBack} />;
  if (activePage === "community")
    return <CommunityGuidelinesPage onBack={handleBack} />;
  if (activePage === "children")
    return <ChildrenMinorsPage onBack={handleBack} />;
  if (activePage === "contact") return <ContactUsPage onBack={handleBack} />;

  const legalItems = [
    { key: "privacy", icon: "🔒", label: "Privacy Policy" },
    { key: "terms", icon: "📋", label: "Terms & Conditions" },
    { key: "shipping", icon: "📦", label: "Delivery, Cancellation & Refund" },
    { key: "community", icon: "👥", label: "Community Guidelines" },
    { key: "children", icon: "🚫", label: "Children and Minors Prohibited" },
    { key: "contact", icon: "💬", label: "Contact Us" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        .sett-page{
          min-height:100vh;
          background:#fdf5f8;
          font-family:'Nunito',sans-serif;
          display:flex;
          justify-content:center;
          padding-bottom:24px;
        }
        .sett-wrap{
          width:100%;
          max-width:520px;
          display:flex;
          flex-direction:column;
        }

        /* ── Header ── */
        .sett-hdr{
          background:linear-gradient(135deg,#f9c846 0%,#f9a050 40%,#f47eb0 100%);
          position:relative;
          display:flex;
          align-items:center;
          padding:48px 16px 20px;
          gap:12px;
        }
        .sett-back{
          background:rgba(255,255,255,0.25);
          border:none;
          border-radius:50%;
          width:36px;
          height:36px;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          flex-shrink:0;
        }
        .sett-htitle{
          color:#fff;
          font-family:'Playfair Display',serif;
          font-weight:800;
          font-size:clamp(20px,5vw,26px);
        }

        /* ── Logo area ── */
        .sett-logo{
          display:flex;
          flex-direction:column;
          align-items:center;
          padding:24px 16px 8px;
          gap:10px;
        }
        .sett-logoimg{
          width:88px;
          height:88px;
          border-radius:50%;
          object-fit:contain;
          border:3px solid #f9c846;
          box-shadow:0 4px 20px rgba(249,200,70,0.35);
          background:#1a0a0e;
        }

        /* ── Section label ── */
        .sett-section-label{
          font-size:13px;
          font-weight:800;
          color:#f47eb0;
          text-transform:uppercase;
          letter-spacing:0.08em;
          padding:16px 16px 8px;
        }

        /* ── Card ── */
        .sett-card{
          background:#fff;
          border-radius:16px;
          margin:0 12px;
          overflow:hidden;
          box-shadow:0 2px 12px rgba(244,126,176,0.08);
        }
        .sett-row{
          width:100%;
          display:flex;
          align-items:center;
          gap:14px;
          padding:14px 16px;
          background:none;
          border:none;
          cursor:pointer;
          text-align:left;
          font-family:'Nunito',sans-serif;
          transition:background .15s;
        }
        .sett-row:hover{background:#fff5f8}
        .sett-row-icon{
          width:40px;
          height:40px;
          border-radius:10px;
          background:#fce4ec;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:18px;
          flex-shrink:0;
        }
        .sett-row-label{
          flex:1;
          font-size:clamp(13px,3.5vw,15px);
          font-weight:700;
          color:#1a1a1a;
        }
        .sett-chev{font-size:20px;color:#ddd}
        .sett-rowdiv{height:1px;background:#fdf0f5;margin-left:70px}

        /* ── Delete button ── */
        .sett-delete{
          width:calc(100% - 24px);
          margin:12px 12px 0;
          padding:15px 0;
          border-radius:14px;
          border:none;
          background:linear-gradient(135deg,#e8334a,#c0112d);
          color:#fff;
          font-weight:900;
          font-size:clamp(14px,3.5vw,16px);
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          font-family:'Nunito',sans-serif;
          box-shadow:0 4px 16px rgba(232,51,74,0.3);
          transition:opacity .2s;
        }
        .sett-delete:hover{opacity:0.9}

        /* ── Footer ── */
        .sett-footer{
          text-align:center;
          font-size:clamp(10px,2vw,12px);
          color:#c0a0b0;
          padding:20px 16px;
          line-height:1.8;
        }

        /* ── Tablet ── */
        @media(min-width:768px){
          .sett-wrap{max-width:700px}
          .sett-card{margin:0}
          .sett-delete{width:100%;margin:12px 0 0}
          .sett-section-label{padding:20px 0 8px}
        }

        /* ── Laptop / Desktop ── */
        @media(min-width:1024px){
          .sett-page{
            align-items:flex-start;
            padding:40px 24px 60px;
            background:#f3e8ef;
          }
          .sett-wrap{
            max-width:660px;
            margin:0 auto;
            border-radius:24px;
            overflow:hidden;
            box-shadow:0 8px 40px rgba(244,126,176,0.15);
            background:#fdf5f8;
          }
          .sett-hdr{
            padding:36px 32px 28px;
            border-radius:0;
          }
          .sett-back{width:42px;height:42px}
          .sett-htitle{font-size:30px}
          .sett-logo{padding:32px 0 12px}
          .sett-logoimg{
            width:108px;
            height:108px;
            box-shadow:0 6px 28px rgba(249,200,70,0.4);
          }
          .sett-section-label{
            font-size:14px;
            padding:24px 24px 10px;
          }
          .sett-card{
            margin:0 16px;
            border-radius:20px;
            box-shadow:0 4px 20px rgba(244,126,176,0.1);
          }
          .sett-row{padding:17px 20px}
          .sett-row-icon{width:44px;height:44px;font-size:20px;border-radius:12px}
          .sett-row-label{font-size:15px}
          .sett-chev{font-size:22px}
          .sett-rowdiv{margin-left:74px}
          .sett-delete{
            width:calc(100% - 32px);
            margin:14px 16px 0;
            padding:17px 0;
            font-size:16px;
            border-radius:16px;
          }
          .sett-footer{font-size:13px;padding:28px 16px}
        }

        /* ── Wide Desktop ── */
        @media(min-width:1280px){
          .sett-wrap{max-width:720px}
          .sett-logoimg{width:116px;height:116px}
        }
      `}</style>

      {showDeleteModal && (
        <DeleteAccountModal
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleting}
        />
      )}

      <div className="sett-page">
        <div className="sett-wrap">
          {/* Header */}
          <div className="sett-hdr">
            <button className="sett-back" onClick={() => navigate(-1)}>
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="sett-htitle">Settings</span>
          </div>

          {/* ── Logo — replaced SVG/emoji with actual logo image ── */}
          <div className="sett-logo">
            <img
              src="/logo.png"
              alt="Red Cherry"
              className="sett-logoimg"
              onError={(e) => {
                // fallback if logo.png not found
                e.target.style.display = "none";
              }}
            />
          </div>

          {/* Legal & Policies */}
          <div className="sett-section-label">Legal &amp; Policies</div>
          <div className="sett-card">
            {legalItems.map((item, i) => (
              <div key={item.key}>
                <button
                  className="sett-row"
                  onClick={() => setActivePage(item.key)}
                >
                  <div className="sett-row-icon">{item.icon}</div>
                  <span className="sett-row-label">{item.label}</span>
                  <span className="sett-chev">›</span>
                </button>
                {i < legalItems.length - 1 && <div className="sett-rowdiv" />}
              </div>
            ))}
          </div>

          {/* Account Actions */}
          <div className="sett-section-label">Account Actions</div>
          <button
            className="sett-delete"
            onClick={() => setShowDeleteModal(true)}
          >
            🗑️ Delete Account
          </button>

          <p className="sett-footer">
            ©️ Redcherry 2026.
            <br />
            All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
