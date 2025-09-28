import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

const UserLayout = () => {
  const { user } = useAuthContext();

  console.log(user);
  const { logout } = useLogout();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/user/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <Link to="/dashboard" className="font-bold text-lg">
          MyApp
        </Link>
        <nav className="flex gap-4">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
            Logout
          </button>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
