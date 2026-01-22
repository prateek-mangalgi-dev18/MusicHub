const Music = require("../models/music");
const User = require("../models/user");
const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});


const uploadSong = async (req, res) => {
  try {
    const { title, artist, movie } = req.body;
    const audioFile = req.files?.file?.[0];
    const imageFile = req.files?.coverImage?.[0];

    if (!title || !artist || !audioFile) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    
    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video", 
      folder: "musichub/songs",
    });

    
    let imageUrl = null;
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        folder: "musichub/covers",
      });
      imageUrl = imageUpload.secure_url;
    }

    const newSong = new Music({
      title,
      artist,
      movie,
      fileUrl: audioUpload.secure_url, 
      coverImage: imageUrl,             
    });

    await newSong.save();

    res.status(200).json({
      message: "Upload successful",
      song: newSong,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};


async function getAllSongs(req, res) {
  try {
    const songs = await Music.find();
    return res.json({ success: true, songs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch songs." });
  }
}


async function deleteSong(req, res) {
  const { id } = req.params;

  try {
    const deleted = await Music.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Song not found." });
    }

    return res.json({ success: true, message: "Song deleted." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to delete song." });
  }
}


async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    return res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch users." });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.json({ success: true, message: "User deleted." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to delete user." });
  }
}

module.exports = {
  uploadSong,
  getAllSongs,
  deleteSong,
  getAllUsers,
  deleteUser,
};
