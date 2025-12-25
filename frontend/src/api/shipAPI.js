import { apiFetch, apiFetchPublic } from "../lib/api";

export const shipAPI = {
  getAll: () => apiFetch("/ships/customer"),
  getAllPublic: () => apiFetchPublic("/ships/public"),
  getBySlug: (slug) => apiFetch(`/ships/customer/${slug}`),
  getBySlugPublic: (slug) => apiFetchPublic(`/ships/public/${slug}`),
  getById: (id) => apiFetch(`/ships/${id}`),
  create: (data) => apiFetch("/ships", { method: "POST", body: data }), // ✅ kirim apa adanya
  update: (id, data) => apiFetch(`/ships/${id}`, { method: "PUT", body: data }), // ✅
  delete: (id) => apiFetch(`/ships/${id}`, { method: "DELETE" }),
};
