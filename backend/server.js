require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS (frontend vite di localhost:5173)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);

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