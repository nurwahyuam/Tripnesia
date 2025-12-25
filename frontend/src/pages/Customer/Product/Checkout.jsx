// src/pages/Guest/Checkout.jsx
import React, { useCallback, useEffect, useState } from "react";
import CustomerLayout from "../../../layouts/CustomerLayout";
import Breadcrumb from "../../../components/Breadcrumb";
import { useAuth } from "../../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Bath, BedDouble, Dock, Eye, Fence, ShowerHead, Users, Wallet } from "lucide-react";
import InputForm from "../../../components/InputForm";
import { useLogin } from "../../../hooks/useLogin";
import Button from "../../../components/Button";
import { getImageUrl } from "../../../lib/getImageUrl";
import { formatDateRange } from "../../../lib/dateFormatter";
import { formatPrice } from "../../../lib/formatPrice";
import { usePromoByCode } from "../../../hooks/usePromoByCode";
import { useCreateBooking } from "../../../hooks/useCreateBooking";

const Checkout = () => {
  const { user } = useAuth();
  const { error: loginError, success: loginSuccess } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingData } = location.state || {};

  // Perbaikan logika initialGreeting
  const initialGreeting = user?.greeting === "Unknown" ? "" : user?.greeting || "";
  const [personalInfo, setPersonalInfo] = useState({
    title: initialGreeting,
    fullName: user?.name || "",
    phone: user?.no_phone || "",
    email: user?.email || "",
  });
  const [agreeContact, setAgreeContact] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Gunakan hook useCreateBooking dengan error handling
  const { createBooking, loading: bookingLoading, error: bookingError } = useCreateBooking();

  const { promo, fetchPromoByCode, loading: loadingPromo, error: promoError, clearPromo } = usePromoByCode();

  // Effect untuk auto-clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Effect untuk menghitung total
  useEffect(() => {
    if (!bookingData) {
      setFinalTotal(0);
      return;
    }

    const { totalPrice } = bookingData;
    let newTotal = totalPrice;
    let calculatedDiscount = 0;

    if (promo && promo.discount_type === "percentage") {
      calculatedDiscount = (promo.discount_value / 100) * totalPrice;
      newTotal = totalPrice - calculatedDiscount;
    } else if (promo && promo.discount_type === "fixed") {
      calculatedDiscount = promo.discount_value;
      newTotal = Math.max(0, totalPrice - promo.discount_value);
    }

    setDiscount(calculatedDiscount);
    const fee = (totalPrice / 100) * 2;
    setFinalTotal(newTotal + fee);
  }, [bookingData, promo]);

  // Tampilkan bookingError jika ada
  useEffect(() => {
    if (bookingError) {
      setError(bookingError);
    }
  }, [bookingError]);

  const clearMessage = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  // Validasi form yang lebih komprehensif
  const validateForm = () => {
    if (!personalInfo.title) {
      return "Please select a title (Mr/Mrs).";
    }
    if (!personalInfo.fullName?.trim()) {
      return "Please enter your full name.";
    }
    if (!personalInfo.phone?.trim()) {
      return "Please enter your phone number.";
    }
    if (!personalInfo.email?.trim()) {
      return "Please enter your email address.";
    }
    if (!agreeContact) {
      return "Please agree to share contact information.";
    }
    if (!agreeTerms) {
      return "Please agree to the terms and conditions.";
    }
    return null;
  };

  console.log(user);

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validasi form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Create the booking object
      const bookingDataToSend = {
        ship_id: ship._id,
        user_id: user.id,
        promo_id: promo ? promo._id : null,
        booking_date: new Date().toISOString(),
        status: "pending",
        total_price: finalTotal,
        cabins: cabins.map((cabin) => ({
          cabin_id: cabin._id,
          pax: cabin.pax,
          price: cabin.price,
          other: cabin.other,
        })),
        personal_info: {
          title: personalInfo.title,
          full_name: personalInfo.fullName,
          phone: personalInfo.phone,
          email: personalInfo.email,
        },
      };

      const result = await createBooking(bookingDataToSend);

      navigate(`/customer/product/${ship.slug}/invoice`, { state: { booking: result } });
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "An error occurred while creating your booking.");
    }
  };

  const handleApplyVoucher = async () => {
    setError("");
    if (!user) {
      setError("Please login first to use voucher.");
      return;
    }

    if (!voucherCode.trim()) {
      setError("Please enter voucher code.");
      return;
    }

    try {
      const promoData = await fetchPromoByCode(voucherCode, ship._id);
      if (promoData) {
        // Validasi promo
        if (promoData.ship_id && promoData.ship_id !== ship._id) {
          setError("Voucher ini hanya berlaku untuk kapal tertentu.");
          clearPromo();
          return;
        }
        if (promoData.min_pax > totalPax.adult + totalPax.child) {
          setError(`Minimal ${promoData.min_pax} pax untuk menggunakan voucher ini.`);
          clearPromo();
          return;
        }
      }
    } catch (e) {
      setError(e);
    }
  };

  const handleRemoveVoucher = () => {
    clearPromo();
    setVoucherCode("");
    setDiscount(0);
    if (bookingData) {
      const fee = (bookingData.totalPrice / 100) * 2;
      setFinalTotal(bookingData.totalPrice + fee);
    }
  };

  // Pengecekan bookingData
  if (!bookingData) {
    return (
      <CustomerLayout>
        <Breadcrumb />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-500">No booking data found.</p>
            <Link to="/product" className="text-blue-600 hover:underline">
              Back to Ships
            </Link>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const { ship, cabins, totalPax, totalPrice, schedule, dateRange } = bookingData;
  const total = totalPax.adult + totalPax.child;
  const fee = (totalPrice / 100) * 2;

  return (
    <CustomerLayout>
      {error && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-md text-white z-50 bg-red-500 cursor-pointer`} onClick={clearMessage}>
          {error}
        </div>
      )}
      {success && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-md text-white z-50 bg-green-500 cursor-pointer`} onClick={clearMessage}>
          {success}
        </div>
      )}

      <Breadcrumb />
      <div className="container mx-auto px-4 py-8">
        <Link to={`/product/${ship.slug}`} className="flex items-center gap-2 mb-8 text-sm">
          <ArrowLeft size={18} />
          Checkout Details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri: Personal Info */}
          <div className="w-full">
            <form onSubmit={handlePersonalInfoSubmit}>
              <div className="border border-gray-300 rounded-lg p-4">
                <h2 className={`text-lg font-semibold mb-6 ${!user ? "text-center" : ""}`}>{!user ? "Log in to your account or register to place an order" : "Personal Information"}</h2>

                {loginError && <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-md">{loginError}</div>}
                {loginSuccess && <div className="mb-4 p-2 bg-green-100 text-green-600 rounded-md">{loginSuccess}</div>}

                <div className="flex space-x-4 mb-4">
                  <label className="inline-flex items-center">
                    <input type="radio" name="title" value="Mr" checked={personalInfo.title === "Mr"} onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })} className="form-radio h-4 w-4 text-primary" required />
                    <span className="ml-2">Mr</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="title" value="Mrs" checked={personalInfo.title === "Mrs"} onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })} className="form-radio h-4 w-4 text-primary" required />
                    <span className="ml-2">Mrs</span>
                  </label>
                </div>

                <InputForm label="Full Name" type="text" value={personalInfo.fullName} onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })} placeholder="Dhio Rizqi Novan Saputra" required />

                <div className="my-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. Handphone <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <select className="border border-gray-300 rounded-l-md px-2 py-2 border-r-0 bg-gray-100">
                      <option>+62</option>
                    </select>
                    <input type="tel" value={personalInfo.phone.replace(/^0/, "")} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value.replace(/\D/g, "") })} className="rounded-l-none flex-1 border-t border-b border-r border-gray-300 pl-4 text-gray-600" placeholder="8123456789" required/>
                  </div>
                </div>

                <InputForm label="Email" type="email" value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} placeholder="test@gmail.com" required />

                <div className="space-y-2 mt-6">
                  <label className="flex items-center">
                    <input type="checkbox" checked={agreeContact} onChange={(e) => setAgreeContact(e.target.checked)} className=" h-5.5 w-5.5 text-primary" required />
                    <span className="ml-2 text-sm text-gray-600">I agree that my contact information may be shared with the trip provider and used for communication via WhatsApp.</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="h-4 w-4 text-primary" required />
                    <span className="ml-2 text-sm text-gray-600">
                      I declare that I have read and understood the applicable{" "}
                      <a href="/terms" className="text-primary hover:underline">
                        Terms and Conditions
                      </a>
                      .
                    </span>
                  </label>
                </div>
              </div>

              {/* Room Details */}
              <div className="mt-8 border border-gray-300 rounded-lg py-4 px-5">
                <h1 className="text-lg font-semibold capitalize mb-3">Room Details</h1>
                {cabins.map((cabin) => {
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
                      <h1 className="text-md font-semibold mb-4">{cabin.name}</h1>
                      <div className="grid grid-cols-3 gap-2 w-full">
                        <span className="flex items-center font-semibold gap-2 text-sm">
                          <BedDouble size={18} /> {cabin.bed} Bed
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={bookingLoading || !agreeContact || !agreeTerms || !personalInfo.title}
                className={`w-full mt-4 ${bookingLoading || !agreeContact || !agreeTerms || !personalInfo.title ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"}`}
              >
                {bookingLoading ? "Processing..." : "Confirm Booking"}
              </Button>

              {!initialGreeting && <p className="mt-2 text-sm text-red-500">Please select a title above, or update your profile information (Account {">"} Profile).</p>}
            </form>
          </div>

          {/* Kolom Kanan: Booking Summary */}
          <div className="w-full">
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex gap-4">
                <div className="w-[35%]">
                  <img src={getImageUrl(ship.image)} alt={ship.name} className="rounded-xl w-48 h-48 object-cover" />
                </div>
                <div className="w-[65%]">
                  <h1 className="font-semibold capitalize mb-1">
                    {schedule} {ship.type} With {ship.name}
                  </h1>
                  <p className="text-sm text-gray-700 mb-3">{formatDateRange(dateRange)}</p>
                  <span className="flex items-center justify-center gap-2 bg-green-500 text-white px-1.5 py-2.5 w-32 text-sm capitalize rounded-xl">
                    <Wallet size={20} />
                    {ship.type}
                  </span>
                </div>
              </div>
              <hr className="border border-gray-300 mt-6 mb-4" />
              <div className="space-y-2">
                <h2 className="font-semibold">Checkout Detail{cabins.length > 1 ? "s" : ""}</h2>
                <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
                  <p>Trip</p>
                  <p>{ship.type}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
                  <p>Ship</p>
                  <p>{ship.name}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
                  <p>Services</p>
                  <p>{schedule}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
                  <p>Number of Guests</p>
                  <p>
                    {total} Guest{total > 1 ? "s" : ""} ({totalPax.adult} Adult {totalPax.child} Children)
                  </p>
                </div>
              </div>
              <hr className="border border-gray-300 mt-5 mb-4" />
              <div className="">
                <h2 className="font-semibold mb-3">Voucher Code</h2>
                <div className="flex gap-2 w-full">
                  <InputForm label="" type="text" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} placeholder="Enter voucher code" className="w-full" />
                  {promo ? (
                    <button type="button" onClick={handleRemoveVoucher} className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyVoucher}
                      disabled={loadingPromo || !voucherCode.trim()}
                      className={`px-6 py-2 rounded-md ${loadingPromo || !voucherCode.trim() ? "bg-gray-300 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"}`}
                    >
                      {loadingPromo ? "Applying..." : "Apply"}
                    </button>
                  )}
                </div>
                {promo && (
                  <div className="mt-2 text-sm text-green-600">
                    ✅ Voucher "{promo.code}" berhasil diterapkan! Diskon: {formatPrice(discount)}
                  </div>
                )}
                {promoError && <div className="mt-2 text-sm text-red-600">❌ {promoError}</div>}
              </div>

              <hr className="border border-gray-300 mt-5 mb-4" />
              <div className="">
                <h2 className="font-semibold mb-1">Price Details</h2>
                <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
                  <p>Harga</p>
                  <p>{formatPrice(totalPrice)}</p>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
                    <p>Discount ({promo?.code})</p>
                    <p>-{formatPrice(discount)}</p>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
                  <p>Platform fee</p>
                  <p>{formatPrice(fee)}</p>
                </div>
              </div>

              <hr className="border border-gray-300 mt-5 mb-4" />
              <div className="">
                <div className="flex justify-between font-semibold">
                  <span className="text-lg">Total Payment</span>
                  <span className="text-xl">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Checkout;
