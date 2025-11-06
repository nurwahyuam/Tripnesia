// src/hooks/useShipBySlug.js
import { useState, useEffect } from "react";
import { shipAPI } from "../api/shipAPI";

export const useShipBySlug = (slug) => {
  const [ship, setShip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Slug is required");
      return;
    }

    const fetchShip = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await shipAPI.getBySlug(slug);
        setShip(data.data); // Sesuaikan dengan struktur respons: { success: true, data: { ... } }
      } catch (err) {
        setError(err.message || "Failed to load ship details");
      } finally {
        setLoading(false);
      }
    };

    fetchShip();
  }, [slug]);

  return { ship, loading, error };
};