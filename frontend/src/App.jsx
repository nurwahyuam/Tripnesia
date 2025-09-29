import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import Dashboard from "./pages/User/Dashboard";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Guest routes */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to={`/${user.role}/dashboard`} replace />}
        />
        <Route
          path="/forget-password"
          element={!user ? <ForgetPassword /> : <Navigate to={`/${user.role}/dashboard`} replace />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to={`/${user.role}/dashboard`} replace />}
        />

        {/* Customer Protected */}
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="/customer/dashboard" element={<Dashboard />} />
        </Route>

        {/* Admin Protected */}
        {/* <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route> */}

        {/* Default route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
