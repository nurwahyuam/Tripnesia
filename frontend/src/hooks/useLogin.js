// src/hooks/useLogin.js
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const { setUser, setAccessToken } = useAuthContext();

  const login = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // simpan cookie refresh token
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login gagal");

      setAccessToken(data.accessToken);
      setUser(data.user);

      return data;
    } catch (err) {
      throw err;
    }
  };

  return { login };
};
