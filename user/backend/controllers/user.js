const User = require("../models/user");
const bcrypt = require("bcrypt");


/* ================= LIKES ================= */

exports.toggleLike = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { songId } = req.params;

  const index = user.likedSongs.indexOf(songId);
  if (index === -1) user.likedSongs.push(songId);
  else user.likedSongs.splice(index, 1);

  await user.save();
  res.json({ success: true });
};

exports.getLikedSongs = async (req, res) => {
  const user = await User.findById(req.user._id).populate("likedSongs");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.likedSongs || []);
};

/* ================= PLAYLISTS ================= */

exports.getPlaylists = async (req, res) => {
  const user = await User.findById(req.user._id).populate("playlists.songs");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.playlists || []);
};

exports.createPlaylist = async (req, res) => {
  const { name } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.playlists.push({ name, songs: [] });
  await user.save();

  res.json(user.playlists[user.playlists.length - 1]);
};

exports.addSongToPlaylist = async (req, res) => {
  const { playlistId, songId } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const playlist = user.playlists.id(playlistId);
  if (!playlist) return res.status(404).json({ message: "Playlist not found" });

  if (!playlist.songs.includes(songId)) {
    playlist.songs.push(songId);
    await user.save();
  }

  res.json({ success: true });
};

exports.removeSongFromPlaylist = async (req, res) => {
  const { playlistId, songId } = req.params;
  const user = await User.findById(req.user._id);

  const playlist = user.playlists.id(playlistId);
  playlist.songs = playlist.songs.filter(
    (id) => id.toString() !== songId
  );

  await user.save();
  res.json({ success: true });
};

exports.deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const user = await User.findById(req.user._id);

  user.playlists = user.playlists.filter(
    (p) => p._id.toString() !== playlistId
  );

  await user.save();
  res.json({ success: true });
};
