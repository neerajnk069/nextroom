const Booking = require("../../models/booking");
const User = require("../../models/users");
const Notification = require("../../models/notification");
module.exports = {
  addBooking: async (req, res) => {
    try {
      const {
        userId,
        driverId,
        vehicleId,
        pickupLocation,
        dropLocation,
        bookingDate,
        amount,
      } = req.body;

      const booking = await Booking.create({
        userId,
        driverId,
        vehicleId,
        pickupLocation,
        dropLocation,
        bookingDate,
        amount,
      });

      const user = await User.findById(userId).select("firstName lastName");

      const fullName = user ? `${user.firstName} ${user.lastName}` : "User";

      await Notification.create({
        userId: req.user._id,
        title: "Booking",
        message: `${fullName} Add Booking`,
        type: "USER",
        action: "ADD",
      });
      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: "Booking created successfully",
        body: booking,
      });
    } catch (error) {
      console.error("Add Booking Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  bookingList: async (req, res) => {
    try {
      const { id, role } = req.user;
      let filter = {};

      if (role === 1) {
        filter.userId = id;
      }
      if (role === 2) {
        filter.driverId = id;
      }

      const bookings = await Booking.find(filter)
        .populate("userId", "firstName lastName phoneNumber")
        .populate("driverId", "firstName lastName")
        .populate("vehicleId", "vehicleNumber vehicleBrand")
        .sort({ createdAt: -1 });

      res.json({ success: true, body: bookings });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },

  viewBooking: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate("userId", "firstName lastName phoneNumber")
        .populate("driverId", "firstName lastName phoneNumber")
        .populate("vehicleId", "vehicleBrand vehicleNumber");

      if (!booking) {
        return res
          .status(404)
          .json({ success: false, message: "Booking not found" });
      }

      res.json({ success: true, body: booking });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
  updateBookingStatus: async (req, res) => {
    try {
      const { bookingId, status } = req.body;

      await Booking.findByIdAndUpdate(bookingId, { status });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Booking status update successfully",
      });
    } catch (error) {
      console.error("booking status  Booking Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  deleteBooking: async (req, res) => {
    try {
      const { _id } = req.body;

      const booking = await Booking.findById(_id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      await Booking.findByIdAndDelete(_id);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Booking deleted successfully",
      });
    } catch (error) {
      console.error("Delete Booking Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
};
