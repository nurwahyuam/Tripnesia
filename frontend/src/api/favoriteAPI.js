// api/favoriteAPI.js
import { apiFetch } from "../lib/api";

export const favoriteAPI = {
  // Get user's favorites
  getFavorites: () => apiFetch("/favorites"),

  // Add to favorites
  addToFavorites: (shipId) => 
    apiFetch("/favorites", {
      method: "POST",
      body: JSON.stringify({ shipId }),
    }),

  // Remove from favorites - support both methods
  removeFromFavorites: (favoriteId = null, shipId = null) => {
    if (favoriteId) {
      return apiFetch(`/favorites/${favoriteId}`, {
        method: "DELETE",
      });
    } else if (shipId) {
      // Fallback method
      return apiFetch("/favorites/remove-by-ship", {
        method: "DELETE",
        body: JSON.stringify({ shipId }),
      });
    } else {
      throw new Error("Either favoriteId or shipId is required");
    }
  },

  // Check favorite status
  checkFavoriteStatus: (shipId) => {
    const params = new URLSearchParams();
    params.append("shipId", shipId);
    
    return apiFetch(`/favorites/check?${params.toString()}`);
  },
};  