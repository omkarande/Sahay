// import path from "path";
// import fs from "fs";
// import multer from "multer";
// import config from "../config/config";

// // Ensure upload directory exists
// const uploadDir = config.fileUploadPath;
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const subfolder = file.fieldname === "resume" ? "resumes" : "profiles";
//     const destPath = path.join(uploadDir, subfolder);

//     // Create subfolder if it doesn't exist
//     if (!fs.existsSync(destPath)) {
//       fs.mkdirSync(destPath, { recursive: true });
//     }

//     cb(null, destPath);
//   },
//   filename: (req, file, cb) => {
//     // Create unique filename with original extension
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     const ext = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
//   },
// });

// // File filter for uploads
// const fileFilter = (
//   req: Express.Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   if (file.fieldname === "resume") {
//     // Allow only PDFs for resumes
//     if (file.mimetype === "application/pdf") {
//       cb(null, true);
//     } else {
//       cb(new Error("Only PDF files are allowed for resumes!"));
//     }
//   } else if (file.fieldname === "profilePicture") {
//     // Allow images for profile pictures
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed for profile pictures!"));
//     }
//   } else {
//     cb(null, false);
//   }
// };

// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: config.maxFileSize, // Max file size in bytes
//   },
// });
