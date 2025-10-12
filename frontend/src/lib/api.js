export const URL_API = import.meta.env.VITE_API_URL;

const refreshToken = async () => {
  const res = await fetch(`${URL_API}/auth/refresh`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Gagal refresh token");

  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken);
  return data.accessToken;
};

export const apiFetch = async (endpoint, options = {}) => {
  let token = localStorage.getItem("accessToken");

  // Deteksi apakah body adalah FormData
  const isFormData = options.body instanceof FormData;

  // Hanya set Content-Type jika BUKAN FormData
  const headers = {
    ...(isFormData 
      ? {} // ❌ JANGAN set Content-Type untuk FormData
      : { "Content-Type": "application/json" }
    ),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  let res = await fetch(`${URL_API}${endpoint}`, {
    credentials: "include",
    headers,
    ...options,
  });
  
  if (res.status === 401 || res.status === 403) {
    try {
      const newToken = await refreshToken();
      const retryHeaders = {
        ...(isFormData 
          ? {} 
          : { "Content-Type": "application/json" }
        ),
        Authorization: `Bearer ${newToken}`,
        ...(options.headers || {}),
      };

      res = await fetch(`${URL_API}${endpoint}`, {
        credentials: "include",
        headers: retryHeaders,
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