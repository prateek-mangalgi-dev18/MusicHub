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


// const express = require("express");
// const auth = require("../middleware/auth");
// const controller = require("../controllers/user");

// const router = express.Router();

// /* ================= AUTH ================= */
// router.post("/signup", controller.handleUserSignup);

// router.post("/login", controller.handleUserLogin);

// router.post("/logout", (req, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: true,
//     sameSite: "none",
//     path: "/",
//   });
//   res.json({ success: true });
// });

// /* ================= LIKES ================= */
// router.get("/likes", auth, controller.getLikedSongs);
// router.post("/like/:songId", auth, controller.toggleLike);

// /* ================= PLAYLISTS ================= */
// router.get("/playlists", auth, controller.getPlaylists);
// router.post("/playlists", auth, controller.createPlaylist);

// router.get("/me", auth, (req, res) => {
//   res.json({
//     _id: req.user._id,
//     email: req.user.email,
//   });
// });

// router.post(
//   "/playlists/:playlistId/songs/:songId",
//   auth,
//   controller.addSongToPlaylist
// );

// router.delete(
//   "/playlists/:playlistId/songs/:songId",
//   auth,
//   controller.removeSongFromPlaylist
// );

// router.delete(
//   "/playlists/:playlistId",
//   auth,
//   controller.deletePlaylist
// );

// module.exports = router;
