import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const GuestLayout = () => {
  const { user } = useAuthContext();

  if (user) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center">
      {/* Wrapper auth page */}
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default GuestLayout;
