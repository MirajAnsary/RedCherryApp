//host-frontend
// src/pages/EditProfilePage.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAccessToken } from "../utils/api";
import api from "../utils/api";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  .ep-page{min-height:100vh;background:#f7f0f3;font-family:'Nunito',sans-serif;display:flex;justify-content:center;padding-bottom:40px}
  .ep-wrap{width:100%;max-width:520px;display:flex;flex-direction:column}
  .ep-topbar{display:flex;align-items:center;gap:12px;padding:52px 20px 16px;background:#fff}
  .ep-back{background:none;border:none;cursor:pointer;font-size:22px;color:#f47eb0;font-weight:800}
  .ep-topbar-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:800;color:#1a1a1a}
  .ep-logo-row{display:flex;flex-direction:column;align-items:center;padding:16px 20px;background:#fff;border-bottom:1px solid #f5f0f3}
  .ep-logo{width:88px;height:88px;border-radius:50%;object-fit:contain;border:3px solid #fce4ec;padding:4px;background:#fff}
  .ep-logo-name{font-weight:800;font-size:14px;color:#1a1a1a;margin-top:8px;text-align:center}
  .ep-card{background:#fff;border-radius:20px;margin:14px 16px 0;padding:20px;box-shadow:0 2px 14px rgba(244,126,176,0.1)}
  .ep-section-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:800;color:#1a1a1a;margin-bottom:16px}
  .ep-avatar-center{display:flex;flex-direction:column;align-items:center;gap:14px}
  .ep-avatar-ring{width:100px;height:100px;border-radius:50%;border:3px solid #f47eb0;overflow:hidden;position:relative;cursor:pointer;display:flex;align-items:center;justify-content:center;background:#fce4ec}
  .ep-avatar-ring img{width:100%;height:100%;object-fit:cover}
  .ep-avatar-fallback{font-size:40px;color:#f47eb0}
  .ep-cam-badge{position:absolute;bottom:4px;right:4px;background:#f47eb0;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:12px}
  .ep-btn-row{display:flex;gap:10px;width:100%}
  .ep-btn-pink{flex:1;padding:12px 0;border-radius:12px;background:#f9b8c8;border:none;color:#fff;font-weight:800;font-size:14px;cursor:pointer;font-family:'Nunito',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px}
  .ep-btn-red-outline{flex:1;padding:12px 0;border-radius:12px;background:#fff;border:2px solid #e53935;color:#e53935;font-weight:800;font-size:14px;cursor:pointer;font-family:'Nunito',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px}
  .ep-input{width:100%;padding:14px 16px;border-radius:13px;border:2px solid #fce4ec;font-size:15px;color:#333;outline:none;background:#fffbfd;font-family:'Nunito',sans-serif;transition:border-color .2s;margin-bottom:10px}
  .ep-input:focus{border-color:#f47eb0}
  .ep-save{width:calc(100% - 32px);margin:16px;padding:16px 0;border-radius:50px;background:linear-gradient(135deg,#f9c846,#f47eb0);border:none;color:#fff;font-weight:900;font-size:17px;cursor:pointer;font-family:'Nunito',sans-serif;box-shadow:0 4px 18px rgba(244,126,176,0.4)}
  .ep-save:disabled{opacity:.6;cursor:not-allowed}
  .ep-footer{text-align:center;font-size:11px;color:#c0a0b0;padding:16px;line-height:1.8}
  @media(min-width:768px){.ep-wrap{max-width:700px}.ep-card{margin:20px 0 0;padding:28px}}
  @media(min-width:1024px){.ep-wrap{max-width:900px}}
`;

export default function EditProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [name, setName] = useState(
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
  );
  const [avatarPreview, setAvatarPreview] = useState(
    user?.profileImage || null,
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const initials = (user?.firstName?.[0] || "H").toUpperCase();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  const handleDeleteAvatar = async () => {
    try {
      await api.delete("/api/host/profile/delete-avatar");
      setAvatarPreview(null);
      setAvatarFile(null);
      updateUser({ profileImage: null });
    } catch (e) {
      setError("Failed to delete avatar.");
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return setError("Name cannot be empty.");
    setSaving(true);
    setError("");
    try {
      // Upload avatar if changed
      if (avatarFile) {
        const form = new FormData();
        form.append("avatar", avatarFile);
        const r = await fetch("/api/host/profile/upload-avatar", {
          method: "POST",
          body: form,
          credentials: "include",
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.message);
        updateUser({ profileImage: d.profileImage });
      }
      // Update name
      const parts = name.trim().split(/\s+/);
      const res = await api.put("/api/host/profile/update-name", {
        firstName: parts[0],
        lastName: parts.slice(1).join(" "),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      updateUser(data.user);
      navigate("/host/account");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{S}</style>
      <div className="ep-page">
        <div className="ep-wrap">
          <div className="ep-topbar">
            <button className="ep-back" onClick={() => navigate(-1)}>
              ←
            </button>
            <span className="ep-topbar-title">Edit Profile</span>
          </div>

          <div className="ep-logo-row">
            <img
              src="/logo.png"
              alt="BBSNC"
              className="ep-logo"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/88x88/fce4ec/f47eb0?text=RC";
              }}
            />
            <span className="ep-logo-name">
              Biswa Bangla Social Networking Club
            </span>
          </div>

          {/* Profile Picture */}
          <div className="ep-card">
            <div className="ep-section-title">Profile Picture</div>
            <div className="ep-avatar-center">
              <div
                className="ep-avatar-ring"
                onClick={() => fileRef.current?.click()}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" />
                ) : (
                  <span className="ep-avatar-fallback">👤</span>
                )}
                <span className="ep-cam-badge">🎥</span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
              <div className="ep-btn-row">
                <button
                  className="ep-btn-pink"
                  onClick={() => fileRef.current?.click()}
                >
                  🖼️ Update
                </button>
                <button
                  className="ep-btn-red-outline"
                  onClick={handleDeleteAvatar}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>

          {/* Display Name */}
          <div className="ep-card">
            <div className="ep-section-title">Display Name</div>
            <input
              className="ep-input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              className="ep-btn-red-outline"
              style={{ width: "100%" }}
              onClick={() => setName("")}
            >
              🗑️ Clear Name
            </button>
          </div>

          {error && (
            <div
              style={{
                margin: "0 16px",
                padding: "10px 16px",
                background: "#fff0f0",
                border: "1px solid #ffd5d5",
                color: "#e53935",
                borderRadius: 12,
                fontSize: 13,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <button className="ep-save" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>

          <p className="ep-footer">
            © 2026 Biswa Bangla Social Networking Club. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
