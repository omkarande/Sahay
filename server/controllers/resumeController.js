// const Resume = require("../models/Resume");
// const Profile = require("../models/Profile");

// // Upload resume
// exports.uploadResume = async (req, res) => {
//   const { userId } = req.body;
//   const file = req.file;

//   try {
//     const resume = new Resume({
//       name: file.originalname,
//       file: file.path,
//       url: `/uploads/${file.filename}`,
//     });

//     const savedResume = await resume.save();
//     await Profile.findByIdAndUpdate(userId, {
//       $push: { resumes: savedResume._id },
//     });

//     res.status(201).json(savedResume);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Get resume by ID
// exports.getResume = async (req, res) => {
//   try {
//     const resume = await Resume.findById(req.params.id);
//     res.json(resume);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete resume
// exports.deleteResume = async (req, res) => {
//   try {
//     await Resume.findByIdAndDelete(req.params.id);
//     res.json({ message: "Resume deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // controllers/resumeController.js
// const User = require("../models/User");
// const Resume = require("../models/Resume");
// const fs = require("fs").promises;
// const path = require("path");
// const { v4: uuidv4 } = require("uuid");

// // Helper for resume text extraction and analysis
// const {
//   extractTextFromResume,
//   analyzeResumeContent,
// } = require("../utils/resumeAnalyzer");

// // Upload a new resume
// exports.uploadResume = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const { userId, resumeId } = req.body;

//     // If no resumeId was provided, generate one
//     const newResumeId = resumeId || uuidv4();

//     // Create file URL for frontend
//     const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
//       req.file.filename
//     }`;

//     // Find user to update
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Create new resume object
//     const newResume = {
//       id: newResumeId,
//       name: req.file.originalname,
//       filePath: req.file.path,
//       url: fileUrl,
//       uploadDate: new Date(),
//     };

//     // Add resume to user's resumes array
//     if (!user.resumes) {
//       user.resumes = [];
//     }
//     user.resumes.push(newResume);
//     await user.save();

//     // Also save a copy in the Resume collection for easier querying
//     const resumeDoc = new Resume({
//       userId: userId,
//       resumeId: newResumeId,
//       name: req.file.originalname,
//       filePath: req.file.path,
//       url: fileUrl,
//       uploadDate: new Date(),
//     });
//     await resumeDoc.save();

//     res.status(201).json({
//       message: "Resume uploaded successfully",
//       resumeId: newResumeId,
//       fileUrl: fileUrl,
//     });
//   } catch (error) {
//     console.error("Error uploading resume:", error);
//     res.status(500).json({ error: "Failed to upload resume" });
//   }
// };

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // For generating unique resumeId
const User = require("../models/User");
const Resume = require("../models/Resume");

// exports.uploadResume = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const { userId, resumeId } = req.body;

//     // Validate userId
//     if (!mongoose.isValidObjectId(userId)) {
//       return res.status(400).json({ error: "Invalid user ID format" });
//     }

//     // If no resumeId was provided, generate one
//     const newResumeId = resumeId || uuidv4();

//     // Create file URL for frontend
//     const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
//       req.file.filename
//     }`;

//     // Find user to update
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Create new resume object
//     const newResume = {
//       id: newResumeId,
//       name: req.file.originalname,
//       filePath: req.file.path,
//       url: fileUrl,
//       uploadDate: new Date(),
//     };

//     // Add resume to user's resumes array
//     if (!user.resumes) {
//       user.resumes = [];
//     }
//     user.resumes.push(newResume);
//     await user.save();

//     // Also save a copy in the Resume collection for easier querying
//     const resumeDoc = new Resume({
//       userId: userId,
//       resumeId: newResumeId,
//       name: req.file.originalname,
//       filePath: req.file.path,
//       url: fileUrl,
//       uploadDate: new Date(),
//     });
//     await resumeDoc.save();

//     res.status(201).json({
//       message: "Resume uploaded successfully",
//       resumeId: newResumeId,
//       fileUrl: fileUrl,
//     });
//   } catch (error) {
//     console.error("Error uploading resume:", error);
//     res.status(500).json({ error: "Failed to upload resume" });
//   }
// };

// Get all resumes for a user

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { userId, resumeId } = req.body;

    if (userId === "1") console.log(`User ${userId}`);

    // Validate userId
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // If no resumeId was provided, generate one
    const newResumeId = resumeId || uuidv4();

    // Create file URL for frontend
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    // Find user to update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create new resume object
    const newResume = {
      id: newResumeId,
      name: req.file.originalname,
      filePath: req.file.path,
      url: fileUrl,
      uploadDate: new Date(),
    };

    // Add resume to user's resumes array
    if (!user.resumes) {
      user.resumes = [];
    }
    user.resumes.push(newResume);
    await user.save();

    // Also save a copy in the Resume collection for easier querying
    const resumeDoc = new Resume({
      userId: userId,
      resumeId: newResumeId,
      name: req.file.originalname,
      filePath: req.file.path,
      url: fileUrl,
      uploadDate: new Date(),
    });
    await resumeDoc.save();

    res.status(201).json({
      message: "Resume uploaded successfully",
      resumeId: newResumeId,
      fileUrl: fileUrl,
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ error: "Failed to upload resume" });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ resumes: user.resumes || [] });
  } catch (error) {
    console.error("Error retrieving resumes:", error);
    res.status(500).json({ error: "Failed to retrieve resumes" });
  }
};

// Get a specific resume by ID
exports.getResumeById = async (req, res) => {
  try {
    const { userId, resumeId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resume = user.resumes.find((r) => r.id === resumeId);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.status(200).json({ resume });
  } catch (error) {
    console.error("Error retrieving resume:", error);
    res.status(500).json({ error: "Failed to retrieve resume" });
  }
};

// Delete a resume
exports.deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    // Find the resume in the Resume collection
    const resume = await Resume.findOne({ resumeId });
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // Remove the file from the filesystem
    if (resume.filePath) {
      await fs.unlink(resume.filePath).catch((err) => {
        console.warn(`Warning: Could not delete file ${resume.filePath}:`, err);
      });
    }

    // Remove the resume from the user's resumes array
    await User.updateOne(
      { _id: resume.userId },
      { $pull: { resumes: { id: resumeId } } }
    );

    // Remove the resume from the Resume collection
    await Resume.deleteOne({ resumeId });

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ error: "Failed to delete resume" });
  }
};

// Analyze a resume (get ATS score)
exports.analyzeResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    // Find the resume
    const resume = await Resume.findOne({ resumeId });
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // Extract text from the resume file
    const resumeText = await extractTextFromResume(resume.filePath);

    // Analyze the resume content
    const analysisResults = await analyzeResumeContent(resumeText);

    // Update resume with analysis results
    resume.score = analysisResults.overall_score;
    resume.categoryScores = analysisResults.category_scores;
    resume.feedback = analysisResults.feedback;
    resume.recommendations = analysisResults.recommendations;
    await resume.save();

    // Also update the resume in the user's resumes array
    await User.updateOne(
      { _id: resume.userId, "resumes.id": resumeId },
      {
        $set: {
          "resumes.$.score": analysisResults.overall_score,
          "resumes.$.categoryScores": analysisResults.category_scores,
          "resumes.$.feedback": analysisResults.feedback,
          "resumes.$.recommendations": analysisResults.recommendations,
        },
      }
    );

    res.status(200).json(analysisResults);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
};
