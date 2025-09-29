import { useState } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { login, user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);

      // redirect otomatis sesuai role
      if (accessToken !== null){
        if (user?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/customer/dashboard");
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login gagal");
    }
  };

  return { handleLogin, error };
};
