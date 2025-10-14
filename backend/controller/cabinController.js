const Cabin = require("../models/cabinShipModel");
const ImagesCabin = require("../models/imageCabinModel");
const Ship = require("../models/shipModel.js");

// GET ALL CABINS (with ship name and images)
const getCabins = async (req, res) => {
  try {
    const cabins = await Cabin.find().populate("ship_id", "name");

    // Ambil gambar untuk setiap kabin
    const cabinsWithImages = await Promise.all(
      cabins.map(async (cabin) => {
        const images = await ImagesCabin.find({ cabin_id: cabin._id });
        return {
          ...cabin.toObject(),
          images: images.map((img) => img.image_cabin_url),
        };
      })
    );

    res.status(200).json(cabinsWithImages);
  } catch (error) {
    console.error("Error fetching cabins:", error);
    res.status(500).json({ message: "Gagal mengambil data kabin", error: error.message });
  }
};

// CREATE CABIN + UPLOAD IMAGES (handled by multer middleware)
const createCabin = async (req, res) => {
  try {
    const { ship_id, date_start, date_end, type, name, pax, bed, price } = req.body;

    // Validasi kapal
    const ship = await Ship.findById(ship_id);
    if (!ship) {
      return res.status(404).json({ message: "Kapal tidak ditemukan" });
    }

    // Validasi tanggal
    const startDate = new Date(date_start);
    const endDate = new Date(date_end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Format tanggal tidak valid." });
    }
    if (endDate <= startDate) {
      return res.status(400).json({ message: "Tanggal berakhir harus setelah tanggal mulai." });
    }

    // Validasi price
    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ message: "Harga harus berupa angka positif." });
    }

    // Validasi type
    if (!["private room", "shared room"].includes(type)) {
      return res.status(400).json({
        message: 'Tipe kabin harus "private room" atau "shared room".',
      });
    }

    let otherArray = [];
    if (req.body.other) {
      try {
        // Jika dikirim sebagai string JSON
        if (typeof req.body.other === "string") {
          otherArray = JSON.parse(req.body.other);
        } else {
          // Jika dikirim sebagai array (FormData biasanya kirim string)
          otherArray = req.body.other;
        }
      } catch (e) {
        return res.status(400).json({ message: "Invalid format for 'other' field." });
      }
    }

    // Validasi struktur
    if (!Array.isArray(otherArray)) {
      return res.status(400).json({ message: "'other' must be an array." });
    }

    // Buat kabin baru
    const newCabin = new Cabin({
      ship_id,
      date_start: startDate,
      date_end: endDate,
      type,
      name,
      pax: pax ? Number(pax) : undefined,
      bed,
      other: otherArray
        .map((item) => ({
          key: String(item.key || "").trim(),
          value: String(item.value || "").trim(),
        }))
        .filter((item) => item.key && item.value),
      price: parsedPrice,
    });

    await newCabin.save();

    // Simpan gambar (jika diupload)
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const imageDocs = req.files.map((file) => ({
        cabin_id: newCabin._id,
        image_cabin_url: `/uploads/cabins/${file.filename}`,
      }));
      const savedImages = await ImagesCabin.insertMany(imageDocs);
      imageUrls = savedImages.map((img) => img.image_cabin_url);
    }

    res.status(201).json({
      message: "Kabin berhasil dibuat",
      cabin: {
        ...newCabin.toObject(),
        images: imageUrls,
      },
    });
  } catch (error) {
    console.error("Error creating cabin:", error);
    res.status(500).json({ message: "Gagal membuat kabin", error: error.message });
  }
};

// UPDATE CABIN + UPLOAD IMAGES (handled by multer)
const updateCabin = async (req, res) => {
  try {
    const { id } = req.params;
    const { ship_id, date_start, date_end, type, name, pax, bed, price } = req.body;

    const cabin = await Cabin.findById(id);
    if (!cabin) {
      return res.status(404).json({ message: "Kabin tidak ditemukan" });
    }

    // Validasi kapal (jika diubah)
    if (ship_id) {
      const ship = await Ship.findById(ship_id);
      if (!ship) {
        return res.status(404).json({ message: "Kapal tidak ditemukan" });
      }
      cabin.ship_id = ship_id;
    }

    // Update field lainnya
    if (date_start) cabin.date_start = new Date(date_start);
    if (date_end) cabin.date_end = new Date(date_end);
    if (type) {
      if (!["private room", "shared room"].includes(type)) {
        return res.status(400).json({
          message: 'Tipe kabin harus "private room" atau "shared room".',
        });
      }
      cabin.type = type;
    }
    if (name) cabin.name = name;
    if (pax !== undefined) cabin.pax = Number(pax);
    if (bed) cabin.bed = bed;
    if (req.body.other) {
      try {
        const otherArray = typeof req.body.other === "string" ? JSON.parse(req.body.other) : req.body.other;

        if (!Array.isArray(otherArray)) {
          return res.status(400).json({ message: "'other' must be an array." });
        }

        cabin.other = otherArray
          .map((item) => ({
            key: String(item.key || "").trim(),
            value: String(item.value || "").trim(),
          }))
          .filter((item) => item.key && item.value);
      } catch (e) {
        return res.status(400).json({ message: "Invalid format for 'other' field." });
      }
    }
    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ message: "Harga harus berupa angka positif." });
      }
      cabin.price = parsedPrice;
    }

    // Validasi tanggal setelah update
    if (cabin.date_end <= cabin.date_start) {
      return res.status(400).json({ message: "Tanggal berakhir harus setelah tanggal mulai." });
    }

    // Jika ada file baru diupload → ganti semua gambar
    if (req.files && req.files.length > 0) {
      // Hapus entri gambar lama di database
      await ImagesCabin.deleteMany({ cabin_id: cabin._id });

      // Simpan gambar baru
      const imageDocs = req.files.map((file) => ({
        cabin_id: cabin._id,
        image_cabin_url: `/uploads/cabins/${file.filename}`,
      }));
      await ImagesCabin.insertMany(imageDocs);
    }

    await cabin.save();

    // Ambil gambar terbaru
    const images = await ImagesCabin.find({ cabin_id: cabin._id });

    res.status(200).json({
      message: "Kabin berhasil diperbarui",
      cabin: {
        ...cabin.toObject(),
        images: images.map((img) => `${baseUrl}${img.image_cabin_url}`),
      },
    });
  } catch (error) {
    console.error("Error updating cabin:", error);
    res.status(500).json({ message: "Gagal memperbarui kabin", error: error.message });
  }
};

// DELETE CABIN + DELETE IMAGES FROM DB (file fisik tetap ada, opsional dihapus)
const deleteCabin = async (req, res) => {
  try {
    const { id } = req.params;

    const cabin = await Cabin.findById(id);
    if (!cabin) {
      return res.status(404).json({ message: "Kabin tidak ditemukan" });
    }

    // Hapus referensi gambar di database
    await ImagesCabin.deleteMany({ cabin_id: cabin._id });

    // Hapus kabin
    await cabin.deleteOne();

    res.status(200).json({ message: "Kabin berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting cabin:", error);
    res.status(500).json({ message: "Gagal menghapus kabin", error: error.message });
  }
};

module.exports = { getCabins, createCabin, updateCabin, deleteCabin };
