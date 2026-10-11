//host-frontend
// src/pages/MyKYCPage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/api";
import api from "../utils/api";

const DOC_SECTIONS = [
  {
    section: "Aadhaar Card",
    docs: [
      { key: "aadhaarFront", label: "Aadhaar Front" },
      { key: "aadhaarBack", label: "Aadhaar Back" },
    ],
  },
  {
    section: "Voter ID Card",
    docs: [
      { key: "voterFront", label: "Voter ID Front" },
      { key: "voterBack", label: "Voter ID Back" },
    ],
  },
];

export default function MyKYCPage() {
  const navigate = useNavigate();
  const fileRefs = useRef({});
  const [kyc, setKyc] = useState({
    status: "pending",
    aadhaarFront: null,
    aadhaarBack: null,
    voterFront: null,
    voterBack: null,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get("/api/host/profile/kyc")
      .then((r) => r.json())
      .then((d) => {
        setKyc(d.kyc || kyc);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpload = async (docType, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("docType", docType);
    form.append("file", file);
    const r = await fetch("/api/host/profile/kyc/upload", {
      method: "POST",
      body: form,
      credentials: "include",
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    const d = await r.json();
    if (r.ok) setKyc((prev) => ({ ...prev, [docType]: d.url }));
    else alert(d.message);
  };

  const handleDelete = async (docType) => {
    const r = await api.delete(`/api/host/profile/kyc/${docType}`);
    if (r.ok) setKyc((prev) => ({ ...prev, [docType]: null }));
  };

  const handleSubmit = async () => {
    const { aadhaarFront, aadhaarBack, voterFront, voterBack } = kyc;
    if (!aadhaarFront || !aadhaarBack || !voterFront || !voterBack)
      return alert("Please upload all 4 documents first.");
    setSubmitting(true);
    const r = await api.post("/api/host/profile/kyc/submit", {});
    const d = await r.json();
    if (r.ok) {
      setKyc((prev) => ({ ...prev, status: "submitted" }));
      alert(d.message);
    } else alert(d.message);
    setSubmitting(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .kyc-page{min-height:100vh;background:#f7f0f3;font-family:'Nunito',sans-serif;display:flex;justify-content:center;padding-bottom:40px}
        .kyc-wrap{width:100%;max-width:520px;display:flex;flex-direction:column}
        .kyc-topbar{display:flex;align-items:center;gap:12px;padding:52px 20px 16px;background:#fff}
        .kyc-back{background:none;border:none;cursor:pointer;font-size:22px;color:#f47eb0;font-weight:800}
        .kyc-topbar-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:800;color:#1a1a1a}
        .kyc-logo-row{display:flex;justify-content:center;padding:14px;background:#fff;border-bottom:1px solid #f5f0f3}
        .kyc-logo{width:88px;height:88px;border-radius:50%;object-fit:contain;border:3px solid #fce4ec;padding:4px}
        .kyc-status-banner{display:flex;align-items:center;gap:12px;background:#fffde7;border:1px solid #f9e04b;border-radius:16px;padding:14px 16px;margin:16px 16px 0}
        .kyc-status-icon{font-size:24px;flex-shrink:0}
        .kyc-status-text{flex:1}
        .kyc-status-title{font-weight:800;font-size:15px;color:#1a1a1a}
        .kyc-status-sub{font-size:12px;color:#888;margin-top:2px}
        .kyc-badge{background:transparent;border:2px solid #f9c846;color:#ca8a04;border-radius:50px;padding:4px 14px;font-size:12px;font-weight:800}
        .kyc-section-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:800;color:#1a1a1a;padding:16px 16px 8px}
        .kyc-doc-card{background:#fff;border-radius:16px;margin:0 16px 12px;padding:16px;box-shadow:0 2px 12px rgba(0,0,0,.06)}
        .kyc-doc-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
        .kyc-doc-label{font-weight:800;font-size:15px;color:#1a1a1a}
        .kyc-not-uploaded{background:transparent;border:2px solid #f9c846;color:#ca8a04;border-radius:50px;padding:3px 12px;font-size:11px;font-weight:800}
        .kyc-uploaded-badge{background:transparent;border:2px solid #16a34a;color:#16a34a;border-radius:50px;padding:3px 12px;font-size:11px;font-weight:800}
        .kyc-drop{background:#f8f8f8;border:2px dashed #ddd;border-radius:14px;aspect-ratio:16/9;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;margin-bottom:12px;overflow:hidden}
        .kyc-drop img{width:100%;height:100%;object-fit:cover}
        .kyc-drop-icon{font-size:32px;opacity:.4}
        .kyc-drop-text{font-size:13px;color:#aaa;font-weight:600}
        .kyc-doc-btns{display:flex;gap:10px}
        .kyc-upload-btn{flex:1;padding:12px 0;border-radius:12px;background:#f9b8c8;border:none;color:#fff;font-weight:800;font-size:13px;cursor:pointer;font-family:'Nunito',sans-serif;display:flex;align-items:center;justify-content:center;gap:5px}
        .kyc-del-btn{flex:1;padding:12px 0;border-radius:12px;background:#fff;border:2px solid #e53935;color:#e53935;font-weight:800;font-size:13px;cursor:pointer;font-family:'Nunito',sans-serif;display:flex;align-items:center;justify-content:center;gap:5px}
        .kyc-submit{width:calc(100% - 32px);margin:8px 16px 0;padding:16px 0;border-radius:50px;background:linear-gradient(135deg,#f9c846,#f47eb0);border:none;color:#fff;font-weight:900;font-size:17px;cursor:pointer;font-family:'Nunito',sans-serif;box-shadow:0 4px 18px rgba(244,126,176,.4)}
        .kyc-submit:disabled{opacity:.6;cursor:not-allowed}
        .kyc-footer{text-align:center;font-size:11px;color:#c0a0b0;padding:20px 16px;line-height:1.8}
        @media(min-width:768px){.kyc-wrap{max-width:700px}}
        @media(min-width:1024px){.kyc-wrap{max-width:900px}}
      `}</style>
      <div className="kyc-page">
        <div className="kyc-wrap">
          <div className="kyc-topbar">
            <button className="kyc-back" onClick={() => navigate(-1)}>
              ←
            </button>
            <span className="kyc-topbar-title">My KYC</span>
          </div>
          <div className="kyc-logo-row">
            <img
              src="/logo.png"
              alt="BBSNC"
              className="kyc-logo"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/88x88/fce4ec/f47eb0?text=RC";
              }}
            />
          </div>

          <div className="kyc-status-banner">
            <span className="kyc-status-icon">🛡️</span>
            <div className="kyc-status-text">
              <div className="kyc-status-title">KYC Verification</div>
              <div className="kyc-status-sub">
                Upload your documents to get verified
              </div>
            </div>
            <span className="kyc-badge">
              {kyc.status.charAt(0).toUpperCase() + kyc.status.slice(1)}
            </span>
          </div>

          {DOC_SECTIONS.map((sec) => (
            <div key={sec.section}>
              <div className="kyc-section-title">{sec.section}</div>
              {sec.docs.map((doc) => (
                <div key={doc.key} className="kyc-doc-card">
                  <div className="kyc-doc-header">
                    <span className="kyc-doc-label">{doc.label}</span>
                    {kyc[doc.key] ? (
                      <span className="kyc-uploaded-badge">Uploaded ✓</span>
                    ) : (
                      <span className="kyc-not-uploaded">Not Uploaded</span>
                    )}
                  </div>
                  <div
                    className="kyc-drop"
                    onClick={() => fileRefs.current[doc.key]?.click()}
                  >
                    {kyc[doc.key] ? (
                      <img src={kyc[doc.key]} alt={doc.label} />
                    ) : (
                      <>
                        <span className="kyc-drop-icon">🪪</span>
                        <span className="kyc-drop-text">Tap to upload</span>
                      </>
                    )}
                  </div>
                  <input
                    ref={(el) => (fileRefs.current[doc.key] = el)}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleUpload(doc.key, e)}
                  />
                  <div className="kyc-doc-btns">
                    <button
                      className="kyc-upload-btn"
                      onClick={() => fileRefs.current[doc.key]?.click()}
                    >
                      ⬆️ Upload
                    </button>
                    <button
                      className="kyc-del-btn"
                      onClick={() => handleDelete(doc.key)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <button
            className="kyc-submit"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit for Verification"}
          </button>
          <p className="kyc-footer">
            © 2026 Biswa Bangla Social Networking Club. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
