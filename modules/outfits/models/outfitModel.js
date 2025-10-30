const { readFile, writeToFile } = require("../../../shared/file-utils");
const filePath = "./data/outfits.json";

/**
 * Get all outfits.
 */
async function getAllOutfits() {
  return readFile(filePath);
}

/**
 * Get outfit by ID.
 */
async function getOutfitByID(outfitID) {
  if (!outfitID) throw new Error(`Cannot use ${outfitID} to get outfit`);
  const outfits = await getAllOutfits();
  return outfits.find(outfit => outfit.id === Number(outfitID));
}

/**
 * Add new outfit.
 */
async function addNewOutfit(newOutfit) {
  if (!newOutfit) throw new Error(`Cannot use ${newOutfit} to add outfit`);
  const outfits = await getAllOutfits();
  newOutfit = { id: outfits.length + 1, ...newOutfit };
  outfits.push(newOutfit);
  await writeToFile(filePath, outfits);
  return newOutfit;
}

/**
 * Update existing outfit.
 */
async function updateExistingOutfit(outfitID, newOutfit) {
  if (!outfitID || !newOutfit) throw new Error(`Cannot update outfit`);
  const outfits = await getAllOutfits();
  const index = outfits.findIndex(o => o.id === Number(outfitID));
  if (index < 0) throw new Error(`Outfit with ${outfitID} doesn't exist`);
  const updatedOutfit = { ...outfits[index], ...newOutfit };
  outfits[index] = updatedOutfit;
  await writeToFile(filePath, outfits);
  return updatedOutfit;
}

/**
 * Delete outfit.
 */
async function deleteOutfit(outfitID) {
  if (!outfitID) throw new Error(`Cannot delete outfit`);
  const outfits = await getAllOutfits();
  const index = outfits.findIndex(o => o.id === Number(outfitID));
  if (index < 0) throw new Error(`Outfit with ${outfitID} doesn't exist`);
  const [deletedOutfit] = outfits.splice(index, 1);
  await writeToFile(filePath, outfits);
  return deletedOutfit;
}

module.exports = {
  getAllOutfits,
  getOutfitByID,
  addNewOutfit,
  updateExistingOutfit,
  deleteOutfit
};