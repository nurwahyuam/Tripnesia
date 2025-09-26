// src/hooks/useSignup.js
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const { setUser } = useAuthContext();

  const signup = async (name, email, password, role, number_telephone, support) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, number_telephone, support }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup gagal");

      setUser(data.user);
      return data;
    } catch (err) {
      throw err;
    }
  };

  return { signup };
};
