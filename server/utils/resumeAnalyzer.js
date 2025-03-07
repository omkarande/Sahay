// utils/resumeAnalyzer.js
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const textract = require("textract");

// Extract text from resume file
exports.extractTextFromResume = async (filePath) => {
  try {
    const fileExt = path.extname(filePath).toLowerCase();

    // Extract text based on file type
    switch (fileExt) {
      case ".pdf":
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdf(dataBuffer);
        return pdfData.text;

      case ".docx":
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;

      case ".doc":
        return new Promise((resolve, reject) => {
          textract.fromFileWithPath(
            filePath,
            { preserveLineBreaks: true },
            (err, text) => {
              if (err) {
                reject(err);
              } else {
                resolve(text);
              }
            }
          );
        });

      default:
        throw new Error(`Unsupported file type: ${fileExt}`);
    }
  } catch (error) {
    console.error("Error extracting text from resume:", error);
    throw error;
  }
};

// Analyze resume content for ATS scoring
exports.analyzeResumeContent = async (resumeText) => {
  try {
    // This is a simplified implementation of an ATS scoring system
    // In a real-world scenario, you might want to use a more sophisticated model,
    // possibly integrating with an AI service like OpenAI or Google Cloud NLP

    // Define categories to evaluate
    const categories = {
      formatting: evaluateFormatting(resumeText),
      keywords: evaluateKeywords(resumeText),
      experience: evaluateExperience(resumeText),
      education: evaluateEducation(resumeText),
      skills: evaluateSkills(resumeText),
      contact_info: evaluateContactInfo(resumeText),
    };

    // Calculate overall score (average of all categories)
    const categoryValues = Object.values(categories);
    const overallScore = Math.round(
      categoryValues.reduce((sum, score) => sum + score, 0) /
        categoryValues.length
    );

    // Generate feedback for each category
    const feedback = {
      formatting: generateFormattingFeedback(categories.formatting),
      keywords: generateKeywordsFeedback(categories.keywords),
      experience: generateExperienceFeedback(categories.experience),
      education: generateEducationFeedback(categories.education),
      skills: generateSkillsFeedback(categories.skills),
      contact_info: generateContactInfoFeedback(categories.contact_info),
    };

    // Generate recommendations based on scores
    const recommendations = generateRecommendations(categories, resumeText);

    return {
      overall_score: overallScore,
      category_scores: categories,
      feedback,
      recommendations,
    };
  } catch (error) {
    console.error("Error analyzing resume content:", error);
    throw error;
  }
};

// Helper functions for resume evaluation

function evaluateFormatting(text) {
  let score = 0;

  // Check for appropriate length (not too short, not too long)
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 300 && wordCount < 1200) score += 25;

  // Check for appropriate sections (headings)
  const hasHeadings =
    /education|experience|skills|work history|employment|professional experience/i.test(
      text
    );
  if (hasHeadings) score += 25;

  // Check for readable paragraphs (not too long)
  const paragraphs = text.split("\n\n");
  const areParaReasonableLength =
    paragraphs.filter((p) => p.length > 10 && p.length < 500).length >
    paragraphs.length / 2;
  if (areParaReasonableLength) score += 25;

  // Check for consistent formatting
  const hasConsistentSpacing = !/\n{3,}/.test(text);
  if (hasConsistentSpacing) score += 25;

  return score;
}

function evaluateKeywords(text) {
  let score = 0;
  const commonJobKeywords = [
    "achieved",
    "improved",
    "team",
    "leadership",
    "project",
    "managed",
    "developed",
    "created",
    "designed",
    "implemented",
    "analyzed",
    "solution",
    "strategy",
    "skills",
    "experience",
    "coordination",
    "success",
    "delivered",
    "results",
    "responsible",
    "increase",
  ];

  const lowerText = text.toLowerCase();
  const keywordsFound = commonJobKeywords.filter((keyword) =>
    lowerText.includes(keyword)
  );

  // Score based on keyword density
  score = Math.min(
    100,
    Math.round((keywordsFound.length / commonJobKeywords.length) * 100)
  );

  return score;
}

function evaluateExperience(text) {
  let score = 0;

  // Check for date patterns (experience timeline)
  const datePattern = /\b(19|20)\d{2}\s*(-|–|to)\s*(19|20)\d{2}|present\b/i;
  const hasExperienceDates = datePattern.test(text);
  if (hasExperienceDates) score += 35;

  // Check for job titles
  const jobTitlePattern =
    /\b(senior|junior|lead|manager|director|coordinator|analyst|engineer|developer|specialist|assistant)\b/i;
  const hasJobTitles = jobTitlePattern.test(text);
  if (hasJobTitles) score += 30;

  // Check for accomplishment statements
  const accomplishmentPattern =
    /\b(achieved|improved|increased|reduced|saved|delivered|created|developed|managed|led)\b/i;
  const hasAccomplishments = accomplishmentPattern.test(text);
  if (hasAccomplishments) score += 35;

  return score;
}

function evaluateEducation(text) {
  let score = 0;

  // Check for degree mentions
  const degreePattern =
    /\b(bachelor|master|phd|doctorate|bsc|ba|msc|ma|mba|associate|degree)\b/i;
  const hasDegrees = degreePattern.test(text);
  if (hasDegrees) score += 40;

  // Check for university/college/school mentions
  const schoolPattern = /\b(university|college|school|institute|academy)\b/i;
  const hasSchools = schoolPattern.test(text);
  if (hasSchools) score += 30;

  // Check for graduation dates
  const gradDatePattern = /\b(19|20)\d{2}\b/;
  const hasGradDates = gradDatePattern.test(text);
  if (hasGradDates) score += 30;

  return score;
}

function evaluateSkills(text) {
  let score = 0;

  // Check for technical skills
  const techSkillsPattern =
    /\b(javascript|python|java|c\+\+|react|node|sql|aws|azure|cloud|machine learning|data analysis|tensorflow|pytorch)\b/i;
  const hasTechSkills = techSkillsPattern.test(text);
  if (hasTechSkills) score += 30;

  // Check for soft skills
  const softSkillsPattern =
    /\b(communication|leadership|teamwork|problem.solving|time.management|critical.thinking|adaptability|creativity|collaboration)\b/i;
  const hasSoftSkills = softSkillsPattern.test(text);
  if (hasSoftSkills) score += 30;

  // Check for industry-specific skills
  const industrySkillsPattern =
    /\b(marketing|sales|finance|accounting|human resources|project management|customer service|research|development|design)\b/i;
  const hasIndustrySkills = industrySkillsPattern.test(text);
  if (hasIndustrySkills) score += 20;

  // Skills section identifier
  const skillsSectionPattern =
    /\b(skills|competencies|proficiencies|expertise|qualifications)\b/i;
  const hasSkillsSection = skillsSectionPattern.test(text);
  if (hasSkillsSection) score += 20;

  return Math.min(100, score);
}

function evaluateContactInfo(text) {
  let score = 0;

  // Check for email address
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const hasEmail = emailPattern.test(text);
  if (hasEmail) score += 35;

  // Check for phone number
  const phonePattern =
    /\b(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/;
  const hasPhone = phonePattern.test(text);
  if (hasPhone) score += 35;

  // Check for LinkedIn or other social/portfolio links
  const linkPattern =
    /\b(linkedin\.com|github\.com|portfolium\.com|behance\.net|dribbble\.com|personal website|portfolio|www\.)\b/i;
  const hasLinks = linkPattern.test(text);
  if (hasLinks) score += 30;

  return score;
}

// Generate feedback based on scores
function generateFormattingFeedback(score) {
  if (score >= 80) {
    return "Your resume has excellent formatting that is ATS-friendly. It has appropriate length, clear section headings, and consistent spacing.";
  } else if (score >= 60) {
    return "Your resume formatting is generally good. Consider reviewing your section headers and paragraph lengths to make it even more ATS-friendly.";
  } else {
    return "Your resume needs formatting improvements. Make sure you have clear section headings, appropriate length (2 pages max), and consistent spacing throughout.";
  }
}

function generateKeywordsFeedback(score) {
  if (score >= 80) {
    return "Excellent use of relevant keywords. You're likely to pass most ATS filters with this keyword density.";
  } else if (score >= 60) {
    return "Good keyword usage. Consider adding more industry-specific terms relevant to your target position to improve ATS matching.";
  } else {
    return "Your resume could benefit from more relevant keywords. Review job descriptions in your field and incorporate those terms naturally throughout your resume.";
  }
}

function generateExperienceFeedback(score) {
  if (score >= 80) {
    return "Your experience section is well-structured with clear dates, job titles, and accomplishment statements.";
  } else if (score >= 60) {
    return "Your work experience is presented adequately. Try to include more quantifiable achievements and action verbs to strengthen this section.";
  } else {
    return "Your experience section needs improvement. Ensure you have clear job titles, dates, and accomplishment statements that start with strong action verbs.";
  }
}

function generateEducationFeedback(score) {
  if (score >= 80) {
    return "Your education section is well-formatted with degrees, institutions, and graduation dates clearly presented.";
  } else if (score >= 60) {
    return "Your education section is adequate. Consider adding more structure to clearly show your degrees, institutions, and graduation dates.";
  } else {
    return "Your education section needs improvement. Make sure to clearly list your degrees, educational institutions, and graduation dates.";
  }
}

function generateSkillsFeedback(score) {
  if (score >= 80) {
    return "Excellent skills section with a good balance of technical, soft, and industry-specific skills.";
  } else if (score >= 60) {
    return "Good skills presentation. Consider organizing your skills into categories (technical, soft, industry-specific) for better readability.";
  } else {
    return "Your skills section needs enhancement. Create a dedicated skills section and include a mix of technical, soft, and industry-specific skills relevant to your target role.";
  }
}

function generateContactInfoFeedback(score) {
  if (score >= 80) {
    return "Your contact information is complete and well-presented, making it easy for recruiters to reach you.";
  } else if (score >= 60) {
    return "Your contact information is generally good. Consider adding additional professional links such as LinkedIn or a portfolio website.";
  } else {
    return "Improve your contact information section. Ensure you have a professional email, phone number, and LinkedIn profile at minimum.";
  }
}

// Generate recommendations based on scores
function generateRecommendations(categories, resumeText) {
  const recommendations = [];

  // Add category-specific recommendations for scores below 70
  if (categories.formatting < 70) {
    recommendations.push(
      "Improve resume formatting with clear section headings (Experience, Education, Skills) and consistent spacing."
    );
  }

  if (categories.keywords < 70) {
    recommendations.push(
      "Incorporate more industry-relevant keywords throughout your resume to improve ATS compatibility."
    );
  }

  if (categories.experience < 70) {
    recommendations.push(
      "Enhance your experience section with accomplishment statements that start with action verbs and include quantifiable results."
    );
  }

  if (categories.education < 70) {
    recommendations.push(
      "Structure your education section clearly with degree names, institutions, and graduation dates."
    );
  }

  if (categories.skills < 70) {
    recommendations.push(
      "Create a dedicated skills section with relevant technical, soft, and industry-specific skills organized in categories."
    );
  }

  if (categories.contact_info < 70) {
    recommendations.push(
      "Ensure your contact information is complete with email, phone, and professional links such as LinkedIn."
    );
  }

  // Add general recommendations
  if (recommendations.length === 0 || recommendations.length < 3) {
    recommendations.push(
      "Use bullet points for experience and accomplishments rather than paragraphs for better readability."
    );
    recommendations.push(
      "Tailor your resume for each job application by matching keywords from the job description."
    );
    recommendations.push(
      "Keep your resume to 1-2 pages maximum for optimal ATS and recruiter readability."
    );
  }

  return recommendations;
}
