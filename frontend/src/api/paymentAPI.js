import { apiFetch } from "../lib/api";

export const paymentAPI = {
  createMidtransToken: (bookingId, scheduleName) =>
    apiFetch("/payment/midtrans/create-token", {
      method: "POST",
      body: JSON.stringify({ bookingId, scheduleName }),
    }),
};