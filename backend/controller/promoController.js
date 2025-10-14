const Promo = require("../models/promoModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// GET ALL PROMOS
const getPromos = async (req, res) => {
  try {
    const promos = await Promo.find().select("code description price percentage start_date end_date status");
    res.status(200).json(promos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// CREATE PROMO
const createPromo = async (req, res) => {
  try {
    const { code, description, price, percentage, start_date, end_date, status } = req.body;

    // Validasi wajib
    if (!code || !description || !start_date || !end_date || status === undefined) {
      return res.status(400).json({ message: "Wajib isi Kode, Deksripsi, Mulai Tanggal, Sampai Tanggal, dan Status." });
    }

    // Validasi format tanggal
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Format tanggal tidak valid." });
    }
    if (endDate <= startDate) {
      return res.status(400).json({ message: "Tanggal berakhir harus setelah tanggal mulai." });
    }

    // Cek duplikat kode
    const existingPromo = await Promo.findOne({ code });
    if (existingPromo) {
      return res.status(400).json({ message: "Kode promo sudah ada." });
    }

    // Di createPromo & updatePromo:
    const safeNumber = (val) => {
      if (val == null || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    };

    const newPromo = new Promo({
      code,
      description,
      price: safeNumber(price),
      percentage: safeNumber(percentage),
      start_date: startDate,
      end_date: endDate,
      status: Boolean(status),
    });

    await newPromo.save();
    res.status(201).json({ message: "Promo telah berhasil dibuat.", promo: newPromo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kesalahan server internal." });
  }
};
// UPDATE PROMO
const updatePromo = async (req, res) => {
  try {
    const { code, description, price, percentage, start_date, end_date, status } = req.body;
    const promo = await Promo.findById(req.params.id);
    if (!promo) return res.status(404).json({ message: "Promo tidak ditemukan." });

    const safeNumber = (val) => {
      if (val == null || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    };

    if (code) promo.code = code;
    if (description) promo.description = description;
    if (price) promo.price = safeNumber(price);
    if (percentage) promo.percentage = safeNumber(percentage);
    if (status) promo.status = status;
    if (start_date) promo.start_date = start_date;
    if (end_date) promo.end_date = end_date;
    await promo.save();
    res.status(200).json({ message: "Promo Berhasil Diperbarui!" });
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
    res.status(200).json({ message: "Pengguna Berhasil Dihapus!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPromos,
  createPromo,
  updatePromo,
  deletePromo,
};
