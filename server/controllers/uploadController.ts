// import { Request, Response } from "express";
// import { CustomRequest } from "../middlewares/authMiddleware";
// import Resume from "../models/Resume";
// import path from "path";
// import { upload } from "../services/pdfParserService";

// // @desc    Upload resume
// // @route   POST /api/upload-resume
// // @access  Private
// export const uploadResume = async (
//   req: CustomRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     if (!req.file) {
//       res.status(400).json({ error: "Please upload a file" });
//       return;
//     }

//     const userId = req.user?.id;
//     const file = req.file;

//     // Check file type
//     const fileExtension = path.extname(file.originalname).toLowerCase();
//     if (fileExtension !== ".pdf") {
//       res.status(400).json({ error: "Please upload a PDF file" });
//       return;
//     }

//     // Save resume info to database
//     const resume = await Resume.create({
//       user: userId,
//       filename: file.originalname,
//       path: file.path,
//     });

//     res.status(200).json({
//       success: true,
//       data: {
//         id: resume._id,
//         filename: resume.filename,
//       },
//     });
//   } catch (error) {
//     console.error("Resume upload error:", error);
//     res.status(500).json({
//       error: "Server error",
//     });
//   }
// };

// // @desc    Parse resume for auto-fill
// // @route   POST /api/auto-fill-resume
// // @access  Public
// export const parseResume = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     if (!req.file) {
//       res.status(400).json({ error: "Please upload a file" });
//       return;
//     }

//     const file = req.file;

//     // Check file type
//     const fileExtension = path.extname(file.originalname).toLowerCase();
//     if (fileExtension !== ".pdf") {
//       res.status(400).json({ error: "Please upload a PDF file" });
//       return;
//     }

//     // Parse the PDF file
//     const pdfParser = new PDFParser();
//     const parsedData = await pdfParser.parse(file.path);

//     res.status(200).json({
//       success: true,
//       data: parsedData,
//     });
//   } catch (error) {
//     console.error("Resume parsing error:", error);
//     res.status(500).json({
//       error: "Server error in parsing resume",
//     });
//   }
// };
