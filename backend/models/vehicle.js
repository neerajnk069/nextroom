const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleBrand: {
      type: String,
    },
    vehicleModel: {
      type: String,
    },
    vehicleYear: {
      type: String,
    },
    vehicleNumber: {
      type: String,
    },
    vehicleColor: {
      type: String,
    },
    vehicleRegistrationDocument: {
      type: String,
    },
    drivingLicence: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
