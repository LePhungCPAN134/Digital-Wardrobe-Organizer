//Import mongoose library
const mongoose = require("mongoose");

//Create a new schema for outfit
const OutfitSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    item: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clothing",
        required: true
    }],
    occasion: { type: String, required: true, minlength: 3 },
    createdAt: { type: mongoose.Schema.Types.Date, default: Date.now() }
});

//Create outfit model
const OutfitModel = new mongoose.model("Outfit", OutfitSchema);

//Get all outfit with clothing details
async function getAllOutfits() {
  return OutfitModel.find().populate("items").lean();
}

//Get outfit by ID
async function getOutfitByID(outfitID) {
  if (!outfitID) throw new Error(`Cannot use ${outfitID} to get outfit`);
  return OutfitModel.findById(outfitID).populate("items").lean();
}

//Add new outfit.
async function addNewOutfit(newOutfit) {
  if (!newOutfit) throw new Error(`Cannot use ${newOutfit} to add outfit`);
  const created = await OutfitModel.create(newOutfit);
  return created.toObject();
}

//Update existing outfit.
async function updateExistingOutfit(outfitID, newOutfit) {
  if (!outfitID || !newOutfit) throw new Error(`Cannot update outfit`);
  const updated = await OutfitModel.findByIdAndUpdate(
    outfitID,
    newOutfit,
    { new: true, runValidators: true }
  ).populate("items").lean();

  if (!updated) throw new Error(`Outfit with ${outfitID} doesn't exist`);
  return updated;
}

//Delete outfit.
async function deleteOutfit(outfitID) {
  if (!outfitID) throw new Error(`Cannot delete outfit`);
  const deleted = await OutfitModel.findByIdAndDelete(outfitID).populate("items").lean();
  if (!deleted) throw new Error(`Outfit with ${outfitID} doesn't exist`);
  return deleted;
}

module.exports = { getAllOutfits, getOutfitByID, addNewOutfit, updateExistingOutfit, deleteOutfit, OutfitModel };