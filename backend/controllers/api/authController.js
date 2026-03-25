require("dotenv").config();
const User = require("../../models/users");
const { Validator } = require("node-input-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretkey = process.env.SECRET_KEY;
const Notification = require("../../models/notification");
module.exports = {
  signup: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        firstName: "required",
        lastName: "required",
        email: "required|email",
        phoneNumber: "required|numeric|minLength:10",
        password: "required|minLength:8",
        confirmPassword: "required|minLength:8",
        countryCode: "required",
        country: "required",
        city: "required",
        state: "required",
        gender: "required",
        role: "required",
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
        confirmPassword,
        countryCode,
        country,
        city,
        state,
        gender,
        role,
      } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Confirm password not matched",
        });
      }

      const existingUser = await User.findOne({
        $or: [{ email }, { phoneNumber }],
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            existingUser.email === email
              ? "Email already registered"
              : "Phone number already registered",
        });
      }

      let imagePath = "";
      if (req.files && req.files.image) {
        const imageFile = req.files.image;
        const fileName = `${Date.now()}-${imageFile.name}`;
        const uploadPath = `public/uploads/${Date.now()}-${imageFile.name}`;
        await imageFile.mv(uploadPath);
        imagePath = fileName;
      }

      const otp = Math.floor(1000 + Math.random() * 9000);

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashPassword,
        countryCode,
        country,
        city,
        state,
        gender,
        role,
        image: imagePath,
        otp: otp,
        otpVerified: 0,
      });

      await newUser.save();
      await Notification.create({
        title: "New User Signup",
        message: `${newUser.firstName} ${newUser.lastName} has registered`,
        type: "USER",
        action: "SIGNUP",
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully. OTP sent to your phone.",
        user: {
          _id: newUser._id,
          phoneNumber: newUser.phoneNumber,
          email: newUser.email,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        phoneNumber: "required|numeric|minLength:10",
        password: "required",
      });

      const match = await validator.check();
      if (!match) {
        return res.status(422).json({
          success: false,
          statusCode: 422,
          errors: validator.errors,
        });
      }

      const { phoneNumber, password } = req.body;

      const existingUser = await User.findOne({ phoneNumber });
      if (!existingUser) {
        return res.status(401).json({
          success: false,
          message: "User not registered",
        });
      }

      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }

      const otp = Math.floor(1000 + Math.random() * 9000);

      await User.updateOne(
        { _id: existingUser._id },
        {
          otpVerified: 0,
          otp: otp,
          loginTime: new Date(),
        }
      );

      const token = jwt.sign(
        {
          _id: existingUser._id,
          phoneNumber: existingUser.phoneNumber,
          role: existingUser.role,
        },
        secretkey,
        { expiresIn: "7d" }
      );

      const userData = existingUser.toObject();
      userData.token = token;

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Login successful",
        body: userData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },
  adminProfile: async (req, res) => {
    try {
      const admin = await User.findById(req.user._id).select(
        "-password -otp -otpVerified"
      );

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      res.status(200).json({
        success: true,
        body: admin,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  editAdminProfile: async (req, res) => {
    try {
      const adminId = req.user._id;

      const { firstName, lastName, phoneNumber, country, state, city, bio } =
        req.body;

      if (req.user.role !== "admin" && req.user.role !== 0) {
        return res.status(403).json({
          success: false,
          message: "Only admin can edit profile",
        });
      }

      let imagePath;

      if (req.files && req.files.image) {
        const imageFile = req.files.image;
        const fileName = `${Date.now()}-${imageFile.name}`;
        const uploadPath = `public/uploads/${fileName}`;

        await imageFile.mv(uploadPath);
        imagePath = fileName;
      }

      const updateData = {
        firstName,
        lastName,
        phoneNumber,
        country,
        state,
        city,
        bio,
      };

      if (imagePath) {
        updateData.image = imagePath;
      }

      const updatedAdmin = await User.findByIdAndUpdate(adminId, updateData, {
        new: true,
      }).select("-password -otp -otpVerified");

      return res.status(200).json({
        success: true,
        message: "Admin profile updated successfully",
        body: updatedAdmin,
      });
    } catch (error) {
      console.log("Admin Edit Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  logout: async (req, res) => {
    try {
      const userId = req.user._id;

      await User.findByIdAndUpdate(req.user._id, {
        logoutAt: new Date(),
      });

      return res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  userList: async (req, res) => {
    try {
      const users = await User.find({
        role: { $nin: [0, 2, 3] },
      })
        .sort({ createdAt: -1 })
        .select("-password -otp -otpVerified");
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "User list fetched successfully",
        body: users,
      });
    } catch (error) {
      console.error("userList API Error:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { _id } = req.body;
      console.log("DELETE BODY 👉", req.body);
      const deletedUser = await User.findByIdAndDelete(_id);
      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "User not found",
        });
      }
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("deleteUser API Error:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  viewUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "User not found",
        });
      }
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "User details fetched successfully",
        body: user,
      });
    } catch (error) {
      console.error("viewUser API Error:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  toggleStatusUser: async (req, res) => {
    try {
      console.log(req.body, ">>>>>>>>i ma here in user");

      const user = await User.findById({ _id: req.body.id });
      console.log(user, ">>>>>>>>cat");
      if (!user) return res.json({ success: false });

      await User.findByIdAndUpdate(req.body.id, {
        status: req.body.status,
      });

      res.json({ success: true, status: 1 });
    } catch (err) {
      console.error(err);
      res.json({ success: false });
    }
  },
  addUser: async (req, res) => {
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

      const existingUser = await User.findOne({
        $or: [{ email }, { phoneNumber }],
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            existingUser.email === email
              ? "Email already registered"
              : "Phone number already registered",
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
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
        role: 1,
      });

      await newUser.save();
      return res.status(201).json({
        success: true,
        message: "User added successfully",
        user: newUser,
      });
    } catch (error) {
      console.error("addUser API Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { id, password, ...rest } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "User id is required",
        });
      }

      const updateData = { ...rest };

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      await Notification.create({
        title: "USER Updated",
        message: `${driver.name} User updated`,
        type: "USER",
        action: "EDIT",
      });
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("updateUser API Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  changePassword: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        currentPassword: "required|minLength:8",
        newPassword: "required|minLength:8",
        confirmPassword: "required|minLength:8",
      });

      const matched = await validator.check();
      if (!matched) {
        return res.status(422).json({
          success: false,
          statusCode: 422,
          errors: validator.errors,
        });
      }
      const userId = req.user._id;
      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        return res.status(422).json({
          success: false,
          message: "New password and confirm password do not match",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();
      await Notification.create({
        userId: user._id,
        title: "Password Updated",
        message: `${user.firstName} ${user.lastName} password updated`,
        type: "ADMIN",
        action: "EDIT",
      });

      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change Password Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
};
