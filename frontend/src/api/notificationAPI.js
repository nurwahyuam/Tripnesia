import { apiFetch } from "../lib/api";

export const notificationAPI = {
  getNotifications: () => apiFetch("/notifications", { method: "GET" }),
  markAsRead: (id) => apiFetch(`/notifications/${id}/read`, { method: "PATCH" }),
};