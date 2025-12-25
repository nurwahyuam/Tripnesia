const Promo = require("../models/promoModel");
const UserPromoUsage = require("../models/userPromoUsageModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const mongoose = require("mongoose");

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

// ✅ GET PROMO BY CODE (endpoint baru)
const getPromoByCode = async (req, res) => {
  const { code } = req.query;
  const userId = req.user?.id;

  if (!code) {
    return res.status(400).json({ error: "Kode promo harus diisi" });
  }

  try {
    let promoQuery = {
      code: code.toUpperCase(),
      status: true, // diganti dari is_active ke status
      start_date: { $lte: new Date() },
      end_date: { $gte: new Date() },
    };

    // Jika ada user_id, cek apakah promo khusus user atau umum
    if (userId) {
      promoQuery.$or = [
        { user_id: null }, // promo umum
        { user_id: userId }, // promo khusus user
      ];
    } else {
      promoQuery.user_id = null; // hanya promo umum
    }

    const promo = await Promo.findOne(promoQuery);

    if (!promo) {
      return res.status(404).json({
        error: "Promo tidak ditemukan, sudah kadaluarsa, atau tidak berlaku untuk Anda",
      });
    }

    // ✅ Cek apakah user ini sudah pernah pakai promo ini
    if (userId) {
      const usage = await UserPromoUsage.findOne({
        user_id: userId,
        promo_id: promo._id,
      });

      if (usage) {
        return res.status(400).json({
          error: "Anda sudah pernah menggunakan voucher ini.",
        });
      }
    }

    res.json({
      id: promo._id,
      code: promo.code,
      description: promo.description,
      discount_value: promo.discount_value,
      discount_type: promo.discount_type,
      start_date: promo.start_date,
      end_date: promo.end_date,
      status: promo.status,
      user_id: promo.user_id,
      min_pax: promo.min_pax,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET ALL PROMOS
const getPromos = async (req, res) => {
  try {
    const promos = await Promo.find().select("code description discount_value discount_type start_date end_date status user_id min_pax");
    res.status(200).json(promos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE PROMO + Kirim Notifikasi ke Semua User
const createPromo = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      code,
      description,
      discount_value,
      discount_type,
      start_date,
      end_date,
      status,
      user_id, // jika promo khusus user, tidak perlu kirim ke semua
      min_pax,
    } = req.body;

    // Validasi wajib
    if (!code || !description || !discount_value || !discount_type || !start_date || !end_date || status === undefined) {
      return res.status(400).json({ message: "Wajib isi Kode, Deskripsi, Discount Value, Discount Type, Mulai Tanggal, Sampai Tanggal, dan Status." });
    }

    // Bersihkan dan ubah ke uppercase
    const cleanCode = code.trim().toUpperCase();

    // Validasi karakter
    if (!/^[A-Z0-9_-]+$/.test(cleanCode)) {
      return res.status(400).json({
        message: "Kode promo hanya boleh berisi huruf (A-Z), angka (0-9), underscore (_), atau dash (-).",
      });
    }

    if (!["percentage", "fixed"].includes(discount_type)) {
      return res.status(400).json({ message: "Discount type harus 'percentage' atau 'fixed'." });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Format tanggal tidak valid." });
    }
    if (endDate <= startDate) {
      return res.status(400).json({ message: "Tanggal berakhir harus setelah tanggal mulai." });
    }

    const existingPromo = await Promo.findOne({ code });
    if (existingPromo) {
      return res.status(400).json({ message: "Kode promo sudah ada." });
    }

    // Buat promo baru
    const newPromo = new Promo({
      code: cleanCode,
      description,
      discount_value: Number(discount_value),
      discount_type,
      start_date: startDate,
      end_date: endDate,
      status: Boolean(status),
      user_id: user_id || null,
      min_pax: min_pax || 1,
    });

    await newPromo.save({ session });

    // 🔔 Jika promo UNTUK SEMUA USER (user_id null), kirim notifikasi ke semua user
    if (!user_id) {
      // Ambil semua user (hanya ID)
      const allUsers = await User.find({}).select("_id");

      // Siapkan notifikasi untuk setiap user
      const notifications = allUsers.map((user) => ({
        booking_id: null,
        user_id: user._id,
        type: "promo_created",
        title: "🎉 Promo Baru Tersedia!",
        message: `Gunakan kode **${cleanCode}** untuk mendapatkan diskon ${discount_type === "percentage" ? `${discount_value}%` : formatRupiah(discount_value)}! Berlaku hingga ${endDate.toLocaleDateString("id-ID")}.`,
        read: false,
        metadata: {
          promo_id: newPromo._id,
          promo_code: code,
        },
      }));

      // Simpan semua notifikasi
      if (notifications.length > 0) {
        await Notification.insertMany(notifications, { session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Promo telah berhasil dibuat.", promo: newPromo });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating promo:", err);
    res.status(500).json({ message: "Kesalahan server internal." });
  }
};

// UPDATE PROMO
const updatePromo = async (req, res) => {
  try {
    const { code, description, discount_value, discount_type, start_date, end_date, status, user_id, min_pax } = req.body;

    const promo = await Promo.findById(req.params.id);
    if (!promo) return res.status(404).json({ message: "Promo tidak ditemukan." });

    if (code) {
      const cleanCode = code.trim().toUpperCase();
      if (!/^[A-Z0-9_-]+$/.test(cleanCode)) {
        return res.status(400).json({
          message: "Kode promo hanya boleh berisi huruf (A-Z), angka (0-9), underscore (_), atau dash (-).",
        });
      }
      promo.code = cleanCode; // 🔥 uppercase
    }
    if (description) promo.description = description;
    if (discount_value) promo.discount_value = Number(discount_value);
    if (discount_type) {
      if (["percentage", "fixed"].includes(discount_type)) {
        promo.discount_type = discount_type;
      } else {
        return res.status(400).json({ message: "Discount type harus 'percentage' atau 'fixed'." });
      }
    }
    if (status !== undefined) promo.status = status;
    if (start_date) promo.start_date = start_date;
    if (end_date) promo.end_date = end_date;
    if (user_id !== undefined) promo.user_id = user_id || null;
    if (min_pax !== undefined) promo.min_pax = min_pax;

    await promo.save();
    res.status(200).json({ message: "Promo Berhasil Diperbarui!", promo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE PROMO
const deletePromo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Promo tidak ditemukan" });
    }
    const promo = await Promo.findByIdAndDelete(id);
    if (!promo) {
      return res.status(404).json({ error: "Promo tidak ditemukan" });
    }
    res.status(200).json({ message: "Promo Berhasil Dihapus!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPromos,
  createPromo,
  updatePromo,
  deletePromo,
  getPromoByCode,
};
