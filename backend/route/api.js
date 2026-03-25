const express = require("express");
const router = express.Router();
const authController = require("../controllers/api/authController");
const driverController = require("../controllers/api/driverController");
const employeeController = require("../controllers/api/employeeController");
const vehicleController = require("../controllers/api/vehicalController");
const cmsController = require("../controllers/api/cmsController");
const authMiddleware = require("../middleware/auth");
const faqController = require("../controllers/api/faqController");
const bookingController = require("../controllers/api/bookingController");
const dashboardController = require("../controllers/api/dashboardController");
const notificationController = require("../controllers/api/notificationController");
const driverCategoryController = require("../controllers/api/driverCategoryController");
const driverSubCategoryController = require("../controllers/api/driverSubCategoryController");
//signup,register,changePassword  routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

//adminDashboard
router.get(
  "/adminDashBoard",
  authMiddleware.VerifyToken,
  dashboardController.adminDashBoard
);
router.post(
  "/changePassword",
  authMiddleware.VerifyToken,
  authController.changePassword
);

router.get(
  "/adminProfile",
  authMiddleware.VerifyToken,
  authController.adminProfile
);
router.post(
  "/editAdminProfile",
  authMiddleware.VerifyToken,
  authController.editAdminProfile
);

router.post("/logout", authMiddleware.VerifyToken, authController.logout);

// user routes
router.post("/addUser", authMiddleware.VerifyToken, authController.addUser);
router.post(
  "/updateUser",
  authMiddleware.VerifyToken,
  authController.updateUser
);
router.post(
  "/deleteUser",
  authMiddleware.VerifyToken,
  authController.deleteUser
);
router.get(
  "/viewUser/:id",
  authMiddleware.VerifyToken,
  authController.viewUser
);
router.get("/userList", authMiddleware.VerifyToken, authController.userList);
router.post("/toggleStatusUser", authController.toggleStatusUser);

// driver routes
router.post(
  "/addDriver",
  authMiddleware.VerifyToken,
  driverController.addDriver
);
router.post(
  "/updateDriver",
  authMiddleware.VerifyToken,
  driverController.updateDriver
);
router.post(
  "/deleteDriver",
  authMiddleware.VerifyToken,
  driverController.deleteDriver
);
router.get(
  "/viewDriver/:id",
  authMiddleware.VerifyToken,
  driverController.viewDriver
);
router.get(
  "/driverList",
  authMiddleware.VerifyToken,
  driverController.driverList
);
router.post("/toggleStatusDriver", driverController.toggleStatusDriver);

//vehicle routes
router.post(
  "/addVehicle",
  authMiddleware.VerifyToken,
  vehicleController.addVehicle
);
router.get(
  "/viewVehicle/:id",
  authMiddleware.VerifyToken,
  vehicleController.viewVehicle
);
router.get(
  "/viewVehicleByDriver/:driverId",
  authMiddleware.VerifyToken,
  vehicleController.viewVehicleByDriver
);

// employee routes
router.post(
  "/addEmployee",
  authMiddleware.VerifyToken,
  employeeController.addEmployee
);
router.post(
  "/updateEmployee",
  authMiddleware.VerifyToken,
  employeeController.updateEmployee
);
router.post(
  "/deleteEmployee",
  authMiddleware.VerifyToken,
  employeeController.deleteEmployee
);
router.get(
  "/viewEmployee/:id",
  authMiddleware.VerifyToken,
  employeeController.viewEmployee
);
router.get(
  "/employeeList",
  authMiddleware.VerifyToken,
  employeeController.employeeList
);
router.post("/toggleStatusEmployee", employeeController.toggleStatusEmployee);

//cms routes

router.post(
  "/getByType",
  authMiddleware.VerifyToken,
  cmsController.getCmsByType
);
router.post("/about-us", authMiddleware.VerifyToken, cmsController.AboutUs);
router.post(
  "/privacy-policy",
  authMiddleware.VerifyToken,
  cmsController.PrivacyPolicy
);
router.post(
  "/terms-condition",
  authMiddleware.VerifyToken,
  cmsController.TermsCondition
);
router.post("/contactUs", cmsController.ContactUs);

// admin faq routes
router.post("/addFaq", authMiddleware.VerifyToken, faqController.addFaq);
router.get("/viewFaq/:id", authMiddleware.VerifyToken, faqController.viewFaq);
router.put(
  "/updateFaq/:id",
  authMiddleware.VerifyToken,
  faqController.updateFaq
);
router.post("/deleteFaq", authMiddleware.VerifyToken, faqController.deleteFaq);

// user  faq
router.get("/faqs", faqController.getFaqs);

//booking routes
router.post(
  "/addBooking",
  authMiddleware.VerifyToken,
  bookingController.addBooking
);

router.get(
  "/bookingList",
  authMiddleware.VerifyToken,
  bookingController.bookingList
);

router.get(
  "/viewBooking/:id",
  authMiddleware.VerifyToken,
  bookingController.viewBooking
);
router.post(
  "/updateBookingStatus",
  authMiddleware.VerifyToken,
  bookingController.updateBookingStatus
);
router.post(
  "/deleteBooking",
  authMiddleware.VerifyToken,
  bookingController.deleteBooking
);
//notification
router.post(
  "/createNotification",
  authMiddleware.VerifyToken,
  notificationController.createNotification
);
router.get(
  "/getNotification",
  authMiddleware.VerifyToken,
  notificationController.getNotification
);
router.post(
  "/markRead",
  authMiddleware.VerifyToken,
  notificationController.markRead
);
router.post(
  "/clearNotification",
  authMiddleware.VerifyToken,
  notificationController.clearNotification
);

//driverCategory routes
router.post("/addDriverCategory", driverCategoryController.addDriverCategory);
router.post(
  "/updateDriverCategory",
  driverCategoryController.updateDriverCategory
);
router.post(
  "/deleteDriverCategory",
  driverCategoryController.deleteDriverCategory
);
router.get(
  "/getAllDriverCategory",
  driverCategoryController.getAllDriverCategory
);
router.post("/viewDriverCategory", driverCategoryController.viewDriverCategory);
router.post("/toggleStatus", driverCategoryController.toggleStatus);

//driverSubCategory
router.post(
  "/addDriverSubCategory",
  driverSubCategoryController.addDriverSubCategory
);
router.post(
  "/updateDriverSubCategory",
  driverSubCategoryController.updateDriverSubCategory
);
router.post(
  "/deleteDriverSubCategory",
  driverSubCategoryController.deleteDriverSubCategory
);
router.get(
  "/getAllDriverSubCategory",
  driverSubCategoryController.getAllDriverSubCategory
);
router.post(
  "/viewDriverSubCategory",
  driverSubCategoryController.viewDriverSubCategory
);
router.post(
  "/toggleStatusSubCategory",
  driverSubCategoryController.toggleStatusSubCategory
);
module.exports = router;
