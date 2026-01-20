const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ TEMP DIRECTORY (Render-safe)
const tempDir = path.join(__dirname, "..", "temp");

// Ensure temp directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// ---------------- MULTER CONFIG ----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir); // ⬅️ temporary storage only
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// ---------------- FILE FILTER ----------------
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("audio/") ||
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// ---------------- EXPORT ----------------
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

module.exports = upload;


// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (file.fieldname === 'audio') {
//       cb(null, 'uploads/audio/');
//     } else if (file.fieldname === 'coverImage') {
//       cb(null, 'uploads/covers/');
//     }
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

// module.exports = upload;
