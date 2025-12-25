const snap = require("midtrans-client");
const Booking = require("../models/bookingModel");
const crypto = require("crypto");
const Notification = require("../models/notificationModel");  

// Inisialisasi Snap
let snapApi = new snap.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

const createMidtransTransaction = async (req, res) => {
  try {
    const { bookingId, scheduleName } = req.body;

    // Ambil data booking
    const booking = await Booking.findById(bookingId).populate("ship_id", "name image_ship").lean();

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const parameter = {
      transaction_details: {
        order_id: booking._id.toString(),
        gross_amount: booking.total_price,
      },
      customer_details: {
        first_name: booking.personal_info?.full_name || "Customer",
        email: booking.personal_info?.email,
        phone: booking.personal_info?.phone,
        billing_address: {
          first_name: "Tripnesia",
          address: "Jl. Wonocatur, Gg. Merpati No. 65, Banguntapan, Bantul, DI Yogyakarta, Indonesia 55198",
          email: "tripnesia.info@gmail.com",
          phone: "+6285230081586",
        },
        shipping_address: {
          first_name: "Tripnesia",
          address: "Jl. Wonocatur, Gg. Merpati No. 65, Banguntapan, Bantul, DI Yogyakarta, Indonesia 55198",
          email: "tripnesia.info@gmail.com",
          phone: "+6285230081586",
        },
      },

      item_details: [
        {
          id: booking.ship_id?._id,
          price: booking.total_price,
          quantity: 1,
          name: `${scheduleName} ${booking.ship_id?.type} With ${booking.ship_id?.name}`,
        },
      ],
    };

    // Buat Snap Token
    const token = await snapApi.createTransactionToken(parameter);

    res.status(200).json({
      token,
    });
  } catch (error) {
    console.error("Error creating Midtrans transaction:", error);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};

const verifySignature = (req) => {
  const { order_id, status_code, gross_amount } = req.body;
  const value = `${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`;
  const signature = crypto.createHash("sha512").update(value, "utf-8").digest("hex");
  return signature === req.body.signature_key;
};

const createNotification = async (bookingId, userId, type, title, message, metadata = {}) => {
  try {
    const notification = new Notification({
      booking_id: bookingId,
      user_id: userId,
      type,
      title,
      message,
      metadata,
    });
    await notification.save();
    console.log("✅ Notification created:", title);
  } catch (error) {
    console.error("❌ Failed to create notification:", error);
  }
};

const handleMidtransNotification = async (req, res) => {
  try {
    if (!verifySignature(req)) {
      return res.status(403).json({ message: "Invalid signature" });
    }

    const { order_id, transaction_status, fraud_status, gross_amount} = req.body;

    // Cari booking untuk dapatkan user_id
    const booking = await Booking.findById(order_id).populate("user_id");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const userId = booking.user_id;

    let newStatus = "pending";
    let notificationType = "payment_pending";
    let notificationTitle = "Payment Pending";
    let notificationMessage = "Your payment is being processed.";

    if (transaction_status === "capture") {
      if (fraud_status === "accept") {
        newStatus = "confirmed";
        notificationType = "payment_success";
        notificationTitle = "Payment Successful!";
        notificationMessage = "Your booking is confirmed. Prepare for your trip!";
      } else if (fraud_status === "challenge") {
        newStatus = "pending";
        notificationType = "payment_pending";
        notificationTitle = "Payment Verification Needed";
        notificationMessage = "Your payment requires manual verification.";
      }
    } else if (transaction_status === "settlement") {
      newStatus = "confirmed";
      notificationType = "payment_success";
      notificationTitle = "Payment Successful!";
      notificationMessage = "Your booking is confirmed. Prepare for your trip!";
    } else if (["deny", "expire", "cancel"].includes(transaction_status)) {
      newStatus = "cancelled";
      if (transaction_status === "expire" || transaction_status === "deny") {
        notificationType = "payment_failed";
        notificationTitle = "Payment Expired";
        notificationMessage = "Your payment was expired.";
      }
    }

    await Booking.findByIdAndUpdate(order_id, { status: newStatus });

    await createNotification(order_id, userId, notificationType, notificationTitle, notificationMessage, {
      order_id,
      transaction_status,
      fraud_status,
      gross_amount,
    });

    // Midtrans butuh respons HTTP 200
    res.status(200).json({ message: "Notification received" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createMidtransTransaction, handleMidtransNotification };
