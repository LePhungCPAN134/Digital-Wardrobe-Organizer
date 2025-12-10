const { body } = require("express-validator");
const mongoose = require("mongoose");
const checkValidation = require("../../../shared/middlewares/check-validation");

/**
 * Validation rules for updating an outfit.
 */
const updateOutfitRules = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("items")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Items must be an array with at least one clothing item")
    .bail()
    .custom((items) => items.every(id => mongoose.Types.ObjectId.isValid(id)))
    .withMessage("Each item must be a valid clothing item ID"),

  body("occasion")
    .optional()
    .isString()
    .withMessage("Occasion must be a string")
    .isLength({ min: 3 })
    .withMessage("Occasion must be at least 3 characters long"),

  checkValidation,
];

module.exports = updateOutfitRules;