////user-frontend
// src/components/TopPicksRow.jsx
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

function SkeletonAvatar() {
  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      <div className="w-14 h-14 rounded-full bg-pink-100 animate-pulse" />
      <div className="w-10 h-2.5 rounded-full bg-pink-50 animate-pulse" />
    </div>
  );
}

export default function TopPicksRow() {
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
      <div className="my-2 card p-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {loading ? (
            [...Array(5)].map((_, i) => <SkeletonAvatar key={i} />)
          ) : hosts.length === 0 ? (
            <p className="text-xs text-gray-400 font-semibold py-2 px-1">
              No hosts available yet.
            </p>
          ) : (
            hosts.map((host, i) => (
              <div
                key={host.id}
                onClick={() => setSelectedHost(host)}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 transition-transform"
              >
                <div
                  className="w-14 h-14 rounded-full border-2 border-pink-300 overflow-hidden flex items-center justify-center"
                  style={{
                    background: host.profileImage
                      ? "transparent"
                      : COLORS[i % COLORS.length],
                  }}
                >
                  {host.profileImage ? (
                    <img
                      src={host.profileImage}
                      alt={host.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentNode.style.background =
                          COLORS[i % COLORS.length];
                      }}
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">
                      {host.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-gray-600 max-w-[56px] truncate text-center">
                  {host.firstName || host.name.split(" ")[0]}
                </span>
              </div>
            ))
          )}
        </div>
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
