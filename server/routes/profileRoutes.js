// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Profile = require("../models/Profile");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "profilePicture") {
      cb(null, path.join(__dirname, "../uploads/profile-pictures"));
    } else if (file.fieldname === "resume") {
      cb(null, path.join(__dirname, "../uploads/resumes"));
    } else {
      cb(new Error("Invalid file field"));
    }
  },
  filename: function (req, file, cb) {
    // Use email as part of the filename to make it unique
    const parsedPersonalInfo = JSON.parse(req.body.personalInfo || "{}");
    const email = parsedPersonalInfo.email || "unknown";
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, "-");
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, `${sanitizedEmail}-${timestamp}${extension}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "profilePicture") {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
  } else if (file.fieldname === "resume") {
    // Accept PDFs only
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error("Only PDF files are allowed!"), false);
    }
  }
  cb(null, true);
};

// Upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Handle multiple file uploads
const uploadFields = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);

// Create or update profile
router.post("/", uploadFields, async (req, res, next) => {
  try {
    const personalInfo = JSON.parse(req.body.personalInfo);
    const education = JSON.parse(req.body.education);
    const skills = JSON.parse(req.body.skills);

    // Find if profile exists by email
    let profile = await Profile.findOne({
      "personalInfo.email": personalInfo.email,
    });
    const isUpdate = !!profile;

    // Prepare profile data
    const profileData = {
      personalInfo: {
        ...personalInfo,
        // Only update profile picture path if a new one is uploaded
        ...(req.files.profilePicture && {
          profilePicturePath: `/uploads/profile-pictures/${req.files.profilePicture[0].filename}`,
        }),
      },
      education,
      skills,
      // Only update resume path if a new one is uploaded
      ...(req.files.resume && {
        resumePath: `/uploads/resumes/${req.files.resume[0].filename}`,
      }),
      updatedAt: Date.now(),
    };

    if (isUpdate) {
      // If updating, preserve existing files if not replaced
      if (
        !req.files.profilePicture &&
        profile.personalInfo.profilePicturePath
      ) {
        profileData.personalInfo.profilePicturePath =
          profile.personalInfo.profilePicturePath;
      }
      if (!req.files.resume && profile.resumePath) {
        profileData.resumePath = profile.resumePath;
      }

      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { "personalInfo.email": personalInfo.email },
        profileData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      profile = new Profile(profileData);
      await profile.save();
    }

    res.status(200).json({
      success: true,
      data: profile,
      message: isUpdate
        ? "Profile updated successfully"
        : "Profile created successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Get profile by email
router.get("/:email", async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      "personalInfo.email": req.params.email,
    });

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, error: "Profile not found" });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
});

// Get all profiles (with pagination)
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const profiles = await Profile.find()
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Profile.countDocuments();

    res.status(200).json({
      success: true,
      count: profiles.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: profiles,
    });
  } catch (error) {
    next(error);
  }
});

// Delete profile
router.delete("/:email", async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      "personalInfo.email": req.params.email,
    });

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, error: "Profile not found" });
    }

    // Delete associated files
    if (profile.personalInfo.profilePicturePath) {
      const profilePicPath = path.join(
        __dirname,
        "..",
        profile.personalInfo.profilePicturePath
      );
      if (fs.existsSync(profilePicPath)) {
        fs.unlinkSync(profilePicPath);
      }
    }

    if (profile.resumePath) {
      const resumePath = path.join(__dirname, "..", profile.resumePath);
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
      }
    }

    // Delete profile from database
    await Profile.findOneAndDelete({ "personalInfo.email": req.params.email });

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
