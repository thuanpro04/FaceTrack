const express = require("express");
const {
  handleSaveFace,
  handleRecognizeFace,
} = require("../controllers/FaceController");
const faceRouter = express();
faceRouter.post("/upload-face", handleSaveFace);
faceRouter.post("/timkeeping", handleRecognizeFace);
module.exports = faceRouter;
