// src/hooks/useUserBookings.js
import { useState, useEffect } from "react";
import { bookingAPI } from "../api/bookingAPI";

export const useUserBookings = (status = null) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await bookingAPI.getUserBookings(status);
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err.message || "Failed to fetch bookings.");
        console.error("Fetch User Bookings Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [status]);

  return { bookings, loading, error };
};