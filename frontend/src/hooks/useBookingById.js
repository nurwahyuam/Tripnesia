import { useState, useEffect } from "react";
import { bookingAPI } from "../api/bookingAPI";

export const useBookingById = (id) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Id is required");
      return;
    }

    const fetchShip = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await bookingAPI.getBookingById(id);
        setBooking(data.booking); 
      } catch (err) {
        setError(err.message || "Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchShip();
  }, [id]);

  return { booking, loading, error };
};