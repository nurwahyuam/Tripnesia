import { apiFetch } from "../lib/api";

export const cabinAPI = {
  getAll: () => apiFetch("/cabins"),
  create: (data) => apiFetch("/cabins", { method: "POST", body: data }),
  update: (id, data) => apiFetch(`/cabins/${id}`, { method: "PUT", body: data }),
  delete: (id) => apiFetch(`/cabins/${id}`, { method: "DELETE" }),
};