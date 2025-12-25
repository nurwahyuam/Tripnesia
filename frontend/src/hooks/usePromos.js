import { useState, useEffect, useCallback } from "react";
import { promoAPI } from "../api/promoAPI";

export const usePromos = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

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

      // 🔁 Konversi ke format backend
      let discount_value, discount_type;
      if (promoData.percentage !== "" && promoData.percentage != null) {
        discount_value = Number(promoData.percentage);
        discount_type = "percentage";
      } else if (promoData.price !== "" && promoData.price != null) {
        discount_value = Number(promoData.price);
        discount_type = "fixed";
      } else {
        throw new Error("Harus isi persentase atau harga diskon");
      }

      const payload = {
        code: promoData.code,
        description: promoData.description,
        discount_value,
        discount_type,
        start_date: promoData.start_date,
        end_date: promoData.end_date,
        status: promoData.status,
        user_id: promoData.user_id || null, // opsional
        min_pax: promoData.min_pax || 1,
      };

      await promoAPI.create(payload);
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

      // 🔁 Konversi ke format backend
      let discount_value, discount_type;
      if (promoData.percentage !== "" && promoData.percentage != null) {
        discount_value = Number(promoData.percentage);
        discount_type = "percentage";
      } else if (promoData.price !== "" && promoData.price != null) {
        discount_value = Number(promoData.price);
        discount_type = "fixed";
      } else {
        throw new Error("Harus isi persentase atau harga diskon");
      }

      const payload = {
        code: promoData.code,
        description: promoData.description,
        discount_value,
        discount_type,
        start_date: promoData.start_date,
        end_date: promoData.end_date,
        status: promoData.status,
        user_id: promoData.user_id || null,
        min_pax: promoData.min_pax || 1,
      };

      await promoAPI.update(id, payload);
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
