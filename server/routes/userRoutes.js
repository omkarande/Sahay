const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

// Public routes
router.post("/signup", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);

module.exports = router;
