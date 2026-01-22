const express = require("express");
const upload = require("../middleware/upload");
const { uploadSong } = require("../controllers/music");

const router = express.Router();


router.post(
  "/upload",
  upload.fields([
    { name: "file", maxCount: 1 },        
    { name: "coverImage", maxCount: 1 },  
  ]),
  uploadSong
);

module.exports = router;


