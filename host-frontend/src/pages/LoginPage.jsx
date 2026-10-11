//host-frontend
// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

function EyeIcon({ open }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={open ? "#f47eb0" : "#b0b0b0"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

const fieldBox = {
  border: "1.5px solid #fce4ec",
  borderRadius: 16,
  background: "#fff",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ get login from context
  const [form, setForm] = useState({ phoneNumber: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phone = form.phoneNumber.trim();
    if (!phone) return setError("Please enter your phone number.");
    if (!/^\d{10}$/.test(phone))
      return setError("Enter a valid 10-digit phone number.");
    if (!form.password) return setError("Please enter your password.");

    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/host/auth/login", {
        phoneNumber: phone,
        password: form.password,
      });
      const data = await res.json();

      if (!res.ok) {
        // Unverified account — redirect to OTP verification
        if (data.needsVerification) {
          return navigate("/host/verify-otp", {
            state: {
              phoneNumber: phone,
              maskedPhone: data.maskedPhone,
              mode: "signup",
            },
          });
        }
        throw new Error(data.message || "Login failed. Please try again.");
      }

      // ✅ Login successful — set auth context and go to home directly
      login(data.user, data.accessToken);
      navigate("/host/home", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fdf0f3",
        maxWidth: 430,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HERO GRADIENT HEADER */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#f9c846 0%,#f9a66c 30%,#f47eb0 65%,#f06fa8 100%)",
          borderBottomLeftRadius: "2.2rem",
          borderBottomRightRadius: "2.2rem",
          minHeight: 230,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 36,
          paddingTop: 52,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -40,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "3px solid rgba(255,255,255,0.8)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: 86, height: 86, objectFit: "contain" }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
        <p
          style={{
            color: "#fff",
            fontFamily: "Georgia,serif",
            fontSize: 24,
            fontWeight: 700,
            marginTop: 12,
            position: "relative",
            zIndex: 2,
          }}
        >
          Red Cherry (Host)
        </p>
        <p
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 14,
            marginTop: 2,
            position: "relative",
            zIndex: 2,
          }}
        >
          Welcome back
        </p>
      </div>

      {/* CARD */}
      <div
        style={{
          margin: "0 16px",
          marginTop: -2,
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 8px 32px rgba(244,126,176,0.13)",
          padding: "28px 24px 24px",
        }}
      >
        <h2
          style={{
            fontFamily: "Georgia,serif",
            fontSize: 26,
            fontWeight: 800,
            color: "#1a1a1a",
            margin: 0,
          }}
        >
          Sign In
        </h2>
        <p style={{ fontSize: 14, color: "#9e9e9e", marginTop: 4 }}>
          Enter your credentials to continue
        </p>
        <div
          style={{
            width: 36,
            height: 3,
            borderRadius: 4,
            background: "linear-gradient(90deg,#f47eb0,#f9c846)",
            margin: "10px 0 22px",
          }}
        />

        <form onSubmit={handleSubmit}>
          {/* Phone Number */}
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 700,
              color: "#333",
              marginBottom: 6,
            }}
          >
            Phone Number
          </label>
          <div
            style={{
              ...fieldBox,
              display: "flex",
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "0 12px",
                background: "#fff5f8",
                borderRight: "1.5px solid #fce4ec",
                fontSize: 14,
                fontWeight: 600,
                color: "#555",
                minWidth: 72,
                whiteSpace: "nowrap",
              }}
            >
              +91 <span style={{ fontSize: 10, color: "#aaa" }}>▾</span>
            </span>
            <input
              name="phoneNumber"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter phone number"
              value={form.phoneNumber}
              onChange={onChange}
              autoComplete="tel"
              style={{
                flex: 1,
                padding: "14px 16px",
                fontSize: 14,
                color: "#333",
                border: "none",
                outline: "none",
                background: "transparent",
              }}
            />
          </div>

          {/* Password */}
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 700,
              color: "#333",
              marginBottom: 6,
            }}
          >
            Password
          </label>
          <div
            style={{
              ...fieldBox,
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
              style={{
                flex: 1,
                padding: "14px 16px",
                fontSize: 14,
                color: "#333",
                border: "none",
                outline: "none",
                background: "transparent",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{
                padding: "0 14px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <EyeIcon open={showPass} />
            </button>
          </div>

          <div style={{ textAlign: "right", marginBottom: 16 }}>
            <Link
              to="/host/forgot-password"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#f47eb0",
                textDecoration: "none",
              }}
            >
              Forgot Password?
            </Link>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                background: "#fff0f0",
                border: "1px solid #ffd5d5",
                color: "#e53935",
                fontSize: 13,
                borderRadius: 12,
                padding: "10px 16px",
                textAlign: "center",
                marginBottom: 14,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px 0",
              borderRadius: 50,
              background: loading ? "#f9d96a" : "#f5c518",
              color: "#fff",
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: 3,
              textTransform: "uppercase",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 6px 20px rgba(245,197,24,0.38)",
              marginBottom: 18,
            }}
          >
            {loading ? "Signing In…" : "SIGN IN"}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#fce4ec" }} />
            <span style={{ fontSize: 13, color: "#bbb" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#fce4ec" }} />
          </div>

          <GoogleAuthButton label="SIGN IN WITH GOOGLE" />
        </form>
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: 14,
          color: "#aaa",
          padding: "16px 0 4px",
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          to="/host/signup"
          style={{ fontWeight: 700, color: "#f47eb0", textDecoration: "none" }}
        >
          Sign Up
        </Link>
      </p>
      <p
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "#ccc",
          paddingBottom: 28,
          lineHeight: 1.7,
        }}
      >
        © 2026 Biswa Bangla Social Networking Club.
        <br />
        All rights reserved.
      </p>
    </div>
  );
}
