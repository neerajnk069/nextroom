const mongoose = require("mongoose");

const driverCategorySchema = new mongoose.Schema(
  {
    image: { type: String },
    name: { type: String, required: true },
    status: { type: Number, enum: [1, 2], default: 2 }, // 1=>inactive, 2=>active
  },
  { timestamps: true }
);

module.exports = mongoose.model("DriverCategory", driverCategorySchema);
