// src/pages/Guest/Payment.jsx
import React, { useState } from "react";
import CustomerLayout from "../../../layouts/CustomerLayout";
import Breadcrumb from "../../../components/Breadcrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getImageUrl } from "../../../lib/getImageUrl";
import { formatDate } from "../../../lib/dateFormatter";
import PaymentMethodSelector from "../../../components/PaymentMethodSelector";
import useMidtransPayment from "../../../hooks/useMidtransPayment";
import { paymentAPI } from "../../../api/paymentAPI";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking: bookingData } = location.state || {};
  const b = bookingData;

  console.log("Booking Data:", b);

  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const clientKey = import.meta.env.VITE_REACT_APP_MIDTRANS_CLIENT_KEY;

  const { isSnapReady, error: snapError, openPaymentPopup } = useMidtransPayment(clientKey);

  console.log("Is Snap Ready:", isSnapReady);

  if (!b) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-8 text-center text-red-500">
          <h2>No booking data found.</h2>
          <Link to="/customer" className="text-blue-500 mt-4 inline-block">
            Go to Home
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  const handlePay = async () => {
    if (!isSnapReady) {
      setPaymentError("Payment system is not ready. Please try again.");
      return;
    }

    setLoading(true);
    setPaymentError(null);

    try {
      const { token } = await paymentAPI.createMidtransToken(b._id, b.schedule_names[0]);

      openPaymentPopup(token, {
        onSuccess: () => {
          navigate(`/customer/product`);
        },
        onPending: () => {
          navigate(`/customer/product/${b.ship_id.slug}/invoice`, { state: { booking: b } });
        },
        onError: () => {
          setPaymentError("Payment failed. Please try again.");
        },
        onClose: () => {
          setPaymentError("Payment was cancelled.");
        },
      });
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError(err.message || "Failed to start payment process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      {(snapError || paymentError) && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-md text-white z-50 bg-red-500`}>
          {snapError || paymentError}
        </div>
      )}
      <Breadcrumb />
      <div className="container mx-auto px-4 py-8">
        <Link to={`/customer/product/${b.ship_id.slug}/invoice`} className="flex items-center gap-2 mb-4 text-sm">
          <ArrowLeft size={18} />
          Back to Invoice
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kiri: Metode Pembayaran */}
          <div className="w-full">
            <div className="border border-gray-300 rounded-xl p-6 bg-white">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <PaymentMethodSelector />

              <button
                onClick={handlePay}
                disabled={loading || !isSnapReady}
                className={`w-full mt-6 py-3 rounded-xl text-white font-medium transition-colors ${loading || !isSnapReady ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"}`}
              >
                {loading ? "Processing..." : "Confirm Pay"}
              </button>
            </div>
          </div>

          {/* Kanan: Detail Trip */}
          <div className="w-full">
            <div className="border border-gray-300 rounded-xl p-6 bg-white">
              <div className="flex gap-4 mb-4">
                <div className="w-1/3">
                  <img
                    src={getImageUrl(b.ship_id.image_ship)}
                    alt={b.ship_id.name}
                    className="rounded-xl w-full h-32 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                </div>
                <div className="w-2/3">
                  <h3 className="font-semibold capitalize">
                    {b.schedule_names[0]} {b.ship_id.type} With {b.ship_id.name}
                  </h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {formatDate(new Date(b.cabins[0]?.cabin_id?.date_start))} – {formatDate(new Date(b.cabins[0]?.cabin_id?.date_end))}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-yellow-400 px-2 py-1 rounded-full">{b.ship_id.type}</span>
                    <span className="bg-sky-400 px-2 py-1 rounded-full">{b.ship_id.merk}</span>
                    <span className="bg-emerald-400 px-2 py-1 rounded-full">{b.ship_id.class}</span>
                  </div>
                </div>
              </div>

              <hr className="my-4 border-gray-300" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total Payment</span>
                <span>IDR {b.total_price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Payment;
