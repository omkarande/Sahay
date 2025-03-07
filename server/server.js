// import express from "express";
// import cors from "cors";
// import { config } from "dotenv";
// import mongoose from "mongoose";
// import authRoutes from "./routes/authRoutes";
// import userRoutes from "./routes/userRoutes";
// import uploadRoutes from "./routes/uploadRoutes";
// import { connectDB } from "./config/db";

// // Load environment variables
// config();

// // Initialize express
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use("/api", authRoutes);
// app.use("/api", userRoutes);
// app.use("/api", uploadRoutes);

// // Serve static files from uploads folder
// app.use("/uploads", express.static("uploads"));

// // Default route
// app.get("/", (req, res) => {
//   res.send("Sahay API is running");
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Handle unhandled promise rejections
// process.on("unhandledRejection", (err: Error) => {
//   console.log(`Error: ${err.message}`);
//   // Close server & exit process
//   process.exit(1);
// });

// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/api/auth");

// // Load environment variables
// dotenv.config();

// // Initialize express app
// //const app = express();

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(express.json({ extended: false }));
// app.use(cors());

// // Routes
// app.use("/api", authRoutes);

// // Default route
// app.get("/", (req, res) => {
//   res.send("Sahay API Running");
// });

// // Define PORT
// const PORT = process.env.PORT || 5000;

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
// const mongoose = require("mongoose");
// const multer = require("multer");
// //const { GridFsStorage } = require("multer-gridfs-storage");
// //const Grid = require("gridfs-stream");
// const path = require("path");
// const crypto = require("crypto");

// const upload = require("./middleware/upload");
// const resumeRoutes = require("./routes/resumeRoutes");

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Ensure correct path
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
// ✅ Import the profile routes

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Sahay API is running" });
});

// app.use("/api", resumeRoutes(upload));

// Create uploads directory if it doesn't exist
const fs = require("fs");
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
  console.log("Created uploads directory");
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// server.js - Main entry point
// const express = require("express");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const { v4: uuidv4 } = require("uuid");
// const cors = require("cors");
// require("dotenv").config();

// // Import routes
// const resumeRoutes = require("./routes/resumeRoutes");

// // Initialize express app
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Set up MongoDB connection
// mongoose
//   .connect(process.env.MONGODB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Use routes
// app.use("/api", resumeRoutes);

// // Serve uploaded files
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Something went wrong!" });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
