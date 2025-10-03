import { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";

export const AuthProvider = ({ children }) => {
  // Inisialisasi dari localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [role, setRole] = useState(() => {
    if (user) {
      const decoded = jwtDecode(localStorage.getItem("accessToken"));
      return decoded.role;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      const decoded = jwtDecode(token);
      setRole(decoded.role); // ambil role dari token
    }
  }, []);

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

  return <AuthContext.Provider value={{ role, user, accessToken, signup, login, logout, forgotPassword, checkOTP, resetPassword, axiosAuth }}>{children}</AuthContext.Provider>;
};
