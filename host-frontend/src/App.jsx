// //host-frontend
// // src/App.jsx
// import {
//   createBrowserRouter,
//   RouterProvider,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";

// import SignupPage from "./pages/SignupPage";
// import LoginPage from "./pages/LoginPage";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// import VerifyOTPPage from "./pages/VerifyOTPPage";
// import ResetPasswordPage from "./pages/ResetPasswordPage";
// import HomePage from "./pages/HomePage";
// import AccountPage from "./pages/AccountPage";
// import EditProfilePage from "./pages/EditProfilePage";
// import MyImagesPage from "./pages/MyImagesPage";
// import MyVideoPage from "./pages/MyVideoPage";
// import AuditionVideoPage from "./pages/AuditionVideoPage";
// import MyKYCPage from "./pages/MyKYCPage";
// import BankDetailsPage from "./pages/BankDetailsPage";
// import WithdrawPage from "./pages/WithdrawPage";
// import WithdrawalHistoryPage from "./pages/WithdrawalHistoryPage";
// import FAQPage from "./pages/FAQPage";
// import OnCallPage from "./pages/OnCallPage"; // ✅ NEW
// import LiveRoomPage from "./pages/LiveRoomPage";

// import AdminDashboard from "./AdminDashboard";

// function RequireAuth({ children }) {
//   const { user, loading } = useAuth();
//   if (loading) return null;
//   return user ? children : <Navigate to="/host/signin" replace />;
// }
// function PublicOnly({ children }) {
//   const { user, loading } = useAuth();
//   if (loading) return null;
//   return !user ? children : <Navigate to="/host/home" replace />;
// }

// const router = createBrowserRouter([
//   {
//     path: "/host",
//     children: [
//       { index: true, element: <Navigate to="signin" replace /> },
//       {
//         path: "signup",
//         element: (
//           <PublicOnly>
//             <SignupPage />
//           </PublicOnly>
//         ),
//       },
//       {
//         path: "signin",
//         element: (
//           <PublicOnly>
//             <LoginPage />
//           </PublicOnly>
//         ),
//       },
//       {
//         path: "forgot-password",
//         element: (
//           <PublicOnly>
//             <ForgotPasswordPage />
//           </PublicOnly>
//         ),
//       },
//       { path: "verify-otp", element: <VerifyOTPPage /> },
//       { path: "reset-password", element: <ResetPasswordPage /> },

//       {
//         path: "home",
//         element: (
//           <RequireAuth>
//             <HomePage />
//           </RequireAuth>
//         ),
//       },
//       {
//         path: "oncall", // ✅ NEW
//         element: (
//           <RequireAuth>
//             <OnCallPage />
//           </RequireAuth>
//         ),
//       },
//       //new
//       {
//         path: "live",
//         element: (
//           <RequireAuth>
//             <LiveRoomPage />
//           </RequireAuth>
//         ),
//       },
//       //end
//       {
//         path: "account",
//         element: (
//           <RequireAuth>
//             <AccountPage />
//           </RequireAuth>
//         ),
//       },
//       {
//         path: "edit-profile",
//         element: (
//           <RequireAuth>
//             <EditProfilePage />
//           </RequireAuth>
//         ),
//       },
//       {
//         path: "images",
//         element: (
//           <RequireAuth>
//             <MyImagesPage />
//           </RequireAuth>
//         ),
//       },
//       {
//         path: "video",
//         element: (
//           <RequireAuth>
//             <MyVideoPage />
//           </RequireAuth>
//         ),
//       },
//       {
//         path: "audition",
//         element: (
//           <RequireAuth>
//             <AuditionVideoPage />
//           </RequireAuth>
//         ),
//       },
//       {
//         path: "kyc",
//         element: (
//           <RequireAuth>
//             <MyKYCPage />
//           </RequireAuth>
//         ),
//       },
//       {
//         path: "bank",
//         element: (
//           <RequireAuth>
//             <BankDetailsPage />
//           </RequireAuth>
//         ),
//       },
//       {
//         path: "withdraw",
//         element: (
//           <RequireAuth>
//             <WithdrawPage />
//           </RequireAuth>
//         ),
//       },
//       {
//         path: "history",
//         element: (
//           <RequireAuth>
//             <WithdrawalHistoryPage />
//           </RequireAuth>
//         ),
//       },
//       {
//         path: "faq",
//         element: (
//           <RequireAuth>
//             <FAQPage />
//           </RequireAuth>
//         ),
//       },
//     ],
//   },
//   { path: "/admin", element: <AdminDashboard /> },
//   { path: "*", element: <Navigate to="/host/signin" replace /> },
// ]);

// export default function App() {
//   return (
//     <AuthProvider>
//       <RouterProvider router={router} />
//     </AuthProvider>
//   );
// }

///for notification
//host-frontend
// App.jsx
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LiveRoomPage from "./pages/LiveRoomPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import EditProfilePage from "./pages/EditProfilePage";
import MyImagesPage from "./pages/MyImagesPage";
import MyVideoPage from "./pages/MyVideoPage";
import AuditionVideoPage from "./pages/AuditionVideoPage";
import MyKYCPage from "./pages/MyKYCPage";
import BankDetailsPage from "./pages/BankDetailsPage";
import WithdrawPage from "./pages/WithdrawPage";
import WithdrawalHistoryPage from "./pages/WithdrawalHistoryPage";
import FAQPage from "./pages/FAQPage";
import OnCallPage from "./pages/OnCallPage"; // ✅ NEW
import AdminDashboard from "./AdminDashboard";
import AgencyDashboard from "./AgencyDashboard";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/host/signin" replace />;
}
function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/host/home" replace />;
}

const router = createBrowserRouter([
  {
    path: "/host",
    children: [
      { index: true, element: <Navigate to="signin" replace /> },
      {
        path: "signup",
        element: (
          <PublicOnly>
            <SignupPage />
          </PublicOnly>
        ),
      },
      {
        path: "signin",
        element: (
          <PublicOnly>
            <LoginPage />
          </PublicOnly>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <PublicOnly>
            <ForgotPasswordPage />
          </PublicOnly>
        ),
      },
      { path: "verify-otp", element: <VerifyOTPPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      {
        path: "home",
        element: (
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        ),
      },
      {
        path: "oncall", // ✅ NEW
        element: (
          <RequireAuth>
            <OnCallPage />
          </RequireAuth>
        ),
      },
      {
        path: "live",
        element: (
          <RequireAuth>
            <LiveRoomPage />
          </RequireAuth>
        ),
      },

      {
        path: "account",
        element: (
          <RequireAuth>
            <AccountPage />
          </RequireAuth>
        ),
      },
      {
        path: "edit-profile",
        element: (
          <RequireAuth>
            <EditProfilePage />
          </RequireAuth>
        ),
      },
      {
        path: "images",
        element: (
          <RequireAuth>
            <MyImagesPage />
          </RequireAuth>
        ),
      },
      {
        path: "video",
        element: (
          <RequireAuth>
            <MyVideoPage />
          </RequireAuth>
        ),
      },
      {
        path: "audition",
        element: (
          <RequireAuth>
            <AuditionVideoPage />
          </RequireAuth>
        ),
      },
      {
        path: "kyc",
        element: (
          <RequireAuth>
            <MyKYCPage />
          </RequireAuth>
        ),
      },
      {
        path: "bank",
        element: (
          <RequireAuth>
            <BankDetailsPage />
          </RequireAuth>
        ),
      },
      {
        path: "withdraw",
        element: (
          <RequireAuth>
            <WithdrawPage />
          </RequireAuth>
        ),
      },
      {
        path: "history",
        element: (
          <RequireAuth>
            <WithdrawalHistoryPage />
          </RequireAuth>
        ),
      },
      {
        path: "faq",
        element: (
          <RequireAuth>
            <FAQPage />
          </RequireAuth>
        ),
      },
    ],
  },
  { path: "/host/admin", element: <AdminDashboard /> },
  { path: "/host/agency", element: <AgencyDashboard /> },
  { path: "*", element: <Navigate to="/host/signin" replace /> },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
