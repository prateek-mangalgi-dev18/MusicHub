const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Music" }],
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Music" }],

    playlists: [playlistSchema], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);


