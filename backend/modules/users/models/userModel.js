//Import mongoose library
const mongoose = require("mongoose");
const { encodePassword } = require("../../../shared/password-utils");

//Create user scheema
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    address: String,
    createdAt: { type: Date, default: Date.now() },
    //Add role-based access control
    roles: { type: [String], enum: ["admin", "customer"], required: true, default: ["customer"] },
  },
  { versionKey: false }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = encodePassword(this.password);
  next();
});

const UserModel = mongoose.model("User", userSchema);

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