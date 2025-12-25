const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const Ship = require('../models/shipModel');
const BookingCabin = require('../models/bookingCabinModel');

const getAdminDashboard = async (req, res) => {
  try {
    // === 1. Statistik Ringkasan ===
    const totalBookings = await Booking.countDocuments();
    const totalConfirmed = await Booking.countDocuments({ status: 'confirmed' });
    
    const confirmedBookings = await Booking.find({ status: 'confirmed' }).select('total_price');
    const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + (booking.total_price || 0), 0);
    
    const totalUsers = await User.countDocuments();
    const totalShips = await Ship.countDocuments();

    // === 2. Recent Bookings (5 terbaru) ===
    const recentBookingDocs = await Booking.find()
      .populate('user_id', 'name')        // data user
      .populate('ship_id', 'name')         // data kapal
      .sort({ created_at: -1 })
      .limit(5)
      .select('invoice_code status total_price created_at user_id ship_id');

    const recentBookings = await Promise.all(
      recentBookingDocs.map(async (booking) => {
        const cabins = await BookingCabin.find({ booking_id: booking._id })
          .select('pax')
          .populate('cabin_id', 'name');

        return {
          ...booking.toObject(),
          cabins: cabins.map(cb => ({
            name: cb.cabin_id?.name || '–',
            adult: cb.pax?.adult || 0,
            child: cb.pax?.child || 0,
          })),
        };
      })
    );

    // === Kirim Response ===
    res.status(200).json({
      summary: {
        totalBookings,
        totalConfirmed,
        totalRevenue,
        totalUsers,
        totalShips,
      },
      recentBookings,
    });
  } catch (error) {
    console.error('Error fetching admin dashboard ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAdminDashboard };