// hooks/usePromoByCode.js
import { useState, useCallback } from "react";
import { promoAPI } from "../api/promoAPI";

export const usePromoByCode = () => {
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPromoByCode = useCallback(async (code, shipId = null) => {
    if (!code.trim()) {
      setError("Kode voucher harus diisi");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await promoAPI.getByCode(code, shipId);
      setPromo(data);
      return data;
    } catch (err) {
      setError(err.message || "Gagal mengambil promo");
      setPromo(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearPromo = useCallback(() => {
    setPromo(null);
    setError(null);
  }, []);

  return { promo, fetchPromoByCode, loading, error, clearPromo };
};