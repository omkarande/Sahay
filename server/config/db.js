const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully!");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);

    // More detailed error handling
    if (err.name === "MongoServerSelectionError") {
      console.error("Could not connect to MongoDB server. Please check if:");
      console.error("- MongoDB is running on the specified host and port");
      console.error("- Your network allows connections to MongoDB");
    } else if (err.name === "MongoError" && err.code === 18) {
      console.error(
        "Authentication failed. Please check your username and password"
      );
    }

    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
