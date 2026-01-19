const express = require("express");
const auth = require("../middleware/auth");
const controller = require("../controllers/user");

const router = express.Router();

/* ================= AUTH ================= */
router.post("/signup", controller.handleUserSignup);
router.post("/login", controller.handleUserLogin);
router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ success: true });
});

/* ================= LIKES ================= */
router.get("/likes", auth, controller.getLikedSongs);
router.post("/like/:songId", auth, controller.toggleLike);

/* ================= PLAYLISTS ================= */
router.get("/playlists", auth, controller.getPlaylists);

router.post("/playlists", auth, controller.createPlaylist);

router.get("/me", auth, (req, res) => {
  res.json({
    _id: req.user._id,
    email: req.user.email,
  });
});


router.post(
  "/playlists/:playlistId/songs/:songId",
  auth,
  controller.addSongToPlaylist
);

router.delete(
  "/playlists/:playlistId/songs/:songId",
  auth,
  controller.removeSongFromPlaylist
);

router.delete(
  "/playlists/:playlistId",
  auth,
  controller.deletePlaylist
);

module.exports = router;



