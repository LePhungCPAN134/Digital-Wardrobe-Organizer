const { body } = require("express-validator");

/**
 * Validation rules for updating a user.
 */
const updateUserRules = [
  body("name").optional().isString().withMessage("Name must be a string").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
  body("email").optional().isEmail().withMessage("Valid email is required")
];

module.exports = { updateUserRules };