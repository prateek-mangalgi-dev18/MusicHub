const express = require("express");
const upload = require("../middleware/upload");
const { uploadSong } = require("../controllers/music");

const router = express.Router();

// ⬆️ Supports BOTH audio + cover image
router.post(
  "/upload",
  upload.fields([
    { name: "file", maxCount: 1 },        // audio
    { name: "coverImage", maxCount: 1 },  // image
  ]),
  uploadSong
);

module.exports = router;

// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const { uploadSong } = require("../controllers/music");

// const router = express.Router();

// // Setup Multer for file upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// router.post("/upload", upload.single("file"), uploadSong);

// module.exports = router;
