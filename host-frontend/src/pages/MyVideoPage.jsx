//host-frontend
// src/pages/MyVideoPage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/api";
import api from "../utils/api";

const VideoPage = ({ title, apiBase }) => {
  const navigate = useNavigate();
  const uploadRef = useRef();
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api
      .get(`/api/host/profile/${apiBase}`)
      .then((r) => r.json())
      .then((d) => {
        setVideoUrl(d.videoUrl);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiBase]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("video", file);
    const r = await fetch(`/api/host/profile/${apiBase}`, {
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
    if (!confirm("Delete this video?")) return;
    const r = await api.delete(`/api/host/profile/${apiBase}`);
    if (r.ok) setVideoUrl(null);
  };

  const S = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    .vp-page{min-height:100vh;background:#f7f0f3;font-family:'Nunito',sans-serif;display:flex;justify-content:center;padding-bottom:40px}
    .vp-wrap{width:100%;max-width:520px;display:flex;flex-direction:column}
    .vp-topbar{display:flex;align-items:center;gap:12px;padding:52px 20px 16px;background:#fff}
    .vp-back{background:none;border:none;cursor:pointer;font-size:22px;color:#f47eb0;font-weight:800}
    .vp-topbar-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:800;color:#1a1a1a}
    .vp-logo-row{display:flex;justify-content:center;padding:14px;background:#fff;border-bottom:1px solid #f5f0f3}
    .vp-logo{width:88px;height:88px;border-radius:50%;object-fit:contain;border:3px solid #fce4ec;padding:4px}
    .vp-player{background:#4a4a4a;border-radius:18px;margin:20px 16px 0;aspect-ratio:16/9;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.2)}
    .vp-player video{width:100%;height:100%;object-fit:cover}
    .vp-no-video{display:flex;flex-direction:column;align-items:center;gap:10px}
    .vp-cam-icon{font-size:48px;opacity:.5}
    .vp-no-text{color:rgba(255,255,255,.6);font-size:15px;font-weight:600}
    .vp-btns{display:flex;gap:10px;margin:16px 16px 0}
    .vp-btn-upload{flex:1;padding:14px 0;border-radius:14px;background:#f9b8c8;border:none;color:#fff;font-weight:800;font-size:14px;cursor:pointer;font-family:'Nunito',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px}
    .vp-btn-replace{flex:1;padding:14px 0;border-radius:14px;background:#f5c518;border:none;color:#fff;font-weight:800;font-size:14px;cursor:pointer;font-family:'Nunito',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px}
    .vp-btn-delete{flex:1;padding:14px 0;border-radius:14px;background:#e53935;border:none;color:#fff;font-weight:800;font-size:14px;cursor:pointer;font-family:'Nunito',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px}
    .vp-footer{text-align:center;font-size:11px;color:#c0a0b0;padding:24px 16px;line-height:1.8}
    @media(min-width:768px){.vp-wrap{max-width:700px}}
    @media(min-width:1024px){.vp-wrap{max-width:900px}}
  `;

  return (
    <>
      <style>{S}</style>
      <div className="vp-page">
        <div className="vp-wrap">
          <div className="vp-topbar">
            <button className="vp-back" onClick={() => navigate(-1)}>
              ←
            </button>
            <span className="vp-topbar-title">{title}</span>
          </div>
          <div className="vp-logo-row">
            <img
              src="/logo.png"
              alt="BBSNC"
              className="vp-logo"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/88x88/fce4ec/f47eb0?text=RC";
              }}
            />
          </div>

          <div className="vp-player">
            {loading ? (
              <div className="vp-no-video">
                <span className="vp-no-text">Loading…</span>
              </div>
            ) : videoUrl ? (
              <video src={videoUrl} controls />
            ) : (
              <div className="vp-no-video">
                <span className="vp-cam-icon">🎥</span>
                <span className="vp-no-text">No video uploaded yet</span>
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
          <div className="vp-btns">
            <button
              className="vp-btn-upload"
              onClick={() => uploadRef.current?.click()}
              disabled={uploading}
            >
              ⬆️ {uploading ? "Uploading…" : "Upload"}
            </button>
            <button
              className="vp-btn-replace"
              onClick={() => uploadRef.current?.click()}
              disabled={uploading}
            >
              ✏️ Replace
            </button>
            <button
              className="vp-btn-delete"
              onClick={handleDelete}
              disabled={!videoUrl}
            >
              🗑️ Delete
            </button>
          </div>

          <p className="vp-footer">
            © 2026 Biswa Bangla Social Networking Club. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default function MyVideoPage() {
  return <VideoPage title="My Video" apiBase="video" />;
}
