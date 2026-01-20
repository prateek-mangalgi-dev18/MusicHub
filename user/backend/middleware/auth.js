const jwt = require("jsonwebtoken");
const JWT_SECRET = "E-com";

module.exports = function auth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      _id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};




// const { getUser } = require("../routes/auth");

// module.exports = function auth(req, res, next) {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const user = getUser(token);

//     if (!user || !user._id) {
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     req.user = user; // ✅ THIS WAS MISSING
//     next();
//   } catch (err) {
//     console.error("Auth error:", err.message);
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };
