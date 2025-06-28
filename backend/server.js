require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const connectDb = require("./config/mongodb");
const port = process.env.PORT || 3001;
const app = express();
const authRouter = require("./routes/AuthRouter");
const faceRouter = require("./routes/faceRouter");
const { scheduleCleanupOldFiles } = require("./controllers/FaceController");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// upload các file tĩnh
// Database connection middleware
app.use(async (req, res, next) => {
  try {
    if (!isDbConnected) {
      console.log("Connecting to database...");
      await connectDb();
      isDbConnected = true;
      console.log("Database connected successfully");

      // Schedule cleanup only once and only in non-production
      scheduleCleanupOldFiles();
    }
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      message: "Database connection failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});
// connectDb();
// // dọn file rac
// scheduleCleanupOldFiles();
app.get("/", (req, res) => {
  res.send("Welcome to FaceTrack API");
});
app.get("/hello", (req, res) => {
  res.json("Welcome to FaceTrack API");
});
app.use("/uploads", express.static("uploads"));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/face", faceRouter);
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
module.exports = app;
