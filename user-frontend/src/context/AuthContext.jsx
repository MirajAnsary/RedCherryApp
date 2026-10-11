// ////user-frontend
// //src/context/AuthContext.jsx
// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Rehydrate from localStorage on first load
//   useEffect(() => {
//     try {
//       const savedToken = localStorage.getItem("rc_token");
//       const savedUser = localStorage.getItem("rc_user");
//       if (savedToken && savedUser) {
//         setToken(savedToken);
//         setUser(JSON.parse(savedUser));
//       }
//     } catch {
//       // corrupted storage — clear it
//       localStorage.removeItem("rc_token");
//       localStorage.removeItem("rc_user");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const login = (userData, authToken) => {
//     setUser(userData);
//     setToken(authToken);
//     localStorage.setItem("rc_token", authToken);
//     localStorage.setItem("rc_user", JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("rc_token");
//     localStorage.removeItem("rc_user");
//   };

//   const updateUser = (updatedFields) => {
//     const merged = { ...user, ...updatedFields };
//     setUser(merged);
//     localStorage.setItem("rc_user", JSON.stringify(merged));
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, token, login, logout, updateUser, loading }}
//     >
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
////user-frontend
//src/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on first load
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("rc_token");
      const savedUser = localStorage.getItem("rc_user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // corrupted storage — clear it
      localStorage.removeItem("rc_token");
      localStorage.removeItem("rc_user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("rc_token", authToken);
    localStorage.setItem("rc_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("rc_token");
    localStorage.removeItem("rc_user");
  };

  const updateUser = (updatedFields) => {
    const merged = { ...user, ...updatedFields };
    setUser(merged);
    localStorage.setItem("rc_user", JSON.stringify(merged));
  };

  // Re-fetch fresh user data from server and update context + localStorage
  const refreshUser = useCallback(async () => {
    try {
      const savedToken = localStorage.getItem("rc_token");
      if (!savedToken) return;
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        const fresh = data.user || data;
        setUser(fresh);
        localStorage.setItem("rc_user", JSON.stringify(fresh));
      }
    } catch {
      /* silently ignore */
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, updateUser, refreshUser, loading }}
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
