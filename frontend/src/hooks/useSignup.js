import { useState } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";


export const useSignup = () => {
  const { signup, user } = useAuth();
  const navigate = useNavigate()
  const [error, setError] = useState(null);

  const handleSignup = async (name, email, password, number_telephone, support = false) => {
    try {
      await signup({ name, email, password, number_telephone, support });

      // redirect otomatis sesuai role
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Signup gagal");
    }
  };

  return { handleSignup, error };
};
