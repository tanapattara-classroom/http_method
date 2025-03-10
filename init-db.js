// Database initialization script
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import models
const Note = require("./models/Note");
const User = require("./models/User");

// Sample user data
const sampleUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
};

// Sample notes data
const sampleNotes = [
  {
    title: "Meeting Notes",
    content: "Discuss project timeline and resource allocation",
    category: "Work",
    isCompleted: false,
  },
  {
    title: "Shopping List",
    content: "Milk, Eggs, Bread, Cheese, Vegetables",
    category: "Personal",
    isCompleted: false,
  },
  {
    title: "Learning Goals",
    content: "Complete Docker tutorial, Learn GraphQL basics",
    category: "Education",
    isCompleted: false,
  },
];

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    try {
      // Clear existing data
      await User.deleteMany({});
      await Note.deleteMany({});
      console.log("Cleared existing users and notes");

      // Create sample user
      const user = await User.create(sampleUser);
      console.log(`Added sample user: ${user.email}`);

      // Add user reference to notes
      const notesWithUser = sampleNotes.map((note) => ({
        ...note,
        user: user._id,
      }));

      // Insert sample notes
      const insertedNotes = await Note.insertMany(notesWithUser);
      console.log(
        `Added ${insertedNotes.length} sample notes for user: ${user.email}`
      );

      console.log("Database initialization completed successfully");
    } catch (error) {
      console.error("Error initializing database:", error);
    } finally {
      // Close the connection
      mongoose.connection.close();
    }
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
