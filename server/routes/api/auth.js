// /* This code snippet is written in JavaScript and is using the Express framework for creating a router. */
// import express from "express";
// import { login, signup } from "../controllers/authController";

// const router = express.Router();

// router.post("/login", login);
// router.post("/signup", signup);

// export default router;

// routes/api/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");
const { validateSignup, validateLogin } = require("../../middleware/Validator");
const authMiddleware = require("../../middleware/auth");

// @route   POST api/signup
// @desc    Register a user
// @access  Public
router.post("/signup", validateSignup, authController.signup);

// @route   POST api/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", validateLogin, authController.login);

// @route   GET api/me
// @desc    Get current user profile
// @access  Private
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
