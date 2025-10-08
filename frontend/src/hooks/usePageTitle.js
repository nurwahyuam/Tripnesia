  import { useEffect } from "react";
  import { useLocation } from "react-router-dom";

  export const usePageTitle = () => {
    const location = useLocation();
    const appName = import.meta.env.VITE_APP_NAME || "TripNesia";

    useEffect(() => {
      const path = location.pathname;

      let pageTitle = "Welcome";

      if (path === "/") pageTitle = "Welcome";
      else if (path === "/about-us") pageTitle = "About Us";
      else if (path === "/support") pageTitle = "Support";
      else if (path === "/product") pageTitle = "Product";
      else if (path === "/login") pageTitle = "Login";
      else if (path === "/register") pageTitle = "Register";
      else if (path === "/forgot-password") pageTitle = "Forgot Password";
      else if (path.startsWith("/customer/dashboard")) pageTitle = "Customer Dashboard";

      else if (path.startsWith("/admin/dashboard")) pageTitle = "Admin Dashboard"
      else if (path.startsWith("/admin/users")) pageTitle = "Users Management";
      else if (path.startsWith("/admin/ships")) pageTitle = "Ships Management"
      else if (path.startsWith("/admin/cabins")) pageTitle = "Cabins Management"
      else if (path.startsWith("/admin/bookings")) pageTitle = "Bookings Management";
      else if (path.startsWith("/admin/transactions")) pageTitle = "Transactions Management";
      else if (path.startsWith("/admin/promos")) pageTitle = "Promos Management";

      document.title = `${pageTitle} | ${appName}`;
    }, [location, appName]);
  };