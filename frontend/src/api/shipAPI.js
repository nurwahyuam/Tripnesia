import { apiFetch } from "../lib/api";

export const shipAPI = {
  getAll: () => apiFetch("/ships"),
  getById: (id) => apiFetch(`/ships/${id}`),
  create: (data) => apiFetch("/ships", { method: "POST", body: data }), // ✅ kirim apa adanya
  update: (id, data) => apiFetch(`/ships/${id}`, { method: "PUT", body: data }), // ✅
  delete: (id) => apiFetch(`/ships/${id}`, { method: "DELETE" }),
};