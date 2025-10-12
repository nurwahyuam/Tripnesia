require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const shipRoutes = require("./routes/ships");

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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ships", shipRoutes);

// Database & Server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONG_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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