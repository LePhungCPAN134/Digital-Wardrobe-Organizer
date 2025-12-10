const { body } = require("express-validator");
const checkValidation = require("../../../shared/middlewares/check-validation");

// Simple validation for updating an account.
const updateAccountRules = [
  body("name").optional().isString().withMessage("Name must be a string").trim(),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail(),

  body("phone")
    .optional()
    .matches(/^\d{3}-\d{3}-\d{4}$/)
    .withMessage("Phone number must be in the format XXX-XXX-XXXX"),

  body("address")
    .optional()
    .isString()
    .withMessage("Address must be a string")
    .trim(),

  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),

  checkValidation,
];

module.exports = updateAccountRules;