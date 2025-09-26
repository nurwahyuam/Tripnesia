export const URL_API = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${URL_API}${endpoint}`, {
    credentials: "include",
    headers: {
      "Context-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => {});
    throw new Error(err.message || `API Error: ${err.status}`);
  }

  return res.json();
};
