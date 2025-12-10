//Import mongoose library
const mongoose = require("mongoose");

//Create a new schema for user
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    createdAt: { type: mongoose.Schema.Types.Date, default: Date.now() }
});

//Create user model
const UserModel = new mongoose.model("User", UserSchema);

//Get all user
async function getAllUsers() {
  return UserModel.find().lean();
}

//Get user by ID
async function getUserByID(userID) {
  if (!userID) throw new Error(`Cannot use ${userID} to get user`);
  return UserModel.findById(userID).lean();
}

//Add new user
async function addNewUser(newUser) {
  if (!newUser) throw new Error(`Cannot use ${newUser} to add user`);
  const created = await UserModel.create(newUser);
  return created.toObject();
}

//Update existing user
async function updateExistingUser(userID, newUser) {
  if (!userID || !newUser) throw new Error(`Cannot update user`);
  const updated = await UserModel.findByIdAndUpdate(
    userID,
    newUser,
    { new: true, runValidators: true }
  ).lean();

  if (!updated) throw new Error(`User with ${userID} doeesn't exist`);
  return updated;
}

//Delete user
async function deleteUser(userID) {
  if (!userID) throw new Error(`Cannot delete user`);
  const deleted = await UserModel.findByIdAndDelete(userID).lean();
  if (!deleted) throw new Error(`User with ${userID} doeesn't exist`);
  return deleted;
}

module.exports = { getAllUsers, getUserByID, addNewUser, updateExistingUser, deleteUser, UserModel };