// import mongoose, { Document, Schema } from "mongoose";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import keys from "../config/key";
// import key from "../config/key";

// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
//   skills: string;
//   profile: {
//     personalInfo: {
//       firstName: string;
//       lastName: string;
//       email: string;
//       phone: string;
//       dateOfBirth: string;
//       gender: string;
//       location: string;
//       profilePicture: string;
//       bio: string;
//       linkedinUrl: string;
//       githubUrl: string;
//       portfolioUrl: string;
//     };
//     education: {
//       currentLevel: string;
//       institution: string;
//       field: string;
//       graduationYear: string;
//       cgpa: string;
//       achievements: string[];
//     };
//     skills: {
//       technical: Array<{ skill: string; level: string }>;
//       soft: Array<{ skill: string; level: string }>;
//       languages: Array<{ language: string; proficiency: string }>;
//     };
//   };
//   createdAt: Date;
//   matchPassword(enteredPassword: string): Promise<boolean>;
//   getSignedJwtToken(): string;
// }

// const UserSchema: Schema = new Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Please add a name"],
//     },
//     email: {
//       type: String,
//       required: [true, "Please add an email"],
//       unique: true,
//       match: [
//         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//         "Please add a valid email",
//       ],
//     },
//     password: {
//       type: String,
//       required: [true, "Please add a password"],
//       minlength: 6,
//       select: false,
//     },
//     skills: {
//       type: String,
//       default: "",
//     },
//     profile: {
//       personalInfo: {
//         firstName: { type: String, default: "" },
//         lastName: { type: String, default: "" },
//         email: { type: String, default: "" },
//         phone: { type: String, default: "" },
//         dateOfBirth: { type: String, default: "" },
//         gender: { type: String, default: "" },
//         location: { type: String, default: "" },
//         profilePicture: { type: String, default: "" },
//         bio: { type: String, default: "" },
//         linkedinUrl: { type: String, default: "" },
//         githubUrl: { type: String, default: "" },
//         portfolioUrl: { type: String, default: "" },
//       },
//       education: {
//         currentLevel: { type: String, default: "" },
//         institution: { type: String, default: "" },
//         field: { type: String, default: "" },
//         graduationYear: { type: String, default: "" },
//         cgpa: { type: String, default: "" },
//         achievements: [{ type: String }],
//       },
//       skills: {
//         technical: [
//           {
//             skill: { type: String, default: "" },
//             level: { type: String, default: "Beginner" },
//           },
//         ],
//         soft: [
//           {
//             skill: { type: String, default: "" },
//             level: { type: String, default: "Beginner" },
//           },
//         ],
//         languages: [
//           {
//             language: { type: String, default: "" },
//             proficiency: { type: String, default: "Basic" },
//           },
//         ],
//       },
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// // Encrypt password using bcrypt
// UserSchema.pre<IUser>("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Sign JWT and return
// UserSchema.methods.getSignedJwtToken = function (): string {
//   return jwt.sign({ id: this._id }, keys.jwtSecret, {
//     expiresIn: key.jwtExpire,
//   });
// };

// // Match user entered password to hashed password in database
// UserSchema.methods.matchPassword = async function (
//   enteredPassword: string
// ): Promise<boolean> {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// export default mongoose.model<IUser>("User", UserSchema);

// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Please provide a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // Don't return password in queries by default
  },
  skills: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ResumeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  fileId: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
  },
  categoryScores: {
    type: Map,
    of: Number,
  },
  feedback: {
    type: [String],
  },
  recommendations: {
    type: [String],
  },
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  // Only run this if password was modified
  if (!this.isModified("password")) return next();

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if password matches
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
