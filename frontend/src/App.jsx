import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { usePageTitle } from "./hooks/usePageTitle";
import { useAuth } from "./hooks/useAuth";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Welcome from "./pages/Guest/Welcome";
import AboutUs from "./pages/Guest/AboutUs";
import Support from "./pages/Guest/Support";
import GuestProduct from "./pages/Guest/Product/Index";
import GuestProductDetail from "./pages/Guest/Product/Detail";
import GuestProductCheckout from "./pages/Guest/Product/Checkout";

import UserDashboard from "./pages/Customer/Dashboard";
import CustomerAboutUs from "./pages/Customer/AboutUs";
import CustomerSupport from "./pages/Customer/Support";
import CustomerProfile from "./pages/Customer/Profile";
import CustomerProduct from "./pages/Customer/Product/Index";
import CustomerProductDetail from "./pages/Customer/Product/Detail";
import CustomerProductCheckout from "./pages/Customer/Product/Checkout";
import CustomerProductInvoice from "./pages/Customer/Product/Invoice";

import AdminDashboard from "./pages/Admin/Dashboard";
import AdminUsers from "./pages/Admin/Users";
import AdminShips from "./pages/Admin/Ships";
import AdminCabins from "./pages/Admin/Cabins";
import AdminBookings from "./pages/Admin/Bookings";
import AdminTransactions from "./pages/Admin/Transactions";
import AdminPromos from "./pages/Admin/Promos";
import BookingGuard from "./components/BookingGuard";

function App() {
  const { user, role } = useAuth();
  usePageTitle();

  return (
    <Routes>
      {/* Guest routes */}
      <Route path="/" element={!user ? <Welcome /> : <Navigate to={`/${role}/dashboard`} replace />} />
      <Route path="/about-us" element={!user ? <AboutUs /> : <Navigate to={`/${role}/dashboard`} replace />} />
      <Route path="/support" element={!user ? <Support /> : <Navigate to={`/${role}/dashboard`} replace />} />
      <Route path="/product" element={!user ? <GuestProduct /> : <Navigate to={`/${role}/dashboard`} replace />} />
      <Route path="/product/:slug" element={!user ? <GuestProductDetail /> : <Navigate to={`/${role}/dashboard`} replace />} />
      <Route path="/product/:slug/checkout" element={!user ? <GuestProductCheckout /> : <Navigate to={`/${role}/dashboard`} replace />} />

      <Route path="/login" element={!user ? <SignIn /> : <Navigate to={`/${role}/dashboard`} replace />} />
      <Route path="/register" element={!user ? <SignUp /> : <Navigate to={`/${role}/dashboard`} replace />} />
      <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to={`/${role}/dashboard`} replace />} />

      {/* Customer Protected */}
      <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
        <Route path="/customer/dashboard" element={<UserDashboard />} />
        <Route path="/customer/product" element={<CustomerProduct />} />
        <Route
          path="/customer/product/:slug"
          element={
            <BookingGuard>
              <CustomerProductDetail />
            </BookingGuard>
          }
        />
        <Route path="/customer/product/:slug/checkout" element={<CustomerProductCheckout />} />
        <Route path="/customer/product/:slug/invoice" element={<CustomerProductInvoice />} />
        <Route path="/customer/about-us" element={<CustomerAboutUs />} />
        <Route path="/customer/support" element={<CustomerSupport />} />
        <Route path="/customer/account" element={<CustomerProfile />} />
      </Route>

      {/* Admin Protected */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/ships" element={<AdminShips />} />
        <Route path="/admin/cabins" element={<AdminCabins />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/transactions" element={<AdminTransactions />} />
        <Route path="/admin/promos" element={<AdminPromos />} />
      </Route>

      {/* Default route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
