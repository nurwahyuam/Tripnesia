import React, { useCallback, useEffect, useState } from "react";
import GuestLayout from "../../../layouts/GuestLayout";
import Breadcrumb from "../../../components/Breadcrumb";
import { useAuth } from "../../../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Bath, BedDouble, Dock, Eye, Fence, ShowerHead, Users, Wallet } from "lucide-react";
import InputForm from "../../../components/InputForm";
import { useLogin } from "../../../hooks/useLogin";
import Button from "../../../components/Button";
import { getImageUrl } from "../../../lib/getImageUrl";
import { formatDateRange } from "../../../lib/dateFormatter";
import { formatPrice } from "../../../lib/formatPrice";
import { usePromoByCode } from "../../../hooks/usePromoByCode";

const Checkout = () => {
  const { user } = useAuth();
  const { handleLogin, error: loginError, success: loginSuccess } = useLogin();
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { bookingData } = location.state || {};

  // ✅ Inisialisasi state sebelum validasi bookingData
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [personalInfo, setPersonalInfo] = useState({
    title: "Mr",
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });
  const [agreeContact, setAgreeContact] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const clearMessage = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  const { promo, fetchPromoByCode, loading: loadingPromo, error: promoError, clearPromo } = usePromoByCode();

  // ✅ Akses data setelah validasi
  const { ship, cabins, totalPax, totalPrice, schedule, dateRange } = bookingData;

  const total = totalPax.adult + totalPax.child;
  const fee = (totalPrice / 100) * 2;

  useEffect(() => {
    let newTotal = totalPrice;

    if (promo && promo.discount_type === "percentage") {
      const discountAmount = (promo.discount_value / 100) * totalPrice;
      setDiscount(discountAmount);
      newTotal = totalPrice - discountAmount;
    } else if (promo && promo.discount_type === "fixed") {
      setDiscount(promo.discount_value);
      newTotal = Math.max(0, totalPrice - promo.discount_value);
    }

    setFinalTotal(newTotal + fee); // ✅ Tambahkan fee ke total akhir
  }, [totalPrice, promo, fee]);

  // ✅ Validasi bookingData sebelum akses data
  if (!bookingData) {
    return (
      <GuestLayout>
        <Breadcrumb />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-500">No booking data found.</p>
            <Link to="/product" className="text-blue-600 hover:underline">
              Back to Ships
            </Link>
          </div>
        </div>
      </GuestLayout>
    );
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleLogin(loginData.email, loginData.password, ship.slug);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    if (!agreeContact || !agreeTerms) {
      setError("Please agree to the terms and conditions.");
      return;
    }
    console.log("Personal Info:", { ...personalInfo, agreeContact, agreeTerms });
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

    const promoData = await fetchPromoByCode(voucherCode, ship._id);
    if (promoData) {
      // Validasi: promo hanya berlaku untuk trip ini?
      if (promoData.ship_id && promoData.ship_id !== ship._id) {
        setError("Voucher ini hanya berlaku untuk kapal tertentu.");
        clearPromo(); // ✅ Hapus promo jika tidak cocok
        setDiscount(0);
        setFinalTotal(totalPrice + fee);
        return;
      }
      if (promoData.min_pax > totalPax.adult + totalPax.child) {
        setError(`Minimal ${promoData.min_pax} pax untuk menggunakan voucher ini.`);
        clearPromo(); // ✅ Hapus promo jika tidak cocok
        setDiscount(0);
        setFinalTotal(totalPrice + fee);
        return;
      }
    }
  };

  // ✅ Fungsi hapus voucher
  const handleRemoveVoucher = () => {
    clearPromo();
    setVoucherCode("");
    setDiscount(0);
    setFinalTotal(totalPrice + fee);
  };

  return (
    <GuestLayout>
      {error && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-md text-white z-50 bg-red-500`} onClick={clearMessage}>
          {error}
        </div>
      )}
      <Breadcrumb />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to={`/product/${bookingData.ship.slug}`} className="flex items-center gap-2 mb-8 text-sm">
          <ArrowLeft size={18} />
          Checkout Details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri: Login atau Personal Info */}
          <div className="w-full">
            <div className="border border-gray-300 rounded-lg p-4">
              <h2 className={`text-lg font-semibold mb-6 ${!user ? "text-center" : ""}`}>{!user ? "Log in to your account or register to place an order" : "Personal Information"}</h2>
              {loginError && <div className="mb-4 mx-20 p-2 bg-red-100 text-red-600 rounded-md">{loginError}</div>}
              {loginSuccess && <div className="mb-4 mx-20 p-2 bg-green-100 text-green-600 rounded-md">{loginSuccess}</div>}
              {!user ? (
                <form onSubmit={handleLoginSubmit} className="px-20">
                  <div className="mb-2">
                    <InputForm label="Email" type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />
                  </div>
                  <div className="mb-6">
                    <InputForm label="Password" type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
                  </div>
                  <Button type={"submit"} disabled={loading} className="cursor-pointer" color="bg-primary text-white">
                    {loading ? "Loading..." : "Login"}
                  </Button>
                  <p className="text-center text-sm text-gray-600 mt-4">
                    Don't have an account yet?{" "}
                    <a href="/register" className="text-primary hover:underline">
                      Sign up now.
                    </a>
                  </p>
                </form>
              ) : (
                // Form Personal Info
                <form onSubmit={handlePersonalInfoSubmit}>
                  <div className="flex space-x-4 mb-4">
                    <label className="inline-flex items-center">
                      <input type="radio" name="title" value="Mr" checked={personalInfo.title === "Mr"} onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })} className="form-radio h-4 w-4 text-primary" />
                      <span className="ml-2">Mr</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" name="title" value="Mrs" checked={personalInfo.title === "Mrs"} onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })} className="form-radio h-4 w-4 text-primary" />
                      <span className="ml-2">Mrs</span>
                    </label>
                  </div>

                  <InputForm label="Full Name" type="text" value={personalInfo.fullName} onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })} placeholder="Dhio Rizqi Novan Saputra" required />

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No. Handphone <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <select className="border border-gray-300 rounded-l-md px-3 py-2">
                        <option>+62</option>
                      </select>
                      <InputForm type="tel" value={personalInfo.phone} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} placeholder="+62 85105245768" className="rounded-l-none" required />
                    </div>
                  </div>

                  <InputForm label="Email" type="email" value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} placeholder="dhioputra123@gmail.com" required />

                  <div className="space-y-2 mt-6">
                    <label className="flex items-start">
                      <input type="checkbox" checked={agreeContact} onChange={(e) => setAgreeContact(e.target.checked)} className="mt-1 h-4 w-4 text-primary" />
                      <span className="ml-2 text-sm text-gray-600">I agree that my contact information may be shared with the trip provider and used for communication via WhatsApp.</span>
                    </label>
                    <label className="flex items-start">
                      <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-1 h-4 w-4 text-primary" />
                      <span className="ml-2 text-sm text-gray-600">
                        I declare that I have read and understood the applicable{" "}
                        <a href="/terms" className="text-primary hover:underline">
                          Terms and Conditions
                        </a>
                        .
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2 px-4 font-medium rounded-md mt-4 ${agreeContact && agreeTerms ? "bg-primary text-white hover:bg-primary/90" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                    disabled={!agreeContact || !agreeTerms}
                  >
                    Confirm Booking
                  </button>
                </form>
              )}
            </div>
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
                    <div className="grid grid-cols-3 gap-4 w-full">
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
            <Button type={"submit"} disabled={loading || !user} className={`mt-8 ${!user ? "cursor-not-allowed" : "cursor-pointer"}`} color="bg-primary text-white">
              {loading ? "Ordering..." : "Order Now"}
            </Button>
          </div>

          {/* Kolom Kanan: Booking Summary */}
          <div className="w-full">
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex gap-4">
                <div className="w-[35%]">
                  <img src={getImageUrl(ship.image)} alt={ship.name} className="rounded-xl w-48 h-48" />
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
                    <button onClick={handleRemoveVoucher} className="px-6 py-2 bg-red-500 text-white rounded-md">
                      Remove
                    </button>
                  ) : (
                    <button onClick={handleApplyVoucher} disabled={loadingPromo || !voucherCode.trim()} className={`px-6 py-2 rounded-md ${loadingPromo ? "bg-gray-300" : "bg-primary text-white hover:bg-primary/90"}`}>
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
    </GuestLayout>
  );
};

export default Checkout;
