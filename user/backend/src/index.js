const express = require("express");
const app = express();

require("dotenv").config(); 

const port = process.env.PORT || 1000;

const { connectToMongoDB } = require("./config");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const axios = require("axios");


const songRoutes = require("../routes/songroutes");
const userRoutes = require("../routes/user");
const authRoutes = require("../routes/auth");


connectToMongoDB(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB error", err));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("trust proxy", 1);


const allowedOrigins = [
  "https://musichub-live.vercel.app",
  "https://musichub-gjpr.onrender.com",
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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.options("*", cors());


app.use("/api/songs", songRoutes);
app.use("/api/user", authRoutes);   
app.use("/api/user", userRoutes);   



app.get("/proxy/uploads/:filename", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.AUDIO_SERVER || "http://localhost:1001"}/uploads/${req.params.filename}`,
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


app.listen(port, () =>
  console.log(`🚀 User backend running on http://localhost:${port}`)
);
