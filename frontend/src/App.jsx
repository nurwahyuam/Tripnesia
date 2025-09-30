import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/User/Dashboard";
import { useAuth } from "./hooks/useAuth";
import Welcome from "./pages/Guest/Welcome";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Guest routes */}
        <Route path="/" element={!user ? <Welcome /> : <Navigate to={`/${user.role}/dashboard`} replace />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}/dashboard`} replace />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to={`/${user.role}/dashboard`} replace />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to={`/${user.role}/dashboard`} replace />} />

        {/* Customer Protected */}
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="/customer/dashboard" element={<Dashboard />} />
        </Route>

        {/* Admin Protected */}
        {/* <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route> */}

        {/* Default route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
