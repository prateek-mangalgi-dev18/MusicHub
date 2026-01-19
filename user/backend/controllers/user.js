const User = require("../models/user");
const bcrypt = require("bcrypt");
const { setUser } = require("../routes/auth");

/* ================= AUTH ================= */

exports.handleUserSignup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "All fields required" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.json({ success: false, message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashed,
    likedSongs: [],
    playlists: [],
  });

  res.json({ success: true });
};

exports.handleUserLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "All fields required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  const token = setUser(user);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // change to true in production
    path: "/",
  });

  res.json({ success: true });
};

/* ================= LIKES ================= */

exports.toggleLike = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const { songId } = req.params;
  const index = user.likedSongs.indexOf(songId);

  if (index === -1) user.likedSongs.push(songId);
  else user.likedSongs.splice(index, 1);

  await user.save();
  res.json({ success: true });
};

exports.getLikedSongs = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(req.user._id).populate("likedSongs");
  res.json(user.likedSongs);
};

/* ================= PLAYLISTS ================= */

exports.getPlaylists = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(req.user._id).populate(
    "playlists.songs"
  );
  res.json(user.playlists);
};

exports.createPlaylist = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name required" });
  }

  const user = await User.findById(req.user._id);

  user.playlists.push({ name, songs: [] });
  await user.save();

  res.json(user.playlists[user.playlists.length - 1]);
};

exports.addSongToPlaylist = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { playlistId, songId } = req.params;
  const user = await User.findById(req.user._id);

  const playlist = user.playlists.id(playlistId);
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  if (!playlist.songs.includes(songId)) {
    playlist.songs.push(songId);
    await user.save();
  }

  res.json({ success: true });
};

exports.removeSongFromPlaylist = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { playlistId, songId } = req.params;
  const user = await User.findById(req.user._id);

  const playlist = user.playlists.id(playlistId);
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  playlist.songs = playlist.songs.filter(
    (id) => id.toString() !== songId
  );

  await user.save();
  res.json({ success: true });
};

exports.deletePlaylist = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { playlistId } = req.params;
  const user = await User.findById(req.user._id);

  user.playlists = user.playlists.filter(
    (p) => p._id.toString() !== playlistId
  );

  await user.save();
  res.json({ success: true });
};


