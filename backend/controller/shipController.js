const fs = require('fs');
const path = require("path");
const Ship = require("../models/shipModel");
const Schedule = require("../models/scheduleModel");
const PlanDays = require("../models/planDaysModel");
const SpecificationShip = require("../models/specificationShipModel");
const FacilityShip = require("../models/facilityShipModel");
const SecurityToolShip = require("../models/securityToolShip");
const ImagesShip = require("../models/imageShipModel");

const getShips = async (req, res) => {
  try {
    const ships = await Ship.find().select("name type merk class min_pax max_pax status slug createdAt");
    res.status(200).json(ships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getShipById = async (req, res) => {
  try {
    const shipId = req.params.id;

    const ship = await Ship.findById(shipId);
    if (!ship) return res.status(404).json({ message: "Ship not found" });

    // Ambil semua relasi
    const [schedules, specs, facilities, securityTools, images] = await Promise.all([
      Schedule.find({ ship_id: shipId }),
      SpecificationShip.find({ ship_id: shipId }),
      FacilityShip.find({ ship_id: shipId }),
      SecurityToolShip.find({ ship_id: shipId }),
      ImagesShip.find({ ship_id: shipId }),
    ]);

    // Proses schedules dengan planDays
    let schedulesWithPlans = [];
    if (schedules.length > 0) {
      schedulesWithPlans = await Promise.all(
        schedules.map(async (sched) => {
          const planDays = await PlanDays.find({ plan_id: sched._id });
          return {
            _id: sched._id,
            name: sched.name,
            planDays:
              planDays.length > 0
                ? planDays.map((p) => ({
                    _id: p._id,
                    day: p.day,
                    plans: p.plans,
                  }))
                : [{ day: 1, plans: { 1: "" } }], // fallback jika tidak ada planDays
          };
        })
      );
    } else {
      // Jika tidak ada schedule sama sekali, berikan default
      schedulesWithPlans = [
        {
          name: "Default Schedule",
          planDays: [{ day: 1, plans: { 1: "" } }],
        },
      ];
    }

    const fullShip = {
      ...ship.toObject(),
      schedules: schedulesWithPlans,
      specifications: specs.map((s) => ({ _id: s._id, name: s.name, unit: s.unit })),
      facilities: facilities.map((f) => ({ _id: f._id, name: f.name })),
      securityTools: securityTools.map((t) => ({ _id: t._id, name: t.name })),
      images: images.map((img) => ({ _id: img._id, image_ship_url: img.image_ship_url })),
    };

    // ✅ Tambahkan base URL
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const shipResponse = {
      ...fullShip,
      image_ship: baseUrl + fullShip.image_ship,
      images: fullShip.images.map((img) => ({
        ...img,
        image_ship_url: baseUrl + img.image_ship_url,
      })),
    };

    res.status(200).json(shipResponse);
  } catch (err) {
    console.error("Get ship by ID error:", err);
    res.status(500).json({ message: err.message || "Failed to fetch ship" });
  }
};

const createShip = async (req, res) => {
  let session;
  let committed = false;
  try {
    session = await Ship.startSession();
    session.startTransaction();
  } catch (err) {
    console.warn("MongoDB session not available. Skipping transaction.");
  }

  console.log(req.body.ship);
  console.log(req.files);

  try {
    // Ambil data dari req.body (JSON string yang di-parse)
    const shipData = req.body.ship ? JSON.parse(req.body.ship) : {};
    const schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];
    const specifications = req.body.specifications ? JSON.parse(req.body.specifications) : [];
    const facilities = req.body.facilities ? JSON.parse(req.body.facilities) : [];
    const securityTools = req.body.securityTools ? JSON.parse(req.body.securityTools) : [];

    const { name, description, type, merk, class: cls, package: pkg, unpackage, min_pax, max_pax, status } = shipData;

    // Validasi dasar
    if (!name || !description) {
      throw new Error("Name and description are required");
    }
    if (!["private trip", "open trip"].includes(type)) {
      throw new Error("Invalid ship type. Use 'private trip' or 'open trip'.");
    }
    if (!["standard", "superior", "deluxe", "luxury"].includes(cls)) {
      throw new Error("Invalid ship class. Use 'luxury', 'premium', or 'economy'.");
    }
    if (!min_pax || !max_pax || min_pax > max_pax) {
      throw new Error("Valid min_pax and max_pax are required (min ≤ max)");
    }

    // --- PROSES MASTER IMAGE ---
    const masterImageFile = req.files?.find((file) => file.fieldname === "masterImage");
    let masterImagePath = "";
    if (masterImageFile) {
      masterImagePath = `/uploads/ship/${masterImageFile.filename}`;
    } else {
      throw new Error("Master image is required");
    }

    // Simpan Ship
    const newShip = new Ship({
      type,
      merk,
      class: cls,
      name,
      description,
      package: Array.isArray(pkg) ? pkg.filter((item) => item.trim() !== "") : [],
      unpackage: Array.isArray(unpackage) ? unpackage.filter((item) => item.trim() !== "") : [],
      image_ship: masterImagePath, // simpan path
      min_pax,
      max_pax,
      status,
    });

    const options = session ? { session } : {};
    await newShip.save(options);
    const shipId = newShip._id;

    // Simpan Schedule & PlanDays
    const savedSchedules = [];
    for (const sched of schedules) {
      if (!sched.name) continue;
      const scheduleDoc = new Schedule({
        ship_id: shipId,
        name: sched.name.trim(),
      });
      const savedSched = await scheduleDoc.save(options);
      savedSchedules.push(savedSched);

      if (sched.planDays && Array.isArray(sched.planDays)) {
        for (const plan of sched.planDays) {
          if (!plan.day || !plan.plans) continue;
          const planDayDoc = new PlanDays({
            plan_id: savedSched._id,
            day: plan.day,
            plans: plan.plans,
          });
          await planDayDoc.save(options);
        }
      }
    }

    // Simpan Specifications
    for (const spec of specifications) {
      if (!spec.name) continue;
      const specDoc = new SpecificationShip({
        ship_id: shipId,
        name: spec.name.trim(),
        unit: spec.unit ? spec.unit.trim() : "",
      });
      await specDoc.save(options);
    }

    // Simpan Facilities
    for (const fac of facilities) {
      if (!fac.name) continue;
      const facDoc = new FacilityShip({
        ship_id: shipId,
        name: fac.name.trim(),
      });
      await facDoc.save(options);
    }

    // Simpan Security Tools
    for (const tool of securityTools) {
      if (!tool.name) continue;
      const toolDoc = new SecurityToolShip({
        ship_id: shipId,
        name: tool.name.trim(),
      });
      await toolDoc.save(options);
    }

    if (session) {
      await session.commitTransaction();
      committed = true;
      session.endSession();
    }

    const shipWithSlug = await Ship.findById(shipId);
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const shipResponse = {
      ...shipWithSlug.toObject(),
      image_ship: baseUrl + shipWithSlug.image_ship,
    };

    res.status(201).json({
      message: "Ship and all related data created successfully",
      ship: shipResponse,
    });
  } catch (error) {
    if (session && !committed) {
      await session.abortTransaction();
    }
    if (session) {
      session.endSession();
    }
    if (req.files) {
      Object.values(req.files)
        .flat()
        .forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
    }
    console.error("Create full ship error:", error);
    res.status(500).json({ message: error.message || "Failed to create ship" });
  }
};

const updateShip = async (req, res) => {
  const { id } = req.params;

  let session;
  let committed = false;
  try {
    session = await Ship.startSession();
    session.startTransaction();
  } catch (err) {
    console.warn("MongoDB session not available. Skipping transaction.");
  }

  try {
    const shipData = req.body.ship ? JSON.parse(req.body.ship) : {};
    const schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];
    const specifications = req.body.specifications ? JSON.parse(req.body.specifications) : [];
    const facilities = req.body.facilities ? JSON.parse(req.body.facilities) : [];
    const securityTools = req.body.securityTools ? JSON.parse(req.body.securityTools) : [];

    const { type, merk, class: cls, name, description, package: pkg, unpackage, min_pax, max_pax, status } = shipData;

    if (!name || !description) {
      throw new Error("Name and description are required");
    }
    if (!["private trip", "open trip"].includes(type)) {
      throw new Error("Invalid ship type. Use 'private trip' or 'open trip'.");
    }
    if (!["standard", "superior", "deluxe", "luxury"].includes(cls)) {
      throw new Error("Invalid ship class. Use 'luxury', 'premium', or 'economy'.");
    }
    if (!min_pax || !max_pax || min_pax > max_pax) {
      throw new Error("Valid min_pax and max_pax are required (min ≤ max)");
    }

    // Cari ship lama untuk hapus file lama (opsional)
    const oldShip = await Ship.findById(id);
    if (!oldShip) {
      throw new Error("Ship not found");
    }

    // --- PROSES MASTER IMAGE (jika ada upload baru) ---
    let masterImagePath = oldShip.image_ship;
    const masterImageFile = req.files?.find((file) => file.fieldname === "masterImage");
    if (masterImageFile) {
      masterImagePath = `/uploads/ship/${masterImageFile.filename}`;
    }

    // Update ship utama
    const updatedShip = await Ship.findByIdAndUpdate(
      id,
      {
        type,
        merk,
        class: cls,
        name,
        description,
        package: Array.isArray(pkg) ? pkg.filter((item) => item.trim() !== "") : [],
        unpackage: Array.isArray(unpackage) ? unpackage.filter((item) => item.trim() !== "") : [],
        image_ship: masterImagePath,
        min_pax,
        max_pax,
        status,
      },
      { new: true, session }
    );

    // Hapus semua data lama terkait
    const schedulesOld = await Schedule.find({ ship_id: id });
    const scheduleIdsOld = schedulesOld.map((s) => s._id);

    const deleteOps = [
      Schedule.deleteMany({ ship_id: id }, { session }),
      PlanDays.deleteMany({ plan_id: { $in: scheduleIdsOld } }, { session }),
      SpecificationShip.deleteMany({ ship_id: id }, { session }),
      FacilityShip.deleteMany({ ship_id: id }, { session }),
      SecurityToolShip.deleteMany({ ship_id: id }, { session }),
      ImagesShip.deleteMany({ ship_id: id }, { session }),
    ];

    await Promise.all(deleteOps);

    const options = session ? { session } : {};

    // Simpan Schedule & PlanDays
    const savedSchedules = [];
    for (const sched of schedules) {
      if (!sched.name) continue;
      const scheduleDoc = new Schedule({
        ship_id: id,
        name: sched.name.trim(),
      });
      const savedSched = await scheduleDoc.save(options);
      savedSchedules.push(savedSched);

      if (sched.planDays && Array.isArray(sched.planDays)) {
        for (const plan of sched.planDays) {
          if (!plan.day || !plan.plans) continue;
          const planDayDoc = new PlanDays({
            plan_id: savedSched._id,
            day: plan.day,
            plans: plan.plans,
          });
          await planDayDoc.save(options);
        }
      }
    }

    // Simpan Specifications
    for (const spec of specifications) {
      if (!spec.name) continue;
      const specDoc = new SpecificationShip({
        ship_id: id,
        name: spec.name.trim(),
        unit: spec.unit ? spec.unit.trim() : "",
      });
      await specDoc.save(options);
    }

    // Simpan Facilities
    for (const fac of facilities) {
      if (!fac.name) continue;
      const facDoc = new FacilityShip({
        ship_id: id,
        name: fac.name.trim(),
      });
      await facDoc.save(options);
    }

    // Simpan Security Tools
    for (const tool of securityTools) {
      if (!tool.name) continue;
      const toolDoc = new SecurityToolShip({
        ship_id: id,
        name: tool.name.trim(),
      });
      await toolDoc.save(options);
    }

    // --- PROSES ADDITIONAL IMAGES BARU ---
    const additionalImageFiles = Array.isArray(req.files) ? req.files.filter((file) => file.fieldname === "additionalImages") : [];
    const additionalImagePaths = additionalImageFiles.map((file) => `/uploads/ship/${file.filename}`);

    // Simpan Additional Images
    for (const imgPath of additionalImagePaths) {
      const imgDoc = new ImagesShip({
        ship_id: id,
        image_ship_url: imgPath,
      });
      await imgDoc.save(options);
    }

    if (session) {
      await session.commitTransaction();
      committed = true;
      session.endSession();
    }

    const shipWithSlug = await Ship.findById(id);
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const shipResponse = {
      ...shipWithSlug.toObject(),
      image_ship: baseUrl + shipWithSlug.image_ship,
      images: (shipWithSlug.images || []).map((img) => ({
        ...img,
        image_ship_url: baseUrl + img.image_ship_url,
      })),
    };

    res.status(200).json({
      message: "Ship and all related data updated successfully",
      ship: shipResponse,
    });
  } catch (error) {
    if (session && !committed) {
      await session.abortTransaction();
    }
    if (session) {
      session.endSession();
    }

    // Hapus file yang gagal disimpan
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    console.error("Update full ship error:", error);
    res.status(500).json({ message: error.message || "Failed to update ship" });
  }
};

const deleteShip = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Cari ship untuk validasi & ambil path gambar
    const ship = await Ship.findById(id);
    if (!ship) {
      return res.status(404).json({ message: "Ship not found" });
    }

    // 2. Ambil semua schedule terkait untuk hapus PlanDays
    const schedules = await Schedule.find({ ship_id: id });
    const scheduleIds = schedules.map((s) => s._id);

    // 3. Ambil semua additional images untuk hapus file fisik
    const additionalImages = await ImagesShip.find({ ship_id: id });

    // 4. Hapus file fisik (master image)
    if (ship.image_ship) {
      const masterImagePath = path.join(__dirname, "..", ship.image_ship);
      if (fs.existsSync(masterImagePath)) {
        fs.unlinkSync(masterImagePath);
      }
    }

    // 5. Hapus file fisik (additional images)
    for (const img of additionalImages) {
      if (img.image_ship_url) {
        const imgPath = path.join(__dirname, "..", img.image_ship_url);
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      }
    }

    // 6. Hapus semua dokumen terkait di database
    await Promise.all([
      Schedule.deleteMany({ ship_id: id }),
      PlanDays.deleteMany({ plan_id: { $in: scheduleIds } }),
      SpecificationShip.deleteMany({ ship_id: id }),
      FacilityShip.deleteMany({ ship_id: id }),
      SecurityToolShip.deleteMany({ ship_id: id }),
      ImagesShip.deleteMany({ ship_id: id }),
      Ship.findByIdAndDelete(id), // Hapus ship terakhir
    ]);

    res.status(200).json({ message: "Ship and all related data deleted successfully" });
  } catch (err) {
    console.error("Delete ship error:", err);
    res.status(500).json({ message: err.message || "Failed to delete ship" });
  }
};

module.exports = {
  getShips,
  getShipById,
  createShip,
  updateShip,
  deleteShip,
};
