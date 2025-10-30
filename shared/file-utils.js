const fs = require("fs").promises;

/**
 * Read JSON file and return parsed data.
 * @param {string} filePath
 * @returns {Promise<Array|Object>}
 */
async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Write data to JSON file.
 * @param {string} filePath
 * @param {Array|Object} data
 */
async function writeToFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    throw error;
  }
}

module.exports = { readFile, writeToFile };
