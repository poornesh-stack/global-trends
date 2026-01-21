const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const requireAuth = async (req, res, next) => {
  // Get token from header
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  // Extract token (format: "Bearer TOKEN")
  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Authorization token malformed",
    });
  }

  try {
    // Verify token
    const { _id } = jwt.verify(token, process.env.SECRET);

    // Find user and exclude password
    // Select more fields than just _id for better functionality
    req.user = await User.findById(_id).select("-password");

    // Check if user exists
    if (!req.user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    next();
  } catch (error) {
    // Distinguish between different types of JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token has expired. Please login again.",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token",
      });
    } else {
      return res.status(401).json({
        error: "Request is not authorized",
      });
    }
  }
};

module.exports = requireAuth;
