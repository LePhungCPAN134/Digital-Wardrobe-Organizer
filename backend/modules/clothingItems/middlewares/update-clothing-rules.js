const { body } = require("express-validator");

/**
 * Validation rules for updating a clothing.
 */
const updateClothingRules = [
  body("name")
    .optional()
    .isString().withMessage("Name must be a string")
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),

  body("category")
    .optional()
    .isString().withMessage("Category must be a string")
    .isLength({ min: 3 }).withMessage("Category must be at least 3 characters long"),

  body("color")
    .optional()
    .isString().withMessage("Color must be a string")
    .isLength({ min: 3 }).withMessage("Color must be at least 3 characters long"),

  body("imageUrl")
    .optional()
    .isString().withMessage("Image URL must be a string")
];

module.exports = { updateClothingRules };