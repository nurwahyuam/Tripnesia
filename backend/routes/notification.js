const express = require("express");
const router = express.Router();
const { getUserNotifications, markNotificationAsRead } = require("../controller/notificationController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getUserNotifications);
router.patch("/:id/read", verifyToken, markNotificationAsRead);

module.exports = router;