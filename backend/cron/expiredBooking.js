// cron/expiredBookings.js
const cron = require('node-cron');
const Booking = require('../models/Booking');

// Jalankan setiap 5 menit
cron.schedule('*/5 * * * *', async () => {
  try {
    const result = await Booking.updateMany(
      {
        status: 'pending',
        expired_at: { $lt: new Date() },
      },
      { $set: { status: 'rejected' } }
    );

    if (result.modifiedCount > 0) {
      console.log(`[CRON] Marked ${result.modifiedCount} bookings as rejected due to expiration.`);
    }
  } catch (error) {
    console.error('[CRON] Error updating expired bookings:', error);
  }
});

module.exports = cron;