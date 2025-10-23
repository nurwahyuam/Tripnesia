// controllers/bookingController.js
const Booking = require("../models/Booking");
const BookingCabin = require("../models/BookingCabin");
const Transaction = require("../models/Transaction");
const Ship = require("../models/Ship");
const Cabin = require("../models/Cabin");
const User = require("../models/User");

// CREATE BOOKING — Hanya 1 booking aktif per user
const createBooking = async (req, res) => {
  const { user_id, ship_id, promo_id, cabin_bookings } = req.body;

  try {
    // Validasi user & ship
    const user = await User.findById(user_id);
    const ship = await Ship.findById(ship_id);
    if (!user || !ship) {
      return res.status(404).json({ message: "User or ship not found" });
    }

    // Cek apakah user sudah punya booking aktif
    const activeBooking = await Booking.findOne({
      user_id,
      status: { $in: ["pending", "paid"] },
    });
    if (activeBooking) {
      return res.status(400).json({
        message: "You already have an active booking. Please complete or cancel it first.",
      });
    }

    // Hitung total price
    let total_price = 0;
    for (const item of cabin_bookings) {
      const cabin = await Cabin.findById(item.cabin_id);
      if (!cabin) {
        return res.status(404).json({ message: `Cabin ${item.cabin_id} not found` });
      }
      total_price += item.price;
    }

    // Buat booking
    const booking = new Booking({
      user_id,
      ship_id,
      promo_id: promo_id || null,
      total_price,
      expired_at: new Date(Date.now() + 30 * 60 * 1000), // 30 menit dari sekarang
    });

    await booking.save();

    // Simpan detail kabin
    const cabinDocs = cabin_bookings.map((item) => ({
      booking_id: booking._id,
      cabin_id: item.cabin_id,
      pax: item.pax,
      pax_under_five_year: item.pax_under_five_year || 0,
      price: item.price,
    }));

    await BookingCabin.insertMany(cabinDocs);

    // Populasi untuk respons
    const populatedBooking = await Booking.findById(booking._id).populate("user_id", "name email").populate("ship_id", "name");

    res.status(201).json({
      message: "Booking created successfully",
      data: populatedBooking,
      expired_at: booking.expired_at,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
};

// UPLOAD PAYMENT PROOF
const uploadPaymentProof = async (req, res) => {
  const { booking_id, payment_method, amount, reference_code } = req.body;
  const proof_of_payment_url = req.file ? `/uploads/proofs/${req.file.filename}` : null;

  try {
    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Cek apakah booking sudah kadaluarsa
    if (booking.expired_at < new Date()) {
      return res.status(400).json({ message: "Booking has expired" });
    }

    const transaction = new Transaction({
      booking_id,
      payment_method,
      amount,
      reference_code,
      proof_of_payment_url,
      status: "pending", // menunggu verifikasi admin
    });

    await transaction.save();

    res.status(201).json({
      message: "Payment proof uploaded successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error uploading payment proof:", error);
    res.status(500).json({ message: "Failed to upload payment proof", error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user_id", "name email").populate("ship_id", "name").populate("promo_id", "code").sort({ createdAt: -1 });

    // Tambahkan detail kabin & transaksi
    const fullBookings = await Promise.all(
      bookings.map(async (booking) => {
        const cabins = await BookingCabin.find({ booking_id: booking._id }).populate("cabin_id", "name");

        const transaction = await Transaction.findOne({ booking_id: booking._id });

        return {
          ...booking.toObject(),
          cabins: cabins.map((c) => ({
            name: c.cabin_id.name,
            pax: c.pax,
            price: c.price,
          })),
          transaction: transaction || null,
        };
      })
    );

    res.status(200).json(fullBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};

// UPDATE TRANSACTION STATUS (approve/reject)
const updateTransactionStatus = async (req, res) => {
  const { id } = req.params; // id transaksi
  const { status } = req.body;

  if (!["paid", "failed"].includes(status)) {
    return res.status(400).json({ message: 'Status must be "paid" or "failed"' });
  }

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.status = status;
    await transaction.save();

    // Update status booking
    const booking = await Booking.findById(transaction.booking_id);
    if (booking) {
      booking.status = status === "paid" ? "completed" : "rejected";
      await booking.save();
    }

    res.status(200).json({ message: "Transaction status updated successfully" });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Failed to update transaction", error: error.message });
  }
};

// DELETE BOOKING
const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Hapus transaksi & detail kabin
    await Transaction.deleteMany({ booking_id: id });
    await BookingCabin.deleteMany({ booking_id: id });

    // Hapus bukti pembayaran (opsional)
    const transaction = await Transaction.findOne({ booking_id: id });
    if (transaction && transaction.proof_of_payment_url) {
      const filePath = path.join(__dirname, "..", "..", "public", transaction.proof_of_payment_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Booking.findByIdAndDelete(id);

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Failed to delete booking", error: error.message });
  }
};

// EXPORT TO CSV
const exportBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user_id", "name email").populate("ship_id", "name").sort({ createdAt: -1 });

    let csv = "ID,User Name,User Email,Ship,Status,Total Price,Booking Date,Expired At\n";

    bookings.forEach((b) => {
      csv += `"${b._id}","${b.user_id?.name || ""}","${b.user_id?.email || ""}","${b.ship_id?.name || ""}","${b.status}","${b.total_price}","${b.createdAt.toISOString()}","${b.expired_at.toISOString()}"\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("bookings.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting bookings:", error);
    res.status(500).json({ message: "Failed to export bookings", error: error.message });
  }
};

module.exports = { createBooking, uploadPaymentProof, getAllBookings, updateTransactionStatus, deleteBooking, exportBookings };
