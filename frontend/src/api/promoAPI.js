import { apiFetch, apiFetchPublic } from "../lib/api";

export const promoAPI = {
  getAll: () => apiFetch("/promos"),
  create: (data) =>
    apiFetch("/promos", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiFetch(`/promos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiFetch(`/promos/${id}`, {
      method: "DELETE",
    }),
  getByCode: (code, shipId = null) => {
    const url = shipId ? `/promos/code?code=${code}&shipId=${shipId}` : `/promos/code?code=${code}`;
    return apiFetchPublic(url);
  },
};
