const express = require('express');
const router = express.Router();
const { createMidtransTransaction, handleMidtransNotification } = require("../controller/paymentController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/midtrans/create-token", verifyToken, createMidtransTransaction);
router.post("/midtrans/notification", handleMidtransNotification);

module.exports = router;