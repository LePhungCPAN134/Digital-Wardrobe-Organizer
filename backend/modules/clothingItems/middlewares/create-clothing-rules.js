const { body } = require("express-validator");
const checkValidation = require("../../../shared/middlewares/check-validation");

/**
 * Validation rules for creating a clothing.
 */
const createClothingRules = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("category")
    .isString()
    .withMessage("Category must be a string")
    .isLength({ min: 3 })
    .withMessage("Category must be at least 3 characters long"),

  body("color")
    .isString()
    .withMessage("Color must be a string")
    .isLength({ min: 3 })
    .withMessage("Color must be at least 3 characters long"),

  body("imageUrl")
    .optional()
    .isString()
    .withMessage("Image URL must be a string"),

  checkValidation
];

module.exports = createClothingRules;