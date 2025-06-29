const express = require("express");
const {
  handleSaveFace,
  handleRecognizeFace,
} = require("../controllers/FaceController");
const faceRouter = express();
faceRouter.post("/face", handleSaveFace);
faceRouter.post("/timkeeping", handleRecognizeFace);
module.exports = faceRouter;
