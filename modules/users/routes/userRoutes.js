const express = require("express");
const router = express.Router();
const { getAllUsers, getUserByID, addNewUser, updateExistingUser, deleteUser } = require("../models/userModel");
const { createUserRules } = require("../middlewares/create-user-rules");
const { updateUserRules } = require("../middlewares/update-user-rules");
const { validationResult } = require("express-validator");

/**
 * GET /users - Fetch all users
 */
router.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users || []);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

/**
 * GET /users/:id - Fetch user by ID
 */
router.get("/users/:id", async (req, res) => {
  try {
    const user = await getUserByID(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

/**
 * POST /users - Add new user
 */
router.post("/users", createUserRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const newUser = await addNewUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

/**
 * PUT /users/:id - Update user
 */
router.put("/users/:id", updateUserRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const updatedUser = await updateExistingUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

/**
 * DELETE /users/:id - Delete user
 */
router.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await deleteUser(req.params.id);
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;