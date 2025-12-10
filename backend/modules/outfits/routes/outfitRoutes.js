const express = require("express");
const router = express.Router();
const { getAllOutfits, getOutfitByID, addNewOutfit, updateExistingOutfit, deleteOutfit } = require("../models/outfitModel");
const { createOutfitRules } = require("../middlewares/create-outfit-rules");
const { updateOutfitRules } = require("../middlewares/update-outfit-rules");
const { validationResult } = require("express-validator");
const authorize = require("../../../shared/middlewares/authorize");

/**
 * GET /outfits - Fetch all outfits
 */
router.get("/outfits", authorize(["customer", "admin"]), async (req, res) => {
  try {
    const outfits = await getAllOutfits();
    res.json(outfits || []);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

/**
 * GET /outfits/:id - Fetch outfit by ID
 */
router.get("/outfits/:id", authorize(["customer", "admin"]), async (req, res) => {
  try {
    const outfit = await getOutfitByID(req.params.id);
    if (!outfit) return res.status(404).json({ error: "Outfit not found." });
    res.json(outfit);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

/**
 * POST /outfits - Add new outfit
 */
router.post("/outfits", authorize(["customer", "admin"]), createOutfitRules, async (req, res) => {
  try {
    const newOutfit = await addNewOutfit(req.body);
    res.status(201).json(newOutfit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

/**
 * PUT /outfits/:id - Update outfit
 */
router.put("/outfits/:id", authorize(["customer", "admin"]), updateOutfitRules, async (req, res) => {
  try {
    const updatedOutfit = await updateExistingOutfit(req.params.id, req.body);
    res.json(updatedOutfit);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

/**
 * DELETE /outfits/:id - Delete outfit
 */
router.delete("/outfits/:id", authorize(["customer", "admin"]), async (req, res) => {
  try {
    const deletedOutfit = await deleteOutfit(req.params.id);
    res.json(deletedOutfit);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;