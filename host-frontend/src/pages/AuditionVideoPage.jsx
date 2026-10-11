////host-frontend
// src/pages/AuditionVideoPage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/api";
import api from "../utils/api";

// Reuses same VideoPage component pattern as MyVideoPage but different title/endpoint
export default function AuditionVideoPage() {
  const navigate = useNavigate();
  const uploadRef = useRef();
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api
      .get("/api/host/profile/audition-video")
      .then((r) => r.json())
      .then((d) => {
        setVideoUrl(d.videoUrl);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("video", file);
    const r = await fetch("/api/host/profile/audition-video", {
      method: "POST",
      body: form,
      credentials: "include",
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    const d = await r.json();
    if (r.ok) setVideoUrl(d.videoUrl);
    else alert(d.message);
    setUploading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this audition video?")) return;
    const r = await api.delete("/api/host/profile/audition-video");
    if (r.ok) setVideoUrl(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .av-page{min-height:100vh;background:#f7f0f3;font-family:'Nunito',sans-serif;display:flex;justify-content:center;padding-bottom:40px}
        .av-wrap{width:100%;max-width:520px;display:flex;flex-direction:column}
        .av-topbar{display:flex;align-items:center;gap:12px;padding:52px 20px 16px;background:#fff}
        .av-back{background:none;border:none;cursor:pointer;font-size:22px;color:#f47eb0;font-weight:800}
        .av-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:800;color:#1a1a1a}
        .av-logo-row{display:flex;justify-content:center;padding:14px;background:#fff;border-bottom:1px solid #f5f0f3}
        .av-logo{width:88px;height:88px;border-radius:50%;object-fit:contain;border:3px solid #fce4ec;padding:4px}
        .av-player{background:#4a4a4a;border-radius:18px;margin:20px 16px 0;aspect-ratio:16/9;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.2)}
        .av-player video{width:100%;height:100%;object-fit:cover}
        .av-empty{display:flex;flex-direction:column;align-items:center;gap:10px}
        .av-btns{display:flex;gap:10px;margin:16px 16px 0}
        .av-pink{flex:1;padding:14px 0;border-radius:14px;background:#f9b8c8;border:none;color:#fff;font-weight:800;font-size:14px;cursor:pointer;font-family:'Nunito',sans-serif}
        .av-yellow{flex:1;padding:14px 0;border-radius:14px;background:#f5c518;border:none;color:#fff;font-weight:800;font-size:14px;cursor:pointer;font-family:'Nunito',sans-serif}
        .av-red{flex:1;padding:14px 0;border-radius:14px;background:#e53935;border:none;color:#fff;font-weight:800;font-size:14px;cursor:pointer;font-family:'Nunito',sans-serif}
        .av-footer{text-align:center;font-size:11px;color:#c0a0b0;padding:24px 16px;line-height:1.8}
        @media(min-width:768px){.av-wrap{max-width:700px}}
        @media(min-width:1024px){.av-wrap{max-width:900px}}
      `}</style>
      <div className="av-page">
        <div className="av-wrap">
          <div className="av-topbar">
            <button className="av-back" onClick={() => navigate(-1)}>
              ←
            </button>
            <span className="av-title">My Audition Video</span>
          </div>
          <div className="av-logo-row">
            <img
              src="/logo.png"
              alt="BBSNC"
              className="av-logo"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/88x88/fce4ec/f47eb0?text=RC";
              }}
            />
          </div>
          <div className="av-player">
            {loading ? (
              <div className="av-empty">
                <span style={{ color: "rgba(255,255,255,.6)" }}>Loading…</span>
              </div>
            ) : videoUrl ? (
              <video src={videoUrl} controls />
            ) : (
              <div className="av-empty">
                <span style={{ fontSize: 48, opacity: 0.5 }}>🎥</span>
                <span
                  style={{
                    color: "rgba(255,255,255,.6)",
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  No video uploaded yet
                </span>
              </div>
            )}
          </div>
          <input
            ref={uploadRef}
            type="file"
            accept="video/*"
            hidden
            onChange={handleUpload}
          />
          <div className="av-btns">
            <button
              className="av-pink"
              onClick={() => uploadRef.current?.click()}
            >
              ⬆️ Upload
            </button>
            <button
              className="av-yellow"
              onClick={() => uploadRef.current?.click()}
            >
              ✏️ Replace
            </button>
            <button className="av-red" onClick={handleDelete}>
              🗑️ Delete
            </button>
          </div>
          <p className="av-footer">
            © 2026 Biswa Bangla Social Networking Club. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
