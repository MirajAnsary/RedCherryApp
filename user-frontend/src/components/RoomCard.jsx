//v3 max2 00:02================================================================
////src/components/RoomCard.jsx
import { useState, useEffect } from "react";

const COLORS = [
  "#f9a8d4",
  "#c084fc",
  "#4ade80",
  "#ff85a1",
  "#fbbf24",
  "#60a5fa",
  "#f87171",
  "#34d399",
];

function hostColor(name = "") {
  return COLORS[name.charCodeAt(0) % COLORS.length] || "#f47eb0";
}

// ── Host Gallery Modal ────────────────────────────────────────────────────────
function HostGalleryModal({ hostName, hostId, color, initials, onClose }) {
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    fetch("/api/host/profile/public-hosts")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.hosts) {
          const found =
            d.hosts.find((h) => String(h.id) === String(hostId)) ||
            d.hosts.find(
              (h) => h.name?.toLowerCase() === hostName?.toLowerCase(),
            );
          setHost(found || null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [hostId, hostName]);

  const gallery = Array.isArray(host?.images)
    ? host.images.filter(Boolean)
    : [];
  const coverImg = gallery[0] || host?.profileImage || null;
  const hColor = host ? hostColor(host.name) : color;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto"
      style={{ touchAction: "pan-y" }}
    >
      {/* Cover */}
      <div
        className="relative w-full flex-shrink-0 overflow-hidden"
        style={{ height: 200 }}
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
              background: `linear-gradient(135deg, ${hColor}55, ${hColor}cc)`,
            }}
          />
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

      {/* Content */}
      <div className="px-4 pb-10 -mt-8 relative">
        <div className="flex flex-col items-center mb-4">
          <div
            className="w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden"
            style={{ background: hColor }}
          >
            {host?.profileImage ? (
              <img
                src={host.profileImage}
                alt={host.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <span className="text-white font-extrabold text-2xl">
                {(initials || hostName || "H").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {loading ? (
            <div className="mt-2 w-32 h-5 rounded-full bg-pink-100 animate-pulse" />
          ) : (
            <h2 className="text-xl font-extrabold text-gray-800 mt-2">
              {host?.name || hostName}
              {host?.age && (
                <span className="text-gray-400 font-semibold text-base">
                  , {host.age}
                </span>
              )}
            </h2>
          )}
          {host?.languages?.length > 0 && (
            <p className="text-gray-500 text-xs mt-0.5">
              {host.languages.join(", ")}
            </p>
          )}
        </div>

        {host?.about && (
          <div className="mb-4">
            <h3 className="font-extrabold text-gray-800 text-sm mb-1">About</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {host.about}
            </p>
          </div>
        )}

        {host?.interests?.length > 0 && (
          <div className="mb-5">
            <h3 className="font-extrabold text-gray-800 text-sm mb-2">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {host.interests.map((t) => (
                <span
                  key={t}
                  className="bg-pink-300 text-white text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <h3 className="font-extrabold text-gray-800 text-sm mb-3">Gallery</h3>
          {loading ? (
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl aspect-square bg-pink-100 animate-pulse"
                />
              ))}
            </div>
          ) : gallery.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-gray-300">
              <svg
                className="w-12 h-12 mb-2"
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
              <p className="text-xs font-semibold">No gallery photos yet</p>
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
                    alt={`photo ${i + 1}`}
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
    </div>
  );
}

// ── Connecting Screen ─────────────────────────────────────────────────────────
function ConnectingScreen({ room, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black flex flex-col"
      style={{ zIndex: 9999 }}
    >
      <div className="flex items-center px-4 pt-12 pb-3 gap-3">
        <div
          className="w-10 h-10 rounded-full border-2 border-pink-400 shrink-0 flex items-center justify-center"
          style={{ background: room.color }}
        >
          <span className="text-white font-bold text-sm">{room.initials}</span>
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">
            {room.name}
          </p>
          <p className="text-green-400 text-xs font-semibold">● Live Room</p>
        </div>
        <button
          className="ml-auto text-white text-2xl font-light leading-none"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div className="flex justify-end px-4">
        <div className="flex items-center gap-1 text-white text-sm font-semibold">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {room.viewerCount ?? room.users ?? 0}
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center self-end mr-8 mb-4">
          <svg
            className="w-10 h-10 text-gray-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-3">
          <svg
            className="w-16 h-16 text-gray-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
          <p className="text-white font-bold text-xl tracking-wide">
            Connecting to room...
          </p>
        </div>
      </div>
      <div className="text-center mb-6">
        <p className="text-white font-bold text-xl tracking-widest">00:00</p>
      </div>
      <div className="flex items-center justify-center gap-8 pb-12">
        <div className="flex flex-col items-center gap-1">
          <button className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>
          <span className="text-white text-xs">Mic</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <button
            className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center"
            onClick={onClose}
          >
            <svg
              className="w-7 h-7 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
            </svg>
          </button>
          <span className="text-white text-xs">Leave</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <button className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <span className="text-white text-xs">Flip</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <button className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <span className="text-white text-xs">Video</span>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function isFull(room) {
  return room.currentUsers >= room.maxUsers;
}

// ── RoomCard ──────────────────────────────────────────────────────────────────
export default function RoomCard({ room, onJoin }) {
  const isDouble = room.type === "double";
  const isSingle = room.type === "single";
  const isPrivate = room.visibility === "private";

  const [showGallery, setShowGallery] = useState(false);
  const [showRoom, setShowRoom] = useState(false);

  const roomFull = isFull(room);
  const viewerCount = room.viewerCount ?? room.users ?? 0;
  const rColor = room.color || hostColor(room.name);

  // ── Privacy × Type matrix ──────────────────────────────────────────────────
  //
  //            │  Single         │  Double        │  Multiple
  // ───────────┼─────────────────┼────────────────┼──────────────

  //            │  (1 at a time)  │                │
  // ───────────┼─────────────────┼────────────────┼──────────────
  //  Private   │  max 2 users         │  🔜      │  🔜
  //
  const isPrivateSingle = isPrivate && isSingle;
  const isLocked = isPrivate && !isSingle; // private double / multiple

  // ── Availability banner ────────────────────────────────────────────────────
  const renderBanner = () => {
    // 🔜 Locked — private double / multiple
    if (isLocked) {
      return (
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3"
          style={{ background: "#6b7280" }}
        >
          <span className="text-white text-sm">🔜</span>
          <span className="text-white font-bold text-xs">
            Coming Soon — this room type is locked
          </span>
        </div>
      );
    }

    // Private single — max 2 users
    if (isPrivateSingle) {
      return roomFull ? (
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3"
          style={{ background: "#ef4444" }}
        >
          <svg
            className="w-4 h-4 text-white shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
          <span className="text-white font-bold text-xs">
            Room is Full (2/2) · Wait for a user to leave.
          </span>
        </div>
      ) : (
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3"
          style={{ background: "#22c55e" }}
        >
          <svg
            className="w-4 h-4 text-white shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
          <span className="text-white font-bold text-xs">
            Private · {room.currentUsers}/2 users · Join now!
          </span>
        </div>
      );
    }

    // Public single — unlimited users, no capacity banner needed
    if (isSingle) return null;

    // Public double / multiple — no banner
    return null;
  };

  // ── Join button ────────────────────────────────────────────────────────────
  const renderJoinButton = () => {
    if (isLocked) {
      return (
        <button
          disabled
          className="w-full py-3 rounded-xl text-white font-extrabold text-sm tracking-widest uppercase cursor-not-allowed"
          style={{ background: "#6b7280" }}
        >
          🔜 Coming Soon
        </button>
      );
    }
    // Private single full → disabled button
    if (isPrivateSingle && roomFull) {
      return (
        <button
          disabled
          className="w-full py-3 rounded-xl text-white font-extrabold text-sm tracking-widest uppercase cursor-not-allowed"
          style={{ background: "#9ca3af" }}
        >
          Room is Full (2/2)
        </button>
      );
    }
    return (
      <button className="btn-primary" onClick={() => onJoin && onJoin()}>
        Join Room
      </button>
    );
  };

  // ── Visibility badge ───────────────────────────────────────────────────────
  const renderVisibilityBadge = () => {
    if (!room.visibility) return null;
    const isPublic = room.visibility === "public";
    return (
      <span
        className="inline-block text-white text-xs font-bold px-3 py-0.5 rounded-full mb-3"
        style={{
          background: isPublic ? "#22c55e" : isLocked ? "#6b7280" : "#374151",
        }}
      >
        {isPublic ? "Public" : isLocked ? "🔜 Private (Locked)" : "Private"}
      </span>
    );
  };

  // ── Avatar ─────────────────────────────────────────────────────────────────
  const renderAvatar = () => {
    if (isDouble) {
      return (
        <div className="w-14 h-14 relative">
          <div
            className="w-10 h-10 rounded-full absolute top-0 left-0 border-2 border-white overflow-hidden flex items-center justify-center"
            style={{ background: rColor }}
          >
            {room.avatar ? (
              <img
                src={room.avatar}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <span className="text-white font-bold text-xs">
                {room.initials?.[0] || "H"}
              </span>
            )}
          </div>
          <div
            className="w-10 h-10 rounded-full absolute bottom-0 right-0 border-2 border-white overflow-hidden flex items-center justify-center"
            style={{ background: rColor, opacity: 0.85 }}
          >
            {room.avatar2 ? (
              <img
                src={room.avatar2}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <span className="text-white font-bold text-xs">
                {room.initials?.[1] || "+"}
              </span>
            )}
          </div>
        </div>
      );
    }
    return (
      <div
        className="w-14 h-14 rounded-full border-2 border-pink-200 overflow-hidden flex items-center justify-center text-white font-extrabold text-lg"
        style={{ background: rColor }}
      >
        {room.avatar ? (
          <img
            src={room.avatar}
            alt={room.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentNode.style.background = rColor;
            }}
          />
        ) : (
          room.initials || (room.name || "H").charAt(0).toUpperCase()
        )}
      </div>
    );
  };

  return (
    <>
      <div className="card p-4 mb-3 mx-4 sm:mx-0">
        {/* Top row */}
        <div className="flex items-start gap-3 mb-3">
          <div className="relative shrink-0">{renderAvatar()}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowGallery(true)}
                className="font-extrabold text-gray-800 text-base leading-tight truncate text-left active:opacity-70 transition-opacity"
              >
                {room.name}
              </button>
              <div className="flex items-center gap-1 ml-2 shrink-0">
                {room.verified && (
                  <svg
                    className="w-4 h-4 text-pink-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                )}
                {room.live && (
                  <span className="bg-pink-400 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    Live
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-400 text-xs mt-0.5">
              {isSingle
                ? `${room.hosts?.[0] || room.name}${room.age ? ` • ${room.age} yrs` : ""}`
                : isDouble
                  ? `${room.hosts?.[0]} • ${room.hosts?.[1]}`
                  : room.hostLabel}
            </p>

            <div className="flex items-center gap-1 mt-1">
              <svg
                className="w-3.5 h-3.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-gray-400 text-xs font-semibold">
                {room.currentUsers} users
              </span>
            </div>
          </div>
        </div>

        {/* Visibility badge */}
        {renderVisibilityBadge()}

        {/* Availability banner */}
        {renderBanner()}

        {/* Live preview */}
        <div
          className="relative rounded-xl overflow-hidden bg-black mb-3"
          style={{ aspectRatio: "16/9" }}
        >
          {room.avatar ? (
            <img
              src={room.avatar}
              alt={room.name}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.75)" }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${rColor}99 0%, ${rColor}dd 100%)`,
              }}
            />
          )}

          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/70 rounded-full px-2 py-0.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-xs font-bold">LIVE</span>
          </div>

          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-white text-xs font-semibold">
              {viewerCount}
            </span>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 px-3 py-2 z-10"
            style={{
              background: "linear-gradient(0deg,rgba(0,0,0,0.7),transparent)",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full border border-white/60 overflow-hidden flex items-center justify-center flex-shrink-0"
                style={{ background: rColor }}
              >
                {room.avatar ? (
                  <img
                    src={room.avatar}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-white font-bold text-xs">
                    {(
                      room.initials?.[0] ||
                      room.name?.charAt(0) ||
                      "H"
                    ).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-white text-xs font-bold truncate">
                {room.name}
              </span>
              {room.roomName && room.roomName !== room.name && (
                <span className="text-white/60 text-xs truncate">
                  · {room.roomName}
                </span>
              )}
            </div>
          </div>

          <button
            className="absolute bottom-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg z-20"
            style={{ background: "rgba(244,126,176,0.9)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </button>
        </div>

        <p className="text-gray-400 text-xs mb-2.5">
          Click The Button : Join The Room
        </p>
        {renderJoinButton()}
      </div>

      {showGallery && (
        <HostGalleryModal
          hostName={room.name}
          hostId={room.id}
          color={rColor}
          initials={room.initials}
          onClose={() => setShowGallery(false)}
        />
      )}
      {showRoom && (
        <ConnectingScreen
          room={{ ...room, color: rColor }}
          onClose={() => setShowRoom(false)}
        />
      )}
    </>
  );
}
