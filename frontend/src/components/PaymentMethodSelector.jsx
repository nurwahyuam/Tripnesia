// src/components/PaymentMethodSelector.jsx
import React from "react";

const PaymentMethodSelector = () => {
  return (
    <div className="space-y-4">
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-medium">Bank Transfer</span>
          <div className="flex gap-2">
            {["BCA", "BRI", "BNI", "Mandiri"].map((bank) => (
              <div key={bank} className="bg-gray-100 px-2 py-1 rounded text-xs">
                {bank}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-medium">Credit/Debit Card</span>
          <div className="flex gap-2">
            {["Visa", "Mastercard", "JCB"].map((card) => (
              <div key={card} className="bg-gray-100 px-2 py-1 rounded text-xs">
                {card}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-medium">E-Wallet</span>
          <div className="flex gap-2">
            {["OVO", "ShopeePay", "DANA", "LinkAja"].map((wallet) => (
              <div key={wallet} className="bg-gray-100 px-2 py-1 rounded text-xs">
                {wallet}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
