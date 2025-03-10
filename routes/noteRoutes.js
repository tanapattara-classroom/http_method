const express = require("express");
const router = express.Router();
const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");
const validateNote = require("../middleware/validateNote");
const protect = require("../middleware/auth");

// Apply authentication middleware to all note routes
router.use(protect);

// GET all notes and POST a new note
router.route("/").get(getAllNotes).post(validateNote, createNote);

// GET, PUT, and DELETE a specific note
router
  .route("/:id")
  .get(getNoteById)
  .put(validateNote, updateNote)
  .delete(deleteNote);

module.exports = router;
