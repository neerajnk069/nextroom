const DriverCategory = require("../../models/driverCategory");
const DriverSubCategory = require("../../models/driverSubCategory");
const { Validator } = require("node-input-validator");

module.exports = {
  getAllDriverSubCategory: async (req, res) => {
    try {
      const driverSubCategory = await DriverSubCategory.find()
        .populate("driverCategoryId", "name")
        .sort({ _id: -1 });

      return res.json({
        success: true,
        message: "driverSubCategories fetched successfully",
        body: driverSubCategory,
      });
    } catch (error) {
      console.log("getAllDriverSubCategory Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  addDriverSubCategory: async (req, res) => {
    try {
      const { driverCategoryId, name, description, status } = req.body;

      if (!driverCategoryId || !name || !description) {
        return res.status(400).json({
          success: false,
          message: "DriverCategory ID and  name is required",
        });
      }
      let imagePath = "";
      if (req.files && req.files.image) {
        let imageFile = req.files.image;
        const fileName = `${Date.now()}-${imageFile.name}`;
        let uploadPath = "public/uploads/" + Date.now() + "-" + imageFile.name;
        await imageFile.mv(uploadPath);
        imagePath = fileName;
      }
      const newDriverSubCategory = new DriverSubCategory({
        driverCategoryId,
        name,
        image: imagePath,
        description,
        status: status ?? 1,
      });

      await newDriverSubCategory.save();

      return res.json({
        success: true,
        message: "Driver SubCategory added successfully",
        body: newDriverSubCategory,
      });
    } catch (error) {
      console.log("add DriverSubCategory Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  updateDriverSubCategory: async (req, res) => {
    try {
      const { id, name, description, status, driverCategoryId } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "SubDriverCategory ID is required",
        });
      }
      const existing = await DriverSubCategory.findById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "DriverSubCategory not found",
        });
      }

      let imagePath = existing.image;
      if (req.files && req.files.image) {
        const imageFile = req.files.image;
        const fileName = `${Date.now()}-${imageFile.name}`;
        const uploadPath = `public/uploads/${fileName}`;
        await imageFile.mv(uploadPath);
        imagePath = fileName;
      }

      const updated = await DriverSubCategory.findByIdAndUpdate(
        id,
        {
          driverCategoryId: driverCategoryId ?? existing.driverCategoryId,
          name: name ?? existing.name,
          description: description ?? existing.description,
          status: status ?? existing.status,
          image: imagePath,
        },
        { new: true }
      );

      if (!updated) {
        return res.json({
          success: false,
          message: "SubDriverCategory not found",
        });
      }

      return res.json({
        success: true,
        message: "SubDriverCategory updated successfully",
        body: updated,
      });
    } catch (error) {
      console.log("updateSubCategory Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  deleteDriverSubCategory: async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "DriverSubCategory ID is required",
        });
      }

      const deleted = await DriverSubCategory.findByIdAndDelete(id);

      if (!deleted) {
        return res.json({
          success: false,
          message: "Driver DriverSubCategory not found",
        });
      }

      return res.json({
        success: true,
        message: "Driver SubCategory deleted successfully",
      });
    } catch (error) {
      console.log("deleteDriverSubCategory Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  viewDriverSubCategory: async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "DriverSubCategory ID is required",
        });
      }

      const subCat = await DriverSubCategory.findById(id).populate(
        "driverCategoryId",
        "name"
      );

      if (!subCat) {
        return res.json({
          success: false,
          message: "DriverSubCategory not found",
        });
      }

      return res.json({
        success: true,
        message: "DriverSubCategory fetched successfully",
        body: subCat,
      });
    } catch (error) {
      console.log("viewDriverSubCategory Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  toggleStatusSubCategory: async (req, res) => {
    try {
      const driverSubCategory = await DriverSubCategory.findById({
        _id: req.body.id,
      });
      if (!driverSubCategory) return res.json({ success: false });

      await DriverSubCategory.findByIdAndUpdate(req.body.id, {
        status: req.body.status,
      });

      res.json({ success: true, status: 1 });
    } catch (err) {
      console.error(err);
      res.json({ success: false });
    }
  },
};
