// components/FavoriteButton.jsx
import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";

const FavoriteButton = ({ shipId, size = 20, className = "", onToggle }) => {
  const { addToFavorites, removeFromFavorites, checkFavoriteStatus, loading } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check favorite status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      setIsChecking(true);
      try {
        const status = await checkFavoriteStatus(shipId);
        setIsFavorite(status);
      } catch (error) {
        console.error("Error checking favorite status:", error);
        setIsFavorite(false);
      } finally {
        setIsChecking(false);
      }
    };

    if (shipId) {
      checkStatus();
    }
  }, [shipId, checkFavoriteStatus]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading || isChecking) return;

    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    try {
      if (newFavoriteStatus) {
        await addToFavorites(shipId);
      } else {
        await removeFromFavorites(shipId);
      }
      
      // Call callback if provided
      if (onToggle) {
        onToggle(newFavoriteStatus);
      }
    } catch (error) {
      // Revert on error
      setIsFavorite(!newFavoriteStatus);
      console.error("Error toggling favorite:", error);
    }
  };

  if (isChecking) {
    return (
      <div className={`p-2 rounded-full bg-white/80 backdrop-blur-sm ${className}`}>
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-200 ${
        isFavorite 
          ? "bg-red-500/90 hover:bg-red-600" 
          : "bg-white/80 backdrop-blur-sm hover:bg-white"
      } ${className}`}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        size={size}
        className={`transition-all duration-200 ${
          isFavorite 
            ? "fill-white text-white" 
            : "text-gray-600 hover:text-red-500"
        } ${loading ? "opacity-50" : ""}`}
      />
    </button>
  );
};

export default FavoriteButton;