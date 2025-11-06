import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";

const ProtectedRoute = ({ allowedRoles }) => {
  const { role, user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return role === "admin" ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/customer/dashboard" replace />;
  }

  return (
    <>
      {role === "admin" ? (
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      ) : (
        <CustomerLayout>
          <Outlet />
        </CustomerLayout>
      )}
    </>
  );
};

export default ProtectedRoute;
