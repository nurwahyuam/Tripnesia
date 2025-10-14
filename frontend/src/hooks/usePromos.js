import { useState, useEffect, useCallback } from "react";
import { promoAPI } from "../api/promoAPI";

export const usePromos = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Hapus pesan setelah beberapa detik
  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  const fetchPromos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await promoAPI.getAll();
      setPromos(data);
    } catch (err) {
      setError(err.message || "Gagal mengambil data promo");
      setMessage({ type: "error", text: err.message || "Gagal memuat data promo" });
    } finally {
      setLoading(false);
    }
  }, []);

  const createPromo = async (promoData) => {
    try {
      setLoading(true);
      setError(null);
      await promoAPI.create(promoData);
      await fetchPromos();
      setMessage({ type: "success", text: "Data Promo berhasil dibuat!" });
    } catch (err) {
      const msg = err.message || "Gagal membuat data promo";
      setError(msg);
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const updatePromo = async (id, promoData) => {
    try {
      setLoading(true);
      setError(null);
      await promoAPI.update(id, promoData);
      await fetchPromos();
      setMessage({ type: "success", text: "Data Promo berhasil diperbarui!" });
    } catch (err) {
      const msg = err.message || "Gagal memperbarui data promo";
      setError(msg);
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const deletePromo = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await promoAPI.delete(id);
      await fetchPromos();
      setMessage({ type: "success", text: "Data Promo berhasil dihapus!" });
    } catch (err) {
      const msg = err.message || "Gagal menghapus data promo";
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
    fetchPromos();
  }, [fetchPromos]);

  return {
    promos,
    loading,
    error,
    message,
    clearMessage,
    fetchPromos,
    createPromo,
    updatePromo,
    deletePromo,
  };
};