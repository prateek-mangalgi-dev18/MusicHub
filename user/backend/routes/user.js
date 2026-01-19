const express = require("express");
const auth = require("../middleware/auth");
const controller = require("../controllers/user");

const router = express.Router();

/* ================= AUTH ================= */
router.post("/signup", controller.handleUserSignup);
router.post("/login", controller.handleUserLogin);

/* ================= LIKES ================= */
router.get("/likes", auth, controller.getLikedSongs);
router.post("/like/:songId", auth, controller.toggleLike);

/* ================= PLAYLISTS ================= */
router.get("/playlists", auth, controller.getPlaylists);

router.post("/playlists", auth, controller.createPlaylist);

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



