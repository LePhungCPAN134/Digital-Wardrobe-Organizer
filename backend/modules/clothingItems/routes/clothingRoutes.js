const express = require("express");
const router = express.Router();
const { getAllClothingItems, getClothingItemByID, addNewClothingItem, updateExistingClothingItem, deleteClothingItem } = require("../models/clothingModel");
const { createClothingItemRules } = require("../middlewares/create-clothing-rules");
const { updateClothingItemRules } = require("../middlewares/update-clothing-rules");
const { validationResult } = require("express-validator");
const authorize = require("../../../shared/middlewares/authorize");

/**
 * GET /clothingItems - Fetch all clothing items
 * Protected: customer or admin
 */
router.get("/clothingItems", authorize(["customer", "admin"]), async (req, res) => {
  try {
    const items = await getAllClothingItems();
    res.json(items || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

/**
 * GET /clothingItems/:id - Fetch clothing item by ID
 * Protected: customer or admin
 */
router.get("/clothingItems/:id", authorize(["customer", "admin"]), async (req, res) => {
  try {
    const item = await getClothingItemByID(req.params.id);
    if (!item) return res.status(404).json({ error: "Clothing item not found." });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

/**
 * POST /clothingItems - Add new clothing item
 * Protected: customer or admin
 */
router.post(
  "/clothingItems",
  authorize(["customer", "admin"]), createClothingItemRules, async (req, res) => {
    try {
      const newItem = await addNewClothingItem(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error." });
    }
  }
);

/**
 * PUT /clothingItems/:id - Update clothing item
 * Protected: customer or admin
 */
router.put(
  "/clothingItems/:id", authorize(["customer", "admin"]), updateClothingItemRules, async (req, res) => {
    try {
      const updatedItem = await updateExistingClothingItem(req.params.id, req.body);
      res.json(updatedItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error." });
    }
  }
);

/**
 * DELETE /clothingItems/:id - Delete clothing item
 * Protected: customer or admin
 */
router.delete("/clothingItems/:id", authorize(["customer", "admin"]), async (req, res) => {
    try {
      const deletedItem = await deleteClothingItem(req.params.id);
      res.json(deletedItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error." });
    }
  }
);

module.exports = router;