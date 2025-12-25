require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const shipRoutes = require("./routes/ships");
const promoRoutes = require("./routes/promos");
const cabinRoutes = require("./routes/cabins");
const favoriteShipRoutes = require("./routes/favorites");
const bookingRoutes = require("./routes/bookings")
const paymentRoutes = require("./routes/payments")
const notificationRoutes = require("./routes/notification")
const dashboardRoutes = require("./routes/dashboard")
const { startExpiryChecker } = require('./controller/bookingController');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

startExpiryChecker()

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ships", shipRoutes);
app.use("/api/promos", promoRoutes);
app.use("/api/cabins", cabinRoutes);
app.use("/api/favorites", favoriteShipRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/notifications", notificationRoutes);

// Database & Server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONG_URL);
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`✅ Server running on http://localhost:${port}`);
      console.log("✅ MongoDB connected");
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err.message);
    process.exit(1);
  }
};

startServer();
