import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // ✅ inisialisasi null
  const [accessToken, setAccessToken] = useState(null); // ✅ jangan ambil dari localStorage di 

  const updateLocalUser = useCallback((updatedUserData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedUserData };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  // 🔑 Inisialisasi dari localStorage hanya di useEffect
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const decoded = jwtDecode(token);

        setUser(parsedUser);
        setRole(decoded.role);
        setAccessToken(token);
      } catch (error) {
        console.error("Invalid auth data in localStorage", error);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }
    }
  }, []);

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
    // decode token untuk ambil role
    const decoded = jwtDecode(data.accessToken);
    setRole(decoded.role); // set role di state saja
  };

  const login = async (email, password) => {
    const { data } = await axiosAuth.post("/login", { email, password });

    setUser(data.user); // simpan user di state
    setAccessToken(data.accessToken); // simpan token di state/localStorage
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("accessToken", data.accessToken);

    // decode token untuk ambil role
    const decoded = jwtDecode(data.accessToken);
    setRole(decoded.role); // set role di state saja
  };

  const logout = async () => {
    await axiosAuth.post("/logout").catch(() => {}); // ignore error
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  const forgotPassword = async (email) => {
    await axiosAuth.post("/forgot-password", { email });
  };

  const checkOTP = async (email, code) => {
    await axiosAuth.post("/otp-check", { email, code });
  };

  const resetPassword = async (email, code, password) => {
    await axiosAuth.post("/reset-password", { email, code, password });
  };

  return <AuthContext.Provider value={{ role, user, accessToken, signup, login, logout, forgotPassword, checkOTP, resetPassword, axiosAuth, updateLocalUser, }}>{children}</AuthContext.Provider>;
};
