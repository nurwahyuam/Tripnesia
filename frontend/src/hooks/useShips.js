import { useState, useEffect, useCallback } from "react";
import { shipAPI } from "../api/shipAPI";

export const useShips = () => {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Hapus pesan setelah beberapa detik
  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  const fetchShips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await shipAPI.getAll();
      setShips(data);
    } catch (err) {
      setError(err.message || "Gagal mengambil data kapal");
      setMessage({ type: "error", text: err.message || "Gagal memuat data kapal" });
    } finally {
      setLoading(false);
    }
  }, []);

  const getShipById = useCallback(async (id) => {
    try {
      setError(null);
      const data = await shipAPI.getById(id);
      return data;
    } catch (err) {
      setError(err.message || "Gagal mengambil data detail kapal");
      setMessage({ type: "error", text: err.message || "Gagal memuat data detail kapal" });
      throw err;
    }
  }, []);

  const createShip = async (shipData) => {
    try {
      setLoading(true);
      setError(null);
      await shipAPI.create(shipData);
      await fetchShips();
      setMessage({ type: "success", text: "Data Kapal berhasil dibuat!" });
    } catch (err) {
      const msg = err.message || "Gagal membuat data kapal";
      setError(msg);
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const updateShip = async (id, shipData) => {
    try {
      setLoading(true);
      setError(null);
      await shipAPI.update(id, shipData);
      await fetchShips();
      setMessage({ type: "success", text: "Data Kapal berhasil diperbarui!" });
    } catch (err) {
      const msg = err.message || "Gagal memperbarui data kapal";
      setError(msg);
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const deleteShip = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await shipAPI.delete(id);
      await fetchShips();
      setMessage({ type: "success", text: "Data Kapal berhasil dihapus!" });
    } catch (err) {
      const msg = err.message || "Gagal menghapus data kapal";
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
    fetchShips();
  }, [fetchShips]);

  return {
    ships,
    loading,
    error,
    message,
    clearMessage,
    fetchShips,
    getShipById,
    createShip,
    updateShip,
    deleteShip,
  };
};
