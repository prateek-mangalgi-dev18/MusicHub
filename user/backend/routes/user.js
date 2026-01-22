const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/user");

router.post("/like/:songId", auth, userController.toggleLike);
router.get("/likes", auth, userController.getLikedSongs);

router.get("/playlists", auth, userController.getPlaylists);
router.post("/playlists", auth, userController.createPlaylist);
router.post(
  "/playlists/:playlistId/songs/:songId",
  auth,
  userController.addSongToPlaylist
);
router.delete(
  "/playlists/:playlistId/songs/:songId",
  auth,
  userController.removeSongFromPlaylist
);
router.delete(
  "/playlists/:playlistId",
  auth,
  userController.deletePlaylist
);

module.exports = router;

