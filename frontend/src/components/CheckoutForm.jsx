// src/components/CheckoutForm.jsx
import React, { useState } from "react";
import { BedDouble, Users, Fence, Wallet } from "lucide-react";
import InputForm from "../components/InputForm";
import Button from "../components/Button";

const CheckoutForm = ({ bookingData }) => {
  const [personalInfo, setPersonalInfo] = useState({
    title: "Mr",
    fullName: "",
    phone: "",
    email: "",
  });
  const [agreeContact, setAgreeContact] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [promo, setPromo] = useState(null);

  // Mock data for demonstration
  const mockBookingData = bookingData || {
    ship: {
      name: "Andalucia",
      image: "https://images.unsplash.com/photo-1586902197537-44a2d6e200b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      type: "Open Trip",
    },
    schedule: "3 Days 2 Nights",
    dateRange: "2025-11-07 to 2025-11-09",
    cabins: [
      {
        _id: "1",
        name: "Ocean Room 2",
        bed: "Double Size",
        pax: {
          adult: 2,
          child: 1,
        },
        other: [{ key: "Balcony", value: "Private Balcony" }],
      },
    ],
    totalPax: {
      adult: 2,
      child: 1,
    },
    totalPrice: 25000000,
    fee: 500000,
  };

  const handleInputChange = (field, value) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyVoucher = () => {
    // Mock voucher application
    if (voucherCode === "DISCOUNT10") {
      setPromo({
        code: "DISCOUNT10",
        discount_value: 2500000,
        discount_type: "fixed",
      });
    } else {
      setPromo(null);
    }
  };

  const handleRemoveVoucher = () => {
    setPromo(null);
    setVoucherCode("");
  };

  const calculateFinalTotal = () => {
    let total = mockBookingData.totalPrice;
    if (promo && promo.discount_type === "fixed") {
      total -= promo.discount_value;
    }
    return total + mockBookingData.fee;
  };

  const finalTotal = calculateFinalTotal();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Personal Info */}
      <div className="w-full">
        <div className="border border-gray-300 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-6">Personal Information</h2>

          <div className="flex space-x-4 mb-4">
            <label className="inline-flex items-center">
              <input type="radio" name="title" value="Mr" checked={personalInfo.title === "Mr"} onChange={(e) => handleInputChange("title", e.target.value)} className="form-radio h-4 w-4 text-primary" />
              <span className="ml-2">Mr</span>
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="title" value="Mrs" checked={personalInfo.title === "Mrs"} onChange={(e) => handleInputChange("title", e.target.value)} className="form-radio h-4 w-4 text-primary" />
              <span className="ml-2">Mrs</span>
            </label>
          </div>

          <InputForm label="Full Name *" type="text" value={personalInfo.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} placeholder="Test" required />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">No. Handphone *</label>
            <div className="flex">
              <select className="border border-gray-300 rounded-l-md px-3 py-2 border-r-0 bg-gray-50">
                <option>+62</option>
              </select>
              <InputForm type="tel" value={personalInfo.phone} onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, ""))} className="rounded-l-none flex-1" placeholder="0834732647" required />
            </div>
          </div>

          <InputForm label="Email *" type="email" value={personalInfo.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="test@gmail.com" required />

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
        </div>

        {/* Room Details */}
        <div className="mt-8 border border-gray-300 rounded-lg py-4 px-5">
          <h1 className="text-lg font-semibold capitalize mb-3">Room Details</h1>
          {mockBookingData.cabins.map((cabin) => {
            const getOtherValue = (cabin, key) => {
              const item = cabin.other?.find((item) => item.key === key);
              return item ? item.value : null;
            };

            const balconyValue = getOtherValue(cabin, "Balcony");

            return (
              <div key={cabin._id} className="border-2 border-gray-300 rounded-xl py-3 px-3.5 mb-3">
                <h1 className="text-md font-semibold mb-4">{cabin.name}</h1>
                <div className="flex flex-wrap gap-4">
                  <span className="flex items-center font-semibold gap-2 text-sm">
                    <BedDouble size={18} /> {cabin.bed} Bed
                  </span>
                  <span className="flex items-center gap-2 font-semibold text-sm">
                    <Users size={18} /> {cabin.pax.adult} Adult, {cabin.pax.child} Child
                  </span>
                  {balconyValue && (
                    <span className="text-sm flex items-center gap-2 font-semibold">
                      <Fence size={18} />
                      {balconyValue}
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
          disabled={!agreeContact || !agreeTerms || !personalInfo.title || !personalInfo.fullName || !personalInfo.phone || !personalInfo.email}
          className={`w-full mt-4 ${
            !agreeContact || !agreeTerms || !personalInfo.title || !personalInfo.fullName || !personalInfo.phone || !personalInfo.email ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          Confirm Booking
        </Button>
      </div>

      {/* Right Column: Booking Summary */}
      <div className="w-full">
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex gap-4">
            <div className="w-[35%]">
              <img src={mockBookingData.ship.image} alt={mockBookingData.ship.name} className="rounded-xl w-48 h-48 object-cover" />
            </div>
            <div className="w-[65%]">
              <h1 className="font-semibold capitalize mb-1">
                {mockBookingData.schedule} {mockBookingData.ship.type} With {mockBookingData.ship.name}
              </h1>
              <p className="text-sm text-gray-700 mb-3">{mockBookingData.dateRange}</p>
              <span className="flex items-center justify-center gap-2 bg-green-500 text-white px-1.5 py-2.5 w-32 text-sm capitalize rounded-xl">
                <Wallet size={20} />
                {mockBookingData.ship.type}
              </span>
            </div>
          </div>
          <hr className="border border-gray-300 mt-6 mb-4" />
          <div className="space-y-2">
            <h2 className="font-semibold">Checkout Detail{mockBookingData.cabins.length > 1 ? "s" : ""}</h2>
            <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
              <p>Trip</p>
              <p>{mockBookingData.ship.type}</p>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
              <p>Ship</p>
              <p>{mockBookingData.ship.name}</p>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
              <p>Services</p>
              <p>{mockBookingData.schedule}</p>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
              <p>Number of Guests</p>
              <p>
                {mockBookingData.totalPax.adult + mockBookingData.totalPax.child} Guest{mockBookingData.totalPax.adult + mockBookingData.totalPax.child > 1 ? "s" : ""} ({mockBookingData.totalPax.adult} Adult {mockBookingData.totalPax.child}{" "}
                Children)
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
                <button type="button" onClick={handleApplyVoucher} disabled={!voucherCode.trim()} className={`px-6 py-2 rounded-md ${!voucherCode.trim() ? "bg-gray-300 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"}`}>
                  Apply
                </button>
              )}
            </div>
            {promo && (
              <div className="mt-2 text-sm text-green-600">
                ✅ Voucher "{promo.code}" successfully applied! Discount: Rp {promo.discount_value.toLocaleString()}
              </div>
            )}
          </div>

          <hr className="border border-gray-300 mt-5 mb-4" />
          <div className="">
            <h2 className="font-semibold mb-1">Price Details</h2>
            <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
              <p>Harga</p>
              <p>Rp {mockBookingData.totalPrice.toLocaleString()}</p>
            </div>
            {promo && (
              <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
                <p>Discount ({promo.code})</p>
                <p>-Rp {promo.discount_value.toLocaleString()}</p>
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-gray-700 capitalize">
              <p>Platform Fee</p>
              <p>Rp {mockBookingData.fee.toLocaleString()}</p>
            </div>
          </div>

          <hr className="border border-gray-300 mt-5 mb-4" />
          <div className="">
            <div className="flex justify-between font-semibold">
              <span className="text-lg">Total Payment</span>
              <span className="text-xl">Rp {finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
