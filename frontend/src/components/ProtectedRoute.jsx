import { Navigate, Outlet } from "react-router-dom";
// import dari hook, bukan dari Context langsung
import { useAuth } from "../hooks/useAuth";  

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  // cek role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return user.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/customer/dashboard" replace />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
