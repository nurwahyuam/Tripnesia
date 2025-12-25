import { apiFetch } from "../lib/api";

export const adminAPI = {
  getDashboard: () => apiFetch('/dashboard/admin', { method: 'GET' }),
};