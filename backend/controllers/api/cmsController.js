const Cms = require("../../models/cms");
const { Validator } = require("node-input-validator");
module.exports = {
  getCmsByType: async (req, res) => {
    try {
      const { type } = req.body; //type: 1=AboutUs,2=Privacy,3=Terms

      const cms = await Cms.findOne({ type });

      if (!cms) {
        return res.status(404).json({
          success: false,
          message: "CMS not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "CMS data fetched",
        body: cms,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  AboutUs: async (req, res) => {
    try {
      const { title, description } = req.body;
      const type = 1;

      const existing = await Cms.findOne({ type });

      if (existing) {
        existing.title = title || existing.title;
        existing.description = description;
        await existing.save();

        return res.status(200).json({
          success: true,
          message: "About Us updated",
          body: existing,
        });
      }

      const newAboutUs = await Cms.create({
        title,
        description,
        type,
      });

      res.status(201).json({
        success: true,
        message: "About Us created",
        body: newAboutUs,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  PrivacyPolicy: async (req, res) => {
    try {
      const { title, description } = req.body;
      const type = 2; // Privacy Policy

      const existing = await Cms.findOne({ type });

      if (existing) {
        existing.title = title || existing.title;
        existing.description = description;
        await existing.save();

        return res.status(200).json({
          success: true,
          message: "Privacy Policy updated",
          body: existing,
        });
      }

      const newPrivacy = await Cms.create({ title, description, type });
      res.status(201).json({
        success: true,
        message: "Privacy Policy created",
        body: newPrivacy,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  TermsCondition: async (req, res) => {
    try {
      const { title, description } = req.body;
      const type = 3; // Terms & Conditions

      const existing = await Cms.findOne({ type });

      if (existing) {
        existing.title = title || existing.title;
        existing.description = description;
        await existing.save();

        return res.status(200).json({
          success: true,
          message: "Terms & Conditions updated",
          body: existing,
        });
      }

      const newTerms = await Cms.create({ title, description, type });
      res.status(201).json({
        success: true,
        message: "Terms & Conditions created",
        body: newTerms,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  ContactUs: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        name: "required|minLength:2",
        email: "required|email",
        phone: "required|numeric|minLength:10",
        description: "required",
      });

      const matched = await validator.check();
      if (!matched) {
        return res
          .status(422)
          .json({ success: false, statusCode: 422, errors: validator.errors });
      }
      const { name, email, phone, description } = req.body;
      let result = await Cms.create({
        name: name,
        email: email,
        phone: phone,
        description: description,
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
        message: `ContactUs created successfull`,
        body: result,
      });
    } catch (error) {
      console.log(error, "errror");
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Errror",
      });
    }
  },
};
