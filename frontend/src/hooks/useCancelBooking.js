// src/hooks/useCancelBooking.js
import { useState } from "react";
import { bookingAPI } from "../api/bookingAPI";

export const useCancelBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const cancelBooking = async (bookingId) => {
    if (!bookingId) {
      setError("Booking ID is required");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await bookingAPI.cancelBooking(bookingId);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err.message || "Failed to cancel booking");
      throw err; // agar bisa ditangani di komponen
    } finally {
      setLoading(false);
    }
  };

  return { cancelBooking, loading, error, success };
};