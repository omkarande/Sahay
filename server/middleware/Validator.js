// middleware/validator.js
const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  // Validate name
  if (!name || name.trim() === "") {
    errors.push({ field: "name", message: "Name is required" });
  }

  // Validate email
  if (!email) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    errors.push({
      field: "email",
      message: "Please provide a valid email address",
    });
  }

  // Validate password
  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  } else if (password.length < 6) {
    errors.push({
      field: "password",
      message: "Password must be at least 6 characters",
    });
  }

  // Return errors if any
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", errors });
  }

  // Proceed to next middleware
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  // Validate email
  if (!email) {
    errors.push({ field: "email", message: "Email is required" });
  }

  // Validate password
  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  }

  // Return errors if any
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", errors });
  }

  // Proceed to next middleware
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
};
