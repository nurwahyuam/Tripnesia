const mongoose = require("mongoose");
const Booking = require("../models/bookingModel");
const BookingCabin = require("../models/bookingCabinModel");
const Schedule = require("../models/scheduleModel");
const Ship = require("../models/shipModel");
const User = require("../models/userModel");
const Promo = require("../models/promoModel");
const Notification = require("../models/notificationModel");

// Fungsi bantuan untuk menghasilkan kode invoice
const generateInvoiceCode = () => {
  // Format contoh: INV-YYYYMMDD-HHMMSS-XXXX
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 19).replace(/[-:]/g, "").replace("T", ""); // YYYYMMDDHHMMSS
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 karakter acak
  return `INV-${dateStr}-${randomStr}`;
};

const getByAdminBookings = async (req, res) => {
  try {
    const allowedStatuses = ["pending", "confirmed", "cancelled"];

    // Ambil daftar booking sesuai filter
    const bookings = await Booking.find()
      .populate("ship_id", "name image_ship type slug services date_range merk class package")
      .populate("promo_id", "code discount_type discount_value")
      .populate("user_id", "name email number_telephone greeting")
      .sort({ created_at: -1 });

    // Ambil cabin untuk setiap booking
    const bookingsWithCabins = await Promise.all(
      bookings.map(async (booking) => {
        const cabins = await BookingCabin.find({ booking_id: booking._id }).populate("cabin_id", "name bed pax other date_start date_end");
        return {
          ...booking.toObject(),
          cabins: cabins.map((cb) => {
            const cabinObj = cb.toObject();
            return {
              ...cabinObj,
              cabin_name: cabinObj.cabin_id?.name,
            };
          }),
        };
      })
    );

    // === Hitung statistik tambahan ===
    // 1. Total semua booking (tanpa filter status)
    const totalBookings = await Booking.countDocuments();

    // 2. Total pending
    const totalPending = await Booking.countDocuments({ status: "pending" });

    // 3. Total confirmed
    const totalConfirmed = await Booking.countDocuments({ status: "confirmed" });

    // 4. Total pendapatan dari booking confirmed
    const confirmedBookings = await Booking.find({ status: "confirmed" }).select("total_price");
    const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + (booking.total_price || 0), 0);

    // === Kirim response ===
    res.status(200).json({
      bookings: bookingsWithCabins,
      summary: {
        totalBookings, // semua status
        totalPending,
        totalConfirmed,
        totalRevenue, // hanya dari confirmed
      },
    });
  } catch (error) {
    console.error("Error fetching bookings for admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { id: userId } = req.user; // Diambil dari token otentikasi
    const { status } = req.query; // Ambil status dari query parameter

    // Bangun filter query
    const filter = { user_id: userId };
    if (status) {
      // Validasi status yang diperbolehkan
      const allowedStatuses = ["pending", "confirmed", "cancelled"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status filter" });
      }
      filter.status = status;
    }

    // Ambil booking dengan populate
    const bookings = await Booking.find(filter)
      .populate("ship_id", "name image_ship type slug services date_range merk class package") // Sesuaikan field yang ingin diambil dari Ship
      .populate("promo_id", "code discount_type discount_value") // Sesuaikan field dari Promo
      .sort({ created_at: -1 }); // Urutkan dari yang terbaru

    // Ambil booking cabins untuk setiap booking
    const bookingsWithCabins = await Promise.all(
      bookings.map(async (booking) => {
        const cabins = await BookingCabin.find({ booking_id: booking._id }).populate("cabin_id", "name bed pax other date_start date_end"); // Pastikan field yang ingin diambil benar

        return {
          ...booking.toObject(), // Konversi booking ke plain object
          cabins: cabins.map((cb) => {
            const cabinObj = cb.toObject(); // Konversi setiap cabin ke plain object
            return {
              ...cabinObj,
              cabin_name: cabinObj.cabin_id?.name,
            };
          }),
        };
      })
    );

    res.status(200).json({ bookings: bookingsWithCabins });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createBooking = async (req, res) => {
  try {
    const { ship_id, user_id, promo_id, booking_date, status, total_price, cabins, personal_info } = req.body;

    // Validasi input dasar
    if (!ship_id || !user_id || !total_price || !cabins || !personal_info) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const activeBooking = await Booking.findOne({
      user_id: user_id,
      status: "pending",
    });
    if (activeBooking) {
      return res.status(400).json({ message: "User already has an active pending booking." });
    }

    // Validasi referensi
    const ship = await Ship.findById(ship_id);
    if (!ship) {
      return res.status(404).json({ message: "Ship not found" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let promo = null;
    if (promo_id) {
      promo = await Promo.findById(promo_id);
      if (!promo) {
        return res.status(404).json({ message: "Promo not found" });
      }
    }

    // Buat kode invoice
    const invoiceCode = generateInvoiceCode();

    // Buat booking utama
    const newBooking = new Booking({
      ship_id,
      user_id,
      promo_id: promo ? promo._id : null,
      booking_date: booking_date || new Date(),
      status: status || "pending",
      total_price,
      personal_info,
      invoice_code: invoiceCode, // Sertakan kode invoice
      created_at: new Date(),
    });

    const savedBooking = await newBooking.save();

    const pendingNotification = new Notification({
      booking_id: savedBooking._id,
      user_id: user_id,
      type: "booking_created",
      title: "Booking Created",
      message: `Your booking for invoice ${invoiceCode} is created. Please complete payment to confirm your trip.`,
    });
    await pendingNotification.save();

    // Buat entri booking_cabins
    const bookingCabins = [];
    for (const cabin of cabins) {
      const newBookingCabin = new BookingCabin({
        booking_id: savedBooking._id,
        cabin_id: cabin.cabin_id,
        pax: cabin.pax,
        price: cabin.price,
        other: cabin.other,
      });
      bookingCabins.push(await newBookingCabin.save());
    }

    // Kembalikan data yang dibuat
    res.status(201).json({
      message: "Booking created successfully",
      booking: savedBooking,
      cabins: bookingCabins,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fungsi untuk mengambil booking berdasarkan ID

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    // Ambil booking + relasi dasar
    const booking = await Booking.findById(id).populate("ship_id", "name image_ship type merk class").populate("user_id", "name email number_telephone greeting").populate("promo_id", "code discount_type discount_value").lean();

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Ambil cabin details
    const bookingCabins = await BookingCabin.find({ booking_id: id }).populate("cabin_id", "name bed pax other date_start date_end").lean();

    // 🔹 Ambil schedule names berdasarkan ship_id dari booking
    const shipId = booking.ship_id?._id;
    let scheduleNames = [];
    if (shipId) {
      const schedules = await Schedule.find({ ship_id: shipId }, "name").lean();
      scheduleNames = schedules.map((s) => s.name);
    }

    // Gabungkan semua
    const fullBooking = {
      ...booking,
      cabins: bookingCabins.map((bc) => ({
        ...bc,
        cabin_name: bc.cabin_id?.name,
      })),
      schedule_names: scheduleNames, // ✅ tambahkan di sini
    };

    res.status(200).json({ booking: fullBooking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Cari booking berdasarkan ID
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Hanya boleh cancel jika status masih "pending"
    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be cancelled" });
    }

    // Update status ke "cancelled"
    booking.status = "cancelled";
    await booking.save();

    const cancelNotification = new Notification({
      booking_id: booking._id,
      user_id: booking.user_id,
      type: "booking_cancelled",
      title: "Booking Cancelled",
      message: `Your booking for invoice ${booking.invoice_code} has cancelled, and then payment was not completed`,
    });
    await cancelNotification.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking: booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkActiveBooking = async (req, res) => {
  try {
    const { id: userId } = req.user; // Diambil dari token (harus menggunakan middleware auth)
    const { shipId } = req.params;

    // Validasi shipId
    if (!mongoose.Types.ObjectId.isValid(shipId)) {
      return res.status(400).json({ message: "Invalid Ship ID" });
    }

    // Cari booking yang milik user ini, untuk ship ini, dan statusnya BUKAN 'cancelled'
    const activeBooking = await Booking.findOne({
      user_id: userId,
      ship_id: shipId, // Asumsi ship_id adalah ObjectId
      status: "pending", // $ne artinya "not equal", jadi status bukan 'cancelled'
    });

    if (activeBooking) {
      // Jika ditemukan booking aktif (pending, confirmed, dll), kirim respons true beserta ID dan statusnya
      return res.status(200).json({ hasActiveBooking: true, bookingId: activeBooking._id, status: activeBooking.status });
    }

    // Jika tidak ditemukan, kirim respons false
    return res.status(200).json({ hasActiveBooking: false });
  } catch (error) {
    console.error("Error checking active booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fungsi untuk memeriksa dan memperbarui booking expired
const checkAndExpirePendingBookings = async () => {
  try {
    console.log("Memeriksa booking pending yang expired...");
    const now = new Date();
    const expiryThresholdMs = 1 * 60 * 60 * 1000; // 1 jam

    // Cari booking pending yang expired
    const expiredBookings = await Booking.find({
      status: "pending",
      created_at: { $lt: new Date(now.getTime() - expiryThresholdMs) },
    }).populate("user_id");

    if (expiredBookings.length > 0) {
      console.log(`Ditemukan ${expiredBookings.length} booking yang expired.`);

      // Update status booking jadi "cancelled"
      await Booking.updateMany({ _id: { $in: expiredBookings.map((b) => b._id) } }, { $set: { status: "cancelled", reason: "Expired after pending timeout" } });

      // 🔔 Buat notifikasi untuk setiap user
      for (const booking of expiredBookings) {
        const notification = new Notification({
          booking_id: booking._id,
          user_id: booking.user_id,
          type: "booking_expired",
          title: "Booking Expired",
          message: `Your booking for invoice ${booking.invoice_code} has expired because payment was not completed within 1 hour.`,
        });
        await notification.save();
      }
    } else {
      console.log("Tidak ada booking pending yang expired saat ini.");
    }
  } catch (error) {
    console.error("Error saat memeriksa booking expired:", error);
  }
};

// Fungsi untuk menjalankan cron secara berkala (misalnya setiap 5 menit)
const startExpiryChecker = () => {
  // Jalankan sekali saat server start (opsional)
  checkAndExpirePendingBookings();

  // Atur interval untuk menjalankan fungsi setiap 5 menit (300000 ms)
  setInterval(checkAndExpirePendingBookings, 5 * 60 * 1000);
};

const getConfirmedPaxByShip = async (req, res) => {
  try {
    const { shipId } = req.params;

    if (!shipId) {
      return res.status(400).json({ message: "shipId is required" });
    }

    const result = await BookingCabin.aggregate([
      // Langkah 1: Join ke koleksi bookings
      {
        $lookup: {
          from: "bookings", // pastikan nama koleksi di MongoDB benar (biasanya plural)
          localField: "booking_id",
          foreignField: "_id",
          as: "booking",
        },
      },
      // Langkah 2: Unwind array hasil join
      { $unwind: "$booking" },
      // Langkah 3: Filter hanya booking yang:
      // - milik ship ini
      // - status confirmed
      {
        $match: {
          "booking.ship_id": new mongoose.Types.ObjectId(shipId),
          "booking.status": "confirmed",
        },
      },
      // Langkah 4: Kelompokkan per cabin_id, jumlahkan pax.adult
      {
        $group: {
          _id: "$cabin_id",
          totalBookedPax: { $sum: "$pax.adult" },
        },
      },
      // Langkah 5: Format output
      {
        $project: {
          _id: 0,
          cabinId: "$_id",
          totalBookedPax: 1,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error("Error fetching confirmed pax:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getByAdminBookings,
  getUserBookings,
  createBooking,
  getBookingById,
  cancelBooking,
  checkActiveBooking,
  startExpiryChecker,
  getConfirmedPaxByShip,
};
