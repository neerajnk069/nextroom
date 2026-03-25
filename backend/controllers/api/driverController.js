require("dotenv").config();
const User = require("../../models/users");
const { Validator } = require("node-input-validator");
const bcrypt = require("bcrypt");

module.exports = {
  driverList: async (req, res) => {
    try {
      const drivers = await User.find({
        role: 2,
      })
        .sort({ createdAt: -1 })
        .select("-password -otp -otpVerified");
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Driver list fetched successfully",
        body: drivers,
      });
    } catch (error) {
      console.error("driverList API Error:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  },
  deleteDriver: async (req, res) => {
    try {
      const { _id } = req.body;
      console.log("DELETE BODY ", req.body);
      const deletedDriver = await User.findByIdAndDelete(_id);
      if (!deletedDriver) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Driver not found",
        });
      }
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Driver deleted successfully",
      });
    } catch (error) {
      console.error("deleteDriver API Error:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  viewDriver: async (req, res) => {
    try {
      const { _id } = req.params;
      const driver = await User.findOne({
        _id: req.params.id,
        role: 2,
      });
      if (!driver) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Driver not found",
        });
      }
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Driver details fetched successfully",
        body: driver,
      });
    } catch (error) {
      console.error("viewDriver API Error:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  toggleStatusDriver: async (req, res) => {
    try {
      console.log(req.body, ">>>>>>>>i ma here in driver");

      const driver = await User.findById({ _id: req.body.id });
      console.log(driver, ">>>>>>>>cat");
      if (!driver) return res.json({ success: false });

      await User.findByIdAndUpdate(req.body.id, {
        status: req.body.status,
      });

      res.json({ success: true, status: 1 });
    } catch (err) {
      console.error(err);
      res.json({ success: false });
    }
  },
  addDriver: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        firstName: "required",
        lastName: "required",
        email: "required|email",
        phoneNumber: "required|numeric|minLength:10",
        password: "required|minLength:8",
        countryCode: "required",
        country: "required",
        city: "required",
        state: "required",
        gender: "required",
      });

      const matched = await validator.check();
      if (!matched) {
        return res.status(422).json({
          success: false,
          statusCode: 422,
          errors: validator.errors,
        });
      }
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        countryCode,
        country,
        state,
        city,
        gender,
      } = req.body;

      const existingDriver = await User.findOne({
        $or: [{ email }, { phoneNumber }],
      });
      if (existingDriver) {
        return res.status(409).json({
          success: false,
          message:
            existingDriver.email === email
              ? "Email already registered"
              : "Phone number already registered",
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const newDriver = new User({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashPassword,
        countryCode,
        country,
        state,
        city,
        gender,
        role: 2,
      });

      await newDriver.save();
      return res.status(201).json({
        success: true,
        message: "Driver added successfully",
        body: newDriver,
      });
    } catch (error) {
      console.error("addDriver API Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  updateDriver: async (req, res) => {
    try {
      const { id, password, ...rest } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Driver id is required",
        });
      }

      const updateData = { ...rest };

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updatedDriver = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).select("-password");

      if (!updatedDriver) {
        return res.status(404).json({
          success: false,
          message: "Driver not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Driver updated successfully",
        body: updatedDriver,
      });
    } catch (error) {
      console.error("updateDriver API Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
};
