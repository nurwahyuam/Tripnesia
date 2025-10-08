import { useState, useEffect, useCallback } from "react";
import { userAPI } from "../api/userAPI";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Hapus pesan setelah beberapa detik
  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Gagal mengambil pengguna");
      setMessage({ type: "error", text: err.message || "Gagal memuat pengguna" });
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      await userAPI.create(userData);
      await fetchUsers();
      setMessage({ type: "success", text: "Pengguna berhasil dibuat!" });
    } catch (err) {
      const msg = err.message || "Gagal membuat pengguna";
      setError(msg);
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      setError(null);
      await userAPI.update(id, userData);
      await fetchUsers();
      setMessage({ type: "success", text: "Pengguna berhasil diperbarui!" });
    } catch (err) {
      const msg = err.message || "Gagal memperbarui pengguna";
      setError(msg);
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await userAPI.delete(id);
      await fetchUsers();
      setMessage({ type: "success", text: "Pengguna berhasil dihapus!" });
    } catch (err) {
      const msg = err.message || "Gagal menghapus pengguna";
      setError(msg);
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  // Otomatis hapus pesan setelah 3 detik
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    message,
    clearMessage,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};