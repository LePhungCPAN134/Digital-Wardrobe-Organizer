const { body } = require("express-validator");

/**
 * Validation rules for creating an outfit.
 */
const createOutfitRules = [
  body("items").isArray({ min: 1 }).withMessage("Items must be an array with at least one clothing item"),
  body("occasion").isString().withMessage("Occasion must be a string")
];

module.exports = { createOutfitRules };