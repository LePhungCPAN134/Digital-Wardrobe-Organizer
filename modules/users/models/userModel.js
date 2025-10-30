/**
 * Handles CRUD operations for Users using JSON file as data source.
 */
const { readFile, writeToFile } = require("../../../shared/file-utils");
const filePath = "./data/users.json";

/**
 * Get all users.
 * @returns {Promise<Array>} List of users.
 */
async function getAllUsers() {
  return readFile(filePath);
}

/**
 * Get user by ID.
 * @param {number|string} userID
 * @returns {Promise<Object|undefined>}
 */
async function getUserByID(userID) {
  if (!userID) throw new Error(`Cannot use ${userID} to get user`);
  const users = await getAllUsers();
  return users.find(user => user.id === Number(userID));
}

/**
 * Add new user.
 * @param {Object} newUser
 * @returns {Promise<Object>}
 */
async function addNewUser(newUser) {
  if (!newUser) throw new Error(`Cannot use ${newUser} to add user`);
  const users = await getAllUsers();
  newUser = { id: users.length + 1, ...newUser };
  users.push(newUser);
  await writeToFile(filePath, users);
  return newUser;
}

/**
 * Update existing user.
 */
async function updateExistingUser(userID, newUser) {
  if (!userID || !newUser) throw new Error(`Cannot update user`);
  const users = await getAllUsers();
  const index = users.findIndex(u => u.id === Number(userID));
  if (index < 0) throw new Error(`User with ${userID} doesn't exist`);
  const updatedUser = { ...users[index], ...newUser };
  users[index] = updatedUser;
  await writeToFile(filePath, users);
  return updatedUser;
}

/**
 * Delete user.
 */
async function deleteUser(userID) {
  if (!userID) throw new Error(`Cannot delete user`);
  const users = await getAllUsers();
  const index = users.findIndex(u => u.id === Number(userID));
  if (index < 0) throw new Error(`User with ${userID} doesn't exist`);
  const [deletedUser] = users.splice(index, 1);
  await writeToFile(filePath, users);
  return deletedUser;
}

module.exports = { getAllUsers, getUserByID, addNewUser, updateExistingUser, deleteUser };