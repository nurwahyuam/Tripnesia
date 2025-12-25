import { useState, useCallback } from "react";
import { userAPI } from "../api/userAPI";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const clearMessage = useCallback(() => {
    setMessage(null);
    setError(null);
  }, []);

  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (!passwordData.userId) {
        throw new Error("User ID is required");
      }

      const result = await userAPI.changePassword(passwordData);
      
      setMessage({ 
        type: "success", 
        text: "Password changed successfully!" 
      });
      
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to change password.";
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

  return { changePassword, loading, error, message, clearMessage };
};