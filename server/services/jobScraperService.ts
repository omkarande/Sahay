// import fs from "fs";
// import pdfParse from "pdf-parse";

// interface ParsedEducation {
//   current_level?: string;
//   institution?: string;
//   field?: string;
//   graduation_year?: string;
//   cgpa?: string;
// }

// interface ParsedSkill {
//   name: string;
//   level: string;
// }

// interface ParsedLanguage {
//   name: string;
//   proficiency: string;
// }

// interface ParsedPersonalInfo {
//   name?: string;
//   email?: string;
//   phone?: string;
//   location?: string;
// }

// interface ParsedResumeData {
//   personal_information: ParsedPersonalInfo;
//   education: ParsedEducation;
//   technical_skills: ParsedSkill[];
//   soft_skills: ParsedSkill[];
//   languages: ParsedLanguage[];
// }

// /**
//  * Parses a resume PDF file and extracts structured information
//  */
// export const parseResume = async (
//   filePath: string
// ): Promise<ParsedResumeData> => {
//   // Read the PDF file
//   const dataBuffer = fs.readFileSync(filePath);
//   const data = await pdfParse(dataBuffer);
//   const text = data.text;

//   // Initialize results object
//   const result: ParsedResumeData = {
//     personal_information: {},
//     education: {},
//     technical_skills: [],
//     soft_skills: [],
//     languages: [],
//   };

//   // Extract personal information
//   result.personal_information = extractPersonalInfo(text);

//   // Extract education information
//   result.education = extractEducation(text);

//   // Extract skills
//   const { technicalSkills, softSkills } = extractSkills(text);
//   result.technical_skills = technicalSkills;
//   result.soft_skills = softSkills;

//   // Extract languages
//   result.languages = extractLanguages(text);

//   return result;
// };

// /**
//  * Extract personal information from resume text
//  */
// function extractPersonalInfo(text: string): ParsedPersonalInfo {
//   const info: ParsedPersonalInfo = {};

//   // Extract email
//   const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
//   const emailMatches = text.match(emailRegex);
//   if (emailMatches && emailMatches.length > 0) {
//     info.email = emailMatches[0];
//   }

//   // Extract phone number
//   const phoneRegex =
//     /(\+?[0-9]{10,15}|\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/g;
//   const phoneMatches = text.match(phoneRegex);
//   if (phoneMatches && phoneMatches.length > 0) {
//     info.phone = phoneMatches[0];
//   }

//   // Extract name - typically at the top of resume
//   // This is a simplistic approach - might need refinement
//   const lines = text.split("\n").filter((line) => line.trim() !== "");
//   if (lines.length > 0) {
//     const potentialName = lines[0].trim();
//     // Only use if this doesn't look like a header
//     if (
//       potentialName &&
//       !potentialName.toLowerCase().includes("resume") &&
//       !potentialName.toLowerCase().includes("cv")
//     ) {
//       info.name = potentialName;
//     }
//   }

//   // Extract location (city, state/country)
//   const locationPatterns = [
//     /([A-Za-z]+[ \t]*,[ \t]*[A-Za-z]{2})/g, // City, State
//     /([A-Za-z]+[ \t]*,[ \t]*[A-Za-z]+)/g, // City, Country
//   ];

//   for (const pattern of locationPatterns) {
//     const matches = text.match(pattern);
//     if (matches && matches.length > 0) {
//       info.location = matches[0];
//       break;
//     }
//   }

//   return info;
// }

// /**
//  * Extract education information from resume text
//  */
// function extractEducation(text: string): ParsedEducation {
//   const education: ParsedEducation = {};

//   // Extract degree/education level
//   const educationLevelPatterns = [
//     /Bachelor['']?s|B\.?A\.?|B\.?S\.?|B\.?Tech/i,
//     /Master['']?s|M\.?A\.?|M\.?S\.?|M\.?Tech/i,
//     /Ph\.?D\.?|Doctorate/i,
//     /High School|Secondary/i,
//   ];

//   const degreeMap: Record<string, string> = {
//     bachelor: "bachelors",
//     "b.a": "bachelors",
//     "b.s": "bachelors",
//     "b.tech": "bachelors",
//     master: "masters",
//     "m.a": "masters",
//     "m.s": "masters",
//     "m.tech": "masters",
//     "ph.d": "phd",
//     doctorate: "phd",
//     "high school": "high-school",
//     secondary: "high-school",
//   };

//   for (const pattern of educationLevelPatterns) {
//     const match = text.match(pattern);
//     if (match && match.length > 0) {
//       const found = match[0].toLowerCase();
//       // Map to our standardized values
//       for (const key in degreeMap) {
//         if (found.includes(key)) {
//           education.current_level = degreeMap[key];
//           break;
//         }
//       }
//       if (education.current_level) break;
//     }
//   }

//   // Extract institution
//   // Look for lines after "education" or "university" keywords
//   const lines = text.split("\n");
//   let educationSection = false;

//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i].trim();

//     if (
//       line.toLowerCase().includes("education") ||
//       line.toLowerCase().includes("qualification")
//     ) {
//       educationSection = true;
//       continue;
//     }

//     if (educationSection) {
//       // Check for university/college/institution names
//       if (
//         line.match(/university|college|institute|school/i) &&
//         line.length > 10
//       ) {
//         education.institution = line;
//         break;
//       }
//     }
//   }

//   // Extract graduation year
//   const yearRegex = /(20[0-9]{2}|19[0-9]{2})/g;
//   const yearMatches = text.match(yearRegex);
//   if (yearMatches && yearMatches.length > 0) {
//     education.graduation_year = yearMatches[yearMatches.length - 1]; // Get the most recent year
//   }

//   // Extract CGPA/GPA
//   const cgpaRegex = /CGPA|GPA:?\s*(\d+\.\d+|\d+\/\d+)/i;
//   const cgpaMatch = text.match(cgpaRegex);
//   if (cgpaMatch && cgpaMatch.length > 1) {
//     education.cgpa = cgpaMatch[1];
//   }

//   // Extract field of study
//   const fieldPatterns = [
//     /major in ([^\n.,]+)/i,
//     /degree in ([^\n.,]+)/i,
//     /specialization in ([^\n.,]+)/i,
//   ];

//   for (const pattern of fieldPatterns) {
//     const match = text.match(pattern);
//     if (match && match.length > 1) {
//       education.field = match[1].trim();
//       break;
//     }
//   }

//   return education;
// }

// /**
//  * Extract skills from resume text
//  */
// function extractSkills(text: string): {
//   technicalSkills: ParsedSkill[];
//   softSkills: ParsedSkill[];
// } {
//   const technicalSkills: ParsedSkill[] = [];
//   const softSkills: ParsedSkill[] = [];

//   // Common technical skills to look for
//   const techSkillsToFind = [
//     "JavaScript",
//     "TypeScript",
//     "Python",
//     "Java",
//     "C#",
//     "C++",
//     "Ruby",
//     "PHP",
//     "HTML",
//     "CSS",
//     "React",
//     "Angular",
//     "Vue",
//     "Node.js",
//     "Express",
//     "MongoDB",
//     "SQL",
//     "PostgreSQL",
//     "MySQL",
//     "Oracle",
//     "AWS",
//     "Azure",
//     "Docker",
//     "Kubernetes",
//     "Git",
//     "REST API",
//     "GraphQL",
//     "Linux",
//     "Machine Learning",
//     "AI",
//     "Data Science",
//     "TensorFlow",
//     "PyTorch",
//   ];

//   // Common soft skills to look for
//   const softSkillsToFind = [
//     "Communication",
//     "Teamwork",
//     "Leadership",
//     "Problem Solving",
//     "Critical Thinking",
//     "Creativity",
//     "Time Management",
//     "Adaptability",
//     "Collaboration",
//     "Presentation",
//     "Negotiation",
//     "Conflict Resolution",
//     "Project Management",
//     "Emotional Intelligence",
//     "Customer Service",
//   ];

//   // Search for skills in specific section first
//   const lines = text.split("\n");
//   let skillsSection = false;
//   let skillsLines: string[] = [];

//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i].trim().toLowerCase();

//     if (
//       line.includes("skills") ||
//       line.includes("technical skills") ||
//       line.includes("expertise")
//     ) {
//       skillsSection = true;
//       continue;
//     }

//     if (skillsSection && line !== "") {
//       skillsLines.push(lines[i]);

//       // End of skills section detection (can be improved)
//       if (
//         line.includes("education") ||
//         line.includes("experience") ||
//         line.includes("projects")
//       ) {
//         skillsSection = false;
//       }
//     }
//   }

//   // Helper function to determine skill level from context
//   const determineSkillLevel = (skill: string, context: string): string => {
//     const lowercaseContext = context.toLowerCase();
//     if (
//       lowercaseContext.includes(`advanced ${skill.toLowerCase()}`) ||
//       lowercaseContext.includes(`expert in ${skill.toLowerCase()}`) ||
//       lowercaseContext.includes(`${skill.toLowerCase()} expert`)
//     ) {
//       return "Expert";
//     } else if (
//       lowercaseContext.includes(`proficient in ${skill.toLowerCase()}`) ||
//       lowercaseContext.includes(`${skill.toLowerCase()} proficient`)
//     ) {
//       return "Advanced";
//     } else if (
//       lowercaseContext.includes(`intermediate ${skill.toLowerCase()}`) ||
//       lowercaseContext.includes(`${skill.toLowerCase()} intermediate`)
//     ) {
//       return "Intermediate";
//     } else {
//       return "Beginner";
//     }
//   };

//   // Search for technical skills in the whole text
//   for (const skill of techSkillsToFind) {
//     const skillRegex = new RegExp(skill, "i");
//     if (skillRegex.test(text)) {
//       technicalSkills.push({
//         name: skill,
//         level: determineSkillLevel(skill, text),
//       });
//     }
//   }

//   // Search for soft skills
//   for (const skill of softSkillsToFind) {
//     const skillRegex = new RegExp(skill, "i");
//     if (skillRegex.test(text)) {
//       softSkills.push({
//         name: skill,
//         level: determineSkillLevel(skill, text),
//       });
//     }
//   }

//   return { technicalSkills, softSkills };
// }

// /**
//  * Extract languages from resume text
//  */
// function extractLanguages(text: string): ParsedLanguage[] {
//   const languages: ParsedLanguage[] = [];
//   const commonLanguages = [
//     "English",
//     "Spanish",
//     "French",
//     "German",
//     "Chinese",
//     "Japanese",
//     "Hindi",
//     "Arabic",
//     "Russian",
//     "Portuguese",
//     "Italian",
//     "Korean",
//     "Dutch",
//     "Swedish",
//     "Hebrew",
//     "Turkish",
//     "Polish",
//     "Thai",
//     "Vietnamese",
//   ];

//   // Look for languages section
//   const lines = text.split("\n");
//   let languageSection = false;
//   let languageSectionText = "";

//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i].trim().toLowerCase();

//     if (line.includes("language") || line.includes("languages")) {
//       languageSection = true;
//       continue;
//     }

//     if (languageSection && line !== "") {
//       languageSectionText += line + " ";

//       // End of language section detection
//       if (
//         line.includes("skills") ||
//         line.includes("education") ||
//         line.includes("experience")
//       ) {
//         languageSection = false;
//       }
//     }
//   }

//   // First try to find languages in the language section
//   if (languageSectionText !== "") {
//     for (const language of commonLanguages) {
//       const langRegex = new RegExp(language, "i");
//       if (langRegex.test(languageSectionText)) {
//         // Try to determine proficiency from context
//         let proficiency = "Intermediate"; // Default

//         const context = languageSectionText.toLowerCase();
//         if (
//           context.includes(`native ${language.toLowerCase()}`) ||
//           context.includes(`${language.toLowerCase()} native`) ||
//           context.includes(`mother tongue`)
//         ) {
//           proficiency = "Native";
//         } else if (
//           context.includes(`fluent in ${language.toLowerCase()}`) ||
//           context.includes(`${language.toLowerCase()} fluent`) ||
//           context.includes(`advanced ${language.toLowerCase()}`)
//         ) {
//           proficiency = "Advanced";
//         } else if (
//           context.includes(`basic ${language.toLowerCase()}`) ||
//           context.includes(`${language.toLowerCase()} basic`) ||
//           context.includes(`elementary ${language.toLowerCase()}`)
//         ) {
//           proficiency = "Basic";
//         }

//         languages.push({
//           name: language,
//           proficiency,
//         });
//       }
//     }
//   }

//   // If no languages found in specific section, try the whole document
//   if (languages.length === 0) {
//     for (const language of commonLanguages) {
//       const langRegex = new RegExp(language, "i");
//       if (langRegex.test(text)) {
//         languages.push({
//           name: language,
//           proficiency: "Intermediate", // Default when context is unknown
//         });
//       }
//     }
//   }

//   return languages;
// }
