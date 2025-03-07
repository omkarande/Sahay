// import mongoose, { Document, Schema } from "mongoose";

// interface ITechnicalSkill {
//   skill: string;
//   level: string;
// }

// interface ISoftSkill {
//   skill: string;
//   level: string;
// }

// interface ILanguage {
//   language: string;
//   proficiency: string;
// }

// interface IPersonalInfo {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   dateOfBirth: string;
//   gender: string;
//   location: string;
//   bio: string;
//   linkedinUrl: string;
//   githubUrl: string;
//   portfolioUrl: string;
//   profilePicturePath?: string;
// }

// interface IEducation {
//   currentLevel: string;
//   institution: string;
//   field: string;
//   graduationYear: string;
//   cgpa: string;
//   achievements: string[];
// }

// interface ISkills {
//   technical: ITechnicalSkill[];
//   soft: ISoftSkill[];
//   languages: ILanguage[];
// }

// interface IProfile extends Document {
//   user: mongoose.Schema.Types.ObjectId;
//   personalInfo: IPersonalInfo;
//   education: IEducation;
//   skills: ISkills;
//   resumePath?: string;
// }

// const ProfileSchema: Schema = new Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     personalInfo: {
//       firstName: { type: String, required: true },
//       lastName: { type: String, required: true },
//       email: { type: String, required: true },
//       phone: { type: String, default: "" },
//       dateOfBirth: { type: String, default: "" },
//       gender: { type: String, default: "" },
//       location: { type: String, default: "" },
//       bio: { type: String, default: "" },
//       linkedinUrl: { type: String, default: "" },
//       githubUrl: { type: String, default: "" },
//       portfolioUrl: { type: String, default: "" },
//       profilePicturePath: { type: String },
//     },
//     education: {
//       currentLevel: { type: String, default: "" },
//       institution: { type: String, default: "" },
//       field: { type: String, default: "" },
//       graduationYear: { type: String, default: "" },
//       cgpa: { type: String, default: "" },
//       achievements: [{ type: String }],
//     },
//     skills: {
//       technical: [
//         {
//           skill: { type: String },
//           level: {
//             type: String,
//             enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
//             default: "Beginner",
//           },
//         },
//       ],
//       soft: [
//         {
//           skill: { type: String },
//           level: {
//             type: String,
//             enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
//             default: "Beginner",
//           },
//         },
//       ],
//       languages: [
//         {
//           language: { type: String },
//           proficiency: {
//             type: String,
//             enum: ["Basic", "Intermediate", "Advanced", "Native"],
//             default: "Basic",
//           },
//         },
//       ],
//     },
//     resumePath: { type: String },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model<IProfile>("Profile", ProfileSchema);

// // import mongoose, { Document, Schema } from 'mongoose';

// // export interface IResume extends Document {
// //   user: mongoose.Schema.Types.ObjectId;
// //   filename: string;
// //   path: string;
// //   createdAt: Date;
// // }

// // const ResumeSchema: Schema = new Schema({
// //   user: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'User',
// //     required: true,
// //   },
// //   filename: {
// //     type: String,
// //     required: true,
// //   },
// //   path: {
// //     type: String,
// //     required: true,
// //   },
// //   createdAt: {
// //     type: Date,
// //     default: Date.now,
// //   },
// // });

// // export default mongoose.model<IResume>('Resume', ResumeSchema);

// models/Resume.js
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const categoryScoreSchema = new Schema(
//   {
//     format_and_structure: { type: Number },
//     content_quality: { type: Number },
//     keyword_optimization: { type: Number },
//     impact_and_achievements: { type: Number },
//     skill_relevance: { type: Number },
//   },
//   { _id: false }
// );

// const feedbackSchema = new Schema(
//   {
//     format_and_structure: { type: String },
//     content_quality: { type: String },
//     keyword_optimization: { type: String },
//     impact_and_achievements: { type: String },
//     skill_relevance: { type: String },
//   },
//   { _id: false }
// );

// const resumeSchema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   name: { type: String, required: true },
//   originalName: { type: String, required: true },
//   fileUrl: { type: String, required: true },
//   filePath: { type: String, required: true },
//   fileType: { type: String, required: true },
//   uploadDate: { type: Date, default: Date.now },
//   score: { type: Number },
//   categoryScores: { type: categoryScoreSchema },
//   feedback: { type: feedbackSchema },
//   recommendations: [{ type: String }],
//   isAnalyzed: { type: Boolean, default: false },
// });

// module.exports = mongoose.model("Resume", resumeSchema);
const mongoose = require("mongoose");

const resumeFileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeId: { type: String, required: true },
    name: { type: String, required: true },
    filePath: { type: String, required: true },
    url: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    score: { type: Number },
    categoryScores: { type: Map, of: Number },
    feedback: { type: Map, of: String },
    recommendations: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeFileSchema);
