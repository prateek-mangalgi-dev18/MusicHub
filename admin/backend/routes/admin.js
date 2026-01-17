const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  uploadSong,
  getAllSongs,
  deleteSong,
  getAllUsers,
  deleteUser,
} = require("../controllers/music");

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only audio and image files are allowed.'));
    }
  }
});

// Route: Upload song with image
router.post("/upload", upload.fields([
  { name: "file", maxCount: 1 },          // audio file
  { name: "coverImage", maxCount: 1 }     // image file
]), uploadSong);

// Route: Get all songs
router.get("/songs", getAllSongs);

// Route: Delete song
router.delete("/songs/:id", deleteSong);

// Route: Get all users
router.get("/users", getAllUsers);

// Route: Delete user
router.delete("/users/:id", deleteUser);

module.exports = router;
