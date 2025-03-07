const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  phone: { type: String },
  dateOfBirth: { type: String },
  gender: { type: String },
  location: { type: String },
  bio: { type: String },
  linkedinUrl: { type: String },
  githubUrl: { type: String },
  portfolioUrl: { type: String },
  education: {
    currentLevel: { type: String },
    institution: { type: String },
    field: { type: String },
    graduationYear: { type: String },
    cgpa: { type: String },
    achievements: [{ type: String }],
  },
  skills: {
    technical: [{ skill: String, level: String }],
    soft: [{ skill: String, level: String }],
    languages: [{ language: String, proficiency: String }],
  },
});

module.exports = mongoose.model("Profile", ProfileSchema);
