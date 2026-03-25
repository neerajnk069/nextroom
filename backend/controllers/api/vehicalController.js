const Vehicle = require("../../models/vehicle");
const { Validator } = require("node-input-validator");

module.exports = {
  getAllVehicles: async (req, res) => {
    try {
      const vehicles = await Vehicle.find()
        .populate("userId", "name email mobile role")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Vehicle list fetched successfully",
        body: vehicles,
      });
    } catch (error) {
      console.error("Get All Vehicles Error:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  },

  addVehicle: async (req, res) => {
    try {
      const {
        vehicleBrand,
        vehicleModel,
        vehicleYear,
        vehicleNumber,
        vehicleColor,
        driverId,
      } = req.body;
      let userId;
      if (req.user.role === 2) {
        userId = req.user.id;
      } else if (req.user.role === 0) {
        if (!driverId) {
          return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "driverId is required for admin",
          });
        }
        userId = driverId;
      }

      let vehicleRegistrationDocument = "";
      let drivingLicence = "";

      if (req.files) {
        if (req.files.vehicleRegistrationDocument) {
          const file = req.files.vehicleRegistrationDocument;
          const fileName = `${Date.now()}-${file.name}`;
          const uploadPath = `public/uploads/${fileName}`;
          await file.mv(uploadPath);
          vehicleRegistrationDocument = fileName;
        }

        if (req.files.drivingLicence) {
          const file = req.files.drivingLicence;
          const fileName = `${Date.now()}-${file.name}`;
          const uploadPath = `public/uploads/${fileName}`;
          await file.mv(uploadPath);
          drivingLicence = fileName;
        }
      }

      const vehicle = await Vehicle.create({
        userId,
        vehicleBrand,
        vehicleModel,
        vehicleYear,
        vehicleNumber,
        vehicleColor,
        vehicleRegistrationDocument,
        drivingLicence,
      });

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: "Vehicle added successfully",
        body: vehicle,
      });
    } catch (error) {
      console.error("Add Vehicle Error:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  },

  updateVehicle: async (req, res) => {
    try {
      const updateData = {
        ...req.body,
      };

      if (req.files?.vehicleRegistrationDocument) {
        updateData.vehicleRegistrationDocument =
          req.files.vehicleRegistrationDocument[0].path;
      }

      if (req.files?.drivingLicence) {
        updateData.drivingLicence = req.files.drivingLicence[0].path;
      }

      const vehicle = await Vehicle.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          statusCode: 400,
          message: "Vehicle not found",
        });
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Vehicle updated successfully",
        body: vehicle,
      });
    } catch (error) {
      console.error("Update Vehicle Error:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  },

  deleteVehicle: async (req, res) => {
    try {
      const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          statusCode: 400,
          message: "Vehicle not found",
        });
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Vehicle deleted successfully",
      });
    } catch (error) {
      console.error("Delete Vehicle Error:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  },

  viewVehicle: async (req, res) => {
    try {
      const vehicle = await Vehicle.findById(req.params.id).populate(
        "userId",
        "name email mobile"
      );
      console.log(vehicle, "::::::::::::::::::::::::::::::::::");

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Vehicle not found",
        });
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Vehicle details fetched successfully",
        body: vehicle,
      });
    } catch (error) {
      console.error("View Vehicle Error:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  },
  viewVehicleByDriver: async (req, res) => {
    try {
      const { driverId } = req.params;

      const vehicle = await Vehicle.findOne({ userId: driverId });

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found for this driver",
        });
      }

      return res.status(200).json({
        success: true,
        body: vehicle,
      });
    } catch (error) {
      console.error("View Vehicle Error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
};
