//host-frontend
// src/pages/FAQPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FAQ_DATA = [
  {
    section: "General Information",
    items: [
      {
        q: "What is Biswa Bangla Social Networking Services?",
        a: "Biswa Bangla Social Networking Services is an online friendship and social networking platform strictly for users aged 18 years and above. We provide social networking and online friendship services to help people connect and interact.",
      },
      {
        q: "Who can use this platform?",
        a: "This platform is strictly intended only for individuals who are 18 years of age or older. Children and minors are not permitted to use this service.",
      },
      {
        q: "What services do you offer?",
        a: "We provide social networking and online friendship services. All services are online and virtual in nature. We do not sell, ship, or deliver any physical products.",
      },
    ],
  },
  {
    section: "Age Restrictions",
    items: [
      {
        q: "Why is there an age restriction?",
        a: "Our platform is designed for adult social networking and is strictly intended for individuals 18 years or older. This ensures a safe and appropriate environment for all users.",
      },
      {
        q: "What happens if a minor is found using the platform?",
        a: "Any account found to be operated by a minor (under 18 years) may be suspended or terminated without notice. We do not knowingly collect data from minors.",
      },
    ],
  },
  {
    section: "Account & Usage",
    items: [
      {
        q: "What are my responsibilities as a user?",
        a: "Users are expected to: use the platform respectfully and lawfully, avoid harassment or inappropriate behavior, share accurate information, respect the privacy and consent of other members, and refrain from misleading or fraudulent activity.",
      },
      {
        q: "What activities are prohibited?",
        a: "Prohibited activities include: use by anyone under 18, posting illegal or offensive content, impersonation or scams, misuse of personal information, harassment or exploitation of other users, and any activity that violates applicable laws.",
      },
      {
        q: "Can my account be suspended or terminated?",
        a: "Yes. Accounts may be suspended or terminated for: violation of Terms & Conditions, false age or identity information, abusive or suspicious behavior, and legal/regulatory compliance requirements.",
      },
      {
        q: "How do I delete my account?",
        a: "You can request account deletion by contacting customer support. We retain personal data only as long as necessary for providing services, legal compliance, and resolving disputes.",
      },
    ],
  },
  {
    section: "Payments & Refunds",
    items: [
      {
        q: "Are there any paid features?",
        a: "Certain features may require paid subscriptions or one-time payments. Prices are displayed clearly before purchase.",
      },
      {
        q: "What is your refund policy?",
        a: "All payments made on the platform are generally non-refundable, except where required by law. Refunds will not be provided for change of mind, inactivity, account violations, or dissatisfaction with interactions.",
      },
      {
        q: "Can I get a refund for technical errors?",
        a: "Refunds may be considered only if: payment was deducted but service not activated due to technical error, the issue was reported within 48 hours, and proof of payment is provided.",
      },
      {
        q: "Can I cancel my subscription?",
        a: "Yes, you may cancel subscriptions to avoid future charges. However, cancellation does not entitle you to a refund for the current billing period.",
      },
      {
        q: "How long do refunds take to process?",
        a: "If approved, refunds will be processed to the original payment method and may take 7–10 business days.",
      },
    ],
  },
  {
    section: "Finance & Withdrawals",
    items: [
      {
        q: "How do I withdraw my earnings?",
        a: "Go to Finance → Withdraw, enter amount and tap Withdraw Now. Amount will be credited within 3-5 business days.",
      },
      {
        q: "What is the minimum withdrawal amount?",
        a: "The minimum withdrawal amount is ₹100. Your KYC must be verified before you can withdraw.",
      },
    ],
  },
  {
    section: "KYC & Profile",
    items: [
      {
        q: "What is KYC verification?",
        a: "KYC (Know Your Customer) is mandatory to enable withdrawals. Upload Aadhaar and Voter ID documents.",
      },
      {
        q: "How many images can I upload?",
        a: "You can upload up to 5 profile images. Each image should be under 5MB in JPEG or PNG format.",
      },
    ],
  },
  {
    section: "Privacy & Data Security",
    items: [
      {
        q: "What information do you collect?",
        a: "We collect: personal information (name, age, gender, email, phone, photos, location), account & usage information (login details, messages, preferences, device info), and automatically collected information (cookies, log files, usage statistics).",
      },
      {
        q: "Do you share my data with third parties?",
        a: "We do not sell or rent personal data to third parties. Information may be shared only with service providers, when required by law, to protect legal rights, or with your consent.",
      },
      {
        q: "What are my data rights?",
        a: "You have the right to: access personal data, update or correct information, request account deletion, and withdraw consent where applicable.",
      },
    ],
  },
  {
    section: "Legal & Compliance",
    items: [
      {
        q: "What laws govern this platform?",
        a: "This platform is governed by the laws of India, including the Information Technology Act, 2000 and IT Intermediary Guidelines & Digital Media Ethics Code Rules, 2021. Jurisdiction is with Kolkata, West Bengal courts.",
      },
      {
        q: "Do you ship physical products?",
        a: "No. Biswa Bangla Social Networking Services is a digital-only platform. We do not sell, ship, or deliver any physical products. All services provided are online and virtual in nature only.",
      },
    ],
  },
];

export default function FAQPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState({});
  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .faq-page{min-height:100vh;background:#f7f0f3;font-family:'Nunito',sans-serif;display:flex;justify-content:center;padding-bottom:40px}
        .faq-wrap{width:100%;max-width:520px;display:flex;flex-direction:column}
        .faq-topbar{display:flex;align-items:center;gap:12px;padding:52px 20px 16px;background:#fff}
        .faq-back{background:none;border:none;cursor:pointer;font-size:22px;color:#f47eb0;font-weight:800}
        .faq-topbar-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:800;color:#1a1a1a}
        .faq-logo-row{display:flex;flex-direction:column;align-items:center;padding:16px 20px;background:#fff;border-bottom:1px solid #f5f0f3}
        .faq-logo{width:88px;height:88px;border-radius:50%;object-fit:contain;border:3px solid #fce4ec;padding:4px}
        .faq-logo-name{font-weight:800;font-size:14px;color:#1a1a1a;margin-top:6px;text-align:center}
        .faq-logo-addr{font-size:12px;color:#aaa;text-align:center;margin-top:2px}
        .faq-help-banner{display:flex;align-items:center;gap:12px;background:#f9b8c8;border-radius:16px;padding:16px;margin:16px 16px 0}
        .faq-help-icon{width:36px;height:36px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
        .faq-help-text{flex:1}
        .faq-help-title{font-weight:800;font-size:15px;color:#fff}
        .faq-help-sub{font-size:12px;color:rgba(255,255,255,.85);margin-top:1px}
        .faq-help-btn{background:#fff;border:none;color:#f47eb0;font-weight:800;font-size:13px;border-radius:50px;padding:8px 16px;cursor:pointer;font-family:'Nunito',sans-serif;white-space:nowrap}
        .faq-contact-card{background:#fff;border-radius:16px;margin:14px 16px 0;padding:16px;box-shadow:0 2px 12px rgba(0,0,0,.06)}
        .faq-contact-title{font-weight:800;font-size:16px;color:#1a1a1a;margin-bottom:12px}
        .faq-contact-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;font-size:13px;color:#555;line-height:1.4}
        .faq-section{margin:16px 16px 0}
        .faq-section-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:800;color:#1a1a1a;margin-bottom:10px}
        .faq-item{background:#fff;border-radius:14px;margin-bottom:8px;box-shadow:0 1px 8px rgba(0,0,0,.05);overflow:hidden}
        .faq-q{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;cursor:pointer;border:none;background:none;width:100%;text-align:left;font-family:'Nunito',sans-serif}
        .faq-q-text{font-weight:800;font-size:14px;color:#1a1a1a;flex:1;line-height:1.4;padding-right:10px}
        .faq-chev{font-size:18px;color:#f47eb0;transition:transform .2s;flex-shrink:0}
        .faq-chev.open{transform:rotate(90deg)}
        .faq-a{padding:0 16px 14px;font-size:13px;color:#555;line-height:1.7}
        .faq-footer-box{display:flex;flex-direction:column;align-items:center;padding:24px 16px}
        .faq-footer-logo{width:44px;height:44px;border-radius:50%;object-fit:contain;opacity:.4}
        .faq-footer-text{font-size:11px;color:#c0a0b0;margin-top:8px;text-align:center;line-height:1.8}
        @media(min-width:768px){.faq-wrap{max-width:700px}}
        @media(min-width:1024px){.faq-wrap{max-width:900px}}
      `}</style>
      <div className="faq-page">
        <div className="faq-wrap">
          <div className="faq-topbar">
            <button className="faq-back" onClick={() => navigate(-1)}>
              ←
            </button>
            <span className="faq-topbar-title">FAQ & Help</span>
          </div>

          <div className="faq-logo-row">
            <img
              src="/logo.png"
              alt="BBSNC"
              className="faq-logo"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/88x88/fce4ec/f47eb0?text=RC";
              }}
            />
            <span className="faq-logo-name">
              Biswa Bangla Social Networking Services
            </span>
            <span className="faq-logo-addr">
              Newtown, Kolkata – 700161, West Bengal, India
            </span>
          </div>

          <div className="faq-help-banner">
            <div className="faq-help-icon">❓</div>
            <div className="faq-help-text">
              <div className="faq-help-title">Need help?</div>
              <div className="faq-help-sub">Contact our support team</div>
            </div>
            <a href="mailto:care@biswabanglasocialnetworkingservices.com">
              <button className="faq-help-btn">Contact</button>
            </a>
          </div>

          <div className="faq-contact-card">
            <div className="faq-contact-title">Contact Information</div>
            {[
              {
                icon: "📧",
                val: "care@biswabanglasocialnetworkingservices.com",
              },
              { icon: "📧", val: "customercarebiswabanglasocialn@gmail.com" },
              {
                icon: "📧",
                val: "customercare@biswabanglasocialnetworkingservices.com",
              },
              { icon: "📞", val: "8240210845" },
            ].map((c, i) => (
              <div key={i} className="faq-contact-row">
                <span>{c.icon}</span>
                <span>{c.val}</span>
              </div>
            ))}
          </div>

          {FAQ_DATA.map((sec) => (
            <div key={sec.section} className="faq-section">
              <div className="faq-section-title">{sec.section}</div>
              {sec.items.map((item, i) => {
                const key = `${sec.section}-${i}`;
                return (
                  <div key={key} className="faq-item">
                    <button className="faq-q" onClick={() => toggle(key)}>
                      <span className="faq-q-text">{item.q}</span>
                      <span className={`faq-chev${open[key] ? " open" : ""}`}>
                        ›
                      </span>
                    </button>
                    {open[key] && <div className="faq-a">{item.a}</div>}
                  </div>
                );
              })}
            </div>
          ))}

          <div className="faq-footer-box">
            <img
              src="/logo.png"
              alt="BBSNC"
              className="faq-footer-logo"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <p className=" bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent text-center">
              © 2026 Biswa Bangla Social Networking Club.
              <br />
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
