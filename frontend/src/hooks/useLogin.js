import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { login, user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleLogin = async (email, password, slug = null, fromCheckout = false) => {
    try {
      await login(email, password);

      if (accessToken !== null) {
        if (user?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          // Jika login dari checkout, redirect ke checkout
          if (fromCheckout && slug) {
            navigate(`/customer/product/${slug}/checkout`);
          } else {
            // Jika login langsung dari halaman login, redirect ke dashboard
            navigate("/customer/dashboard");
          }
        }
      }
      setSuccess("Berhasil Log In");
    } catch (err) {
      setError(err.response?.data?.error || "Login gagal");
    }
  };

  return { handleLogin, error, success };
};