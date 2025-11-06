// src/hooks/useLogout.js
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      sessionStorage.setItem("reloadOnce", "true");

      navigate("/");
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  return { handleLogout };
};
