import { useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  // Inisialisasi dari localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("accessToken") || null;
  });

  const axiosAuth = axios.create({
    baseURL: "http://localhost:4000/api/auth",
    withCredentials: true,
  });

  // Interceptor untuk refresh token otomatis
  axiosAuth.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;
      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { data } = await axiosAuth.get("/refresh");
          setAccessToken(data.accessToken);
          localStorage.setItem("accessToken", data.accessToken); // update localStorage
          originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
          return axiosAuth(originalRequest);
        } catch {
          logout();
        }
      }
      return Promise.reject(err);
    }
  );

  const signup = async (payload) => {
    const { data } = await axiosAuth.post("/signup", payload);
    setUser(data.user);
    setAccessToken(data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("accessToken", data.accessToken);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await axiosAuth.post("/login", { email, password });
    setUser(data.user);
    setAccessToken(data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("accessToken", data.accessToken);
    return data;
  };

  const logout = async () => {
    await axiosAuth.post("/logout").catch(() => {}); // ignore error
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  return <AuthContext.Provider value={{ user, accessToken, signup, login, logout, axiosAuth }}>{children}</AuthContext.Provider>;
};
