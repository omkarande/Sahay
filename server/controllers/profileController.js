const Profile = require("../models/Profile");
const User = require("../models/User");
const extractResumeDetails = require("../utils/extractResume");

// Create or update profile
const createOrUpdateProfile = async (req, res) => {
  const { userId } = req.params;
  const { body } = req;

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if profile exists
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId });
    }

    // Update profile fields
    profile.firstName = body.firstName || profile.firstName;
    profile.lastName = body.lastName || profile.lastName;
    profile.email = user.email; // Use the email from the user model
    profile.phone = body.phone || profile.phone;
    profile.dateOfBirth = body.dateOfBirth || profile.dateOfBirth;
    profile.gender = body.gender || profile.gender;
    profile.location = body.location || profile.location;
    profile.bio = body.bio || profile.bio;
    profile.linkedinUrl = body.linkedinUrl || profile.linkedinUrl;
    profile.githubUrl = body.githubUrl || profile.githubUrl;
    profile.portfolioUrl = body.portfolioUrl || profile.portfolioUrl;
    profile.education = body.education || profile.education;
    profile.skills = body.skills || profile.skills;

    await profile.save();
    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Parse resume and update profile
const parseResumeAndUpdateProfile = async (req, res) => {
  const { userId } = req.params;
  const resumeFile = req.file;

  if (!resumeFile) {
    return res.status(400).json({ message: "No resume file uploaded" });
  }

  try {
    // Call Python script to parse resume
    const parsedData = await extractResumeDetails(resumeFile.path);

    // Find the profile
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId });
    }

    // Update profile with parsed data
    profile.firstName =
      parsedData.personal_information?.name?.split(" ")[0] || "";
    profile.lastName =
      parsedData.personal_information?.name?.split(" ").slice(1).join(" ") ||
      "";
    profile.phone = parsedData.personal_information?.phone || "";
    profile.location = parsedData.personal_information?.location || "";
    profile.education = {
      currentLevel: parsedData.education?.current_level || "",
      institution: parsedData.education?.institution || "",
      field: parsedData.education?.field || "",
      graduationYear: parsedData.education?.graduation_year || "",
      cgpa: parsedData.education?.cgpa || "",
      achievements: [],
    };
    profile.skills = {
      technical: parsedData.technical_skills || [],
      soft: parsedData.soft_skills || [],
      languages: parsedData.languages || [],
    };

    await profile.save();
    res
      .status(200)
      .json({ message: "Resume parsed and profile updated", profile });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createOrUpdateProfile, parseResumeAndUpdateProfile };
