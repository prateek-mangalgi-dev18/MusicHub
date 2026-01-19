const express = require("express");
const app = express();
const port = 1000;

const { connectToMongoDB } = require("./config");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const axios = require("axios");

// ✅ FIXED PATHS (IMPORTANT)
const songRoutes = require("../routes/songroutes");
const userRoutes = require("../routes/user");

// -------------------- DB --------------------
connectToMongoDB("mongodb://localhost:27017/rr")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB error", err));

// -------------------- MIDDLEWARE --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", // Next.js frontend
    credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// -------------------- API ROUTES --------------------
app.use("/api/songs", songRoutes);
app.use("/api/user", require("../routes/user"));


// -------------------- AUDIO PROXY --------------------
app.get("/proxy/uploads/:filename", async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:1001/uploads/${req.params.filename}`,
      { responseType: "stream" }
    );

    res.set({
      "Content-Type": response.headers["content-type"],
      "Content-Length": response.headers["content-length"],
      "Cache-Control": "public, max-age=31536000",
    });

    response.data.pipe(res);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).send("Error fetching audio");
  }
});

// -------------------- START --------------------
app.listen(port, () =>
  console.log(`🚀 User backend running on http://localhost:${port}`)
);


