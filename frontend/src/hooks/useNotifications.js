// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from "react"; // ✅ tambahkan useCallback
import { notificationAPI } from "../api/notificationAPI";
import { useAuth } from "./useAuth";

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔑 Bungkus dengan useCallback
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await notificationAPI.getNotifications();
      setNotifications(data.notifications || []);
      const unread = (data.notifications || []).filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
      console.error("Fetch notifications error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]); // ✅ user sebagai dependency

  const markAsRead = useCallback(
    async (id) => {
      if (!user) return;
      try {
        await notificationAPI.markAsRead(id);
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Mark as read error:", err);
      }
    },
    [user]
  ); // ✅ opsional, tapi disarankan

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    try {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n._id);
      await Promise.all(unreadIds.map((id) => notificationAPI.markAsRead(id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark all as read error:", err);
    }
  }, [user, notifications]); // ✅ sertakan dependencies yang digunakan

  // ✅ Sekarang aman masukkan fetchNotifications ke dependency
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]); // ✅ tidak ada error lagi

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};
