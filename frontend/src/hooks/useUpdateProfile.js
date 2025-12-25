// src/hooks/useUpdateProfile.js
import { useState, useCallback } from "react";
import { userAPI } from "../api/userAPI";

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const clearMessage = useCallback(() => {
    setMessage(null);
    setError(null);
  }, []);

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Validasi: pastikan userId ada
      if (!profileData.userId) {
        throw new Error("User ID is required");
      }

      console.log("Updating profile with data:", profileData); // Untuk debugging

      // Panggil API untuk mengupdate profil
      const result = await userAPI.updateProfile(profileData);
      
      setMessage({ 
        type: "success", 
        text: "Profile updated successfully!" 
      });
      return result
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to update profile.";
      setError(errorMsg);
      setMessage({ 
        type: "error", 
        text: errorMsg 
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error, message, clearMessage };
};