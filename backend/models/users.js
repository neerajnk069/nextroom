const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 1, // 0=>admin,1=>user,2=>driver,3=>employee
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    countryCode: {
      type: Number,
    },

    phoneNumber: {
      type: Number,
    },

    password: {
      type: String,
    },

    image: {
      type: String,
    },

    otp: {
      type: Number,
    },

    otpVerified: {
      type: Number,
      enum: [0, 1],
      default: 0, // 0 not verified, 1 verified
    },

    status: {
      type: Number,
      enum: [0, 1],
      default: 1, // 0 inactive, 1 active
    },

    loginTime: {
      type: Date,
    },
    logoutAt: {
      type: Date,
    },

    bio: {
      type: String,
    },

    location: {
      latitude: { type: String },
      longitude: { type: String },
    },

    online: {
      type: Boolean,
      default: false,
    },

    country: { type: String },
    state: { type: String },
    city: { type: String },

    gender: {
      type: Number,
      enum: [0, 1, 2], // 0 male, 1 female, 2 other
      default: 0,
    },

    block: {
      type: Number,
      enum: [0, 1], //  0 unblock , 1 for block
      default: 0,
    },

    suspend: {
      type: Number,
      enum: [0, 1], // 0 for unsuspend ,1 for suspend
      default: 0,
    },

    approve: {
      type: Number,
      enum: [0, 1, 2], // pending, approve, reject
      default: 0,
    },

    documentVerify: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },

    adminCommission: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    deviceToken: {
      type: String,
    },

    deviceType: {
      type: String,
      enum: ["android", "ios", "web"],
    },

    isNotificationOn: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },

    vehicle: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },

    firstName: { type: String },
    lastName: { type: String },

    isProfileComplete: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },

    rideOtp: { type: Number },
    socketId: { type: String },

    accountId: { type: String },

    hasAccount: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
