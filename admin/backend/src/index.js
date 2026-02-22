const express = require("express");
const app = express();
require("dotenv").config();

const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const adminRoutes = require("../routes/admin.js");
const { handleAdminSignup, handleAdminLogin } = require("../controllers/admin.js");
const { connectToMongoDB } = require("./config.js");


const port = process.env.PORT || 1001;


connectToMongoDB(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB (Admin)"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


app.set("view engine", "ejs");


app.use(
  cors({
    origin: ["http://localhost:5173", "https://musichub-admin-x6wd.onrender.com", "https://musichub-live.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));


app.use("/admin", adminRoutes);


app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});


app.post("/signup", handleAdminSignup);
app.post("/login", handleAdminLogin);


app.listen(port, () => {
  console.log(`🚀 Admin backend running on port ${port}`);
});
