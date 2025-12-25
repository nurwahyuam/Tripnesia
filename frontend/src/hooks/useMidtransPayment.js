// src/hooks/useMidtransPayment.js
import { useEffect, useState } from "react";

const useMidtransPayment = (clientKey) => {
  const [isSnapReady, setIsSnapReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clientKey || typeof window === "undefined") return;

    // Cek apakah Snap sudah dimuat
    if (window.snap && window.snap.isReady) {
      setIsSnapReady(true);
      return;
    }

    // Muat Snap.js
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    script.onload = () => {
      if (window.snap) {
        setIsSnapReady(true);
      } else {
        setError("Failed to initialize Midtrans Snap");
      }
    };

    script.onerror = () => {
      setError("Failed to load Midtrans payment gateway");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [clientKey]);

  const openPaymentPopup = (token, callbacks = {}) => {
    if (!isSnapReady || !window.snap) {
      throw new Error("Midtrans Snap is not ready");
    }

    window.snap.pay(token, {
      onSuccess: () => callbacks.onSuccess?.(),
      onPending: () => callbacks.onPending?.(),
      onError: () => callbacks.onError?.(),
      onClose: () => callbacks.onClose?.(),
    });
  };

  return { isSnapReady, error, openPaymentPopup };
};

export default useMidtransPayment;
