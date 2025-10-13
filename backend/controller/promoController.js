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
    if (!code || !description || !price || !percentage || !start_date || end_date || !status) {
      return res.status(400).json({ message: "Semua Input harus wajib diisi." });
    }
    const existingPromo = await Promo.findOne({ $or: [{ code }] });
    if (existingPromo) {
      return res.status(400).json({ message: "Kode sudah dibuat." });
    }

    const newPromo = new Promo({
      code,
      description,
      price,
      percentage,
      start_date,
      end_date,
      status
    });
    await newPromo.save();
    res.status(201).json({ message: "Promo telah berhasil dibuat" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// UPDATE PROMO
const updatePromo = async (req, res) => {
  try {
    const { code, description, price, percentage, start_date, end_date, status } = req.body;
    const promo = await Promo.findById(req.params.id);
    if (!promo) return res.status(404).json({ message: "Promo tidak ditemukan." });
    if (code) promo.code = code;
    if (description) promo.description = description;
    if (price) promo.price = price;
    if (percentage) promo.percentage = percentage;
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
      return res.status(404).json({ error: 'Promo tidak ditemukan' });
    }
    res.status(200).json({ message: 'Pengguna Berhasil Dihapus!' });
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
