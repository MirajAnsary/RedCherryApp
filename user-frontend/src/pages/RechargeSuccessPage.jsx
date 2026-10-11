// user-frontend/src/pages/RechargeSuccessPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RechargeSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();
  const plan = location.state?.plan;
  const newBalance = location.state?.newBalance ?? 0;
  const [show, setShow] = useState(false);

  useEffect(() => {
    // ✅ FIX: sync balance into AuthContext + localStorage so it is
    // reflected immediately without a logout/login cycle.
    if (newBalance > 0) {
      updateUser({ talktimeBalance: newBalance });
    }
    setTimeout(() => setShow(true), 100);
    const t = setTimeout(() => navigate("/talktime-wallet"), 4000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line

  if (!plan) {
    navigate("/talktime-wallet");
    return null;
  }

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center px-6"
      style={{ background: "#0f0f0f" }}
    >
      {/* Animated success card */}
      <div
        className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1.5px solid rgba(255,255,255,0.1)",
          transform: show
            ? "scale(1) translateY(0)"
            : "scale(0.8) translateY(30px)",
          opacity: show ? 1 : 0,
          transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Success icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            boxShadow: "0 0 40px rgba(34,197,94,0.4)",
          }}
        >
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <p className="text-green-400 font-extrabold text-sm tracking-widest uppercase mb-1">
          Payment Successful
        </p>
        <h1 className="text-white font-extrabold text-3xl mb-1">
          ₹{plan.priceTotal}
        </h1>
        <p className="text-white/50 text-sm mb-6">
          {plan.title} · {plan.minutes} min
        </p>

        {/* New balance */}
        <div
          className="w-full rounded-2xl p-4 mb-6"
          style={{
            background: "rgba(244,114,182,0.1)",
            border: "1px solid rgba(244,114,182,0.2)",
          }}
        >
          <p className="text-white/50 text-xs mb-1">Your New Balance</p>
          <p className="text-white font-extrabold text-2xl">₹{newBalance}</p>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="w-full py-3.5 rounded-xl font-extrabold text-white text-sm uppercase tracking-wide"
          style={{ background: "linear-gradient(135deg, #f472b6, #ec4899)" }}
        >
          Browse Live Rooms 🎉
        </button>
        <button
          onClick={() => navigate("/talktime-wallet")}
          className="w-full py-3 rounded-xl font-semibold text-white/50 text-sm mt-2"
        >
          Back to Wallet
        </button>
      </div>

      <p className="text-white/20 text-xs mt-6">
        Redirecting to wallet in 4 seconds…
      </p>
    </div>
  );
}
