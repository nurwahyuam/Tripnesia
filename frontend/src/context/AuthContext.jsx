import { createContext, useState, useEffect } from "react";
import { apiFetch } from "../lib/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const res = await apiFetch("/auth/refresh", { method: "POST" });
        setAccessToken(data.accessToken);

        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken);

          // optional: fetch user profile setelah dapat token
          const profileRes = await fetch("/api/users/me", {
            headers: {
              Authorization: `Bearer ${data.accessToken}`,
            },
          });
          if (profileRes.ok) {
            const profile = await profileRes.json();
            setUser(profile);
          }
        }
      } catch (err) {
        console.error("Gagal refresh token", err);
      } finally {
        setLoading(false);
      }
    };

    refreshToken();
  }, []);

  return <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, loading }}>{children}</AuthContext.Provider>;
};
