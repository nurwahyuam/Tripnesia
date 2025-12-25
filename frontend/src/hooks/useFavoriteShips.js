// hooks/useFavoriteShips.js
import { useState, useEffect, useCallback } from "react";
import { favoriteAPI } from "../api/favoriteAPI";
import { useAuth } from "./useAuth";

export const useFavoriteShips = () => {
  const { user } = useAuth();
  const [favoriteShips, setFavoriteShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch favorite ships dengan cabins
  const fetchFavoriteShips = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await favoriteAPI.getFavorites();
      setFavoriteShips(response.favorites || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch favorites";
      setError(errorMsg);
      setFavoriteShips([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Remove ship from favorites by favoriteId
  const removeFromFavorites = useCallback(async (favoriteId) => {
    try {
      // Optimistic update - remove from UI immediately
      setFavoriteShips(prev => prev.filter(ship => ship.favorite_id !== favoriteId));
      
      await favoriteAPI.removeFromFavorites(favoriteId);
      return true;
    } catch (err) {
      // Revert on error - refetch data
      const errorMsg = err.response?.data?.message || "Failed to remove from favorites";
      setError(errorMsg);
      fetchFavoriteShips(); // Refetch to restore correct state
      return false;
    }
  }, [fetchFavoriteShips]);

  // Remove by shipId - for direct removal
  const removeFromFavoritesByShipId = useCallback(async (shipId) => {
    try {
      // Find favoriteId for this ship
      const shipToRemove = favoriteShips.find(ship => ship._id === shipId);
      if (shipToRemove && shipToRemove.favorite_id) {
        return await removeFromFavorites(shipToRemove.favorite_id);
      }
      return false;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to remove from favorites";
      setError(errorMsg);
      return false;
    }
  }, [favoriteShips, removeFromFavorites]);

  // Refresh favorites
  const refreshFavorites = useCallback(() => {
    fetchFavoriteShips();
  }, [fetchFavoriteShips]);

  // Fetch on mount and when user changes
  useEffect(() => {
    fetchFavoriteShips();
  }, [fetchFavoriteShips]);

  return {
    favoriteShips,
    loading,
    error,
    removeFromFavorites,
    removeFromFavoritesByShipId,
    refreshFavorites
  };
};