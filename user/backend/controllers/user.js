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

const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔥 GENERATE TOKEN
    const token = generateToken(user);

    // ✅ SEND TOKEN IN RESPONSE (THIS WAS MISSING)
    res.status(200).json({
      success: true,
      token, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};


// exports.handleUserLogin = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.json({ success: false, message: "All fields required" });
//   }

//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.json({ success: false, message: "Invalid credentials" });
//   }

//   const ok = await bcrypt.compare(password, user.password);
//   if (!ok) {
//     return res.json({ success: false, message: "Invalid credentials" });
//   }

//   const token = setUser(user);

//   res.cookie("token", token, {
//     httpOnly: true,
//     sameSite: "",
//     secure: false,
//     path: "/",
//   });

//   res.json({
//     success: true,
//     user: { _id: user._id, email: user.email },
//   });
// };

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
  res.json(user.likedSongs);
};

/* ================= PLAYLISTS ================= */

exports.getPlaylists = async (req, res) => {
  const user = await User.findById(req.user._id).populate("playlists.songs");
  res.json(user.playlists);
};

exports.createPlaylist = async (req, res) => {
  const { name } = req.body;
  const user = await User.findById(req.user._id);

  user.playlists.push({ name, songs: [] });
  await user.save();

  res.json(user.playlists[user.playlists.length - 1]);
};

exports.addSongToPlaylist = async (req, res) => {
  const { playlistId, songId } = req.params;
  const user = await User.findById(req.user._id);

  const playlist = user.playlists.id(playlistId);
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
