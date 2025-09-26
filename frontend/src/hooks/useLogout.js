// src/hooks/useLogout.js
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { setUser, setAccessToken } = useAuthContext();

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      setAccessToken(null);
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  return { logout };
};
