const { Router } = require("express");
const createOutfitRules = require("../middlewares/create-outfit-rules");
const updateOutfitRules = require("../middlewares/update-outfit-rules");
const { validationResult } = require("express-validator");
const authorize = require("../../../shared/middlewares/authorize");

const OutfitModel = require("../models/outfitModel");
const outfitRoute = Router();

/**
 * GET /outfits - Fetch all outfits
 */
outfitRoute.get("/outfits", authorize(["customer", "admin"]), async (req, res) => {
  const allOutfits = await OutfitModel.find();
  if (!allOutfits) res.json([]);
  else res.json(allOutfits);
});

/**
 * GET /outfits/:id - Fetch outfit by ID
 */
outfitRoute.get("/outfits/:id", authorize(["customer", "admin"]), async (req, res) => {
  const outfitID = req.params.id;
  const outfit = await OutfitModel.findById(outfitID);
  if (!outfitID) res.status(404).send("Outfit not found!");
  else res.status(200).json(outfit);
});

/**
 * POST /outfits - Add new outfit
 */
outfitRoute.post("/outfits", authorize(["customer", "admin"]), createOutfitRules, async (req, res) => {
  try {
    const { name, items, occasion } = req.body;
    const outfit = new OutfitModel({
      name,
      items,
      occasion,
    });
    const savedOutfit = await outfit.save();
  } catch (error) {
    console.erro("Error creating outfit: ", error);
    res.status(500).send("Failed to create new outfit!");
  }
});

/**
 * PUT /outfits/:id - Update outfit
 */
outfitRoute.put("/outfits/:id", authorize(["customer", "admin"]), updateOutfitRules, async (req, res) => {
  const outfitID = req.params.id;
  try {
    const updatedOutfit = await OutfitModel.findByIdAndUpdate (
      outfitID,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedOutfit) {
      return res.status(404).send("Outfit not found!");
    }
  } catch (error) {
    console.error("Error updating outfit: ", error)
    res.status(500).send("Failed to update outfit data!")
  }
});

/**
 * DELETE /outfits/:id - Delete outfit
 */
outfitRoute.delete("/outfits/:id", authorize(["customer", "admin"]), async (req, res) => {
  const outfitID = req.params.id;
  try {
    const deletedOutfit = await OutfitModel.findByIdAndDelete(outfitID);
    if (!deletedOutfit) {
      return res.status(404).send("Outfit not found!");
    }
    res.status(200).json(deletedOutfit);
  } catch (error) {
    console.error("Error deleting outfit: ", error);
    res.status(500).send("Faile to delete outfit data!");
  }
});

module.exports = { outfitRoute };