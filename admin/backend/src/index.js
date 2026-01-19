const express = require("express");
const app = express();
require("dotenv").config(); 

const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const adminRoutes = require("../routes/admin.js");
const { handleAdminSignup, handleAdminLogin } = require("../controllers/admin.js");
const { connectToMongoDB } = require("./config.js");

// -------------------- PORT --------------------
const port = process.env.PORT || 1001;

// -------------------- DB --------------------
connectToMongoDB(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB (Admin)"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -------------------- VIEW ENGINE --------------------
app.set("view engine", "ejs");

// -------------------- CORS --------------------
const allowedOrigins = [
  "http://localhost:5174",
  "https://musichub-admin-x6wd.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.options("*", cors());

// -------------------- MIDDLEWARE --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// -------------------- STATIC FILES --------------------
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// -------------------- ROUTES --------------------
app.use("/admin", adminRoutes);

// EJS routes
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// API routes
app.post("/signup", handleAdminSignup);
app.post("/login", handleAdminLogin);

// -------------------- START SERVER --------------------
app.listen(port, () => {
  console.log(`🚀 Admin backend running on port ${port}`);
});
