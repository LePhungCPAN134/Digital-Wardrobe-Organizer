const express = require("express");
const router = express.Router();
const { getAllClothingItems, getClothingItemByID, addNewClothingItem, updateExistingClothingItem, deleteClothingItem } = require("../models/clothingModel");
const { createClothingItemRules } = require("../middlewares/create-clothingItem-rules");
const { updateClothingItemRules } = require("../middlewares/update-clothingItem-rules");
const { validationResult } = require("express-validator");

/**
 * GET /clothingItems - Fetch all clothing items
 */
router.get("/clothingItems", async (req, res) => {
  try {
    const items = await getAllClothingItems();
    res.json(items || []);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

/**
 * GET /clothingItems/:id - Fetch clothing item by ID
 */
router.get("/clothingItems/:id", async (req, res) => {
  try {
    const item = await getClothingItemByID(req.params.id);
    if (!item) return res.status(404).json({ error: "Clothing item not found." });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

/**
 * POST /clothingItems - Add new clothing item
 */
router.post("/clothingItems", createClothingItemRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const newItem = await addNewClothingItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

/**
 * PUT /clothingItems/:id - Update clothing item
 */
router.put("/clothingItems/:id", updateClothingItemRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const updatedItem = await updateExistingClothingItem(req.params.id, req.body);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

/**
 * DELETE /clothingItems/:id - Delete clothing item
 */
router.delete("/clothingItems/:id", async (req, res) => {
  try {
    const deletedItem = await deleteClothingItem(req.params.id);
    res.json(deletedItem);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;