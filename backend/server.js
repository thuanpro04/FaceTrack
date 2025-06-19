require("dotenv").config();
const express = require("express");
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
app.use("/uploads", express.static("uploads"));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/face", faceRouter);
connectDb();
//dọn file rac
scheduleCleanupOldFiles();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
