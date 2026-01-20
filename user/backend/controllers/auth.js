const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = "E-com"; // move to env later

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/* ================= SIGNUP ================= */
const handleUserSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashed,
      role: "user",
    });

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
};

/* ================= LOGIN ================= */
const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    // 🔥 SEND TOKEN (NO COOKIE)
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

module.exports = {
  handleUserSignup,
  handleUserLogin,
};


// const User = require('../models/user');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

// const generateToken = (user) => {
//     return jwt.sign({ id: user._id, role: user.role }, 'E-com', { expiresIn: '7d' });
// };

// const handleUserSignup = async (req, res) => {
//     try {
//         const { username, email, password, role } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ username, email, password: hashedPassword, role });

//         await user.save();
//         res.status(201).send('User registered successfully');
//     } catch (error) {
//         res.status(500).send('Error registering user');
//     }
// };

// const handleUserLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });

//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(401).send('Invalid credentials');
//         }

//         const token = generateToken(user);
//         res.cookie("token", token, {
//         httpOnly: true,
//         sameSite: "none",
//         secure: false, // true in production (https)
//         });

        
//         if (user.role === 'admin') {
//             res.redirect('/admin/dashboard');
//         } else {
//             res.redirect('/user/home');
//         }
//     } catch (error) {
//         res.status(500).send('Error logging in');
//     }
// };

// module.exports = { handleUserSignup, handleUserLogin };
