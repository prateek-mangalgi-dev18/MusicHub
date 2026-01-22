const express = require("express");
const router = express.Router();
const {
  handleUserSignup,
  handleUserLogin,
} = require("../controllers/auth");

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);

module.exports = router;
