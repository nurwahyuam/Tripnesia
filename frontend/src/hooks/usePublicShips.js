// src/hooks/usePublicShips.js
import { useState, useEffect } from "react";
import { shipAPI } from "../api/shipAPI";

export const usePublicShips = () => {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadShips = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await shipAPI.getAllPublic();
        
        // Handle response structure based on your API
        if (response && response.success) {
          setShips(response.data || []);
        } else if (Array.isArray(response)) {
          setShips(response);
        } else {
          setShips([]);
        }
      } catch (err) {
        setError(err.message || "Failed to load ships");
        setShips([]);
      } finally {
        setLoading(false);
      }
    };

    loadShips();
  }, []);

  return { ships, loading, error };
};