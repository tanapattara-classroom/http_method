const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getCurrentUser,
  refreshToken,
} = require("../controllers/authController");
const protect = require("../middleware/auth");

// Register and login routes
router.post("/register", register);
router.post("/login", login);

// Protected route to get current user (for testing)
router.get("/me", protect, getCurrentUser);
router.post("/refresh-token", protect, refreshToken);

module.exports = router;
