const User = require("../models/User");

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = user.generateAuthToken();

    // Send response
    res.status(201).json({
      success: true,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user by email and include password field
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Log the login timestamp
    console.log(`User logged in: ${user.email} at ${new Date().toISOString()}`);

    // Generate token
    const token = user.generateAuthToken();

    // Send response
    res.status(200).json({
      success: true,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      message:
        "Login successful. Token will expire in " + process.env.JWT_EXPIRES_IN,
    });
  } catch (error) {
    next(error);
  }
};

// Get current user (for testing protected routes)
exports.getCurrentUser = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// Refresh token (optional - for future implementation)
exports.refreshToken = async (req, res, next) => {
  try {
    // Generate a new token for the current user
    const token = req.user.generateAuthToken();

    res.status(200).json({
      success: true,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    next(error);
  }
};
