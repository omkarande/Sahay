// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Ensure uploads directory exists
// const uploadDir = path.join(__dirname, "..", "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const userId = req.body.userId || "unknown";
//     const resumeId = req.body.resumeId || Date.now().toString();
//     cb(null, `${userId}-${resumeId}-${file.originalname.replace(/\s+/g, "_")}`);
//   },
// });

// // File filter to accept only certain file types
// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = [
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   ];

//   if (allowedFileTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error("Invalid file type. Only PDF and Word documents are allowed."),
//       false
//     );
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 10MB limit
// });

// module.exports = upload;
