const { body } = require("express-validator");

/**
 * Validation rules for creating a user.
 */
const createUserRules = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
];

module.exports = { createUserRules };