////user-frontend
// src/components/OnCallGrid.jsx
// ✅ Fetches real hosts from /api/host/profile/public-hosts
// ✅ Shows real profile photos with fallback initials
// ✅ Skeleton loading state
// ✅ Clicking host card opens HostProfileModal with real data

import { useState, useEffect } from "react";
import HostProfileModal from "./HostProfileModal";

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

function SkeletonCard() {
  return (
    <div className="card p-4 flex flex-col items-center gap-2 animate-pulse">
      <div className="w-20 h-20 rounded-full bg-pink-100" />
      <div className="w-16 h-3 rounded-full bg-pink-100" />
      <div className="w-10 h-2.5 rounded-full bg-pink-50" />
      <div className="w-full h-7 rounded-full bg-pink-100" />
    </div>
  );
}

function HostCard({ host, colorIndex, onPress }) {
  const color = COLORS[colorIndex % COLORS.length];

  return (
    <div
      onClick={() => onPress(host)}
      className="card p-4 flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform"
    >
      {/* Avatar with LIVE badge */}
      <div className="relative">
        <div
          className="w-20 h-20 rounded-full overflow-hidden border-2 border-pink-200 flex items-center justify-center"
          style={{ background: host.profileImage ? "transparent" : color }}
        >
          {host.profileImage ? (
            <img
              src={host.profileImage}
              alt={host.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentNode.style.background = color;
                // show initial letter
                const span = document.createElement("span");
                span.className = "text-white font-extrabold text-2xl";
                span.textContent = host.name.charAt(0).toUpperCase();
                e.target.parentNode.appendChild(span);
              }}
            />
          ) : (
            <span className="text-white font-extrabold text-2xl">
              {host.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <span className="absolute bottom-0 right-0 bg-green-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
          LIVE
        </span>
      </div>

      <div className="text-center">
        <p className="font-extrabold text-gray-800 text-sm">
          {host.firstName || host.name.split(" ")[0]}
        </p>
        {host.age && <p className="text-gray-400 text-xs">{host.age} yrs</p>}
        <p className="text-pink-500 text-xs font-semibold mt-0.5">
          ₹{host.ratePerMin || 5}/min
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPress(host);
        }}
        className="w-full py-1.5 rounded-full bg-pink-300 text-white text-xs font-bold active:bg-pink-400 transition-colors flex items-center justify-center gap-1"
      >
        📞 Call
      </button>
    </div>
  );
}

export default function OnCallGrid() {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHost, setSelectedHost] = useState(null);

  useEffect(() => {
    fetch("/api/host/profile/public-hosts")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setHosts(d.hosts || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="mt-4 px-4">
        <p className="text-sm font-bold text-gray-700 mb-3">
          Hosts Available On Call
        </p>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : hosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-3">📵</div>
            <p className="text-gray-600 font-bold">
              No hosts on call right now.
            </p>
            <p className="text-gray-400 text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {hosts.map((host, i) => (
              <HostCard
                key={host.id}
                host={host}
                colorIndex={i}
                onPress={setSelectedHost}
              />
            ))}
          </div>
        )}

        <p className="text-center text-gray-400 text-xs mt-6">
          © 2025 Biswa Bangla Social Networking Club. All rights reserved.
        </p>
      </div>

      {selectedHost && (
        <HostProfileModal
          host={selectedHost}
          onClose={() => setSelectedHost(null)}
          onCall={(host) => {
            alert(`Calling ${host.name}... ₹${host.ratePerMin || 5}/min`);
            setSelectedHost(null);
          }}
        />
      )}
    </>
  );
}
