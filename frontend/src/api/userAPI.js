import { apiFetch } from "../lib/api";

export const userAPI = {
  getAll: () => apiFetch("/users"),
  create: (data) =>
    apiFetch("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiFetch(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiFetch(`/users/${id}`, {
      method: "DELETE",
    }),
};
