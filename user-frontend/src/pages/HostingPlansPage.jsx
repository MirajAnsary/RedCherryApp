// user-frontend
// src/pages/HostingPlansPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PLANS = [
  {
    id: "web_hosting",
    title: "Start your web hosting now",
    price: "₹499",
    period: "/mo",
    badge: null,
    badgeColor: null,
    color: "#0f766e",
    gradient: "linear-gradient(135deg, #ffffff 0%, #f0fdf9 100%)",
    border: "#99f6e4",
    features: [
      { label: "60GB Cpanel webhosting", value: "Starting at ₹499 monthly" },
      { label: "Free .COM domain", value: "₹1,576" },
      { label: "Free Cpanel license", value: "₹1,078 monthly" },
    ],
    footer: "atleast for 12 month",
    desc: "Virtual machines for more demanding business apps, e.g. (linux - windows). Speed up your website by distributing it globally and serving it to your visitors from the closest location for faster page load speeds wherever they are.",
    btnLabel: "Get Started Now",
    amount: 499,
  },
  {
    id: "vps_server",
    title: "Start your fully managed VPS server",
    price: "₹3,651",
    period: "/mo",
    badge: "DE",
    badgeColor: "#1e40af",
    color: "#1e40af",
    gradient: "linear-gradient(135deg, #f8faff 0%, #eff6ff 100%)",
    border: "#bfdbfe",
    features: [
      { label: "60GB Cpanel webhosting", value: "Starting at ₹499 monthly" },
    ],
    footer: "atleast for 12 month",
    desc: "25 data center around the world. Intel Xeon v4 vCPU with Hight RAM",
    btnLabel: "Get Started Now",
    amount: 3651,
  },
  {
    id: "wordpress",
    title: "WordPress hosting",
    price: "₹450",
    period: "/mo",
    badge: null,
    badgeColor: null,
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
    border: "#ddd6fe",
    features: [],
    footer: "atleast for 12 month",
    desc: "Design your site, your way. Our Managed WordPress Hosting platform with WooCommerce gives you the freedom to sell anything, anywhere online — from physical products to digital downloads, services and subscriptions.",
    billing: "Starting at, yearly billing.",
    btnLabel: "Get Started Now",
    amount: 450,
  },
  {
    id: "dedicated",
    title: "Dedicated Server Hosting",
    price: "₹9,129",
    period: "/mo",
    badge: null,
    badgeColor: null,
    color: "#b45309",
    gradient: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
    border: "#fde68a",
    features: [],
    footer: "atleast for 12 month",
    desc: "Get high-powered Dedicated Server Hosting. Our Dedicated Server Hosting provides high-performance server options with isolated resources to run mission-critical applications where latency and uptime matters.",
    billing: "Starting at, yearly billing",
    btnLabel: "Get Started Now",
    amount: 9129,
  },
  {
    id: "windows",
    title: "Windows Web Hosting",
    price: "₹450",
    period: "/mo",
    badge: null,
    badgeColor: null,
    color: "#0369a1",
    gradient: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    border: "#bae6fd",
    features: [],
    footer: "atleast for 12 month",
    desc: "for ASP.NET, ASP, .Net Core, and SQL server users. The Windows features you know — ASP.NET, ASP, .NET Core, and SQL Server — are best when paired with our Windows Hosting plans. With Windows Server 2019 and IIS 10, our systems run fast and reliable to meet your dev needs.",
    billing: "Starting at, yearly billing",
    btnLabel: "Get Started Now",
    amount: 450,
  },
];

const DOMAIN_PRICES = [
  { ext: ".com", price: "₹1,241" },
  { ext: ".net", price: "₹1,181" },
];

function DomainSearch() {
  const [query, setQuery] = useState("");
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #0f2340 100%)",
        borderRadius: 16,
        padding: "28px 24px",
        color: "#fff",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          fontSize: 18,
          fontWeight: 800,
          marginBottom: 8,
          fontFamily: "'Merriweather', Georgia, serif",
        }}
      >
        Find your new domain name
      </h3>
      <p
        style={{
          color: "rgba(255,255,255,0.65)",
          fontSize: 13,
          marginBottom: 20,
          lineHeight: 1.6,
        }}
      >
        Easily find available domains from over 500 domain extensions. 24/7
        phone and chat support.
      </p>
      <div
        style={{
          display: "flex",
          background: "#fff",
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 14,
        }}
      >
        <span style={{ padding: "10px 12px", color: "#94a3b8", fontSize: 16 }}>
          🔍
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for your domain"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: 13,
            color: "#1e293b",
            background: "transparent",
          }}
        />
        <button
          style={{
            background: "#0ea5e9",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {DOMAIN_PRICES.map((d) => (
          <span
            key={d.ext}
            style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}
          >
            <strong style={{ color: "#fff" }}>{d.ext}</strong> {d.price}
          </span>
        ))}
      </div>
    </div>
  );
}

function PaymentModal({ plan, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      // Load Razorpay SDK dynamically
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      // Create order via backend
      const res = await fetch("/api/payment/create-hosting-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, amount: plan.amount }),
      });
      const data = await res.json();

      if (!data.success)
        throw new Error(data.message || "Order creation failed");

      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: "INR",
        name: "Red Cherry Hosting",
        description: plan.title,
        order_id: data.order.id,
        theme: { color: plan.color },
        handler: (response) => {
          onSuccess(response);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "32px 28px",
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🚀</div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#1e293b",
              marginBottom: 6,
              fontFamily: "'Merriweather', Georgia, serif",
            }}
          >
            {plan.title}
          </h2>
          <div
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: plan.color,
              marginBottom: 4,
            }}
          >
            {plan.price}
            <span style={{ fontSize: 16, color: "#64748b" }}>
              {plan.period}
            </span>
          </div>
          <p style={{ color: "#64748b", fontSize: 13 }}>
            atleast for 12 months
          </p>
        </div>

        <div
          style={{
            background: "#f8fafc",
            borderRadius: 12,
            padding: "16px",
            marginBottom: 20,
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ color: "#64748b", fontSize: 13 }}>Plan</span>
            <span style={{ color: "#1e293b", fontWeight: 700, fontSize: 13 }}>
              {plan.title}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 10,
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <span style={{ color: "#1e293b", fontWeight: 800 }}>Total</span>
            <span style={{ color: plan.color, fontWeight: 900, fontSize: 18 }}>
              {plan.price}/mo
            </span>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "#fff0f0",
              border: "1px solid #fecaca",
              color: "#dc2626",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 13,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px 0",
            background: loading
              ? "#94a3b8"
              : `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`,
            border: "none",
            borderRadius: 50,
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: `0 8px 24px ${plan.color}40`,
            marginBottom: 12,
            transition: "opacity 0.2s",
          }}
        >
          {loading ? "Processing..." : `Pay ${plan.price} via Razorpay`}
        </button>
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px 0",
            background: "none",
            border: "1.5px solid #e2e8f0",
            borderRadius: 50,
            color: "#64748b",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "#94a3b8",
            marginTop: 14,
          }}
        >
          🔒 Secured by Razorpay · 256-bit SSL Encryption
        </p>
      </div>
    </div>
  );
}

function PlanCard({ plan, onBuy }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: plan.gradient,
        border: `1.5px solid ${hovered ? plan.color : plan.border}`,
        borderRadius: 16,
        padding: "24px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered
          ? `0 12px 40px ${plan.color}25`
          : "0 2px 8px rgba(0,0,0,0.06)",
        cursor: "default",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <div style={{ flex: 1 }}>
          {plan.badge && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: plan.badgeColor,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 4,
                marginBottom: 6,
              }}
            >
              🌍 {plan.badge} · 25 data center around the world
            </span>
          )}
          <h3
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: "#1e293b",
              margin: 0,
              lineHeight: 1.4,
              fontFamily: "'Merriweather', Georgia, serif",
            }}
          >
            {plan.title}
          </h3>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: plan.color }}>
            {plan.price}
          </div>
          <div style={{ fontSize: 12, color: "#64748b" }}>{plan.period}</div>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, margin: 0 }}>
        {plan.desc}
      </p>

      {/* Features */}
      {plan.features.length > 0 && (
        <div
          style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 10 }}
        >
          {plan.features.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px 0",
                fontSize: 13,
              }}
            >
              <span style={{ color: "#475569" }}>{f.label}</span>
              <span style={{ color: "#1e293b", fontWeight: 700 }}>
                {f.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Billing note */}
      {plan.billing && (
        <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
          {plan.billing}
        </p>
      )}

      {/* Price big display for bottom cards */}
      {plan.billing && (
        <div style={{ fontSize: 26, fontWeight: 900, color: plan.color }}>
          {plan.price}
          <span style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}>
            /mo
          </span>
        </div>
      )}

      {/* Footer note */}
      <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{plan.footer}</p>

      {/* CTA Button */}
      <button
        onClick={() => onBuy(plan)}
        style={{
          marginTop: "auto",
          padding: "11px 0",
          background: hovered ? plan.color : "transparent",
          border: `1.5px solid ${plan.color}`,
          borderRadius: 8,
          color: hovered ? "#fff" : plan.color,
          fontWeight: 700,
          fontSize: 13,
          cursor: "pointer",
          transition: "all 0.2s ease",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {plan.btnLabel}
      </button>
    </div>
  );
}

export default function HostingPlansPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSuccess = (response) => {
    setSelectedPlan(null);
    setSuccess(true);
    setTimeout(() => {
      navigate("/signin");
    }, 2500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Load Razorpay SDK */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Header */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#FF4B6E",
            fontWeight: 700,
            fontSize: 14,
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
        <div style={{ width: 1, height: 20, background: "#e2e8f0" }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>
          Red Cherry Hosting
        </span>
      </div>

      {/* Hero Title */}
      <div
        style={{
          textAlign: "center",
          padding: "48px 20px 36px",
          borderBottom: "1px solid #e2e8f0",
          background: "#fff",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(24px, 5vw, 38px)",
            fontWeight: 900,
            color: "#0f172a",
            marginBottom: 10,
            fontFamily: "'Merriweather', Georgia, serif",
          }}
        >
          Products For All Businesses
        </h1>
        <p style={{ color: "#64748b", fontSize: 15 }}>
          Create the perfect site with powerful drag and drop tools
        </p>
      </div>

      {/* Plans Grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px" }}>
        {/* Row 1: Web Hosting + VPS + Domain Search */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            marginBottom: 20,
          }}
        >
          {/* Web Hosting */}
          <PlanCard plan={PLANS[0]} onBuy={setSelectedPlan} />

          {/* VPS + Domain stacked */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <PlanCard plan={PLANS[1]} onBuy={setSelectedPlan} />
            <DomainSearch />
          </div>
        </div>

        {/* Row 2: WordPress + Dedicated + Windows */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {PLANS.slice(2).map((plan) => (
            <PlanCard key={plan.id} plan={plan} onBuy={setSelectedPlan} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            textAlign: "center",
            marginTop: 48,
            padding: "36px 20px",
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
            borderRadius: 20,
            color: "#fff",
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 900,
              marginBottom: 10,
              fontFamily: "'Merriweather', Georgia, serif",
            }}
          >
            Ready to launch your website?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              marginBottom: 24,
              fontSize: 14,
            }}
          >
            Choose any plan above and pay securely via Razorpay
          </p>
          <button
            onClick={() => navigate("/signin")}
            style={{
              padding: "14px 36px",
              background: "#FF4B6E",
              border: "none",
              borderRadius: 50,
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 8px 28px rgba(255,75,110,0.45)",
              fontFamily: "inherit",
            }}
          >
            Enter App 🚀
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Success Toast */}
      {success && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#10b981",
            color: "#fff",
            padding: "16px 28px",
            borderRadius: 50,
            fontWeight: 700,
            fontSize: 14,
            boxShadow: "0 8px 32px rgba(16,185,129,0.4)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          ✅ Payment successful! Redirecting to login...
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@700;900&family=Nunito:wght@400;600;700;800;900&display=swap');
      `}</style>
    </div>
  );
}
