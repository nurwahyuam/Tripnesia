import React, { useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Bath, BedDouble, BedSingle, Dock, Eye, Fence, ShowerHead, Users, Wallet } from "lucide-react";
import CustomerLayout from "../../../layouts/CustomerLayout";
import Breadcrumb from "../../../components/Breadcrumb";
import InputForm from "../../../components/InputForm";
import { getImageUrl } from "../../../lib/getImageUrl";
import { formatDate } from "../../../lib/dateFormatter";
import { formatPrice } from "../../../lib/formatPrice";
import { useBookingById } from "../../../hooks/useBookingById";
import { useCancelBooking } from "../../../hooks/useCancelBooking";
import CancelTrip from "../../../assets/icons/CancelTrip.svg";
import useMidtransPayment from "../../../hooks/useMidtransPayment";
import { paymentAPI } from "../../../api/paymentAPI";

const Invoice = () => {
  const clientKey = import.meta.env.VITE_REACT_APP_MIDTRANS_CLIENT_KEY;
  const { isSnapReady, error: snapError, openPaymentPopup } = useMidtransPayment(clientKey);
  const [modalConfirmCancel, setModalConfirmCancel] = useState(false);
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState("");
  const orderIdFromUrl = searchParams.get("order_id");

  const { booking: bookingData } = location.state || {};

  let bookingId = null;
  if (bookingData?.booking?._id) {
    bookingId = bookingData.booking._id;
  } else if (orderIdFromUrl) {
    bookingId = orderIdFromUrl;
  }

  const { booking: b, loading: bookingLoading, error: bookingError } = useBookingById(bookingId || bookingData._id);

  console.log("Booking Data:", b);

  const { cancelBooking, loading: cancelLoading, error: cancelError } = useCancelBooking();

  const handleCancelTrip = async () => {
    try {
      await cancelBooking(b._id);
      setModalConfirmCancel(false);
      navigate("/customer/product");
    } catch (err) {
      console.error("Failed to cancel booking:", err);
    }
  };

  if (!bookingData) {
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

  if (bookingLoading || cancelLoading) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-8 text-center">Loading invoice...</div>
      </CustomerLayout>
    );
  }

  if (bookingError || cancelError) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-8 text-center text-red-500">Error loading invoice data.</div>
      </CustomerLayout>
    );
  }

  const totalAdult = b.cabins?.reduce((sum, cabin) => sum + (cabin.pax?.adult || 0), 0) || 0;
  const totalChild = b.cabins?.reduce((sum, cabin) => sum + (cabin.pax?.child || 0), 0) || 0;
  const totalPax = totalAdult + totalChild;

  const handlePay = async () => {
    if (!isSnapReady) {
      setPaymentError("Payment system is not ready. Please try again.");
      return;
    }

    setSuccess("");
    setLoading(true);
    setPaymentError(null);

    try {
      const { token } = await paymentAPI.createMidtransToken(b._id, b.schedule_names[0]);

      openPaymentPopup(token, {
        onSuccess: () => {
          setSuccess("Payment successful!");
          navigate(`/customer/product`);
        },
        onPending: () => {
          navigate(`/customer/product`);
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
      {(snapError || paymentError || success) && <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-md text-white z-50 ${success ? "bg-green-500" : "bg-red-500"}`}>{snapError || paymentError || success}</div>}
      <Breadcrumb />
      <div className="container mx-auto px-4 py-8">
        <Link to={`/customer/product/${slug}`} className="flex items-center gap-2 mb-4 text-sm">
          <ArrowLeft size={18} />
          Checkout Details
        </Link>

        <div className="w-full">
          <div className="border border-gray-300 rounded-2xl px-4 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <h1 className="text-2xl font-semibold">{b.invoice_code}</h1>
                <p className={`px-10 pb-0.5 text-sm ${b.status === "pending" ? "bg-amber-400" : b.status === "confirmed" ? "bg-green-500" : "bg-gray-500"} text-white rounded-full`}>{b.status === "pending" ? "Waiting Payment" : b.status === "confirmed" ? "Completed Payment" : "Not Status"}</p>
              </div>
              {b.status === "pending" && (
                <div className="flex items-center justify-between gap-4 w-1/3">
                  <button
                    onClick={() => {
                      setModalConfirmCancel(true);
                    }}
                    disabled={b.status !== "pending" || cancelLoading || !isSnapReady}
                    className="w-full px-12 py-1.5 border border-black rounded-lg text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 transition-colors"
                  >
                    Cancel Trip
                  </button>
                  <button
                    onClick={handlePay}
                    disabled={loading || !isSnapReady}
                    className={`w-full px-12 py-2 rounded-xl text-white font-medium transition-colors ${loading || !isSnapReady ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:opacity-80"}`}
                  >
                    {loading ? "Processing..." : "Confirm Pay"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Kolom Kiri: Order Info */}
          <div className="w-full">
            <div className="border border-gray-300 rounded-2xl px-4 py-5">
              <h2 className="text-xl font-semibold mb-4">Orderer Information</h2>

              <InputForm label="Full Name" type="text" value={b.personal_info?.full_name} disabled className="bg-gray-50 text-gray-600" />

              <div className="flex space-x-4 my-4">
                <label className="inline-flex items-center">
                  <input type="radio" name="title" value="Mr" checked={b.personal_info?.title === "Mr"} className="form-radio h-4 w-4 text-primary bg-gray-50" />
                  <span className="ml-2 text-gray-600">Mr</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="title" value="Mrs" checked={b.personal_info?.title === "Mrs"} className="form-radio h-4 w-4 text-primary bg-gray-50" />
                  <span className="ml-2 text-gray-600">Mrs</span>
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. Handphone <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <select className="border border-gray-300 rounded-l-md px-2 py-2 border-r-0 bg-gray-50" disabled>
                    <option>+62</option>
                  </select>
                  <input type="tel" value={b.personal_info?.phone?.replace(/^0/, "")} disabled className="rounded-l-none flex-1 border-t border-b border-r border-gray-300 pl-4 bg-gray-50 text-gray-600" />
                </div>
              </div>

              <InputForm label="Email" type="email" value={b.personal_info?.email} disabled className="bg-gray-50 text-gray-600" />
            </div>

            <div className="mt-6 border border-gray-300 rounded-2xl py-4 px-5">
              <h1 className="text-lg font-semibold capitalize mb-3">Room Details</h1>
              {b.cabins.map((cabin) => {
                const getOtherValue = (cabin, key) => {
                  const item = cabin.other?.find((item) => item.key === key);
                  return item ? item.value : null;
                };

                const bathroomValue = getOtherValue(cabin, "Bathroom");
                const balconyValue = getOtherValue(cabin, "Balcony");
                const airValue = getOtherValue(cabin, "Air");
                const tableValue = getOtherValue(cabin, "Table");
                const viewValue = getOtherValue(cabin, "View");
                return (
                  <div key={cabin._id} className="border-2 border-gray-300 rounded-xl py-3 px-3.5 mb-3">
                    <h1 className="text-md font-semibold mb-4">{cabin.cabin_name}</h1>
                    <div className="grid grid-cols-3 gap-2 w-full">
                      <span className="flex items-center font-semibold gap-2 text-sm rounded-full">
                        {cabin.bed === "Single Size" ? <BedSingle size={18} /> : <BedDouble size={18} />} {cabin.bed} Bed
                      </span>
                      <span className="flex items-center gap-2 font-semibold text-sm">
                        <Users size={18} /> {cabin.pax.adult} Adult, {cabin.pax.child} Child
                      </span>
                      {bathroomValue && (
                        <span className="text-sm flex items-center gap-2 font-semibold">
                          <Bath size={18} />
                          {bathroomValue}
                        </span>
                      )}
                      {balconyValue && (
                        <span className="text-sm flex items-center gap-2 font-semibold">
                          <Fence size={18} />
                          {balconyValue}
                        </span>
                      )}
                      {airValue && (
                        <span className="text-sm flex items-center gap-2 font-semibold">
                          <ShowerHead size={18} />
                          {airValue}
                        </span>
                      )}
                      {tableValue && (
                        <span className="text-sm flex items-center gap-2 font-semibold">
                          <Dock size={18} />
                          {tableValue}
                        </span>
                      )}
                      {viewValue && (
                        <span className="text-sm flex items-center gap-2 font-semibold">
                          <Eye size={18} />
                          {viewValue}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kolom Kanan: Booking Summary */}
          <div className="w-full">
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex gap-4">
                <div className="w-[35%]">
                  <img src={getImageUrl(b.ship_id.image_ship)} alt={b.ship_id.name} className="rounded-xl w-48 h-48 object-cover" />
                </div>
                <div className="w-[65%]">
                  <h1 className="font-semibold capitalize mb-1">
                    {b.schedule_names[0]} {b.ship_id.type} With {b.ship_id.name}
                  </h1>
                  <p className="text-sm text-gray-700 mb-3">
                    {formatDate(b.cabins[0].cabin_id?.date_start)} - {formatDate(b.cabins[0].cabin_id?.date_end)}
                  </p>
                  <span className="flex items-center justify-center gap-2 bg-green-500 text-white px-1.5 py-2.5 w-32 text-sm capitalize rounded-xl">
                    <Wallet size={20} />
                    {b.ship_id.type}
                  </span>
                </div>
              </div>
              <hr className="border border-gray-300 mt-6 mb-4" />
              <div className="space-y-2">
                <h2 className="font-semibold">Checkout Detail{b.cabins.length > 1 ? "s" : ""}</h2>
                <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
                  <p>Trip</p>
                  <p>{b.ship_id.type}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
                  <p>Ship</p>
                  <p>{b.ship_id.name}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
                  <p>Services</p>
                  <p>{b.schedule_names[0]}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
                  <p>Number of Guests</p>
                  <p>
                    {totalPax} Guest{totalPax > 1 ? "s" : ""} ({totalAdult} Adult {totalChild} Children)
                  </p>
                </div>
              </div>
              <hr className="border border-gray-300 mt-5 mb-4" />
              <div className="">
                <div className="flex justify-between font-semibold">
                  <span className="text-lg">Total Payment</span>
                  <span className="text-xl">{formatPrice(b.total_price)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Booking */}
      {modalConfirmCancel && (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* Backdrop Gelap */}
          <div className="bg-black opacity-70 w-full h-full absolute z-50"></div>

          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto z-51">
            <div className="flex items-center justify-center">
              <img src={CancelTrip} alt="Cancel Trip" />
            </div>
            <h3 className="text-xl text-center font-semibold text-gray-800 capitalize">Cancel Order?</h3>
            <p className="text-center px-10">Are you sure you want to cancel this order? This action cannot be undone.</p>

            {/* Tombol Aksi */}
            <div className="mt-3 flex items-center justify-center gap-6">
              <button onClick={() => setModalConfirmCancel(false)} className="w-full px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-300 transition-all">
                Cancel
              </button>
              <button onClick={handleCancelTrip} className="w-full px-4 py-2 bg-primary text-white rounded-xl hover:opacity-60 transition-all" disabled={b.status !== "pending" || cancelLoading}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
};

export default Invoice;
