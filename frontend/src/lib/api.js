export const URL_API = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${URL_API}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

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
