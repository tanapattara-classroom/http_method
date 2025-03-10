// Middleware to validate note data
const validateNote = (req, res, next) => {
  const { title, content } = req.body;
  const errors = [];

  // Validate title
  if (!title) {
    errors.push("Title is required");
  } else if (title.length > 100) {
    errors.push("Title cannot be more than 100 characters");
  }

  // Validate content
  if (!content) {
    errors.push("Content is required");
  }

  // If there are errors, return a 400 response
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  // If validation passes, proceed to the next middleware
  next();
};

module.exports = validateNote;
