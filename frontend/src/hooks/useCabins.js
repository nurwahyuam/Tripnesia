import { useState, useEffect, useCallback } from "react";
import { shipAPI } from "../api/shipAPI";
import { cabinAPI } from "../api/cabinAPI";

export const useCabins = () => {
  const [ships, setShips] = useState([]);
  const [cabins, setCabins] = useState([]);
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

  const fetchCabins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cabinAPI.getAll();
      setCabins(data);
    } catch (err) {
      setError(err.message || "Gagal mengambil data kabin kapal");
      setMessage({ type: "error", text: err.message || "Gagal memuat data kabin kapal" });
    } finally {
      setLoading(false);
    }
  }, []);

  const createCabin = async (shipData) => {
    try {
      setLoading(true);
      setError(null);
      await cabinAPI.create(shipData);
      await fetchCabins();
      setMessage({ type: "success", text: "Data Kabin Kapal berhasil dibuat!" });
    } catch (err) {
      const msg = err.message || "Gagal membuat data kabin kapal";
      setError(msg);
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const updateCabin = async (id, shipData) => {
    try {
      setLoading(true);
      setError(null);
      await cabinAPI.update(id, shipData);
      await fetchCabins();
      setMessage({ type: "success", text: "Data Kabin Kapal berhasil diperbarui!" });
    } catch (err) {
      const msg = err.message || "Gagal memperbarui data kabin kapal";
      setError(msg);
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const deleteCabin = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await cabinAPI.delete(id);
      await fetchCabins();
      setMessage({ type: "success", text: "Data Kabin Kapal berhasil dihapus!" });
    } catch (err) {
      const msg = err.message || "Gagal menghapus data kabin kapal";
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
    fetchCabins();
    fetchShips();
  }, [fetchCabins, fetchShips]);

  return {
    ships,
    cabins,
    loading,
    error,
    message,
    clearMessage,
    fetchCabins,
    createCabin,
    updateCabin,
    deleteCabin,
  };
};
