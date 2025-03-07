// routes/autoFillRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { PdfReader } = require("pdfreader");
const Profile = require("../models/Profile");

// Configure multer storage for resume uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/temp")); // Temporary storage
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, `resume-${timestamp}-${uniqueId}${extension}`);
  },
});

// File filter to only accept PDFs
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(pdf)$/)) {
    return cb(new Error("Only PDF files are allowed!"), false);
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

// Ensure temp directory exists
const tempDir = path.join(__dirname, "../uploads/temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Helper to extract text from PDF
const extractTextFromPDF = (pdfPath) => {
  return new Promise((resolve, reject) => {
    let textContent = "";
    let currentPage = 1;
    let lastY = -1;
    let text = "";

    new PdfReader().parseFileItems(pdfPath, (err, item) => {
      if (err) {
        reject(err);
      } else if (!item) {
        // End of file, resolve with the text content
        resolve(textContent);
      } else if (item.page) {
        currentPage = item.page;
        textContent += `\n--- Page ${currentPage} ---\n`;
      } else if (item.text) {
        // New line detection
        if (lastY !== -1 && lastY !== item.y) {
          textContent += "\n";
        }
        textContent += item.text;
        lastY = item.y;
      }
    });
  });
};

// Simple parser for resume data (this is a basic example, you'd want more sophisticated parsing in production)
const parseResumeText = (text) => {
  // This is a simplified parser. In a real application, you would use NLP or a more sophisticated algorithm
  // to extract information from the resume text.

  const data = {
    personal_information: {
      name: "",
      email: "",
      phone: "",
      location: "",
    },
    education: {
      current_level: "",
      institution: "",
      field: "",
      graduation_year: "",
      cgpa: "",
    },
    technical_skills: [],
    soft_skills: [],
    languages: [],
  };

  // Very basic parsing - in reality, you'd want to use a more sophisticated approach

  // Try to find an email
  const emailMatch = text.match(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  );
  if (emailMatch) {
    data.personal_information.email = emailMatch[0];
  }

  // Try to find a phone number (very basic pattern)
  const phoneMatch = text.match(
    /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/
  );
  if (phoneMatch) {
    data.personal_information.phone = phoneMatch[0];
  }

  // Try to extract name (assuming it's at the beginning of the resume)
  const lines = text.split("\n");
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (
      line &&
      !line.includes("@") &&
      !line.match(/\d{3}/) &&
      line.length > 5 &&
      line.length < 50
    ) {
      data.personal_information.name = line;
      break;
    }
  }

  // Look for education-related keywords
  const educationKeywords = [
    "education",
    "university",
    "college",
    "degree",
    "school",
  ];
  const educationSectionText = educationKeywords.reduce((text, keyword) => {
    const sectionMatch = new RegExp(`(?:${keyword}[\\s\\S]{0,500})`, "i").exec(
      text
    );
    return sectionMatch ? sectionMatch[0] : text;
  }, text);

  if (educationSectionText) {
    // Try to extract institution
    const institutionMatch = educationSectionText.match(
      /(?:university|college|institute|school) of ([A-Za-z\s&]+)/i
    );
    if (institutionMatch) {
      data.education.institution = institutionMatch[1].trim();
    }

    // Try to extract graduation year
    const yearMatch = educationSectionText.match(/20\d{2}/);
    if (yearMatch) {
      data.education.graduation_year = yearMatch[0];
    }

    // Try to extract GPA/CGPA
    const gpaMatch = educationSectionText.match(/(?:gpa|cgpa)[:\s]*([0-9.]+)/i);
    if (gpaMatch) {
      data.education.cgpa = gpaMatch[1];
    }

    // Try to determine degree level
    const degreeKeywords = {
      bachelor: "bachelors",
      master: "masters",
      phd: "phd",
      "high school": "high-school",
    };

    for (const [keyword, level] of Object.entries(degreeKeywords)) {
      if (educationSectionText.toLowerCase().includes(keyword)) {
        data.education.current_level = level;
        break;
      }
    }
  }

  // Extract skills
  const skillsKeywords = [
    "skills",
    "technologies",
    "programming languages",
    "tools",
  ];
  const skillsSectionText = skillsKeywords.reduce((text, keyword) => {
    const sectionMatch = new RegExp(`(?:${keyword}[\\s\\S]{0,1000})`, "i").exec(
      text
    );
    return sectionMatch ? sectionMatch[0] : text;
  }, text);

  if (skillsSectionText) {
    // Common technical skills
    const techSkills = [
      "javascript",
      "python",
      "java",
      "c\\+\\+",
      "html",
      "css",
      "react",
      "node",
      "angular",
      "vue",
      "sql",
      "mongodb",
      "aws",
      "docker",
      "git",
    ];

    for (const skill of techSkills) {
      const skillRegex = new RegExp(`\\b${skill}\\b`, "i");
      if (skillRegex.test(skillsSectionText)) {
        data.technical_skills.push({
          name:
            skill.charAt(0).toUpperCase() +
            skill.slice(1).replace("\\+\\+", "++"),
          level: "Intermediate", // Default level
        });
      }
    }

    // Common soft skills
    const softSkills = [
      "communication",
      "leadership",
      "teamwork",
      "problem solving",
      "time management",
      "critical thinking",
    ];

    for (const skill of softSkills) {
      const skillRegex = new RegExp(`\\b${skill}\\b`, "i");
      if (skillRegex.test(skillsSectionText)) {
        data.soft_skills.push({
          name: skill.charAt(0).toUpperCase() + skill.slice(1),
          level: "Intermediate", // Default level
        });
      }
    }
  }

  // Extract languages
  const languageKeywords = ["language", "languages", "proficiency"];
  const languageSectionText = languageKeywords.reduce((text, keyword) => {
    const sectionMatch = new RegExp(`(?:${keyword}[\\s\\S]{0,300})`, "i").exec(
      text
    );
    return sectionMatch ? sectionMatch[0] : text;
  }, text);

  if (languageSectionText) {
    const commonLanguages = [
      "english",
      "spanish",
      "french",
      "german",
      "chinese",
      "japanese",
      "korean",
      "arabic",
      "hindi",
      "russian",
    ];

    for (const language of commonLanguages) {
      const langRegex = new RegExp(`\\b${language}\\b`, "i");
      if (langRegex.test(languageSectionText)) {
        data.languages.push({
          name: language.charAt(0).toUpperCase() + language.slice(1),
          proficiency: "Intermediate", // Default level
        });
      }
    }
  }

  return data;
};

// Auto-fill route
router.post("/", upload.single("resume"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    const filePath = req.file.path;

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(filePath);

    // Parse the extracted text
    const parsedData = parseResumeText(extractedText);

    // Move the file from temp to permanent storage if needed
    const permanentDir = path.join(__dirname, "../uploads/resumes");
    if (!fs.existsSync(permanentDir)) {
      fs.mkdirSync(permanentDir, { recursive: true });
    }

    const timestamp = Date.now();
    const uniqueId = uuidv4();
    const newFilename = `resume-${timestamp}-${uniqueId}.pdf`;
    const newPath = path.join(permanentDir, newFilename);

    fs.copyFileSync(filePath, newPath);

    // Return the parsed data
    res.status(200).json({
      success: true,
      message: "Resume parsed successfully",
      data: parsedData,
      file: {
        originalName: req.file.originalname,
        path: `/uploads/resumes/${newFilename}`,
      },
    });

    // Clean up the temp file
    fs.unlinkSync(filePath);
  } catch (error) {
    // Clean up temp file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
});

// Get resume by email
router.get("/:email", async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      "personalInfo.email": req.params.email,
    });

    if (!profile || !profile.resumePath) {
      return res
        .status(404)
        .json({ success: false, error: "Resume not found" });
    }

    // Get the full path
    const resumePath = path.join(__dirname, "..", profile.resumePath);

    // Check if file exists
    if (!fs.existsSync(resumePath)) {
      return res
        .status(404)
        .json({ success: false, error: "Resume file not found" });
    }

    // Send the file
    res.sendFile(resumePath);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
