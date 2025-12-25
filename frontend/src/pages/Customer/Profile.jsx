// src/pages/Customer/Profile.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout";
import { useAuth } from "../../hooks/useAuth";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { useChangePassword } from "../../hooks/useChangePassword";
import { ChevronRight, FileClock, FileHeart, UserRound, Heart, MapPin, Users, Calendar, ChevronLeft, Wallet } from "lucide-react";
import InputForm from "../../components/InputForm";
import { formatDate } from "../../lib/dateFormatter";
import Modal from "../../components/Modal";
import { useFavoriteShips } from "../../hooks/useFavoriteShips";
import { getImageUrl } from "../../lib/getImageUrl";
import FavoriteButton from "../../components/FavoriteButton";
import { useUserBookings } from "../../hooks/useUserBookings";
import IconFerry from "../../assets/icons/Ferry-Boat.svg";
import { useCheckActiveBooking } from "../../hooks/useCheckActiveBooking";
import { formatPrice } from "../../lib/formatPrice";

const Profile = () => {
  const { user, logout, updateLocalUser } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const BOOKINGS_PER_PAGE = 3;

  // State management
  const [activeNav, setActiveNav] = useState("account");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [localError, setLocalError] = useState("");
  // State untuk filter status order (hanya untuk tab 'order')
  const [orderStatusFilter, setOrderStatusFilter] = useState(null); // null untuk 'All'

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    date_of_birth: user?.date_of_birth || "",
    greeting: user?.greeting || "Mr",
    no_phone: user?.no_phone || "",
    email: user?.email || "",
  });

  // Password data state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // API hooks
  const { updateProfile: updateProfileAPI, loading: updateLoading, error: updateError, message: updateMessage, clearMessage: clearUpdateMessage } = useUpdateProfile();
  const { changePassword: changePasswordAPI, loading: changePasswordLoading, error: changePasswordError, message: changePasswordMessage, clearMessage: clearChangePasswordMessage } = useChangePassword();
  const { favoriteShips, loading: favoritesLoading, error: favoritesError, removeFromFavorites, removeFromFavoritesByShipId, refreshFavorites } = useFavoriteShips();

  const { check: checkActiveBooking, result: activeCheckResult, loading: activeCheckLoading } = useCheckActiveBooking();
  const [hasAnyPendingBooking, setHasAnyPendingBooking] = useState(false);

  // Gunakan hook untuk mengambil booking user
  const { bookings: userBookings, loading: bookingsLoading, error: bookingsError } = useUserBookings(orderStatusFilter);

  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * BOOKINGS_PER_PAGE;
    return userBookings.slice(startIndex, startIndex + BOOKINGS_PER_PAGE);
  }, [userBookings, currentPage]);

  const totalPages = Math.ceil(userBookings.length / BOOKINGS_PER_PAGE);

  // Helper untuk menghasilkan range pagination dengan ellipsis
  const getPaginationRange = (currentPage, totalPages, maxVisible = 5) => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 1) {
      end += 1 - start;
      start = 1;
    }

    if (end > totalPages) {
      start -= end - totalPages;
      end = totalPages;
    }

    const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    const result = [];

    // Tambahkan awal
    if (start > 1) {
      result.push(1);
      if (start > 2) result.push("...");
    }

    result.push(...range);

    // Tambahkan akhir
    if (end < totalPages) {
      if (end < totalPages - 1) result.push("...");
      result.push(totalPages);
    }

    return result;
  };

  // Fungsi untuk menentukan apakah card harus non-active
  const shouldDisableCard = (shipId) => {
    // Jika ada pending booking di ship manapun, non-active semua card
    if (hasAnyPendingBooking) return true;

    // Atau jika ship ini memiliki booking aktif
    const activeCheck = activeCheckResult[shipId];
    return activeCheck?.hasActiveBooking;
  };

  // Fungsi untuk mendapatkan status message
  const getStatusMessage = (shipId) => {
    const activeCheck = activeCheckResult[shipId];

    // Jika ada pending booking di ship manapun
    if (hasAnyPendingBooking) {
      return "You have a pending booking";
    }

    // Jika ship ini memiliki booking aktif
    if (activeCheck?.hasActiveBooking) {
      const status = activeCheck.status;
      return `${status.charAt(0).toUpperCase() + status.slice(1)} Booking Exists`;
    }

    return null;
  };

  // Initialize activeNav from URL params or location state
  useEffect(() => {
    const urlSection = searchParams.get("section");
    const stateSection = location.state?.activeSection;

    if (urlSection) {
      setActiveNav(urlSection);
    } else if (stateSection) {
      setActiveNav(stateSection);
    }
  }, [searchParams, location.state]);

  // Clear messages function
  const clearAllMessages = useCallback(() => {
    clearUpdateMessage();
    clearChangePasswordMessage();
    setLocalError("");
  }, [clearUpdateMessage, clearChangePasswordMessage]);

  // Auto clear messages after 5 seconds
  useEffect(() => {
    const timer = setTimeout(clearAllMessages, 5000);
    return () => clearTimeout(timer);
  }, [updateError, updateMessage, changePasswordError, changePasswordMessage, localError, clearAllMessages]);

  // Reset local error when modal closes
  useEffect(() => {
    if (!showChangePasswordModal) {
      setLocalError("");
    }
  }, [showChangePasswordModal]);

  // Cek apakah ada pending booking di antara semua ship
  useEffect(() => {
    const checkAllShipsForPendingBooking = () => {
      let hasPending = false;
      Object.values(activeCheckResult).forEach((check) => {
        if (check?.hasActiveBooking && check?.status === "pending") {
          hasPending = true;
        }
      });
      setHasAnyPendingBooking(hasPending);
    };

    checkAllShipsForPendingBooking();
  }, [activeCheckResult]);

  // Cek booking untuk semua ship di favorites
  useEffect(() => {
    if (favoriteShips.length > 0) {
      favoriteShips.forEach((ship) => {
        if (activeCheckResult[ship._id] === undefined) {
          checkActiveBooking(ship._id);
        }
      });
    }
  }, [favoriteShips, checkActiveBooking, activeCheckResult]);

  // Helper functions
  const getNavClass = (itemName) => {
    const baseClass = "flex items-center justify-between w-full border px-6 py-4 rounded-xl transition-colors cursor-pointer";
    const activeClass = activeNav === itemName ? "border-blue-500" : "border-gray-300 text-gray-800 hover:bg-gray-50";
    return `${baseClass} ${activeClass}`;
  };

  const handleEditToggle = () => {
    setShowEditProfileModal(true);
    setProfileData({
      name: user?.name || "",
      date_of_birth: user?.date_of_birth || "",
      greeting: user?.greeting || "Mr",
      no_phone: user?.no_phone || "",
      email: user?.email || "",
    });
    clearAllMessages();
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [orderStatusFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (localError) setLocalError("");
  };

  const handleSaveChanges = async () => {
    const updateData = { ...profileData, userId: user?.id };
    const result = await updateProfileAPI(updateData);
    if (result) {
      // 🔥 Perbarui user di seluruh aplikasi secara instan
      updateLocalUser({
        name: profileData.name,
        date_of_birth: profileData.date_of_birth,
        greeting: profileData.greeting,
        no_phone: profileData.no_phone,
      });
      setShowEditProfileModal(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    clearAllMessages();

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setLocalError("New password and confirm password don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    const passwordUpdateData = { ...passwordData, userId: user?.id };
    const result = await changePasswordAPI(passwordUpdateData);

    if (result) {
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowChangePasswordModal(false);
    }
  };

  const handleModalClose = () => {
    setShowChangePasswordModal(false);
    setShowEditProfileModal(false);
    clearAllMessages();
  };

  // Handle remove favorite
  const handleRemoveFavorite = async (favoriteId) => {
    const success = await removeFromFavorites(favoriteId);
    return success;
  };

  const handleRemoveFavoriteByShipId = async (shipId) => {
    const success = await removeFromFavoritesByShipId(shipId);
    return success;
  };

  // Notification handler
  const getNotificationMessage = () => {
    if (updateMessage?.type === "success") return { text: updateMessage.text, type: "success" };
    if (changePasswordMessage?.type === "success") return { text: changePasswordMessage.text, type: "success" };
    if (updateError) return { text: updateError, type: "error" };
    if (changePasswordError) return { text: changePasswordError, type: "error" };
    if (localError) return { text: localError, type: "error" };
    if (updateMessage?.type === "error") return { text: updateMessage.text, type: "error" };
    if (changePasswordMessage?.type === "error") return { text: changePasswordMessage.text, type: "error" };
    return null;
  };

  const notification = getNotificationMessage();
  const name = user?.name?.slice(0, 2).toUpperCase() || "US";

  // Status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCheapestPrice = (cabins) => {
    if (!Array.isArray(cabins) || cabins.length === 0) return 0;

    const prices = cabins
      .map((c) => c?.price)
      .filter((p) => p != null) // bukan null/undefined
      .map((p) => {
        const num = parseInt(p.toString().replace(/[^0-9]/g, ""), 10);
        return isNaN(num) ? null : num;
      })
      .filter((p) => p !== null);

    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  return (
    <CustomerLayout>
      {/* Notification Message */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-md text-white z-1000 cursor-pointer ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`} onClick={clearAllMessages}>
          {notification.text}
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <Modal title="Change Password" onClose={handleModalClose}>
          <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
            {localError && <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg">{localError}</div>}
            {changePasswordError && <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg">{changePasswordError}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <InputForm name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} required placeholder="Enter your current password" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <InputForm name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} required placeholder="Enter new password" minLength="6" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <InputForm name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} required placeholder="Confirm new password" minLength="6" />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handleModalClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={changePasswordLoading}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${changePasswordLoading ? "bg-gray-400 text-white cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
              >
                {changePasswordLoading ? "Updating..." : "Change Password"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <Modal title="Edit Profile" onClose={handleModalClose} size="max-w-2xl">
          <div className="space-y-4">
            {(updateError || updateMessage) && <div className={`px-4 py-2 rounded-lg ${updateMessage?.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{updateMessage?.text || updateError}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <InputForm name="name" type="text" value={profileData.name} onChange={handleInputChange} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <InputForm name="date_of_birth" type="date" value={profileData.date_of_birth} onChange={handleInputChange} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Greetings</label>
                <select name="greeting" value={profileData.greeting} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <InputForm name="no_phone" type="tel" value={profileData.no_phone} onChange={handleInputChange} />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <InputForm name="email" type="email" value={profileData.email} onChange={handleInputChange} disabled className="bg-gray-100" />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handleModalClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={updateLoading}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${updateLoading ? "bg-gray-400 text-white cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
              >
                {updateLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Main Profile Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex items-start gap-4">
          {/* Sidebar Navigation */}
          <div className="w-1/3 space-y-4">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-gray-300 text-gray-800 uppercase rounded-full flex items-center justify-center text-xl font-semibold">{name}</div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">{user?.name}</h1>
                <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
              </div>
            </div>

            {/* Navigation Items */}
            <div className={getNavClass("account")} onClick={() => setActiveNav("account")}>
              <div className="flex items-center gap-2">
                <UserRound size={36} />
                <div>
                  <h1 className="text-md font-semibold">Account</h1>
                  <p className="text-xs text-gray-500">Access details and complete your data</p>
                </div>
              </div>
              <ChevronRight />
            </div>

            <div className={getNavClass("order")} onClick={() => setActiveNav("order")}>
              <div className="flex items-center gap-2">
                <FileClock size={36} />
                <div>
                  <h1 className="text-md font-semibold">Your Order</h1>
                  <p className="text-xs text-gray-500">All your orders are here</p>
                </div>
              </div>
              <ChevronRight />
            </div>

            <div className={getNavClass("favorites")} onClick={() => setActiveNav("favorites")}>
              <div className="flex items-center gap-2">
                <FileHeart size={36} />
                <div>
                  <h1 className="text-md font-semibold">Favorites List</h1>
                  <p className="text-xs text-gray-500">Your favorite products are stored here</p>
                </div>
              </div>
              <ChevronRight />
            </div>

            <div className="flex items-center justify-center">
              <button onClick={logout} className="text-red-500 font-semibold text-lg hover:bg-red-500 hover:text-white w-full py-2 rounded-lg transition-all">
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-[80%] border border-gray-300 rounded-xl p-4">
            <h1 className="text-2xl text-gray-800 font-semibold mb-6">{activeNav === "account" ? "Account Details" : activeNav === "order" ? "Your Orders" : "Favorites List"}</h1>
            {activeNav === "account" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleEditToggle} className="text-blue-600 rounded-lg font-medium hover:underline transition-all">
                      Edit
                    </button>
                  </div>
                </div>

                <div className="flex items-center w-full mb-6">
                  <div className="w-1/3 space-y-3">
                    <h3 className="text-sm text-gray-500 font-semibold">Full Name</h3>
                    <h3 className="text-sm text-gray-500 font-semibold">Date of Birth</h3>
                    <h3 className="text-sm text-gray-500 font-semibold">Greetings</h3>
                    <h3 className="text-sm text-gray-500 font-semibold">No Handphone</h3>
                    <h3 className="text-sm text-gray-500 font-semibold">Email</h3>
                  </div>
                  <div className="w-full space-y-3">
                    <p className="text-sm text-gray-500 font-semibold">{user?.name || "Not set"}</p>
                    <p className="text-sm text-gray-500 font-semibold">{formatDate(user?.date_of_birth) || "No Date of Birth"}</p>
                    <p className="text-sm text-gray-500 font-semibold">{user?.greeting || "Not set"}</p>
                    <p className="text-sm text-gray-500 font-semibold">{user?.no_phone || "Not set"}</p>
                    <p className="text-sm text-gray-500 font-semibold">{user?.email || "Not set"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button type="button" onClick={() => setShowChangePasswordModal(true)} className="text-blue-600 rounded-lg font-medium hover:underline transition-all">
                    Change Password
                  </button>
                </div>
              </div>
            )}
            {activeNav === "order" && (
              <div>
                {/* Order Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setOrderStatusFilter(null)} // Null untuk semua
                    className={`px-4 py-2 rounded-full text-sm font-medium ${orderStatusFilter === null ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setOrderStatusFilter("pending")}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${orderStatusFilter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setOrderStatusFilter("confirmed")}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${orderStatusFilter === "confirmed" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                  >
                    Confirmed
                  </button>
                  <button
                    onClick={() => setOrderStatusFilter("cancelled")}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${orderStatusFilter === "cancelled" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                  >
                    Cancelled
                  </button>
                </div>

                {/* Loading State */}
                {bookingsLoading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your orders...</p>
                  </div>
                )}

                {/* Error State */}
                {bookingsError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                      <FileClock className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load orders</h3>
                    <p className="text-red-600 mb-4">{bookingsError}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                      Try Again
                    </button>
                  </div>
                )}

                {/* Empty State */}
                {!bookingsLoading && !bookingsError && userBookings.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                      <FileClock className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">You haven't placed any orders yet. Start exploring our boat rentals and book your next adventure!</p>
                    <Link to="/customer/product" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Explore Boats
                    </Link>
                  </div>
                )}

                {/* Orders List */}
                {!bookingsLoading && !bookingsError && userBookings.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      {paginatedBookings.map((booking) => (
                        <div key={booking._id} className="border border-gray-300 rounded-xl p-4 bg-white">
                          <div className="mb-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-bold text-sm text-gray-800">#{booking.invoice_code}</h3>
                                <p className="text-xs text-gray-600">Booking Date: {formatDate(new Date(booking.booking_date))}</p>
                              </div>
                              <span className={`px-4 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                            </div>
                          </div>

                          {/* Trip Summary */}
                          <div className="flex justify-between items-end">
                            <div className="flex items-start gap-4">
                              <div className="w-100">
                                <img
                                  src={getImageUrl(booking.ship_id?.image_ship)}
                                  alt={booking.ship_id?.name}
                                  className="w-full h-42 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                                  }}
                                />
                              </div>
                              <div className="w-full">
                                <h4 className="font-bold capitalize">
                                  {booking.ship_id?.services} {booking.ship_id?.type} With {booking.ship_id?.name}
                                </h4>
                                {booking.cabins &&
                                  booking.cabins.length > 0 &&
                                  (() => {
                                    const allStartDates = booking.cabins.map((cabin) => new Date(cabin.cabin_id.date_start));
                                    const allEndDates = booking.cabins.map((cabin) => new Date(cabin.cabin_id.date_end));
                                    const earliestStart = new Date(Math.min(...allStartDates));
                                    const latestEnd = new Date(Math.max(...allEndDates));

                                    return (
                                      <p className="text-xs text-gray-700 mb-2">
                                        {formatDate(earliestStart)} - {formatDate(latestEnd)}
                                      </p>
                                    );
                                  })()}
                              </div>
                            </div>
                            {/* Actions (optional) */}
                            {(booking.status === "pending" || booking.status === "confirmed") && (
                              <div className="mt-4 flex justify-end">
                                <Link to={`/customer/product/${booking.ship_id?.slug}/invoice`} state={{ booking }} className="w-full px-4 py-2 text-blue-600 rounded-lg hover:underline transition-colors text-sm font-medium text-center">
                                  Detail Order
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-6">
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`px-2 py-2 rounded-full ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-200"}`}
                        >
                          <ChevronLeft />
                        </button>

                        {getPaginationRange(currentPage, totalPages).map((page, idx) =>
                          page === "..." ? (
                            <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-gray-500">
                              ...
                            </span>
                          ) : (
                            <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-full ${currentPage === page ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}>
                              {page}
                            </button>
                          )
                        )}

                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`px-2 py-2 rounded-full ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-200"}`}
                        >
                          <ChevronRight />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {activeNav === "favorites" && (
              <div className="min-h-96">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Favorite Ships</h2>
                    <p className="text-sm text-gray-500 mt-1">Your favorite boat rentals with their cabins</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {favoriteShips.length} {favoriteShips.length === 1 ? "ship" : "ships"}
                  </div>
                </div>

                {/* Loading State */}
                {favoritesLoading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your favorites...</p>
                  </div>
                )}

                {/* Error State */}
                {favoritesError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                      <Heart className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load favorites</h3>
                    <p className="text-red-600 mb-4">{favoritesError}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                      Try Again
                    </button>
                  </div>
                )}

                {/* Empty State */}
                {!favoritesLoading && !favoritesError && favoriteShips.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
                      <Heart className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No favorites yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">Start exploring our boat rentals and add your favorite ships to this list by clicking the heart icon.</p>
                    <Link to="/customer/product" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Explore Boats
                    </Link>
                  </div>
                )}

                {/* Favorites Grid */}
                {!favoritesLoading && !favoritesError && favoriteShips.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteShips.map((ship) => {
                      const isCardDisabled = shouldDisableCard(ship._id);
                      const statusMessage = getStatusMessage(ship._id);
                      const activeCheck = activeCheckResult[ship._id];
                      const isPendingCheckLoading = activeCheckLoading[ship._id];

                      return (
                        <div className="relative" key={ship.favorite_id || ship._id}>
                          {/* Favorite Button */}
                          <div className="absolute top-1.5 right-1.5 z-10">
                            <FavoriteButton
                              shipId={ship._id}
                              size={20}
                              className="shadow-md"
                              onToggle={async (isFavorite) => {
                                if (!isFavorite) {
                                  if (ship.favorite_id) {
                                    await handleRemoveFavorite(ship.favorite_id);
                                  } else {
                                    await handleRemoveFavoriteByShipId(ship._id);
                                  }
                                  refreshFavorites();
                                }
                              }}
                            />
                          </div>
                          <Link
                            to={activeCheck?.hasActiveBooking ? `/customer/order/${activeCheck.bookingId}` : `/customer/product/${ship.slug}`}
                            className={`bg-white rounded-2xl border border-gray-300 hover:shadow-sm transition-shadow duration-300 flex flex-col ${ship.hasCabins || isCardDisabled ? "cursor-not-allowed opacity-60 z-1" : "cursor-pointer"}`}
                            onClick={(e) => {
                              if (isCardDisabled) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <div className="h-48 flex items-center justify-center relative rounded-4xl overflow-hidden">
                              <div className="p-2.5 w-full h-full">
                                <img
                                  src={getImageUrl(ship.image_ship)}
                                  alt={ship.name}
                                  className="w-full h-full rounded-lg object-cover"
                                  onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                                  }}
                                />
                              </div>
                            </div>

                            {/* Content Section */}
                            <div className="pl-4 pr-4 pb-4 pt-1">
                              {/* Tipe ship */}
                              <div className="mb-3">
                                <span className="text-sm font-medium rounded flex items-center gap-2 text-gray-400 capitalize">
                                  <Wallet size={20} />
                                  {ship.type}
                                </span>
                              </div>

                              {/* Nama ship */}
                              <div className="mb-3">
                                <span className="flex text-start font-bold text-gray-800 text-lg">{`${ship.schedules?.[0]?.name} ${ship.type} With ${ship.name}`}</span>
                              </div>

                              {/* Harga */}
                              <div className="mb-3">
                                <p className="flex text-start text-sm text-gray-400">Starting from</p>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xl font-bold">
                                    {ship.cabins && ship.cabins.length > 0 ? <span>{formatPrice(getCheapestPrice(ship.cabins))}</span> : <span className="text-gray-400">Price not available</span>}
                                    <span className="font-semibold">
                                      /<span className="text-sm font-bold">person</span>
                                    </span>
                                  </span>
                                </div>
                              </div>

                              {/* Nama kapal dengan ikon */}
                              <div>
                                <span className="text-sm flex items-center gap-2 text-gray-500">
                                  <img src={IconFerry} alt="Icon Tripnesia" />
                                  {ship.name}
                                </span>
                              </div>
                            </div>

                            {/* Status Message */}
                            {statusMessage && <div className={`text-center py-2 text-sm font-medium rounded-b-2xl ${hasAnyPendingBooking ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{statusMessage}</div>}

                            {/* Loading Indicator */}
                            {isPendingCheckLoading && <div className="text-center py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-b-2xl">Checking...</div>}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Profile;
