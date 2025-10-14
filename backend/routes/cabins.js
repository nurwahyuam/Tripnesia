const express = require("express");
const { getCabins, createCabin, updateCabin, deleteCabin } = require("../controller/cabinController");

const { verifyToken } = require("../middleware/authMiddleware");
const { uploadMultiple } = require("../middleware/uploudCabinsMiddleware");

const router = express.Router();

router.get("/", verifyToken, getCabins);
router.post("/", verifyToken, uploadMultiple, createCabin);
router.put("/:id", verifyToken, uploadMultiple, updateCabin);
router.delete("/:id", verifyToken, deleteCabin);

module.exports = router;
