// src/hooks/useCreateBooking.js
import { useState, useCallback } from "react";
import { bookingAPI } from "../api/bookingAPI";

export const useCreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const clearMessage = useCallback(() => {
    setMessage(null);
    setError(null);
  }, []);

  const createBooking = async (bookingData) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await bookingAPI.createBooking(bookingData);
      setMessage(result.message);

      return result;
    } catch (err) {
      const errorMsg = err.message || "Failed to create booking.";
      setError(errorMsg);
      setMessage(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error, message, clearMessage };
};
