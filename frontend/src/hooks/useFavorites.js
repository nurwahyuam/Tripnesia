// hooks/useFavorites.js
import { useState, useCallback } from "react";
import { favoriteAPI } from "../api/favoriteAPI";
import { useAuth } from "./useAuth";

export const useFavorites = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add to favorites
  const addToFavorites = useCallback(
    async (shipId) => {
      if (!user) {
        setError("Please login to add favorites");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        await favoriteAPI.addToFavorites(shipId);
        return true;
      } catch (err) {
        const errorMsg = err.response?.data?.message || "Failed to add to favorites";
        setError(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Remove from favorites
  const removeFromFavorites = useCallback(
    async (shipId) => {
      if (!user) {
        setError("Please login to remove favorites");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        // First check favorite status to get favoriteId
        const statusResponse = await favoriteAPI.checkFavoriteStatus(shipId);

        if (statusResponse.isFavorite && statusResponse.favoriteId) {
          // Remove by favoriteId
          await favoriteAPI.removeFromFavorites(statusResponse.favoriteId);
        } else {
          // Fallback: remove by shipId (for backward compatibility)
          await favoriteAPI.removeFromFavorites(null, shipId);
        }

        return true;
      } catch (err) {
        const errorMsg = err.response?.data?.message || "Failed to remove from favorites";
        setError(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Check favorite status
  const checkFavoriteStatus = useCallback(
    async (shipId) => {
      if (!user) return false;

      try {
        const response = await favoriteAPI.checkFavoriteStatus(shipId);
        return response.isFavorite;
      } catch (err) {
        console.error("Check favorite status error:", err);
        return false;
      }
    },
    [user]
  );

  return {
    addToFavorites,
    removeFromFavorites,
    checkFavoriteStatus,
    loading,
    error,
  };
};
