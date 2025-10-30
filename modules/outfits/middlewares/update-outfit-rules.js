const { body } = require("express-validator");

/**
 * Validation rules for updating an outfit.
 */
const updateOutfitRules = [
  body("items").optional().isArray({ min: 1 }).withMessage("Items must be an array with at least one clothing item"),
  body("occasion").optional().isString().withMessage("Occasion must be a string")
];

module.exports = { updateOutfitRules };