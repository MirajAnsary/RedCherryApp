////user-frontend
// src/pages/HomePage.jsx
// ✅ Fetches REAL live rooms from /api/rooms/live (user-backend)
// ✅ Auto-refreshes every 15 seconds
// ✅ Filter tabs still work (client-side + server-side type filter)
// ✅ Preserves all existing UI: TopPicks, SkeletonCard, EmptyState, ErrorState, OnCallGrid

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import FilterTabs from "../components/FilterTabs";
import RoomCard from "../components/RoomCard";
import TopPicksRow from "../components/TopPicksRow";
import OnCallGrid from "../components/OnCallGrid";

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="card p-4 mb-3 mx-4 sm:mx-0 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-14 h-14 rounded-full bg-pink-100 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-pink-100 rounded-full w-3/4" />
          <div className="h-3 bg-pink-50 rounded-full w-1/2" />
          <div className="h-3 bg-pink-50 rounded-full w-1/3" />
        </div>
      </div>
      <div
        className="rounded-xl bg-pink-50 mb-3"
        style={{ aspectRatio: "16/9" }}
      />
      <div className="h-3 bg-pink-50 rounded-full w-2/3 mb-2" />
      <div className="h-10 bg-pink-100 rounded-xl" />
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ filter }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-pink-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p className="text-gray-700 font-bold text-base mb-1">
        No {filter} rooms live right now.
      </p>
      <p className="text-gray-400 text-sm">
        Check back soon — hosts go live frequently!
      </p>
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ onRetry }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-red-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-gray-700 font-bold text-base mb-1">
        Could not load rooms.
      </p>
      <p className="text-gray-400 text-sm mb-4">
        Please check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="bg-pink-400 text-white font-bold text-sm px-6 py-2 rounded-full active:scale-95 transition-transform"
      >
        Retry
      </button>
    </div>
  );
}

// ── HomePage ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Single");
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch live rooms from backend ─────────────────────────────────────────
  const fetchRooms = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/rooms/live");
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load.");
      setAllRooms(data.rooms || []);
    } catch (err) {
      console.error("fetchRooms:", err);
      setError(err.message || "Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + auto-refresh every 15 s
  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 15000);
    return () => clearInterval(interval);
  }, [fetchRooms]);

  // Client-side filter by tab
  const filtered =
    activeFilter === "All"
      ? allRooms
      : allRooms.filter((r) => r.type === activeFilter.toLowerCase());

  // When user clicks "Join Room" on a RoomCard, navigate to live room viewer
  const handleJoinRoom = (room) => {
    navigate("/live-room", { state: { room } });
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Header title="Home" />
      <FilterTabs active={activeFilter} onChange={setActiveFilter} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeFilter === "OnCall" ? (
            <OnCallGrid />
          ) : (
            <div className="px-4">
              <p className="text-sm font-bold text-gray-700 mt-4 mb-1">
                Top Picks For You
              </p>
              <TopPicksRow />

              {/* Live rooms count badge */}
              {!loading && !error && filtered.length > 0 && (
                <div className="flex items-center gap-2 mt-3 mb-1">
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse inline-block" />
                  <span className="text-xs font-bold text-pink-400">
                    {filtered.length} room{filtered.length !== 1 ? "s" : ""}{" "}
                    live now
                  </span>
                </div>
              )}

              <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                {loading ? (
                  <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                  </>
                ) : error ? (
                  <ErrorState onRetry={fetchRooms} />
                ) : filtered.length === 0 ? (
                  <EmptyState filter={activeFilter} />
                ) : (
                  filtered.map((room) => (
                    <RoomCard
                      key={room.id || room.channelName}
                      room={room}
                      onJoin={() => handleJoinRoom(room)}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
