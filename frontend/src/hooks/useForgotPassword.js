import React, { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export const useForgotPassword = () => {
  const { forgotPassword, checkOTP, resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔔 Hapus otomatis error setelah 3 detik
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // 🔔 Hapus otomatis success setelah 3 detik
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleForgotPassword = async (email) => {
    try {
      await forgotPassword(email);
      setSuccess("OTP sudah dikirim ke email Anda");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Lupa Kata Sandi Gagal");
      return false;
    }
  };

  const handleOtpCheck = async (email, code) => {
    try {
      await checkOTP(email, code);
      setSuccess("OTP berhasil");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "OTP Gagal");
      return false;
    }
  }

  const handleResetPassword = async (email, code, password) => {
    try {
      await resetPassword(email, code, password);
      setSuccess("Password berhasil diubah");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "OTP Gagal");
      return false;
    }
  };

  return { success, error, setError, handleForgotPassword, handleOtpCheck, handleResetPassword };
};
