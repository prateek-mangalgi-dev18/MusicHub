const Music = require("../models/music");
const User = require("../models/user"); 


const uploadSong = async (req, res) => {
  try {
    const { title, artist, movie } = req.body;
    const audioFile = req.files?.file?.[0];
    const imageFile = req.files?.coverImage?.[0];

    if (!title || !artist || !audioFile) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const newSong = new Music({
      title,
      artist,
      movie,
      fileUrl: `http://localhost:1001/uploads/${audioFile.filename}`,
      coverImage: imageFile ? `http://localhost:1001/uploads/${imageFile.filename}` : null,
    });

    await newSong.save();
    res.status(200).json({ message: "Upload successful", song: newSong });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get all songs
async function getAllSongs(req, res) {
  try {
    const songs = await Music.find();
    return res.json({ success: true, songs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch songs." });
  }
}

// Delete a song by ID
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

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    return res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch users." });
  }
}

// Delete a user by ID
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