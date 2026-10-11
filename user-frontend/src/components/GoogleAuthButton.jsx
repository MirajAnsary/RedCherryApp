// src/components/GoogleAuthButton.jsx
// "Sign in / Sign up with Google" — used on the Sign In and Sign Up pages.
// New Google users only add their phone number — no OTP (Google verifies them).
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getGoogleIdToken } from "../firebase";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

export default function GoogleAuthButton({ label = "SIGN IN WITH GOOGLE" }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(null); // { googleToken, name }
  const [phone, setPhone] = useState("");

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const idToken = await getGoogleIdToken();
      const { res, data } = await postJSON("/api/auth/google", { idToken });

      if (!res.ok) throw new Error(data.message || "Google sign-in failed.");
      if (data.needsPhone)
        return setPending({ googleToken: data.googleToken, name: data.name });

      login(data.user, data.token);
      navigate("/home");
    } catch (err) {
      if (
        err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/cancelled-popup-request"
      )
        return;
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    const phoneNumber = phone.trim();
    if (!/^[6-9]\d{9}$/.test(phoneNumber))
      return setError("Enter a valid 10-digit mobile number.");
    setError("");
    setLoading(true);
    try {
      const { res, data } = await postJSON("/api/auth/google/complete", {
        googleToken: pending.googleToken,
        phoneNumber,
      });
      if (!res.ok) throw new Error(data.message || "Could not create account.");
      login(data.user, data.token);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!pending ? (
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px 0",
            borderRadius: 50,
            background: "#fff",
            border: "1.5px solid #fce4ec",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            fontSize: 14,
            fontWeight: 700,
            color: "#444",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          <GoogleIcon />
          {loading ? "Please wait…" : label}
        </button>
      ) : (
        <div
          style={{
            border: "1.5px solid #fce4ec",
            borderRadius: 16,
            padding: 14,
          }}
        >
          <p style={{ fontSize: 13, color: "#555", margin: "0 0 10px" }}>
            Hi {pending.name || "there"}! Add your mobile number to finish
            setting up your account.
          </p>
          <div
            style={{
              border: "1.5px solid #fce4ec",
              borderRadius: 16,
              display: "flex",
              overflow: "hidden",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                background: "#fff5f8",
                borderRight: "1.5px solid #fce4ec",
                fontSize: 14,
                fontWeight: 600,
                color: "#555",
              }}
            >
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // don't submit the outer form
                  handleComplete();
                }
              }}
              autoFocus
              style={{
                flex: 1,
                padding: "12px 14px",
                fontSize: 14,
                border: "none",
                outline: "none",
                background: "transparent",
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleComplete}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 50,
              background: loading ? "#f9d96a" : "#f5c518",
              color: "#fff",
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: 2,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Please wait…" : "CONTINUE"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPending(null);
              setPhone("");
              setError("");
            }}
            style={{
              width: "100%",
              marginTop: 8,
              background: "transparent",
              border: "none",
              color: "#aaa",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {error && (
        <p
          role="alert"
          style={{
            color: "#e53935",
            fontSize: 13,
            textAlign: "center",
            margin: "10px 0 0",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
