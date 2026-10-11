////user-frontend
// src/pages/ReportProblemPage.jsx

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const COMPLAINT_TYPES = [
  "Objection to Content",
  "Nudity / Pornography",
  "Judicial Order",
  "Privacy",
  "Impersonation",
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rp-page { min-height: 100vh; background: #f3f0f8; font-family: 'Nunito', sans-serif; }
  .rp-header {
    background: #f47eb0; position: sticky; top: 0; z-index: 40;
    display: flex; align-items: center; gap: 12px; padding: 16px 20px;
    box-shadow: 0 2px 8px rgba(244,126,176,0.3);
  }
  .rp-back {
    background: none; border: none; cursor: pointer; color: white;
    display: flex; align-items: center; justify-content: center; padding: 4px;
  }
  .rp-header-title { color: white; font-weight: 900; font-size: 22px; }
  .rp-header-logo {
    margin-left: auto; width: 44px; height: 44px; border-radius: 50%;
    background: white; overflow: hidden; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }

  .rp-body { max-width: 700px; margin: 0 auto; padding: 0; }

  .rp-section {
    background: white; margin-bottom: 2px;
    padding: 22px 24px;
  }
  .rp-section:first-child { border-top-left-radius: 0; border-top-right-radius: 0; }

  .rp-label {
    font-size: 13.5px; font-weight: 800; color: #2d2d2d; margin-bottom: 10px; display: block;
  }
  .rp-label span { color: #f47eb0; }

  .rp-input {
    width: 100%; border: 1.5px solid #e5e0f0; border-radius: 10px;
    padding: 12px 16px; font-size: 14px; font-family: 'Nunito', sans-serif;
    color: #333; background: #faf9fc; outline: none; transition: border-color 0.2s;
    margin-bottom: 0;
  }
  .rp-input:focus { border-color: #f47eb0; background: white; }
  .rp-input::placeholder { color: #bbb; }

  .rp-phone-row { display: flex; gap: 0; }
  .rp-phone-prefix {
    border: 1.5px solid #e5e0f0; border-right: none; border-radius: 10px 0 0 10px;
    padding: 12px 14px; background: #f3f0f8; color: #888; font-size: 14px;
    font-family: 'Nunito', sans-serif; font-weight: 700; white-space: nowrap;
    display: flex; align-items: center;
  }
  .rp-phone-input {
    flex: 1; border: 1.5px solid #e5e0f0; border-radius: 0 10px 10px 0;
    padding: 12px 16px; font-size: 14px; font-family: 'Nunito', sans-serif;
    color: #333; background: #faf9fc; outline: none; transition: border-color 0.2s;
  }
  .rp-phone-input:focus { border-color: #f47eb0; background: white; }
  .rp-phone-input::placeholder { color: #bbb; }

  .rp-checkbox-row {
    display: flex; align-items: center; gap: 12px; padding: 10px 0;
    cursor: pointer; border-bottom: 1px solid #f5f2f9;
  }
  .rp-checkbox-row:last-child { border-bottom: none; }
  .rp-checkbox {
    width: 20px; height: 20px; border-radius: 5px; border: 2px solid #e0d8ef;
    background: white; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.15s; cursor: pointer;
  }
  .rp-checkbox.checked { background: #f47eb0; border-color: #f47eb0; }
  .rp-checkbox-label { font-size: 14px; color: #333; font-weight: 600; }

  .rp-upload-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: #f47eb0; color: white; font-weight: 800; font-size: 14px;
    border: none; border-radius: 10px; padding: 11px 22px; cursor: pointer;
    transition: background 0.2s; margin-bottom: 8px;
  }
  .rp-upload-btn:hover { background: #e8689e; }
  .rp-upload-hint { font-size: 12px; color: #aaa; }
  .rp-file-attached {
    display: flex; align-items: center; gap-8px; background: #fdf0f7;
    border: 1.5px dashed #f4a8cc; border-radius: 10px; padding: 10px 14px;
    margin-top: 10px; font-size: 13px; color: #c0527a; font-weight: 700; gap: 8px;
  }

  .rp-affirm-row {
    display: flex; align-items: flex-start; gap: 12px; padding: 20px 24px;
    background: white; margin-bottom: 2px; cursor: pointer;
  }

  .rp-submit-btn {
    width: 100%; padding: 16px; border-radius: 14px; border: none;
    font-size: 16px; font-weight: 900; font-family: 'Nunito', sans-serif;
    cursor: pointer; transition: all 0.2s; margin-bottom: 24px;
  }
  .rp-submit-btn.active { background: #f47eb0; color: white; box-shadow: 0 4px 15px rgba(244,126,176,0.4); }
  .rp-submit-btn.disabled { background: #ddd; color: #aaa; cursor: not-allowed; }
  .rp-submit-btn.loading { background: #f4a8cc; color: white; cursor: not-allowed; }

  .rp-success {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 60vh; padding: 40px 24px; text-align: center;
  }
  .rp-success-icon {
    width: 80px; height: 80px; border-radius: 50%; background: #f0fdf4;
    display: flex; align-items: center; justify-content: center; margin-bottom: 20px;
    font-size: 40px;
  }
  .rp-error-banner {
    background: #fff1f2; border: 1.5px solid #fecaca; border-radius: 10px;
    padding: 12px 16px; color: #b91c1c; font-size: 13px; font-weight: 700;
    margin-bottom: 16px;
  }
`;

export default function ReportProblemPage() {
  const navigate = useNavigate();
  const fileRef = useRef();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    appUserId: "",
    categories: [],
    description: "",
    affirmed: false,
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const toggleCategory = (cat) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setError("File must be under 10 MB.");
      return;
    }
    setFile(f);
    setError("");
  };

  const canSubmit =
    form.firstName.trim() &&
    form.phone.trim() &&
    form.categories.length > 0 &&
    form.description.trim() &&
    form.affirmed;

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("firstName", form.firstName.trim());
      fd.append("lastName", form.lastName.trim());
      fd.append("phone", form.phone.trim());
      fd.append("email", form.email.trim());
      fd.append("appUserId", form.appUserId.trim());
      fd.append("categories", JSON.stringify(form.categories));
      fd.append("description", form.description.trim());
      fd.append("affirmed", "true");
      if (file) fd.append("evidence", file);

      const res = await fetch("/api/grievance/submit", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Submission failed. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <>
        <style>{S}</style>
        <div className="rp-page">
          <div className="rp-header">
            <button className="rp-back" onClick={() => navigate(-1)}>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="rp-header-title">Report A Problem</span>
            <div className="rp-header-logo">
              <img
                src="/logo.png"
                alt="BBSNC"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          </div>
          <div className="rp-success">
            <div className="rp-success-icon">✅</div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#1a1a1a",
                marginBottom: 8,
              }}
            >
              Grievance Submitted!
            </h2>
            <p
              style={{
                color: "#666",
                fontSize: 14,
                lineHeight: 1.6,
                maxWidth: 320,
              }}
            >
              Our team will review your complaint and respond within 24–48
              hours.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="rp-submit-btn active"
              style={{ maxWidth: 280, marginTop: 32 }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Main Form ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{S}</style>
      <div className="rp-page">
        {/* Header */}
        <div className="rp-header">
          <button className="rp-back" onClick={() => navigate(-1)}>
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="rp-header-title">Report A Problem</span>
          <div className="rp-header-logo">
            <img
              src="/logo.png"
              alt="BBSNC"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>

        <div className="rp-body">
          {/* Name */}
          <div className="rp-section">
            <label className="rp-label">
              What is your name? <span>*</span>
            </label>
            <input
              className="rp-input"
              style={{ marginBottom: 10 }}
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <input
              className="rp-input"
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div className="rp-section">
            <label className="rp-label">
              What is your registered contact number? <span>*</span>
            </label>
            <div className="rp-phone-row">
              <div className="rp-phone-prefix">+91</div>
              <input
                className="rp-phone-input"
                placeholder="10-digit mobile number"
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
                }
              />
            </div>
          </div>

          {/* Email */}
          <div className="rp-section">
            <label className="rp-label">
              What is your email address? <span>*</span>
            </label>
            <input
              className="rp-input"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* App User ID */}
          <div className="rp-section">
            <label className="rp-label">
              App User ID <span>*</span>
            </label>
            <input
              className="rp-input"
              placeholder="Enter App User ID"
              value={form.appUserId}
              onChange={(e) => setForm({ ...form, appUserId: e.target.value })}
            />
          </div>

          {/* Complaint Nature */}
          <div className="rp-section">
            <label className="rp-label">
              What is the nature of your complaint? <span>*</span>
            </label>
            {COMPLAINT_TYPES.map((cat) => (
              <div
                key={cat}
                className="rp-checkbox-row"
                onClick={() => toggleCategory(cat)}
              >
                <div
                  className={`rp-checkbox ${form.categories.includes(cat) ? "checked" : ""}`}
                >
                  {form.categories.includes(cat) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="rp-checkbox-label">{cat}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="rp-section">
            <label className="rp-label">
              Describe the nature of your complaint and what action you want us
              to take <span>*</span>
            </label>
            <textarea
              className="rp-input"
              rows={5}
              placeholder="Describe here"
              style={{ resize: "none" }}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Evidence Upload */}
          <div className="rp-section">
            <label className="rp-label">
              Provide the necessary evidence <span>*</span>
            </label>
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.pdf,.mp4"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button
              className="rp-upload-btn"
              onClick={() => fileRef.current?.click()}
            >
              📁 Upload File
            </button>
            <p className="rp-upload-hint">
              Accepted: Images (JPG, PNG, GIF), PDF, Videos (MP4) - Max 10MB
            </p>
            {file && (
              <div className="rp-file-attached">
                <span>📎</span>
                <span>{file.name}</span>
                <button
                  onClick={() => setFile(null)}
                  style={{
                    marginLeft: "auto",
                    background: "none",
                    border: "none",
                    color: "#f47eb0",
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 16,
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Error banner */}
          {error && (
            <div style={{ padding: "0 24px" }}>
              <div className="rp-error-banner">⚠️ {error}</div>
            </div>
          )}

          {/* Affirm checkbox */}
          <div
            className="rp-affirm-row"
            onClick={() => setForm({ ...form, affirmed: !form.affirmed })}
          >
            <div
              className={`rp-checkbox ${form.affirmed ? "checked" : ""}`}
              style={{ marginTop: 2 }}
            >
              {form.affirmed && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 13, color: "#444", lineHeight: 1.5 }}>
              I affirm that this information is authentic. I understand that
              this grievance may be rejected if any information is incomplete or
              false.
            </span>
          </div>

          {/* Submit */}
          <div style={{ padding: "8px 24px 32px" }}>
            <button
              className={`rp-submit-btn ${loading ? "loading" : canSubmit ? "active" : "disabled"}`}
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
            >
              {loading ? "Submitting…" : "Submit"}
            </button>
            <p style={{ textAlign: "center", color: "#bbb", fontSize: 12 }}>
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
