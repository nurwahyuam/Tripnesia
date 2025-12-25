// src/hooks/useConfirmedBookings.js
import { useState, useEffect } from "react";
import { bookingAPI } from "../api/bookingAPI";

export const useConfirmedBookings = (shipId) => {
  // ← hapus dateRange
  const [confirmedPaxMap, setConfirmedPaxMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shipId) {
      setConfirmedPaxMap({});
      return;
    }

    const fetchConfirmedPax = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await bookingAPI.getConfirmedPaxByShip(shipId); // ← tanpa tanggal
        const map = {};
        data.forEach((item) => {
          map[item.cabinId] = item.totalBookedPax || 0;
        });
        setConfirmedPaxMap(map);
      } catch (err) {
        setError("Failed to load cabin availability");
        console.error(err);
        setConfirmedPaxMap({});
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedPax();
  }, [shipId]);

  const getBookedPax = (cabinId) => {
    return confirmedPaxMap[cabinId] || 0;
  };

  return { confirmedPaxMap, loading, error, getBookedPax };
};
