////user-frontend
// src/components/HostProfileModal.jsx
import { useState } from "react";

const COLORS = [
  "#f47eb0",
  "#f9a050",
  "#4ade80",
  "#c084fc",
  "#60a5fa",
  "#fbbf24",
  "#f87171",
  "#34d399",
];

export default function HostProfileModal({ host, onClose, onCall }) {
  const [imgError, setImgError] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

  if (!host) return null;

  const hostColor =
    COLORS[host.name?.charCodeAt(0) % COLORS.length] || "#f47eb0";
  const hasAvatar = host.profileImage && !imgError;
  const gallery = Array.isArray(host.images) ? host.images.filter(Boolean) : [];
  const coverImg = gallery[0] || null;
  const videoUrl = host.video || null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto">
      {/* ── Cover / Hero ── */}
      <div
        className="relative w-full flex-shrink-0 overflow-hidden"
        style={{ height: 220 }}
      >
        {coverImg ? (
          <img
            src={coverImg}
            alt="cover"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${hostColor}55 0%, ${hostColor}cc 100%)`,
            }}
          >
            <div className="absolute inset-0 opacity-20">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${70 + i * 22}px`,
                    height: `${70 + i * 22}px`,
                    top: `${8 + i * 9}%`,
                    left: `${i % 2 === 0 ? 12 + i * 10 : 48 + i * 4}%`,
                    opacity: 0.4,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 flex items-center justify-center z-10 backdrop-blur-sm"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* ── Profile Content ── */}
      <div className="px-4 pb-28 -mt-10 relative">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-4">
          <div
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center"
            style={{ background: hasAvatar ? "transparent" : hostColor }}
          >
            {hasAvatar ? (
              <img
                src={host.profileImage}
                alt={host.name}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-white font-extrabold text-2xl">
                {host.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800 mt-2">
            {host.name}
            {host.age && (
              <span className="text-gray-400 font-semibold text-lg">
                , {host.age}
              </span>
            )}
          </h2>
          {host.languages?.length > 0 && (
            <p className="text-gray-500 text-sm mt-0.5">
              {host.languages.join(", ")}
            </p>
          )}
        </div>

        {/* User ID */}
        <div className="card p-4 text-center mb-5 shadow-sm">
          <p className="text-pink-400 font-extrabold text-xl tracking-widest">
            {host.userId}
          </p>
          <p className="text-gray-400 text-xs mt-0.5">User ID</p>
        </div>

        {/* About */}
        {host.about ? (
          <div className="mb-5">
            <h3 className="font-extrabold text-gray-800 text-base mb-1.5">
              About
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {host.about}
            </p>
          </div>
        ) : null}

        {/* Interests */}
        {host.interests?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-extrabold text-gray-800 text-base mb-2">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {host.interests.map((interest) => (
                <span
                  key={interest}
                  className="bg-pink-300 text-white text-sm font-semibold px-4 py-1.5 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Video ── */}
        {videoUrl && (
          <div className="mb-6">
            <h3 className="font-extrabold text-gray-800 text-base mb-3">
              Video
            </h3>
            <div className="rounded-2xl overflow-hidden aspect-video bg-black">
              <video
                src={videoUrl}
                controls
                playsInline
                className="w-full h-full object-cover"
                poster={host.profileImage || undefined}
              />
            </div>
          </div>
        )}

        {/* ── Gallery ── */}
        <div className="mb-6">
          <h3 className="font-extrabold text-gray-800 text-base mb-3">
            Gallery
          </h3>
          {gallery.length === 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden aspect-square flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}33, ${COLORS[(i + 2) % COLORS.length]}55)`,
                  }}
                >
                  <svg
                    className="w-10 h-10 text-white opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              ))}
              <div
                className="col-span-2 rounded-2xl overflow-hidden aspect-video flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #e5e7eb, #9ca3af)",
                }}
              >
                <svg
                  className="w-10 h-10 text-white opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {gallery.map((imgUrl, i) => (
                <div
                  key={i}
                  onClick={() => setLightboxImg(imgUrl)}
                  className={`rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-transform ${
                    i === gallery.length - 1 && gallery.length % 2 !== 0
                      ? "col-span-2 aspect-video"
                      : "aspect-square"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${host.name} photo ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.parentNode.style.background = `linear-gradient(135deg, ${COLORS[i % COLORS.length]}33, ${COLORS[(i + 2) % COLORS.length]}55)`;
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <img
            src={lightboxImg}
            alt="gallery"
            className="max-w-full max-h-full rounded-xl object-contain"
          />
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Footer CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg z-60">
        <button
          onClick={() => onCall && onCall(host)}
          className="w-full py-3.5 rounded-full bg-pink-400 text-white font-extrabold text-base shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Call Now · ₹{host.ratePerMin || 5}/min
        </button>
      </div>

      <div className="text-center text-xs text-gray-400 pb-28 mt-2">
        © 2026 Biswa Bangla Social Networking Club. All rights reserved.
      </div>
    </div>
  );
}
