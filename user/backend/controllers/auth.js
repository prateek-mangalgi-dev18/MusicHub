const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/* ================= TOKEN ================= */

const JWT_SECRET = "E-com"; // 🔴 In real production, move this to process.env.JWT_SECRET

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
    const { username, email, password, role } = req.body;

    // basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

/* ================= LOGIN ================= */

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

    const token = generateToken(user);

    // ✅ PRODUCTION-SAFE COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // ✅ REQUIRED on HTTPS (Render)
      sameSite: "none",    // ✅ REQUIRED for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ DO NOT REDIRECT — SPA expects JSON
    res.status(200).json({
      success: true,
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
