// src/hooks/useCheckActiveBooking.js (Ubah nama file)
import { useState, useCallback } from "react";
import { bookingAPI } from "../api/bookingAPI";

export const useCheckActiveBooking = () => {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});
  const [result, setResult] = useState({});

  const check = useCallback(async (shipId) => {
    const id = shipId;
    setLoading(prev => ({ ...prev, [id]: true }));
    setError(prev => ({ ...prev, [id]: null }));
    setResult(prev => ({ ...prev, [id]: null }));

    try {
      // Gunakan fungsi API baru
      const data = await bookingAPI.checkActiveBooking(id);
      setResult(prev => ({ ...prev, [id]: data }));
      return data;
    } catch (err) {
      const errorMsg = err.message || "Failed to check active booking.";
      setError(prev => ({ ...prev, [id]: errorMsg }));
      console.error("Check Active Booking Error:", err);
      return { hasActiveBooking: false, error: errorMsg };
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  }, []);

  return { check, loading, error, result };
};