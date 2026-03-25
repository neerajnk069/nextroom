const User = require("../../models/users");
const Vehicle = require("../../models/vehicle");
const Booking = require("../../models/booking");

module.exports = {
  adminDashBoard: async (req, res) => {
    try {
      const totalUsers = await User.countDocuments({ role: 1 });
      const totalDrivers = await User.countDocuments({ role: 2 });
      const totalEmployees = await User.countDocuments({ role: 3 });
      const totalBookings = await Booking.countDocuments();
      const activeBookings = await Booking.countDocuments({ status: "active" });
      const completedBookings = await Booking.countDocuments({
        status: "completed",
      });
      const totalVehicles = await Vehicle.countDocuments();

      const recentBookings = await Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId", "firstName lastName")
        .populate("driverId", "firstName lastName");

      return res.status(200).json({
        success: true,
        body: {
          totalUsers,
          totalDrivers,
          totalEmployees,
          totalBookings,
          activeBookings,
          completedBookings,
          totalVehicles,
          recentBookings,
        },
      });
    } catch (error) {
      console.error("Dashboard API Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
};
