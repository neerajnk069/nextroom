const DriverCategory = require("../../models/driverCategory");
const { Validator } = require("node-input-validator");

module.exports = {
  getAllDriverCategory: async (req, res) => {
    try {
      const allDriverCategories = await DriverCategory.find();
      if (allDriverCategories) {
        return res.status(200).json({
          success: true,
          mesage: "driver Categories fetch successfully ",
          body: allDriverCategories,
        });
      } else {
        return res
          .status(403)
          .json({ success: "driver categories not found " });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  addDriverCategory: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        name: "required|minLength:2",
      });

      const matched = await validator.check();
      if (!matched) {
        return res
          .status(422)
          .json({ success: false, statusCode: 422, errors: validator.errors });
      }

      let { name, status } = req.body;

      let imagePath = "";
      if (req.files && req.files.image) {
        let imageFile = req.files.image;
        const fileName = `${Date.now()}-${imageFile.name}`;
        let uploadPath = "public/uploads/" + Date.now() + "-" + imageFile.name;
        await imageFile.mv(uploadPath);
        imagePath = fileName;
      }

      let allreadyExists = await DriverCategory.findOne({ name });
      console.log(allreadyExists, "allreadyExists");

      if (allreadyExists) {
        return res.status(300).json({
          success: true,
          statusCode: 300,
          message: `driver category name ${name} is all ready Exists`,
        });
      }

      let result = await DriverCategory.create({
        name: name,
        status: true,
        image: imagePath,
        status: status ?? 1,
      });

      if (!result) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: `Something went wrong`,
        });
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: `driverCategory name ${name} is created successfull`,
      });
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  },

  updateDriverCategory: async (req, res) => {
    try {
      const { id, name, status } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Driver Category ID is required!",
        });
      }

      const driver = await DriverCategory.findById(id);
      if (!driver) {
        return res.status(404).json({
          success: false,
          message: "Driver Category not found!",
        });
      }

      let imagePath = driver.image;
      if (req.files && req.files.image) {
        const imageFile = req.files.image;
        const fileName = `${Date.now()}-${imageFile.name}`;
        const uploadPath =
          "public/uploads/" + Date.now() + "-" + imageFile.name;
        await imageFile.mv(uploadPath);
        imagePath = fileName;
      }

      const updatedDriverCategory = await DriverCategory.findByIdAndUpdate(
        id,
        {
          name: name || DriverCategory.name,
          status: status ?? DriverCategory.status,
          image:
            req.files && req.files.image ? imagePath : DriverCategory.image,
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Category updated successfully!",
        data: updatedDriverCategory,
      });
    } catch (error) {
      console.log(" Error in updateDriverCategory:", error);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  deleteDriverCategory: async (req, res) => {
    try {
      const driver = await DriverCategory.findById({ _id: req.body.id });
      if (!driver) {
        return res.status(404).json({
          success: false,
          message: "driver categories not found",
          errors: errors.message,
        });
      }
      const destoryDriverCategory = await DriverCategory.deleteOne({
        _id: req.body.id,
      });
      return res.status(200).json({
        success: true,
        message: "driver category delete successfull",
        body: destoryDriverCategory,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server Error ",
        error: error.message,
      });
    }
  },

  viewDriverCategory: async (req, res) => {
    try {
      const { id } = req.body;

      console.log("User ID received:", id);

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Category ID is required",
        });
      }

      const category = await DriverCategory.findById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "DriverCategory details fetched successfully",
        body: category,
      });
    } catch (error) {
      console.log("View User Error:", error);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
  toggleStatus: async (req, res) => {
    try {
      console.log(req.body, ">>>>>>>>i ma here in controller");

      const category = await DriverCategory.findById({ _id: req.body.id });
      console.log(category, ">>>>>>>>cat");
      if (!category) return res.json({ success: false });

      await DriverCategory.findByIdAndUpdate(req.body.id, {
        status: req.body.status,
      });

      res.json({ success: true, status: 1 });
    } catch (err) {
      console.error(err);
      res.json({ success: false });
    }
  },
};
