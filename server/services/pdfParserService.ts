// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Create uploads directory if it doesn't exist
// const createUploadDir = () => {
//   const dir = path.join(__dirname, "../../uploads");
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
//   return dir;
// };

// // Set storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = createUploadDir();

//     // Determine subfolder based on file type
//     let subfolder = "documents";
//     if (file.mimetype.startsWith("image/")) {
//       subfolder = "profiles";
//     } else if (file.originalname.endsWith(".pdf")) {
//       subfolder = "resumes";
//     }

//     const dir = path.join(uploadDir, subfolder);
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }

//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     // Generate a unique filename
//     cb(
//       null,
//       `${path.parse(file.originalname).name}-${Date.now()}${path.extname(
//         file.originalname
//       )}`
//     );
//   },
// });

// // File filter
// const fileFilter = (
//   req: Express.Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   // Allow pdf and images
//   if (
//     file.mimetype === "application/pdf" ||
//     file.mimetype.startsWith("image/")
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error("Unsupported file format"));
//   }
// };

// // Export multer instance
// export const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
//   fileFilter,
// });
