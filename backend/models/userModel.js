const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama wajib diisi"],
    },
    email: {
      type: String,
      required: [true, "Email wajib diisi"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Email tidak valid"],
    },
    password: {
      type: String,
      required: [true, "Password wajib diisi"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer", // perbaikan typo
    },
    number_telephone: {
      type: String,
      required: [true, "Nomor telepon wajib diisi"],
    },
    support: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// static signup method
userSchema.statics.signup = async function (
  name,
  email,
  password,
  role = "customer",
  number_telephone,
  support = false
) {
  if (!email || !password || !name || !number_telephone) {
    throw Error("Semua kolom harus diisi");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email tidak valid");
  }

  // if (!validator.isStrongPassword(password)) {
  //   throw Error("Password tidak cukup kuat");
  // }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email sudah digunakan");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    name,
    email,
    password: hash,
    role,
    number_telephone,
    support,
  });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("Semua kolom harus diisi");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Email salah atau tidak ditemukan");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Kata sandi salah");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);