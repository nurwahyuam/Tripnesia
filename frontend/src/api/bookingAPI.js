// src/api/bookingAPI.js
import { apiFetch } from "../lib/api";

export const bookingAPI = {
  getAdminBookings: () => {
    return apiFetch("/booking/admin", {
      method: "GET",
    });
  },
  getUserBookings: (status = null) => {
    const params = status ? `?status=${status}` : "";
    return apiFetch(`/booking${params}`, {
      method: "GET",
    });
  },
  createBooking: (data) =>
    apiFetch("/booking", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getBookingById: (id) =>
    apiFetch(`/booking/${id}`, {
      method: "GET",
    }),
  cancelBooking: (id) =>
    apiFetch(`/booking/${id}/cancel`, {
      method: "PATCH",
    }),
  checkActiveBooking: (shipId) =>
    apiFetch(`/booking/customer/check-active/${shipId}`, {
      method: "GET",
    }),
  getConfirmedPaxByShip: (shipId) =>
    apiFetch(`/booking/confirmed-pax/${shipId}`, {
      method: "GET",
    }),
};
