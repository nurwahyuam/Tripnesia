import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        // apiFetch sudah langsung lempar error kalau !res.ok
        const data = await apiFetch("/auth/refresh", {
          method: "POST",
          credentials: "include", // penting biar cookie HttpOnly terkirim
          headers: { "Content-Type": "application/json" },
        });

        if (data?.accessToken) {
          setAccessToken(data.accessToken);
        } else {
          setUser(null);
          setAccessToken(null);
        }
      } catch (err) {
        console.error("Gagal refresh token", err);
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    refreshToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, accessToken, setAccessToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
