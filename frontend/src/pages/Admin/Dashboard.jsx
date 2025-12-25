// src/pages/Admin/Dashboard.jsx
import React from "react";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import { Calendar, CreditCard, Users, Ship, FileText, ShieldCheck, ClipboardList } from "lucide-react";

const Dashboard = () => {
  const { data, loading, error } = useAdminDashboard();

  const formatRupiah = (value) => {
    if (!value && value !== 0) return "–";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("id-ID") : "–";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-800 px-10 py-2 rounded-full text-xs font-semibold">
            Confirmed
          </span>
        );
      case "pending":
        return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-10 py-2 rounded-full text-xs font-semibold">Pending</span>;
      case "cancelled":
        return <span className="flex items-center gap-1 bg-red-100 text-red-800 px-10 py-2 rounded-full text-xs font-semibold">Cancelled</span>;
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <p className="text-center text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div className="bg-white border border-gray-300 rounded-xl py-4 flex items-center gap-3 justify-center shadow-sm">
          <div className="p-4 bg-[#29D9C233]/80 rounded-full">
            <Users className="text-primary" size={36} />
          </div>
          <div>
            <div className="text-gray-600 text-xl font-semibold">Total Users</div>
            <div className="text-lg text-gray-600">{data.summary.totalUsers}</div>
          </div>
        </div>
        <div className="bg-white border border-gray-300 rounded-xl py-4 flex items-center gap-3 justify-center shadow-sm">
          <div className="p-4 bg-[#29D9C233]/80 rounded-full">
            <Ship className="text-primary" size={36} />
          </div>
          <div>
            <div className="text-gray-600 text-xl font-semibold">Total Ships</div>
            <div className="text-lg text-gray-600">{data.summary.totalShips}</div>
          </div>
        </div>
        <div className="bg-white border border-gray-300 rounded-xl py-4 flex items-center gap-3 justify-center shadow-sm">
          <div className="p-4 bg-[#29D9C233]/80 rounded-full">
            <Calendar className="text-primary" size={36} />
          </div>
          <div>
            <div className="text-gray-600 text-xl font-semibold">Total Bookings</div>
            <div className="text-lg text-gray-600">{data.summary.totalBookings}</div>
          </div>
        </div>
        <div className="bg-white border border-gray-300 rounded-xl py-4 flex items-center gap-3 justify-center shadow-sm">
          <div className="p-4 bg-[#29D9C233]/80 rounded-full">
            <ClipboardList className="text-primary" size={36} />
          </div>
          <div>
            <div className="text-gray-600 text-xl font-semibold">Total Transactions</div>
            <div className="text-lg text-gray-600">{data.summary.totalConfirmed}</div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Bookings</h2>

        {data.recentBookings.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No recent bookings</div>
        ) : (
          <div className="space-y-3">
            {data.recentBookings.map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                {/* Kiri: Ikon + Trip + User */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-[#DDFFFB] rounded-full">
                    <Ship size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{booking.ship_id?.name || "–"}</div>
                    <div className="text-xs text-gray-500">{booking.user_id?.name || "–"}</div>
                  </div>
                </div>

                {/* Kanan: Harga, Tanggal, Status */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{formatRupiah(booking.total_price)}</div>
                    <div className="text-xs text-gray-500">{formatDate(booking.created_at)}</div>
                  </div>
                  <div>{getStatusBadge(booking.status)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
