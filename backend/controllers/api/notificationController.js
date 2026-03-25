const Notification = require("../../models/notification");

module.exports = {
  createNotification: async (userId = null, title, type, message) => {
    try {
      const notif = await Notification.create({
        userId,
        title,
        message,
        type,
        isRead: false,
      });
      return notif;
    } catch (err) {
      console.error("Notification creation error:", err);
    }
  },

  getNotification: async (req, res) => {
    try {
      const filter = req.user.role === "ADMIN" ? {} : { userId: req.user._id };
      const notifications = await Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(10);

      res.status(200).json({ success: true, body: notifications });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  markRead: async (req, res) => {
    try {
      const filter =
        req.user.role === "ADMIN"
          ? { isRead: false }
          : { userId: req.user._id, isRead: false };
      await Notification.updateMany(
        { userId: req.user._id, isRead: false },
        { $set: { isRead: true } }
      );
      res
        .status(200)
        .json({ success: true, message: "All notifications marked as read" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  clearNotification: async (req, res) => {
  try {
    const filter =
      req.user.role === "ADMIN"
        ? {} // admin → sab clear
        : { userId: req.user._id }; // user → apni

    await Notification.deleteMany(filter);

    res.status(200).json({
      success: true,
      message: "Notifications cleared successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
};
