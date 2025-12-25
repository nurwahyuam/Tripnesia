const express = require('express');
const router = express.Router();
const { getAdminDashboard } = require('../controller/dashboardController');
const { verifyToken } = require("../middleware/authMiddleware");

router.get('/admin', verifyToken, getAdminDashboard);

module.exports = router;