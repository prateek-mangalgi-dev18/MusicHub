const jwt = require("jsonwebtoken");
const secret = "E-com";

function setUser(user) {
  return jwt.sign(
    { _id: user._id, email: user.email },
    secret,
    { expiresIn: "7d" }
  );
}

function getUser(token) {
  return jwt.verify(token, secret);
}

module.exports = { setUser, getUser };
