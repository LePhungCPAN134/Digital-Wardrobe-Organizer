/**
 * Handles CRUD operations for Clothing Items using JSON file as data source.
 */
const { readFile, writeToFile } = require("../../../shared/file-utils");
const filePath = "./data/clothingItems.json";

/**
 * Get all clothing items.
 */
async function getAllClothingItems() {
  return readFile(filePath);
}

/**
 * Get clothing item by ID.
 */
async function getClothingItemByID(itemID) {
  if (!itemID) throw new Error(`Cannot use ${itemID} to get clothing item`);
  const items = await getAllClothingItems();
  return items.find(item => item.id === Number(itemID));
}

/**
 * Add new clothing item.
 */
async function addNewClothingItem(newItem) {
  if (!newItem) throw new Error(`Cannot use ${newItem} to add clothing item`);
  const items = await getAllClothingItems();
  newItem = { id: items.length + 1, ...newItem };
  items.push(newItem);
  await writeToFile(filePath, items);
  return newItem;
}

/**
 * Update existing clothing item.
 */
async function updateExistingClothingItem(itemID, newItem) {
  if (!itemID || !newItem) throw new Error(`Cannot update clothing item`);
  const items = await getAllClothingItems();
  const index = items.findIndex(i => i.id === Number(itemID));
  if (index < 0) throw new Error(`Clothing item with ${itemID} doesn't exist`);
  const updatedItem = { ...items[index], ...newItem };
  items[index] = updatedItem;
  await writeToFile(filePath, items);
  return updatedItem;
}

/**
 * Delete clothing item.
 */
async function deleteClothingItem(itemID) {
  if (!itemID) throw new Error(`Cannot delete clothing item`);
  const items = await getAllClothingItems();
  const index = items.findIndex(i => i.id === Number(itemID));
  if (index < 0) throw new Error(`Clothing item with ${itemID} doesn't exist`);
  const [deletedItem] = items.splice(index, 1);
  await writeToFile(filePath, items);
  return deletedItem;
}

module.exports = {
  getAllClothingItems,
  getClothingItemByID,
  addNewClothingItem,
  updateExistingClothingItem,
  deleteClothingItem
};