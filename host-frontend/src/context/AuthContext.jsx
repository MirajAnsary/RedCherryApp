// //host-frontend
// // src/context/AuthContext.jsx
// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import { setAccessToken, clearAccessToken, apiFetch } from "../utils/api";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /**
//    * On mount: try to rehydrate session from the HTTP-only refresh token cookie
//    * by calling /refresh-token. If it succeeds we're logged in silently.
//    */
//   useEffect(() => {
//     async function rehydrate() {
//       try {
//         const res = await fetch("/api/host/auth/refresh-token", {
//           method: "POST",
//           credentials: "include",
//         });
//         if (res.ok) {
//           const data = await res.json();
//           if (data.accessToken) {
//             setAccessToken(data.accessToken);
//             // Fetch profile
//             const meRes = await apiFetch("/api/host/auth/me");
//             if (meRes.ok) {
//               const meData = await meRes.json();
//               setUser(meData.user);
//             }
//           }
//         }
//       } catch {
//         // No session — that's fine
//       } finally {
//         setLoading(false);
//       }
//     }
//     rehydrate();
//   }, []);

//   const login = useCallback((userData, accessToken) => {
//     setAccessToken(accessToken);
//     setUser(userData);
//   }, []);

//   const logout = useCallback(async () => {
//     try {
//       await fetch("/api/host/auth/logout", {
//         method: "POST",
//         credentials: "include",
//       });
//     } catch {
//       // Ignore errors — always clear local state
//     }
//     clearAccessToken();
//     setUser(null);
//   }, []);

//   const updateUser = useCallback((fields) => {
//     setUser((prev) => ({ ...prev, ...fields }));
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // eslint-disable-next-line react-refresh/only-export-components
// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
//   return ctx;
// }

//v2
//host-frontend
// src/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { setAccessToken, clearAccessToken, apiFetch } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * On mount: try to rehydrate session from the HTTP-only refresh token cookie
   * by calling /refresh-token. If it succeeds we're logged in silently.
   */
  useEffect(() => {
    async function rehydrate() {
      try {
        const res = await fetch("/api/host/auth/refresh-token", {
          method: "POST",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.accessToken) {
            setAccessToken(data.accessToken);
            // Fetch profile
            const meRes = await apiFetch("/api/host/auth/me");
            if (meRes.ok) {
              const meData = await meRes.json();
              setUser(meData.user);
            }
          }
        }
      } catch {
        // No session — that's fine
      } finally {
        setLoading(false);
      }
    }
    rehydrate();
  }, []);

  const login = useCallback((userData, accessToken) => {
    setAccessToken(accessToken);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/host/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore errors — always clear local state
    }
    clearAccessToken();
    setUser(null);
  }, []);

  const updateUser = useCallback((fields) => {
    setUser((prev) => ({ ...prev, ...fields }));
  }, []);

  // Re-fetch the latest host profile from the server (earnings, balance, etc.)
  const refreshUser = useCallback(async () => {
    try {
      const meRes = await apiFetch("/api/host/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        setUser(meData.user);
      }
    } catch {
      // Silently ignore — stale data is better than a crash
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateUser, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
