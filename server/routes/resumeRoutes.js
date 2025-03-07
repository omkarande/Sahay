// routes/resumeRoutes.js
const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");
const { upload } = require("../middleware/fileUpload");

// Upload a new resume
router.post("/resume", upload.single("resume"), resumeController.uploadResume);

// Get all resumes for a user
router.get("/resume/:userId", resumeController.getResumes);

// Get a specific resume
router.get("/resume/:userId/:resumeId", resumeController.getResumeById);

// Delete a resume
router.delete("/delete-resume/:resumeId", resumeController.deleteResume);

// Analyze a resume (ATS score)
router.post("/analyze-resume/:resumeId", resumeController.analyzeResume);

module.exports = router;
