require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const app = express();
const authRouter = require("./routes/AuthRouter");
const faceRouter = require("./routes/faceRouter");
const { mongoMiddleware } = require("./middlewares/mongoMiddleware");
const PORT = process.env.PORT || 2403;
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
app.use(mongoMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/face", faceRouter);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// module.exports = app;
