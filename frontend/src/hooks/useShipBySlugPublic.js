// src/hooks/useShipBySlug.js
import { useState, useEffect } from "react";
import { shipAPI } from "../api/shipAPI";

export const useShipBySlugPublic = (slug) => {
  const [shipPublic, setShipPublic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Slug is required");
      return;
    }

    const fetchShipPublic = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await shipAPI.getBySlugPublic(slug);
        setShipPublic(data.data); 
      } catch (err) {
        setError(err.message || "Failed to load ship details");
      } finally {
        setLoading(false);
      }
    };

    fetchShipPublic();
  }, [slug]);

  return { shipPublic, loading, error };
};