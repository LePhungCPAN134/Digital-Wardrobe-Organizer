const { body } = require("express-validator");

/**
 * Validation rules for creating a clothing item.
 */
const createClothingItemRules = [
  body("name").isString().withMessage("Name must be a string").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
  body("category").isString().withMessage("Category must be a string"),
  body("color").isString().withMessage("Color must be a string")
];

module.exports = { createClothingItemRules };