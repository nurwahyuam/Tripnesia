import { Outlet } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const GuestLayout = () => {
  const { user } = useAuthContext();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Wrapper auth page */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default GuestLayout;
