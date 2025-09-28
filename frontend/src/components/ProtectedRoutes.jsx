import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuthContext();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
