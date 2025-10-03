import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import UserDashboard from "./pages/User/Dashboard";
import AdminDashboard from "./pages/Admin/Dashboard";
import { useAuth } from "./hooks/useAuth";
import Welcome from "./pages/Guest/Welcome";
import AboutUs from "./pages/Guest/AboutUs";
import Support from "./pages/Guest/Support";

function App() {
  const { user, role } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Guest routes */}
        <Route path="/" element={!user ? <Welcome /> : <Navigate to={`/${role}/dashboard`} replace />} />
        <Route path="/about-us" element={!user ? <AboutUs /> : <Navigate to={`/${role}/dashboard`} replace />} />
        <Route path="/support" element={!user ? <Support /> : <Navigate to={`/${role}/dashboard`} replace />} />
        <Route path="/signin" element={!user ? <SignIn /> : <Navigate to={`/${role}/dashboard`} replace />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to={`/${role}/dashboard`} replace />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to={`/${role}/dashboard`} replace />} />

        {/* Customer Protected */}
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="/customer/dashboard" element={<UserDashboard />} />
        </Route>

        {/* Admin Protected */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Default route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
