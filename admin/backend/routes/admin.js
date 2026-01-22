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
    cb(null, "uploads/"); 
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


router.post("/upload", upload.fields([
  { name: "file", maxCount: 1 },          
  { name: "coverImage", maxCount: 1 }     
]), uploadSong);


router.get("/songs", getAllSongs);


router.delete("/songs/:id", deleteSong);


router.get("/users", getAllUsers);


router.delete("/users/:id", deleteUser);

module.exports = router;
