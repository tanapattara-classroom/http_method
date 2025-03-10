const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract token from Bearer token
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      console.log("Access attempt without token");
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log(
        `Token verified for user ID: ${decoded.id}, issued at: ${new Date(
          decoded.iat * 1000
        ).toISOString()}`
      );

      // Find user by id
      const user = await User.findById(decoded.id);

      // Check if user exists
      if (!user) {
        console.log(`User not found for ID: ${decoded.id}`);
        return res.status(401).json({
          success: false,
          message: "User no longer exists",
        });
      }

      // Set user in request
      req.user = user;
      next();
    } catch (error) {
      console.log("Token verification failed:", error.message);

      // Provide more specific error messages
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Your session has expired. Please log in again.",
        });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token. Please log in again.",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    next(error);
  }
};

module.exports = protect;
