const mongoose = require("mongoose");

const faceAnalysisSchema = new mongoose.Schema(
  {
    imageIndex: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    faceBox: {
      _x: { type: Number, required: true },
      _y: { type: Number, required: true },
      _width: { type: Number, required: true },
      _height: { type: Number, required: true },
    },
    descriptorLength: {
      type: Number,
      required: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    landmarks: {
      type: mongoose.Schema.Types.Mixed, // Lưu landmarks data
      default: null,
    },
  },
  { _id: false }
);
const faceDataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    faceDescriptors: [
      {
        type: [Number],
        required: true,
        validate: {
          validator: function (arr) {
            return arr.length === 128;
          },
          message: "Face descriptor must have exactly 128 dimensions",
        },
      },
    ],
    averageDescriptor: {
      type: [Number],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length === 128;
        },
        message: "Average descriptor must have exactly 128 dimensions",
      },
    },
    faceAnalysis: [faceAnalysisSchema],
    totalImages: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
      default: 4,
    },
    recognitionCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastRecognized: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "face_data",
  }
);

// Indexes để tối ưu query
faceDataSchema.index({ createdAt: -1 });
faceDataSchema.pre("save", function (next) {
  // Kiểm tra faceAnalysis và faceDescriptors
  if (
    !Array.isArray(this.faceAnalysis) ||
    this.faceAnalysis.length !== this.faceDescriptors.length
  ) {
    return next(
      new Error("Number of face analysis must match number of descriptors")
    );
  }

  // Cập nhật updatedAt
  this.updatedAt = new Date();
  next();
});

// Pre-remove middleware để cleanup files
faceDataSchema.pre("remove", function (next) {
  const fs = require("fs");
  this.imageUrls.forEach((imagePath) => {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  });
  next();
});
faceDataSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  // Loại bỏ các trường nhạy cảm
  delete obj.faceDescriptors;
  delete obj.averageDescriptor;
  delete obj.__v;

  return obj;
};
const FaceData = mongoose.model("FaceData", faceDataSchema);
module.exports = FaceData;
