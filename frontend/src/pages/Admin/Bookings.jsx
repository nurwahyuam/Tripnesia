// src/pages/Admin/Bookings.jsx
import React, { useState } from "react";
import { useAdminBookings } from "../../hooks/useAdminBookings";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import AllBookingsIcon from "../../assets/icons/Bookings.svg";
import { ShieldCheck, ShieldAlert, Trash2, X, Users, FileCheck, ClipboardCheck, ClipboardClock, DollarSign } from "lucide-react";
import { formatPrice } from "../../lib/formatPrice";

const Bookings = () => {
  const { bookings, summary, loading, error, message, clearMessage, cancelBooking } = useAdminBookings();
  const { currentData: currentBookings, currentPage, totalPages, goToPage, nextPage, prevPage } = usePagination(bookings, 4);

  console.log("Admin Bookings:", bookings);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const openDeleteModal = (booking) => {
    setSelectedBooking(booking);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDeleteConfirm = async () => {
    await cancelBooking(selectedBooking._id);
    closeDeleteModal();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <div className="py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <span>Confirmed</span>
          </div>
        );
      case "pending":
        return <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Pending</div>;
      case "cancelled":
        return <div className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Cancelled</div>;
      default:
        return status;
    }
  };

  if (error) {
    return (
      <div className="container mx-auto pt-6">
        <p className="text-center text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {message && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-md text-white z-50 cursor-pointer ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`} onClick={clearMessage}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
          <p className="text-gray-500 mt-1">Manage all customer bookings</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="bg-white border border-gray-300 rounded-xl py-4 flex items-center gap-3 justify-center shadow-sm">
          <div className="p-4 bg-[#29D9C233]/80 rounded-full">
            <Users className="text-primary" size={36} />
          </div>
          <div>
            <div className="text-gray-600 text-xl font-semibold">Total Bookings</div>
            <div className="text-lg text-gray-600">{summary.totalBookings}</div>
          </div>
        </div>
        <div className="bg-white border border-gray-300 rounded-xl py-4 flex items-center gap-3 justify-center shadow-sm">
          <div className="p-4 bg-[#29D9C233]/80 rounded-full">
            <ClipboardCheck className="text-primary" size={36} />
          </div>
          <div>
            <div className="text-gray-600 text-xl font-semibold">Total Confirmed</div>
            <div className="text-lg text-gray-600">{summary.totalConfirmed}</div>
          </div>
        </div>
        <div className="bg-white border border-gray-300 rounded-xl py-4 flex items-center gap-3 justify-center shadow-sm">
          <div className="p-4 bg-[#29D9C233]/80 rounded-full">
            <ClipboardClock className="text-primary" size={36} />
          </div>
          <div>
            <div className="text-gray-600 text-xl font-semibold">Total Pending</div>
            <div className="text-lg text-gray-600">{summary.totalPending}</div>
          </div>
        </div>
        <div className="bg-white border border-gray-300 rounded-xl py-4 flex items-center gap-3 justify-center shadow-sm">
          <div className="p-4 bg-[#29D9C233]/80 rounded-full">
            <DollarSign  className="text-primary" size={36} />
          </div>
          <div>
            <div className="text-gray-600 text-xl font-semibold">Total Revenue</div>
            <div className="text-lg text-gray-600">{formatPrice(summary.totalRevenue)}</div>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center mt-5">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center mt-5">No bookings found.</p>
      ) : (
        <>
          <Table title="Bookings Management" src={AllBookingsIcon}>
            <thead className="text-left text-gray-500 text-sm font-medium">
              <tr className="border-b border-gray-300">
                <th className="px-4 py-4">Ship</th>
                <th className="px-4 py-4">Cabins</th>
                <th className="px-4 py-4 text-center">Type</th>
                <th className="px-4 py-4 text-center">Pax</th>
                <th className="px-4 py-4 text-center">Total</th>
                <th className="px-4 py-4 text-center">Status</th>
                <th className="px-4 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {currentBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-gray-600">{booking.ship_id?.name || "–"}</div>
                  </td>
                  <td className="px-4 py-3">
                    {booking.cabins && booking.cabins.length > 0 ? (
                      <ul className="text-sm list-disc list-inside space-y-1">
                        {booking.cabins.map((cabin) => (
                          <li key={cabin._id}>{cabin.cabin_name || "–"}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm">–</div>
                    )}
                  </td>
                  <td className="text-center capitalize text-xs">
                    <div className="bg-blue-200 text-blue-800 py-1 rounded-full border border-blue-800">{booking.ship_id?.type}</div>
                  </td>
                  <td className="px-4 py-3 text-center">{booking.cabins?.reduce((sum, c) => sum + (c.pax?.adult || 0) + (c.pax?.child || 0), 0) || 0}</td>
                  <td className="px-4 py-3 text-center font-semibold text-gray-600">{formatPrice(booking.total_price)}</td>
                  <td className="text-center text-gray-600">{getStatusBadge(booking.status)}</td>
                  <td className="px-4 py-3 text-center">
                    {booking.status !== "cancelled" && (
                      <button onClick={() => openDeleteModal(booking)} className="text-red-600 hover:text-red-800 transition-colors" title="Cancel Booking">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination currentPage={currentPage} totalPages={totalPages} onNext={nextPage} onPrev={prevPage} onPageChange={goToPage} />
        </>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedBooking && (
        <Modal title="Confirm Cancellation" onClose={closeDeleteModal}>
          <p className="text-gray-700 mb-6">
            Are you sure you want to cancel booking <strong>#{selectedBooking.invoice_code}</strong>? This will mark it as cancelled.
          </p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={closeDeleteModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
              Cancel
            </button>
            <button type="button" onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Confirm Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Bookings;
