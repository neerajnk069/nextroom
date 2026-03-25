require("dotenv").config();
const User = require("../../models/users");
const { Validator } = require("node-input-validator");
const bcrypt = require("bcrypt");

module.exports = {
  employeeList: async (req, res) => {
    try {
      const employee = await User.find({
        role: 3,
      })
        .sort({ createdAt: -1 })
        .select("-password -otp -otpVerified");
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Employees list fetched successfully",
        body: employee,
      });
    } catch (error) {
      console.error("employeeList API Error:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  },
  deleteEmployee: async (req, res) => {
    try {
      const { _id } = req.body;
      console.log("DELETE BODY ", req.body);
      const deletedEmployee = await User.findByIdAndDelete(_id);
      if (!deletedEmployee) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Employee not found",
        });
      }
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Employee deleted successfully",
      });
    } catch (error) {
      console.error("deleteEmployee API Error:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  viewEmployee: async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await User.findById(id);
      if (!employee) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Employee not found",
        });
      }
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Employee details fetched successfully",
        body: employee,
      });
    } catch (error) {
      console.error("viewEmployee API Error:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  toggleStatusEmployee: async (req, res) => {
    try {
      console.log(req.body, ">>>>>>>>i ma here in Employee");

      const employee = await User.findById({ _id: req.body.id });
      console.log(employee, ">>>>>>>>cat");
      if (!employee) return res.json({ success: false });

      await User.findByIdAndUpdate(req.body.id, {
        status: req.body.status,
      });

      res.json({ success: true, status: 1 });
    } catch (err) {
      console.error(err);
      res.json({ success: false });
    }
  },
  addEmployee: async (req, res) => {
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

      const existingEmployee = await User.findOne({
        $or: [{ email }, { phoneNumber }],
      });
      if (existingEmployee) {
        return res.status(409).json({
          success: false,
          message:
            existingEmployee.email === email
              ? "Email already registered"
              : "Phone number already registered",
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const newEmployee = new User({
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
        role: 3,
      });

      await newEmployee.save();
      return res.status(201).json({
        success: true,
        message: "Employee added successfully",
        body: newEmployee,
      });
    } catch (error) {
      console.error("addEmployee API Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  updateEmployee: async (req, res) => {
    try {
      const { id, password, ...rest } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Employee id is required",
        });
      }

      const updateData = { ...rest };

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updatedEmployee = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).select("-password");

      if (!updatedEmployee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        body: updatedEmployee,
      });
    } catch (error) {
      console.error("updateEmployee API Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
};
