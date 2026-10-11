// //user-frontend
// // App.jsx
// import {
//   createBrowserRouter,
//   RouterProvider,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import ComingSoonPage from "./pages/ComingSoonPage";
// import SignupPage from "./pages/SignupPage";
// import LoginPage from "./pages/LoginPage";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// import VerifyOTPPage from "./pages/VerifyOTPPage";
// import ResetPasswordPage from "./pages/ResetPasswordPage";
// import HomePage from "./pages/HomePage";
// import AccountPage from "./pages/AccountPage";
// import EditProfilePage from "./pages/EditProfilePage";
// import ReportProblemPage from "./pages/ReportProblemPage";
// import TalktimeWalletPage from "./pages/TalktimeWalletPage";
// import UserLiveRoomPage from "./pages/UserLiveRoomPage";
// import TalktimeTransactionsPage from "./pages/TalktimeTransactionsPage";
// import RechargePage from "./pages/RechargePage";
// import RechargeSuccessPage from "./pages/RechargeSuccessPage";
// import SettingsPage from "./pages/SettingsPage";
// import HostingPlansPage from "./pages/HostingPlansPage";

// function RequireAuth({ children }) {
//   const { user, loading } = useAuth();
//   if (loading) return null;
//   return user ? children : <Navigate to="/signin" replace />;
// }

// function PublicOnly({ children }) {
//   const { user, loading } = useAuth();
//   if (loading) return null;
//   return !user ? children : <Navigate to="/home" replace />;
// }

// const router = createBrowserRouter(
//   [
//     // ✅ Coming Soon is now the first page
//     { path: "/", element: <ComingSoonPage /> },
//     { path: "/coming-soon", element: <ComingSoonPage /> },

//     {
//       path: "/signup",
//       element: (
//         <PublicOnly>
//           <SignupPage />
//         </PublicOnly>
//       ),
//     },
//     {
//       path: "/signin",
//       element: (
//         <PublicOnly>
//           <LoginPage />
//         </PublicOnly>
//       ),
//     },
//     {
//       path: "/forgot-password",
//       element: (
//         <PublicOnly>
//           <ForgotPasswordPage />
//         </PublicOnly>
//       ),
//     },
//     { path: "/verify-otp", element: <VerifyOTPPage /> },
//     { path: "/reset-password", element: <ResetPasswordPage /> },
//     {
//       path: "/home",
//       element: (
//         <RequireAuth>
//           <HomePage />
//         </RequireAuth>
//       ),
//     },
//     {
//       path: "/account",
//       element: (
//         <RequireAuth>
//           <AccountPage />
//         </RequireAuth>
//       ),
//     },
//     {
//       path: "/edit-profile",
//       element: (
//         <RequireAuth>
//           <EditProfilePage />
//         </RequireAuth>
//       ),
//     },
//     {
//       path: "/report-problem",
//       element: (
//         <RequireAuth>
//           <ReportProblemPage />
//         </RequireAuth>
//       ),
//     },
//     {
//       path: "/talktime-wallet",
//       element: (
//         <RequireAuth>
//           <TalktimeWalletPage />
//         </RequireAuth>
//       ),
//     },
//     {
//       path: "/talktime-transactions",
//       element: (
//         <RequireAuth>
//           <TalktimeTransactionsPage />
//         </RequireAuth>
//       ),
//     },
//     //newcd
//     {
//       path: "/recharge",
//       element: (
//         <RequireAuth>
//           <RechargePage />
//         </RequireAuth>
//       ),
//     },
//     {
//       path: "/recharge-success",
//       element: (
//         <RequireAuth>
//           <RechargeSuccessPage />
//         </RequireAuth>
//       ),
//     },
//     //end
//     {
//       path: "/settings",
//       element: (
//         <RequireAuth>
//           <SettingsPage />
//         </RequireAuth>
//       ),
//     },
//     //end
//     { path: "/hosting-plans", element: <HostingPlansPage /> },
//     //end
//     {
//       path: "/live-room",
//       element: (
//         <RequireAuth>
//           <UserLiveRoomPage />
//         </RequireAuth>
//       ),
//     },
//   ],
//   {
//     future: { v7_relativeSplatPath: true, v7_startTransition: true },
//   },
// );

// export default function App() {
//   return (
//     <AuthProvider>
//       <RouterProvider router={router} />
//     </AuthProvider>
//   );
// }

//==part 2
//user-frontend
// App.jsx
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ComingSoonPage from "./pages/ComingSoonPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import EditProfilePage from "./pages/EditProfilePage";
import ReportProblemPage from "./pages/ReportProblemPage";
import TalktimeWalletPage from "./pages/TalktimeWalletPage";
import UserLiveRoomPage from "./pages/UserLiveRoomPage";
import TalktimeTransactionsPage from "./pages/TalktimeTransactionsPage";
import RechargePage from "./pages/RechargePage";
import RechargeSuccessPage from "./pages/RechargeSuccessPage";
import SettingsPage from "./pages/SettingsPage";
import HostingPlansPage from "./pages/HostingPlansPage";
//user-admin
import UserAdminDashboard from "./UserAdminDashboard";

// In dev, connect to the Vite server, which proxies /socket.io to host-backend
const SOCKET_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? window.location.origin : "https://redcheery.com");

function LiveNotificationToast() {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);
  const timerRefs = useRef({});

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-notifications");
    });

    socket.on("new-room", (data) => {
      const id = Date.now();
      setNotifications((prev) => [...prev.slice(-2), { ...data, id }]);
      timerRefs.current[id] = setTimeout(() => dismissNotif(id), 6000);
    });

    return () => {
      Object.values(timerRefs.current).forEach(clearTimeout);
      socket.disconnect();
    };
  }, []);

  const dismissNotif = (id) => {
    clearTimeout(timerRefs.current[id]);
    delete timerRefs.current[id];
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClick = (notif) => {
    dismissNotif(notif.id);
    window.location.href = "/home";
  };

  if (notifications.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes rc-slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(30px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes rc-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 45, 85, 0.5); }
          50%       { box-shadow: 0 0 0 8px rgba(255, 45, 85, 0); }
        }
        @keyframes rc-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
        .rc-notif-toast {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          z-index: 99999;
          width: 92%;
          max-width: 360px;
          background: linear-gradient(135deg, #1a0a10 0%, #2d0f1a 100%);
          border: 1px solid rgba(255, 45, 85, 0.35);
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04);
          cursor: pointer;
          overflow: hidden;
          animation: rc-slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .rc-notif-toast:active { transform: translateX(-50%) scale(0.97); }
        .rc-notif-inner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 14px 16px;
        }
        .rc-notif-avatar-wrap { position: relative; flex-shrink: 0; }
        .rc-notif-avatar {
          width: 46px; height: 46px; border-radius: 50%;
          object-fit: cover; border: 2px solid rgba(255, 45, 85, 0.6);
        }
        .rc-notif-live-badge {
          position: absolute; bottom: -3px; left: 50%;
          transform: translateX(-50%);
          background: #ff2d55; color: white; font-size: 8px;
          font-weight: 800; letter-spacing: 0.5px; padding: 1px 5px;
          border-radius: 4px; border: 1.5px solid #1a0a10;
          animation: rc-pulse 1.5s ease-in-out infinite;
        }
        .rc-notif-text { flex: 1; min-width: 0; }
        .rc-notif-title {
          color: #fff; font-size: 13.5px; font-weight: 700; margin-bottom: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          font-family: "Nunito", sans-serif;
        }
        .rc-notif-sub {
          color: rgba(255,255,255,0.55); font-size: 11.5px;
          font-family: "Nunito", sans-serif;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .rc-notif-sub span { color: #ff6b9d; font-weight: 600; }
        .rc-notif-cta {
          flex-shrink: 0;
          background: linear-gradient(135deg, #ff2d55, #ff6b9d);
          color: white; font-size: 11px; font-weight: 800;
          padding: 6px 12px; border-radius: 20px; letter-spacing: 0.3px;
          font-family: "Nunito", sans-serif; text-transform: uppercase;
        }
        .rc-notif-dismiss {
          position: absolute; top: 8px; right: 10px;
          color: rgba(255,255,255,0.3); font-size: 16px; line-height: 1;
          cursor: pointer; padding: 2px 4px; z-index: 1;
        }
        .rc-notif-dismiss:hover { color: rgba(255,255,255,0.7); }
        .rc-notif-progress {
          height: 2px;
          background: linear-gradient(90deg, #ff2d55, #ff6b9d);
          animation: rc-progress 6s linear forwards;
          border-radius: 0 0 18px 18px;
        }
        .rc-notif-type-badge {
          display: inline-flex; align-items: center; gap: 3px;
          background: rgba(255, 45, 85, 0.15);
          border: 1px solid rgba(255, 45, 85, 0.25);
          color: #ff6b9d; font-size: 10px; font-weight: 700;
          padding: 2px 7px; border-radius: 10px; margin-top: 4px;
          font-family: "Nunito", sans-serif; text-transform: capitalize;
        }
      `}</style>

      {notifications.map((notif, index) => (
        <div
          key={notif.id}
          className="rc-notif-toast"
          style={{ bottom: `${80 + index * 90}px` }}
          onClick={() => handleClick(notif)}
        >
          <span
            className="rc-notif-dismiss"
            onClick={(e) => {
              e.stopPropagation();
              dismissNotif(notif.id);
            }}
          >
            ×
          </span>
          <div className="rc-notif-inner">
            <div className="rc-notif-avatar-wrap">
              <img
                className="rc-notif-avatar"
                src={
                  notif.hostAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(notif.hostName || "H")}&background=ff2d55&color=fff`
                }
                alt={notif.hostName}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(notif.hostName || "H")}&background=ff2d55&color=fff`;
                }}
              />
              <div className="rc-notif-live-badge">LIVE</div>
            </div>
            <div className="rc-notif-text">
              <div className="rc-notif-title">
                🎉 {notif.hostName} is now live!
              </div>
              <div className="rc-notif-sub">
                "<span>{notif.roomName}</span>"
              </div>
              <div className="rc-notif-type-badge">
                {notif.roomType === "single"
                  ? "👤"
                  : notif.roomType === "double"
                    ? "👥"
                    : "🎉"}{" "}
                {notif.roomType} room
              </div>
            </div>
            <div className="rc-notif-cta">Join</div>
          </div>
          <div className="rc-notif-progress" />
        </div>
      ))}
    </>
  );
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/signin" replace />;
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/home" replace />;
}

const router = createBrowserRouter(
  [
    { path: "/", element: <ComingSoonPage /> },
    { path: "/coming-soon", element: <ComingSoonPage /> },
    {
      path: "/signup",
      element: (
        <PublicOnly>
          <SignupPage />
        </PublicOnly>
      ),
    },
    {
      path: "/signin",
      element: (
        <PublicOnly>
          <LoginPage />
        </PublicOnly>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <PublicOnly>
          <ForgotPasswordPage />
        </PublicOnly>
      ),
    },
    { path: "/verify-otp", element: <VerifyOTPPage /> },
    { path: "/reset-password", element: <ResetPasswordPage /> },
    {
      path: "/home",
      element: (
        <RequireAuth>
          <HomePage />
        </RequireAuth>
      ),
    },
    {
      path: "/account",
      element: (
        <RequireAuth>
          <AccountPage />
        </RequireAuth>
      ),
    },
    {
      path: "/edit-profile",
      element: (
        <RequireAuth>
          <EditProfilePage />
        </RequireAuth>
      ),
    },
    {
      path: "/report-problem",
      element: (
        <RequireAuth>
          <ReportProblemPage />
        </RequireAuth>
      ),
    },
    {
      path: "/talktime-wallet",
      element: (
        <RequireAuth>
          <TalktimeWalletPage />
        </RequireAuth>
      ),
    },
    {
      path: "/talktime-transactions",
      element: (
        <RequireAuth>
          <TalktimeTransactionsPage />
        </RequireAuth>
      ),
    },
    {
      path: "/recharge",
      element: (
        <RequireAuth>
          <RechargePage />
        </RequireAuth>
      ),
    },
    {
      path: "/recharge-success",
      element: (
        <RequireAuth>
          <RechargeSuccessPage />
        </RequireAuth>
      ),
    },
    {
      path: "/settings",
      element: (
        <RequireAuth>
          <SettingsPage />
        </RequireAuth>
      ),
    },
    { path: "/hosting-plans", element: <HostingPlansPage /> },
    //user-admin
    { path: "/user-admin", element: <UserAdminDashboard /> },
    {
      path: "/live-room",
      element: (
        <RequireAuth>
          <UserLiveRoomPage />
        </RequireAuth>
      ),
    },
  ],
  { future: { v7_relativeSplatPath: true, v7_startTransition: true } },
);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <LiveNotificationToast />
    </AuthProvider>
  );
}
