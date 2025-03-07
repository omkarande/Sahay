// import { Request, Response } from "express";
// import User, { IUser } from "../models/User";

// // @desc    Register user
// // @route   POST /api/signup
// // @access  Public
// export const signup = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { name, email, password, skills } = req.body;

//     // Check if user exists
//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       res.status(400).json({ error: "User already exists" });
//       return;
//     }

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password,
//       skills,
//     });

//     if (user) {
//       const token = user.getSignedJwtToken();

//       res.status(201).json({
//         success: true,
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//         },
//       });
//     } else {
//       res.status(400).json({ error: "Invalid user data" });
//     }
//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).json({
//       error: "Server error",
//     });
//   }
// };

// // @desc    Login user
// // @route   POST /api/login
// // @access  Public
// export const login = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, password } = req.body;

//     // Check for user
//     const user = await User.findOne({ email }).select("+password");

//     if (!user) {
//       res.status(401).json({ error: "Invalid credentials" });
//       return;
//     }

//     // Check if password matches
//     const isMatch = await user.matchPassword(password);

//     if (!isMatch) {
//       res.status(401).json({ error: "Invalid credentials" });
//       return;
//     }

//     // Create token
//     const token = user.getSignedJwtToken();

//     res.status(200).json({
//       success: true,
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({
//       error: "Server error",
//     });
//   }
// };

// controllers/authController.js
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // @desc    Register a new user
// // @route   POST /api/signup
// // @access  Public
// exports.signup = async (req, res) => {
//   const { name, email, password, skills } = req.body;

//   try {
//     // Check if user already exists
//     let user = await User.findOne({ email });

//     if (user) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     // Create new user
//     user = new User({
//       name,
//       email,
//       password,
//       skills,
//     });

//     // Save user to database
//     await user.save();

//     // Generate JWT
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//     });

//     // Return user data without password
//     const userData = {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       skills: user.skills,
//       token,
//     };

//     res.status(201).json(userData);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // @desc    Authenticate user & get token
// // @route   POST /api/login
// // @access  Public
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find user by email and include password for verification
//     const user = await User.findOne({ email }).select("+password");

//     // Check if user exists
//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Verify password
//     const isMatch = await user.matchPassword(password);

//     if (!isMatch) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Generate JWT
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//     });

//     // Return user data without password
//     const userData = {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       skills: user.skills,
//       token,
//     };

//     res.json(userData);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // @desc    Get current user profile
// // @route   GET /api/me
// // @access  Private (requires auth middleware)
// exports.getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.json({
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       skills: user.skills,
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// };

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, skills } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      skills,
    });

    if (user) {
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Authenticate a user
// @route   POST /api/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      skills: user.skills,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Get user profile
// @route   GET /api/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/me
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.skills = req.body.skills || user.skills;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        skills: updatedUser.skills,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
