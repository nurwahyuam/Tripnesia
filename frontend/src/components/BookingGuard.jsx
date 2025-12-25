// src/components/BookingGuard.jsx
import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCheckActiveBooking } from "../hooks/useCheckActiveBooking";
import { useShips } from "../hooks/useShips";

const BookingGuard = ({ children }) => {
  const { ships } = useShips();
  const { check: checkActiveBooking } = useCheckActiveBooking(); // ✅ hanya ambil `check`
  const [hasPendingBooking, setHasPendingBooking] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState(null);
  const location = useLocation();

  const checkedShipsRef = useRef(new Set());
  const isCheckingRef = useRef(false); // 🔒 cegah re-entrancy

  useEffect(() => {
    if (!ships || isCheckingRef.current) return;

    isCheckingRef.current = true;

    const checkAllBookings = async () => {
      let pendingFound = false;
      let bookingId = null;

      for (const ship of ships) {
        // Skip jika sudah dicek
        if (checkedShipsRef.current.has(ship._id)) {
          continue;
        }

        checkedShipsRef.current.add(ship._id);

        try {
          // ✅ Gunakan return value langsung, jangan andalkan `activeCheckResult`
          const checkResult = await checkActiveBooking(ship._id);

          if (checkResult?.hasActiveBooking && checkResult.status === "pending") {
            pendingFound = true;
            bookingId = checkResult.bookingId;
            break;
          }
        } catch (err) {
          console.warn("Failed to check booking for ship:", ship._id, err);
        }
      }

      setHasPendingBooking(pendingFound);
      setPendingBookingId(bookingId);
      isCheckingRef.current = false;
    };

    checkAllBookings();
  }, [ships, checkActiveBooking]); // ✅ aman, tanpa `activeCheckResult`

  if (hasPendingBooking && pendingBookingId) {
    return <Navigate to={`/customer/order/${pendingBookingId}`} state={{ from: location }} replace />;
  }

  return children;
};

export default BookingGuard;
