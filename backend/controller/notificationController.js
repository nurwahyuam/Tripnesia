const Notification = require("../models/notificationModel");

const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification" });
  }
};

module.exports = { getUserNotifications, markNotificationAsRead };