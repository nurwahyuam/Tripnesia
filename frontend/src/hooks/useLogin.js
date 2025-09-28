import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const { setUser, setAccessToken } = useAuthContext();

  const login = async (email, password) => {
    const res = await fetch("http://localhost:4000/api/auth/login", {
      // pakai URL lengkap
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    let data = {};
    try {
      const text = await res.text();
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      console.error("Gagal parse JSON login:", err);
    }

    if (!res.ok) {
      // biar error detail ditampilkan
      throw new Error(data.message || "Login gagal");
    }

    setAccessToken(data.accessToken);
    setUser(data.user);

    return data;
  };

  return { login };
};
