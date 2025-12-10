//Import mongoose library
const mongoose = require("mongoose");

//Create a new schema for clothing
const ClothingSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    category: { type: String, required: true },
    color: { type: String, requirede: true, minlength: 3 },
    imageUrl: { type: String, required: false },
    createdAt: { type: mongoose.Schema.Types.Date, default: Date.now() }
});

//Create clothing model
const ClothingModel = new mongoose.model("Clothing", ClothingSchema);

/**
 * Get all clothing items.
 */
async function getAllClothingItems() {
  return ClothingModel.find().lean();
}

/**
 * Get clothing item by ID.
 */
async function getClothingItemByID(clothingID) {
  if (!clothingID) throw new Error(`Cannot use ${clothingID} to get clothing item`);
  return ClothingModel.findById(clothingID).lean();
}

/**
 * Add new clothing item.
 */
async function addNewClothingItem(newClothing) {
  if (!newClothing) throw new Error(`Cannot use ${newClothing} to add clothing`);
  const created = await ClothingModel.create(newClothing);
  return created.toObject();
}

/**
 * Update existing clothing item.
 */
async function updateExistingClothingItem(clothingID, newClothing) {
  if (!clothingID || !newClothing) throw new Error(`Cannot update clothing item`);
  const updated = await ClothingModel.findByIdAndUpdate(
    clothingID,
    newClothing,
    { new: true, runValidators: true }
  ).lean();

  if (!updated) throw new Error(`Outfit with ${outfitID} doesn't exist`);
  return updated;
}

/**
 * Delete clothing item.
 */
async function deleteClothingItem(newClothing) {
  if (!newClothing) throw new Error(`Cannot delete clothing item`);
  const deleted = await ClothingModel.findByIdAndDelete(clothingID).lean();
  if (!deleted) throw new Error(`Outfit with ${clothingID} doesn't exist`);
  return deleted;
}

module.exports = { getAllClothingItems, getClothingItemByID, addNewClothingItem, updateExistingClothingItem, deleteClothingItem, ClothingModel };