// src/hooks/useLogout.js
import { useAuth } from "./useAuth";

export const useLogout = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  return { handleLogout };
};
