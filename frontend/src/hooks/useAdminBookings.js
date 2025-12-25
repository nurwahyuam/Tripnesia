// src/hooks/useAdminBookings.js
import { useState, useEffect, useCallback } from "react";
import { bookingAPI } from "../api/bookingAPI";

export const useAdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState({
    totalBookings: 0,
    totalPending: 0,
    totalConfirmed: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const clearMessage = useCallback(() => setMessage(null), []);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingAPI.getAdminBookings(); // pastikan API sudah ada
      setBookings(response.bookings || []);
      setSummary(response.summary || {
        totalBookings: 0,
        totalPending: 0,
        totalConfirmed: 0,
        totalRevenue: 0,
      });
    } catch (err) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = async (id) => {
    try {
      await bookingAPI.cancelBooking(id);
      setMessage({ type: "success", text: "Booking cancelled successfully" });
      fetchBookings();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to cancel booking" });
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    summary,
    loading,
    error,
    message,
    clearMessage,
    cancelBooking,
    refetch: fetchBookings,
  };
};