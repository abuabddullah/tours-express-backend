const { check } = require("express-validator");

const bookingValidationRules = [
  check("fullName")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Full Name must have a length between 4 to 20 characters")
    .isString()
    .withMessage("Full Name must be a string")
    .notEmpty()
    .withMessage("Full Name is required"),

  check("email")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email")
    .notEmpty()
    .withMessage("Email is required"),

  check("contactNumber")
    .trim()
    .isString()
    .withMessage("Contact Number must be a string")
    .isLength({ min: 10, max: 15 })
    .withMessage(
      "Contact Number must have a length between 10 to 15 characters"
    )
    .notEmpty()
    .withMessage("Contact Number is required"),

  check("nationality")
    .trim()
    .isString()
    .withMessage("Nationality must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Nationality must have a length between 2 to 50 characters")
    .notEmpty()
    .withMessage("Nationality is required"),

  check("passportNumber")
    .trim()
    .optional()
    .isString()
    .withMessage("Passport Number must be a string")
    .isLength({ max: 20 })
    .withMessage("Passport Number must not exceed 20 characters"),

  check("travelDetails.departureDate")
    .trim()
    .isISO8601()
    .withMessage("Departure Date must be a valid date")
    .notEmpty()
    .withMessage("Departure Date is required"),

  check("travelDetails.returnDate")
    .trim()
    .isISO8601()
    .withMessage("Return Date must be a valid date")
    .notEmpty()
    .withMessage("Return Date is required"),

  check("travelDetails.numberOfAdults")
    .trim()
    .isInt({ gt: 0 })
    .withMessage("Number of Adults must be a positive integer")
    .notEmpty()
    .withMessage("Number of Adults is required"),

  check("travelDetails.numberOfChildren")
    .trim()
    .optional()
    .isInt({ gte: 0 })
    .withMessage("Number of Children must be a non-negative integer"),
];

module.exports = bookingValidationRules;
