const mongoose = require("mongoose");

const driverSubCategorySchema = new mongoose.Schema(
  {
    driverCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DriverCategory",
      required: true,
    },
    image: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    status: { type: Number, enum: [0, 1], default: 1 }, // 0=>inactive, 1=>active
  },
  { timestamps: true }
);

module.exports = mongoose.model("DriverSubCategory", driverSubCategorySchema);
