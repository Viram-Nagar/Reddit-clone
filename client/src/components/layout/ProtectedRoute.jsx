import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const ProtectedRoute = ({
  children,
  redirectTo = "/login",
  requireAuth = true,
}) => {
  const { user, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  // Still verifying session — show spinner
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-gray-200 border-t-reddit-orange" />
          <p className="text-sm text-gray-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Auth required but no user → redirect to login
  // Save the current path so we can redirect back after login
  if (requireAuth && !user) {
    return (
      <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
    );
  }

  // Already logged in but visiting auth pages → redirect home
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ─── Guest-only route (login/register pages) ──────────
export const GuestRoute = ({ children }) => (
  <ProtectedRoute requireAuth={false} redirectTo="/">
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;

// import { Navigate } from "react-router-dom";
// import useAuthStore from "../../store/authStore";

// const ProtectedRoute = ({ children }) => {
//   const { user, isCheckingAuth } = useAuthStore();

//   if (isCheckingAuth) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-reddit-orange" />
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
