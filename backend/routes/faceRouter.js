const express = require("express");
const { handleSaveFace } = require("../controllers/FaceController");
const faceRouter = express();
faceRouter.post("/upload-face", handleSaveFace);
module.exports = faceRouter;
