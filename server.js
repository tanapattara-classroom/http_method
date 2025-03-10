const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Load environment variables
dotenv.config();

// Import routes
const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Serve Swagger documentation
app.get("/swagger.json", (req, res) => {
  const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join(__dirname, "swagger.json"), "utf8")
  );
  res.json(swaggerDocument);
});

// API Documentation route
app.get("/api-docs", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "api-docs", "index.html"));
});

// Routes
app.use("/api/notes", noteRoutes);
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Notes API",
    documentation: `${req.protocol}://${req.get("host")}/api-docs`,
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `API Documentation available at http://localhost:${PORT}/api-docs`
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
