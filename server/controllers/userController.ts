// import { Request, Response } from "express";
// import User from "../models/User";
// import { CustomRequest } from "../middlewares/authMiddleware";
// import fs from "fs";
// import path from "path";

// // @desc    Update user profile
// // @route   POST /api/profile
// // @access  Private
// export const updateProfile = async (
//   req: CustomRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const userId = req.user?.id;

//     let profileData = {
//       personalInfo: JSON.parse(req.body.personalInfo || "{}"),
//       education: JSON.parse(req.body.education || "{}"),
//       skills: JSON.parse(req.body.skills || "{}"),
//     };

//     // Handle profile picture upload
//     if (req.files && "profilePicture" in req.files) {
//       const profilePicture = req.files.profilePicture as Express.Multer.File;

//       // Create uploads directory if it doesn't exist
//       const uploadDir = path.join(__dirname, "../../uploads/profiles");
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//       }

//       const filename = `${userId}-${Date.now()}${path.extname(
//         profilePicture.originalname
//       )}`;
//       const filepath = path.join(uploadDir, filename);

//       // Save file
//       fs.writeFileSync(filepath, profilePicture.buffer);

//       // Update profile data with image path
//       profileData.personalInfo.profilePicture = `/uploads/profiles/${filename}`;
//     }

//     // Handle resume upload
//     if (req.files && "resume" in req.files) {
//       const resume = req.files.resume as Express.Multer.File;

//       // Create uploads directory if it doesn't exist
//       const uploadDir = path.join(__dirname, "../../uploads/resumes");
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//       }

//       const filename = `${userId}-${Date.now()}${path.extname(
//         resume.originalname
//       )}`;
//       const filepath = path.join(uploadDir, filename);

//       // Save file
//       fs.writeFileSync(filepath, resume.buffer);
//     }

//     // Update user profile
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profile: profileData },
//       { new: true, runValidators: true }
//     );

//     if (!updatedUser) {
//       res.status(404).json({ error: "User not found" });
//       return;
//     }

//     res.status(200).json({
//       success: true,
//       data: updatedUser.profile,
//     });
//   } catch (error) {
//     console.error("Profile update error:", error);
//     res.status(500).json({
//       error: "Server error",
//     });
//   }
// };

// // @desc    Get user profile
// // @route   GET /api/profile
// // @access  Private
// export const getProfile = async (
//   req: CustomRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const userId = req.user?.id;

//     const user = await User.findById(userId);

//     if (!user) {
//       res.status(404).json({ error: "User not found" });
//       return;
//     }

//     res.status(200).json({
//       success: true,
//       data: user.profile,
//     });
//   } catch (error) {
//     console.error("Get profile error:", error);
//     res.status(500).json({
//       error: "Server error",
//     });
//   }
// };
