// src/components/SupportCard.jsx
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { ChevronRight } from "lucide-react";

const SupportCard = ({ icon, title, list = [] }) => {
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const visibleItems = list.slice(0, 3);
  const hasHiddenItems = list.length > 3;

  useEffect(() => {
    const isAnyModalOpen = isListModalOpen || selectedItem;

    if (isAnyModalOpen) {
      // Simpan scroll position & lock
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0"; // opsional: hindari "shift" jika ada scrollbar
    } else {
      // Pulihkan
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    // Cleanup saat komponen unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isListModalOpen, selectedItem]);

  return (
    <div className="rounded-xl border border-gray-400 p-5 cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="border-b border-gray-400 pb-3 flex items-center gap-4">
          {icon}
          <h3 className="font-bold text-xl text-gray-800">{title.length > 25 ? title.substring(0, 25) + "..." : title}</h3>
        </div>

        {/* List (maks 3 item) */}
        {visibleItems.length > 0 && (
          <ul className="mt-1 space-y-1">
            {visibleItems.map((item) => (
              <button
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(item);
                }}
                className="flex items-center justify-between text-sm text-gray-600 hover:text-[#29d9c2] w-full text-left py-1"
              >
                <span>{item.name.length > 45 ? item.name.substring(0, 45) + "..." : item.name}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}
          </ul>
        )}

        {/* Tombol "Another" — tetap muncul jika >3 item */}
        {hasHiddenItems && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsListModalOpen(true);
            }}
            className="border-t border-gray-400 pt-3 text-start text-sm text-gray-600 hover:text-[#29d9c2] flex items-center justify-between w-full"
          >
            Another
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Modal Level 1: Daftar Semua Item */}
      {isListModalOpen && (
        <Modal title={`All Topics – ${title}`} onClose={() => setIsListModalOpen(false)}>
          <div className="max-h-96 overflow-y-auto pr-2">
            {list.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setIsListModalOpen(false); // Tutup modal daftar
                }}
                className="flex items-center justify-between w-full py-3 text-left border-b border-gray-100 hover:bg-gray-50 rounded"
              >
                <span className="text-sm text-gray-700">{item.name}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Modal Level 2: Konten Detail per Item */}
      {selectedItem && (
        <Modal title={selectedItem.name} onClose={() => setSelectedItem(null)}>
          <div className="text-gray-700 text-sm leading-relaxed max-h-[70vh] overflow-y-auto pr-1">{selectedItem.content || "Content not available."}</div>
        </Modal>
      )}
    </div>
  );
};

export default SupportCard;
