// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import keys from "../config/key";
// import User, { IUser } from "../models/User";

// export interface CustomRequest extends Request {
//   user?: {
//     id: string;
//   };
// }

// interface JwtPayload {
//   id: string;
// }

// // Protect routes
// export const protect = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     // Get token from Bearer token in header
//     token = req.headers.authorization.split(" ")[1];
//   }

//   // Check if token exists
//   if (!token) {
//     res.status(401).json({ error: "Not authorized to access this route" });
//     return;
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, keys.jwtSecret) as JwtPayload;

//     // Get user from the token
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       res.status(401).json({ error: "Not authorized to access this route" });
//       return;
//     }

//     // Add user to request
//     req.user = {
//       id: user._id.toString(),
//     };

//     next();
//   } catch (error) {
//     res.status(401).json({ error: "Not authorized to access this route" });
//   }
// };

// middleware/auth.js
// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   // Get token from header
//   const token =
//     req.header("x-auth-token") ||
//     req.header("Authorization")?.replace("Bearer ", "");

//   // Check if no token
//   if (!token) {
//     return res.status(401).json({ error: "No token, authorization denied" });
//   }

//   // Verify token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ error: "Token is not valid" });
//   }
// };
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ error: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ error: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
