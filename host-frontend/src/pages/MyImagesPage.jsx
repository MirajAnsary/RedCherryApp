//host-frontend
// src/pages/MyImagesPage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/api";
import api from "../utils/api";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  .mi-page{min-height:100vh;background:#f7f0f3;font-family:'Nunito',sans-serif;display:flex;justify-content:center;padding-bottom:40px}
  .mi-wrap{width:100%;max-width:520px;display:flex;flex-direction:column}
  .mi-topbar{display:flex;align-items:center;gap:12px;padding:52px 20px 16px;background:#fff}
  .mi-back{background:none;border:none;cursor:pointer;font-size:22px;color:#f47eb0;font-weight:800}
  .mi-topbar-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:800;color:#1a1a1a}
  .mi-logo-row{display:flex;justify-content:center;padding:12px 20px;background:#fff;border-bottom:1px solid #f5f0f3}
  .mi-logo{width:80px;height:80px;border-radius:50%;object-fit:contain;border:3px solid #fce4ec;padding:4px}
  .mi-info{display:flex;align-items:flex-start;gap:10px;background:#fff8fa;border-radius:14px;padding:14px 16px;margin:16px 16px 0;border:1px solid #fce4ec}
  .mi-info-icon{font-size:18px;flex-shrink:0;margin-top:1px}
  .mi-info-text{font-size:13px;color:#555;line-height:1.6}
  .mi-add-btn{margin:14px 16px 0;width:calc(100% - 32px);padding:15px 0;border-radius:50px;background:linear-gradient(135deg,#f9c846,#f47eb0);border:none;color:#fff;font-weight:900;font-size:16px;cursor:pointer;font-family:'Nunito',sans-serif;box-shadow:0 4px 18px rgba(244,126,176,0.35)}
  .mi-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:14px 16px 0}
  .mi-img-card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.07)}
  .mi-img{width:100%;aspect-ratio:1;object-fit:cover;display:block}
  .mi-img-btns{display:flex;gap:8px;padding:10px}
  .mi-up-btn{flex:1;padding:8px 0;border-radius:10px;border:2px solid #f9b8c8;background:#fff;color:#f47eb0;font-weight:800;font-size:12px;cursor:pointer;font-family:'Nunito',sans-serif;display:flex;align-items:center;justify-content:center;gap:4px}
  .mi-de-btn{flex:1;padding:8px 0;border-radius:10px;border:2px solid #e53935;background:#fff;color:#e53935;font-weight:800;font-size:12px;cursor:pointer;font-family:'Nunito',sans-serif;display:flex;align-items:center;justify-content:center;gap:4px}
  .mi-empty{text-align:center;color:#ccc;padding:40px 20px;font-size:15px}
  .mi-footer{text-align:center;font-size:11px;color:#c0a0b0;padding:20px 16px;line-height:1.8}
  @media(min-width:768px){.mi-wrap{max-width:700px}.mi-grid{grid-template-columns:repeat(3,1fr)}}
  @media(min-width:1024px){.mi-wrap{max-width:900px}.mi-grid{grid-template-columns:repeat(4,1fr)}}
`;

export default function MyImagesPage() {
  const navigate = useNavigate();
  const addRef = useRef();
  const replaceRefs = useRef({});
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/host/profile/images")
      .then((r) => r.json())
      .then((d) => {
        setImages(d.images || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("image", file);
    const r = await fetch("/api/host/profile/images", {
      method: "POST",
      body: form,
      credentials: "include",
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    const d = await r.json();
    if (r.ok) setImages((prev) => [...prev, d.image]);
    else alert(d.message);
  };

  const handleReplace = async (imageId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("image", file);
    const r = await fetch(`/api/host/profile/images/${imageId}`, {
      method: "PUT",
      body: form,
      credentials: "include",
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    const d = await r.json();
    if (r.ok)
      setImages((prev) =>
        prev.map((img) => (img._id === imageId ? d.image : img)),
      );
    else alert(d.message);
  };

  const handleDelete = async (imageId) => {
    if (!confirm("Delete this image?")) return;
    const r = await api.delete(`/api/host/profile/images/${imageId}`);
    if (r.ok) setImages((prev) => prev.filter((img) => img._id !== imageId));
  };

  return (
    <>
      <style>{S}</style>
      <div className="mi-page">
        <div className="mi-wrap">
          <div className="mi-topbar">
            <button className="mi-back" onClick={() => navigate(-1)}>
              ←
            </button>
            <span className="mi-topbar-title">My Images</span>
          </div>
          <div className="mi-logo-row">
            <img
              src="/logo.png"
              alt="BBSNC"
              className="mi-logo"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/80x80/fce4ec/f47eb0?text=RC";
              }}
            />
          </div>

          <div className="mi-info">
            <span className="mi-info-icon">ℹ️</span>
            <span className="mi-info-text">
              Upload unlimited profile images. Tap Update to replace, or Delete
              to remove.
            </span>
          </div>

          <input
            ref={addRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleAdd}
          />
          <button
            className="mi-add-btn"
            onClick={() => addRef.current?.click()}
          >
            + Add New Photo
          </button>

          {loading ? (
            <div className="mi-empty">Loading…</div>
          ) : images.length === 0 ? (
            <div className="mi-empty">No images uploaded yet.</div>
          ) : (
            <div className="mi-grid">
              {images.map((img) => (
                <div key={img._id} className="mi-img-card">
                  <img src={img.url} alt="profile" className="mi-img" />
                  <div className="mi-img-btns">
                    <input
                      ref={(el) => (replaceRefs.current[img._id] = el)}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleReplace(img._id, e)}
                    />
                    <button
                      className="mi-up-btn"
                      onClick={() => replaceRefs.current[img._id]?.click()}
                    >
                      ✏️ UP
                    </button>
                    <button
                      className="mi-de-btn"
                      onClick={() => handleDelete(img._id)}
                    >
                      🗑️ DE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="mi-footer">
            © 2026 Biswa Bangla Social Networking Club. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
