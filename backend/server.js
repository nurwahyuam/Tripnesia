require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // penting biar cookie refreshToken ikut dikirim
  })
);

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONG_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Koneksi database berhasil dan Port yang dibaca", process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error);
  })