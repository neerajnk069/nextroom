const faq = require("../../models/faq");
const Faq = require("../../models/faq");
const { Validator } = require("node-input-validator");

module.exports = {
  addFaq: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        question: "required",
        answer: "required",
      });

      const matched = await validator.check();
      if (!matched) {
        return res.status(422).json({
          success: false,
          statusCode: 422,
          errors: validator.errors,
        });
      }
      const { question, answer } = req.body;
      const faq = await Faq.create({ question, answer });

      res.status(201).json({
        success: true,
        statusCode: 201,
        message: "FAQ added successfully",
        body: faq,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Server Error",
      });
    }
  },

  viewFaq: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await Faq.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Faq not found",
        });
      }
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Faq details fetched successfully",
        body: user,
      });
    } catch (error) {
      console.error("viewFaq API Error:", error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  updateFaq: async (req, res) => {
    try {
      const { id } = req.params;
      const { question, answer } = req.body;

      const faq = await Faq.findByIdAndUpdate(
        id,
        { question, answer },
        { new: true }
      );

      if (!faq) {
        return res.status(404).json({
          success: false,
          message: "FAQ not found",
        });
      }

      res.json({
        success: true,
        message: "FAQ updated",
        body: faq,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },

  deleteFaq: async (req, res) => {
    try {
      const { _id } = req.body;

      const faq = await Faq.findByIdAndDelete(_id);

      if (!faq) {
        return res.status(404).json({
          success: false,
          message: "FAQ not found",
        });
      }

      res.json({
        success: true,
        message: "FAQ deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
  getFaqs: async (req, res) => {
    try {
      const faqs = await Faq.find();
      console.log(faq, "........................");
      res.status(200).json({
        success: true,
        message: "All Faq successful fetch",
        body: faqs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
};
