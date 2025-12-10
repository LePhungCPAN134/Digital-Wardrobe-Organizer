const express = require("express");
const usersRoute = express.Router();

const registerRules = require("../middlewares/register-rules");
const loginRules = require("../middlewares/login-rules");
const verifyLoginRules = require("../middlewares/verify-login-rules");
const updateAccountRules = require("../middlewares/update-account-rules");

const UserModel = require("../models/userModel");
const OTPModel = require("../models/otpModel");

const { matchPassword } = require("../../../shared/password-utils");
const { encodeToken } = require("../../../shared/jwt-utils");
const authorize = require("../../../shared/middlewares/authorize");
const { randomNumberOfNDigits } = require("../../../shared/compute-utils");
const sendEmail = require("../../../shared/email-utils");

/**
 * Register Route (public)
 */
usersRoute.post("/users/register", ...registerRules, async (req, res) => {
  const newUser = req.body;

  const existingUser = await UserModel.findOne({ email: newUser.email });
  if (existingUser) {
    return res.status(500).json({
      errorMessage: `User with ${newUser.email} already exists`,
    });
  }

  const addedUser = await UserModel.create(newUser);
  if (!addedUser) {
    return res.status(500).send({
      errorMessage: `Oops! User couldn't be added!`,
    });
  }

  const user = { ...addedUser.toJSON(), password: undefined };
  res.json(user);
});

/**
 * Login Route (email + password → send OTP) – public
 */
usersRoute.post("/users/login", ...loginRules, async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await UserModel.findOne({ email });
  if (!foundUser) {
    return res.status(404).send({
      errorMessage: `User with ${email} doesn't exist`,
    });
  }

  const passwordMatched = matchPassword(password, foundUser.password);
  if (!passwordMatched) {
    return res.status(401).send({
      errorMessage: `Email and password didn't match`,
    });
  }

  try {
    const otp = randomNumberOfNDigits(6);

    await OTPModel.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    const subject = "Your login OTP";
    const message = `Your one-time password (OTP) is: ${otp}. It is valid for 5 minutes.`;

    await sendEmail(email, subject, message);

    return res.json({
      message: "OTP has been sent to your email address.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errorMessage: "Failed to send OTP. Please try again later.",
    });
  }
});

/**
 * Verify Login Route (email + OTP → JWT) – public
 */
usersRoute.post("/users/verify-login", ...verifyLoginRules, async (req, res) => {
  const { email, otp } = req.body;
  const otpNumber = Number(otp);

  const savedOTP = await OTPModel.findOne({ email, otp: otpNumber });
  if (!savedOTP) {
    return res.status(401).json({
      errorMessage: "Verification failed: invalid or expired OTP.",
    });
  }

  const foundUser = await UserModel.findOne({ email }).select("-password");
  if (!foundUser) {
    return res.status(404).json({
      errorMessage: `User with ${email} doesn't exist`,
    });
  }

  const userPayload = foundUser.toJSON();
  const token = encodeToken(userPayload);

  res.json({
    user: userPayload,
    token,
  });
});

/**
 * Get all users – ADMIN only
 */
usersRoute.get("/users", authorize(["admin"]), async (req, res) => {
  const allUsers = await UserModel.find().select("-password");
  res.json(allUsers || []);
});

/**
 * Get user profile – ADMIN or that CUSTOMER
 */
usersRoute.get( "/accounts/:id", authorize(["admin", "customer"]), async (req, res) => {
    const userID = req.params.id;
    const isAdmin = req.account.roles.includes("admin");

    if (!isAdmin && String(req.account._id) !== String(userID)) {
      return res.status(401).json({
        errorMessage: "You can only access your own profile.",
      });
    }

    const foundUser = await UserModel.findById(userID).select("-password");
    if (!foundUser) {
      return res.status(404).send({
        errorMessage: `User with ${userID} doesn't exist`,
      });
    }
    res.json(foundUser);
  }
);

/**
 * Update user profile – ADMIN or that CUSTOMER
 */
usersRoute.put("/accounts/:id", authorize(["admin", "customer"]), ...updateAccountRules, async (req, res) => {
    const userID = req.params.id;
    const isAdmin = req.account.roles.includes("admin");

    if (!isAdmin && String(req.account._id) !== String(userID)) {
      return res.status(401).json({
        errorMessage: "You can only update your own profile.",
      });
    }

    const newUser = req.body;
    if (!newUser) {
      return res.status(421).json({ errorMessage: "Nothing to update" });
    }

    if (!isAdmin && newUser.roles) {
      return res.status(401).json({
        errorMessage:
          "You don't have permission to update your role. Please contact support.",
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userID,
      { $set: newUser },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(500).send({
        errorMessage: `Oops! User couldn't be updated!`,
      });
    }
    res.json(updatedUser);
  }
);

/**
 * Delete user – ADMIN only
 */
usersRoute.delete("/accounts/:id", authorize(["admin"]), async (req, res) => {
    const userID = req.params.id;
    const deletedUser = await UserModel.findByIdAndDelete(userID).select(
      "-password"
    );
    if (!deletedUser) {
      return res.status(404).send({
        errorMessage: `User with ${userID} doesn't exist`,
      });
    }
    res.json(deletedUser);
  }
);

module.exports = usersRoute;