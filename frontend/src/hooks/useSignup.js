import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export const useSignup = () => {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSignup = async (name, email, password, number_telephone, support = false) => {
    try {
      await signup({ name, email, password, number_telephone, support });

      // redirect otomatis sesuai role
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
      setSuccess("Berhasil Sign Up");
    } catch (err) {
      setError(err.response?.data?.error || "Signup gagal");
    }
  };

  return { handleSignup, error, setError, success };
};
