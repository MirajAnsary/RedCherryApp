// host-frontend/src/AgencyDashboard.jsx
// Agency Login + Host Dashboard — Read-only view
// Route: /agency  (served under /host/agency via Nginx)

import { useState, useEffect, useCallback } from "react";

const API_BASE = "/api/host/agency";

// ── helpers ────────────────────────────────────────────────────────────────────
function agencyFetch(path, options = {}) {
  const token = sessionStorage.getItem("rc_agency_token") || "";
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  }).then((r) => r.json());
}

function imgUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `https://redcheery.com${url}`;
  return `https://redcheery.com/${url}`;
}

// ── Badge ──────────────────────────────────────────────────────────────────────
function Badge({ status }) {
  const map = {
    verified: { bg: "#d1fae5", color: "#065f46", label: "APPROVED" },
    submitted: { bg: "#fef3c7", color: "#92400e", label: "PENDING" },
    pending: { bg: "#f3f4f6", color: "#6b7280", label: "NOT SUBMITTED" },
    rejected: { bg: "#fee2e2", color: "#991b1b", label: "REJECTED" },
  };
  const s = map[status] || {
    bg: "#f3f4f6",
    color: "#6b7280",
    label: status?.toUpperCase() || "—",
  };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

// ── LOGIN PAGE ─────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), password }),
      }).then((r) => r.json());

      if (res.success) {
        sessionStorage.setItem("rc_agency_token", res.token);
        sessionStorage.setItem("rc_agency_name", res.agencyName);
        onLogin(res.agencyName);
      } else {
        setError(res.message || "Login failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "12px 16px",
    border: `2px solid ${hasError ? "#ef4444" : "#e5e7eb"}`,
    borderRadius: 10,
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "'Inter', sans-serif",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #3b0764 0%, #7c1d6f 50%, #be185d 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        padding: 16,
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "fixed",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          background: "rgba(255,255,255,0.04)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          background: "rgba(255,255,255,0.04)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "48px 40px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 32px 64px rgba(0,0,0,0.35)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(190,24,93,0.3)",
            }}
          >
            <img
              src="/user-logo.png"
              alt="Red Cherry"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 800,
              color: "#111",
              letterSpacing: -0.5,
            }}
          >
            Red Cherry
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              color: "#6b7280",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Agency Portal
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Agency Name */}
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 6,
              }}
            >
              Agency Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your agency name"
              required
              autoFocus
              style={inputStyle(!!error)}
              onFocus={(e) => (e.target.style.borderColor = "#be185d")}
              onBlur={(e) =>
                (e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb")
              }
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24, position: "relative" }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{ ...inputStyle(!!error), paddingRight: 44 }}
                onFocus={(e) => (e.target.style.borderColor = "#be185d")}
                onBlur={(e) =>
                  (e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb")
                }
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  color: "#9ca3af",
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
            {error && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: 13,
                  marginTop: 6,
                  margin: "6px 0 0",
                }}
              >
                ⚠️ {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading
                ? "#9ca3af"
                : "linear-gradient(135deg, #be185d, #7c1d6f)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s, transform 0.1s",
              letterSpacing: 0.3,
            }}
            onMouseDown={(e) => {
              if (!loading) e.currentTarget.style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: 24,
            color: "#9ca3af",
            fontSize: 12,
          }}
        >
          Contact admin to get your agency credentials
        </p>
      </div>
    </div>
  );
}

// ── DASHBOARD ──────────────────────────────────────────────────────────────────
function Dashboard({ agencyName, onLogout }) {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState("all");

  const loadHosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await agencyFetch("/hosts");
      if (res.success) setHosts(res.hosts);
    } catch (e) {
      console.error("Failed to load hosts:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHosts();
  }, [loadHosts]);

  const filteredHosts = hosts.filter((h) => {
    const fullName = `${h.firstName} ${h.lastName}`.toLowerCase();
    const matchSearch = !search || fullName.includes(search.toLowerCase());
    const matchKyc = kycFilter === "all" || h.kyc?.status === kycFilter;
    return matchSearch && matchKyc;
  });

  // Stats
  const totalHosts = hosts.length;
  const approvedHosts = hosts.filter((h) => h.isVerified).length;
  const pendingKyc = hosts.filter((h) => h.kyc?.status === "submitted").length;
  const totalEarnings = hosts.reduce((s, h) => s + (h.earnings || 0), 0);

  const filterBtnStyle = (active) => ({
    padding: "6px 14px",
    border: `1.5px solid ${active ? "#be185d" : "#e5e7eb"}`,
    borderRadius: 20,
    background: active ? "#fce7f3" : "#fff",
    color: active ? "#be185d" : "#6b7280",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Top Nav ── */}
      <div
        style={{
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(190,24,93,0.2)",
            }}
          >
            <img
              src="/user-logo.png"
              alt="Red Cherry"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 800,
                color: "#111",
                lineHeight: 1.2,
              }}
            >
              Red Cherry
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: "#9ca3af",
                fontWeight: 500,
              }}
            >
              Agency Portal
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>
              {agencyName}
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>Agency Account</div>
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: "8px 18px",
              background: "linear-gradient(135deg, #be185d, #7c1d6f)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ⎋ Logout
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "28px 32px" }}>
        {/* Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {[
            {
              icon: "👥",
              label: "Total Hosts",
              value: totalHosts,
              color: "#3b82f6",
            },
            {
              icon: "✅",
              label: "Approved",
              value: approvedHosts,
              color: "#10b981",
            },
            {
              icon: "⏳",
              label: "Pending KYC",
              value: pendingKyc,
              color: "#f59e0b",
            },
            {
              icon: "💰",
              label: "Total Earnings",
              value: `₹${totalEarnings}`,
              color: "#be185d",
            },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: card.color + "18",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#111",
                    lineHeight: 1,
                  }}
                >
                  {card.value}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#6b7280",
                    marginTop: 3,
                  }}
                >
                  {card.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            overflow: "hidden",
          }}
        >
          {/* Table Header / Controls */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 17,
                fontWeight: 700,
                color: "#111",
              }}
            >
              Host List
              <span
                style={{
                  marginLeft: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#9ca3af",
                  background: "#f3f4f6",
                  padding: "2px 8px",
                  borderRadius: 10,
                }}
              >
                {filteredHosts.length}
              </span>
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {/* KYC filter */}
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { key: "all", label: "All" },
                  { key: "verified", label: "Approved" },
                  { key: "submitted", label: "Pending" },
                  { key: "pending", label: "Not Submitted" },
                  { key: "rejected", label: "Rejected" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setKycFilter(key)}
                    style={filterBtnStyle(kycFilter === key)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    fontSize: 14,
                  }}
                >
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search hosts…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    padding: "8px 12px 8px 32px",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: 10,
                    fontSize: 13,
                    outline: "none",
                    width: 180,
                    fontFamily: "'Inter', sans-serif",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#be185d")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              {/* Refresh */}
              <button
                onClick={loadHosts}
                style={{
                  width: 36,
                  height: 36,
                  background: "#f3f4f6",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Refresh"
              >
                🔄
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "#9ca3af",
                fontSize: 15,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
              Loading hosts…
            </div>
          ) : filteredHosts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "#9ca3af",
                fontSize: 14,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              No hosts found.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 700,
                }}
              >
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["HOST", "KYC STATUS", "ACCOUNT", "WALLET", "STATS"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 20px",
                            textAlign: "left",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#9ca3af",
                            letterSpacing: 0.8,
                            borderBottom: "1px solid #e5e7eb",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredHosts.map((host, i) => {
                    const kycStatus = host.kyc?.status || "pending";
                    const accountStatus = host.isVerified
                      ? "verified"
                      : kycStatus === "submitted"
                        ? "submitted"
                        : "pending";

                    return (
                      <tr
                        key={host._id}
                        style={{
                          borderBottom: "1px solid #f3f4f6",
                          background: i % 2 === 0 ? "#fff" : "#fafafa",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#fdf2f8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            i % 2 === 0 ? "#fff" : "#fafafa")
                        }
                      >
                        {/* HOST */}
                        <td style={{ padding: "14px 20px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                overflow: "hidden",
                                background:
                                  "linear-gradient(135deg, #fce7f3, #f3e8ff)",
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#be185d",
                                border: "2px solid #fce7f3",
                              }}
                            >
                              {host.profileImage ? (
                                <img
                                  src={imgUrl(host.profileImage)}
                                  alt=""
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.parentNode.innerText = (
                                      host.firstName?.[0] || "H"
                                    ).toUpperCase();
                                  }}
                                />
                              ) : (
                                (host.firstName?.[0] || "H").toUpperCase()
                              )}
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: "#111",
                                }}
                              >
                                {host.firstName} {host.lastName}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#9ca3af",
                                  marginTop: 1,
                                }}
                              >
                                ID: {host._id?.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* KYC STATUS */}
                        <td style={{ padding: "14px 20px" }}>
                          <Badge status={kycStatus} />
                        </td>

                        {/* ACCOUNT */}
                        <td style={{ padding: "14px 20px" }}>
                          <Badge status={accountStatus} />
                        </td>

                        {/* WALLET */}
                        <td style={{ padding: "14px 20px" }}>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: "#111",
                            }}
                          >
                            ₹{host.earnings || 0}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#9ca3af",
                              marginTop: 2,
                            }}
                          >
                            0 points
                          </div>
                        </td>

                        {/* STATS */}
                        <td style={{ padding: "14px 20px" }}>
                          <div
                            style={{
                              fontSize: 13,
                              color: "#374151",
                              fontWeight: 600,
                            }}
                          >
                            {host.totalCalls || 0} calls
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#9ca3af",
                              marginTop: 2,
                            }}
                          >
                            {host.totalMinutes || 0} min
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && filteredHosts.length > 0 && (
            <div
              style={{
                padding: "12px 24px",
                borderTop: "1px solid #f3f4f6",
                fontSize: 12,
                color: "#9ca3af",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                Showing {filteredHosts.length} of {hosts.length} hosts
              </span>
              <span>Read-only view · Agency Portal</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────────────
export default function AgencyDashboard() {
  const [agencyName, setAgencyName] = useState(
    () => sessionStorage.getItem("rc_agency_name") || null,
  );
  const [authed, setAuthed] = useState(
    () => !!sessionStorage.getItem("rc_agency_token"),
  );

  function handleLogin(name) {
    setAgencyName(name);
    setAuthed(true);
  }

  function handleLogout() {
    sessionStorage.removeItem("rc_agency_token");
    sessionStorage.removeItem("rc_agency_name");
    setAuthed(false);
    setAgencyName(null);
  }

  if (!authed) return <LoginPage onLogin={handleLogin} />;
  return <Dashboard agencyName={agencyName} onLogout={handleLogout} />;
}
