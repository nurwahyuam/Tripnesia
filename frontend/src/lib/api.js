export const URL_API = import.meta.env.VITE_API_URL;

// 🔄 fungsi untuk refresh token ketika accessToken expired
const refreshToken = async () => {
  const res = await fetch(`${URL_API}/auth/refresh`, {
    method: "GET",
    credentials: "include", // supaya cookie refresh_token dikirim
  });

  if (!res.ok) throw new Error("Gagal refresh token");

  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken);
  return data.accessToken;
};

// 🔧 fungsi utama untuk fetch API dengan auto refresh
export const apiFetch = async (endpoint, options = {}) => {
  let token = localStorage.getItem("accessToken");

  let res = await fetch(`${URL_API}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
    ...options,
  });
  
  if (res.status === 401 || res.status === 403) {
    try {
      const newToken = await refreshToken();
      token = newToken;

      res = await fetch(`${URL_API}${endpoint}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
          ...(options.headers || {}),
        },
        ...options,
      });
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
  }

  if (!res.ok) {
    let err = {};
    try {
      err = await res.json();
    } catch {
      err = {};
    }
    throw new Error(err.message || err.error || res.statusText || `API Error: ${res.status}`);
  }

  return res.json();
};
