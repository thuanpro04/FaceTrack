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
let isDbConnected = false; // Track if the database is connected
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
app.get("/debug-env", (req, res) => {
  const allEnvKeys = Object.keys(process.env);
  const mongoKeys = allEnvKeys.filter(key => 
    key.toLowerCase().includes('mongo') || 
    key.toLowerCase().includes('db') ||
    key.toLowerCase().includes('uri')
  );
  
  res.json({
    totalEnvVars: allEnvKeys.length,
    mongoRelatedKeys: mongoKeys,
    hasMongoUrl: !!process.env.MONGODB_URL,
    hasMongoUri: !!process.env.MONGODB_URI,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    // Hiển thị 5 ký tự đầu của URI nếu có
    mongoPreview: process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.substring(0, 20) + "..." : 
      (process.env.MONGODB_URL ? process.env.MONGODB_URL.substring(0, 20) + "..." : "not found")
  });
});
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
