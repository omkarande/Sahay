const { spawn } = require("child_process");
const path = require("path");

const extractResumeDetails = (resumeFilePath) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", [
      path.join(__dirname, "../services/AutofillResume.py"),
      resumeFilePath,
    ]);

    let data = "";
    let error = "";

    pythonProcess.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    pythonProcess.stderr.on("data", (chunk) => {
      error += chunk.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${error}`));
      } else {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (err) {
          reject(new Error("Failed to parse Python script output"));
        }
      }
    });
  });
};

module.exports = extractResumeDetails;
