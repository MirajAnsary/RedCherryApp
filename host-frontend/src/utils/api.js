//host-frontend

// src/utils/api.js
// ── Base URL ─────────────────────────────────────────────────────────────────
// In dev: Vite proxies /api → http://localhost:5000
// In prod: set VITE_API_URL env var
const BASE = import.meta.env.VITE_API_URL || "";

/**
 * In-memory access token store
 * (never persisted to localStorage — refresh token in HTTP-only cookie handles rehydration)
 */
let _accessToken = null;

export function setAccessToken(token) {
  _accessToken = token;
}

export function getAccessToken() {
  return _accessToken;
}

export function clearAccessToken() {
  _accessToken = null;
}

/**
 * Core fetch wrapper
 * Automatically attaches Authorization header if token present
 * Handles 401 → tries refresh → retries once
 */
export async function apiFetch(path, options = {}, retry = true) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (_accessToken) {
    headers["Authorization"] = `Bearer ${_accessToken}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: "include", // send cookies (for refresh token)
  });

  // Auto-refresh on 401 TOKEN_EXPIRED
  if (res.status === 401 && retry) {
    const body = await res
      .clone()
      .json()
      .catch(() => ({}));
    if (body.code === "TOKEN_EXPIRED") {
      const refreshed = await tryRefresh();
      if (refreshed) {
        return apiFetch(path, options, false); // retry once
      }
    }
  }

  return res;
}

/**
 * Attempt to get a new access token using the refresh token cookie
 */
async function tryRefresh() {
  try {
    const res = await fetch(`${BASE}/api/host/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      clearAccessToken();
      return false;
    }
    const data = await res.json();
    if (data.accessToken) {
      setAccessToken(data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ── Convenience methods ──────────────────────────────────────────────────────
const api = {
  get: (path) => apiFetch(path, { method: "GET" }),

  post: (path, body) =>
    apiFetch(path, { method: "POST", body: JSON.stringify(body) }),

  put: (path, body) =>
    apiFetch(path, { method: "PUT", body: JSON.stringify(body) }),

  patch: (path, body) =>
    apiFetch(path, { method: "PATCH", body: JSON.stringify(body) }),

  delete: (path) => apiFetch(path, { method: "DELETE" }),
};

export default api;
