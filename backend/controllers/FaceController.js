const faceapi = require("face-api.js");
const canvas = require("canvas");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const CryptoJS = require("crypto-js");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const FaceData = require("../models/FaceData");
const { getUserById } = require("./AuthController");
const { Canvas, Image, ImageData } = canvas;
// Cấu hình Canvas cho face-api.js
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
let modelsLoaded = false;
const loadModels = async () => {
  if (modelsLoaded) return;
  try {
    const modelsPath = path.resolve(__dirname, "../models/faceModels");

    // Load từng model riêng và xử lý lỗi
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath);
      console.log("Loaded ssdMobilenetv1");
    } catch (e) {
      console.error("Error loading ssdMobilenetv1:", e);
    }

    try {
      await faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath);
      console.log("Loaded faceLandmark68Net");
    } catch (e) {
      console.error("Error loading faceLandmark68Net:", e);
    }

    try {
      await faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath);
      console.log("Loaded faceRecognitionNet");
    } catch (e) {
      console.error("Error loading faceRecognitionNet:", e);
    }

    modelsLoaded = true;
  } catch (error) {
    console.error("Error loading models:", error);
    throw error;
  }
};
// Hàm decrypt image data được cải thiện
const decryptImageData = (encryptedData) => {
  try {
    console.log("=== DECRYPT DEBUG ===");
    console.log("Input type:", typeof encryptedData);
    console.log("Input value:", encryptedData);

    // Kiểm tra input chi tiết
    if (!encryptedData) {
      throw new Error("Encrypted data is null or undefined");
    }

    if (typeof encryptedData !== "string") {
      console.error("Expected string but got:", typeof encryptedData);
      console.error("Value:", JSON.stringify(encryptedData));
      throw new Error(
        `Invalid encrypted data format - expected string, got ${typeof encryptedData}`
      );
    }

    if (encryptedData.length === 0) {
      throw new Error("Encrypted data is empty string");
    }

    const decryptionKey = process.env.ENCRYPTION_KEY ?? "thuanne";
    console.log("Attempting to decrypt with key:", decryptionKey);
    console.log("Encrypted data length:", encryptedData.length);
    console.log("Encrypted data preview:", encryptedData.substring(0, 100));

    // Thử decrypt
    let decryptBytes;
    try {
      decryptBytes = CryptoJS.AES.decrypt(encryptedData, decryptionKey);
    } catch (cryptoError) {
      console.error("CryptoJS decrypt error:", cryptoError);
      throw new Error(
        "Failed to decrypt with CryptoJS: " + cryptoError.message
      );
    }

    const decryptedBase64 = decryptBytes.toString(CryptoJS.enc.Utf8);

    console.log("Decrypted data length:", decryptedBase64.length);
    console.log("Decrypted data preview:", decryptedBase64.substring(0, 100));

    if (!decryptedBase64 || decryptedBase64.length === 0) {
      throw new Error(
        "Failed to decrypt - empty result. Check encryption key or data format"
      );
    }

    // Kiểm tra format base64z
    if (!decryptedBase64.startsWith("data:image/")) {
      console.log("Warning: Decrypted data doesn't start with data:image/");
      // Có thể data đã là base64 thuần túy
      if (decryptedBase64.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
        return "data:image/jpeg;base64," + decryptedBase64;
      }
    }

    return decryptedBase64;
  } catch (error) {
    console.error("=== DECRYPT ERROR ===");
    console.error("Error message:", error.message);
    console.error("Input type:", typeof encryptedData);
    console.error(
      "Input length:",
      encryptedData ? encryptedData.length : "null"
    );
    console.error(
      "Input preview:",
      encryptedData ? encryptedData.toString().substring(0, 100) : "null"
    );

    throw new Error("Failed to decrypt image data: " + error.message);
  }
};

// Hàm xử lý base64 không mã hóa (fallback)
const processUnencryptedBase64 = (base64Data) => {
  try {
    // Nếu đã có header data:image/
    if (base64Data.startsWith("data:image/")) {
      return base64Data;
    }

    // Nếu là base64 thuần túy
    if (base64Data.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
      return "data:image/jpeg;base64," + base64Data;
    }

    throw new Error("Invalid base64 format");
  } catch (error) {
    throw new Error("Failed to process unencrypted base64: " + error.message);
  }
};

// Hàm chuyển base64 thành file (đã cập nhật)
const base64ToFile = async (imageData, fileName) => {
  try {
    if (!imageData) {
      throw new Error("Image data is null or undefined");
    }
    if (typeof imageData !== "string") {
      throw new Error(
        `Expected string but received ${typeof imageData}. Value: ${JSON.stringify(
          imageData
        )}`
      );
    }
    // Kiểm tra nếu data là file path thay vì base64
    if (
      imageData.startsWith("file://") ||
      imageData.includes("/cache/") ||
      imageData.includes(".jpg")
    ) {
      throw new Error(
        "Received file path instead of base64 data. Frontend needs to read file content."
      );
    }
    console.log("Input data length:", imageData.length);
    let processedBase64;

    // Kiểm tra nếu đã là base64 thuần túy (không mã hóa)
    if (imageData.startsWith("data:image/")) {
      console.log("Data appears to be unencrypted base64");
      processedBase64 = imageData;
    } else {
      // Thử decrypt trước
      try {
        console.log("Attempting to decrypt image data...");
        processedBase64 = decryptImageData(imageData);
        console.log("Successfully decrypted image data");
      } catch (decryptError) {
        console.log("Decryption failed, trying unencrypted base64...");
        // Nếu decrypt thất bại, thử xử lý như base64 thường
        try {
          processedBase64 = processUnencryptedBase64(imageData);
          console.log("Successfully processed as unencrypted base64");
        } catch (base64Error) {
          console.error("Both decryption and base64 processing failed");
          throw new Error(
            `Failed to process image data. Decrypt error: ${decryptError.message}. Base64 error: ${base64Error.message}`
          );
        }
      }
    }

    // Loại bỏ header data:image/...;base64,
    const base64String = processedBase64.replace(
      /^data:image\/[a-z]+;base64,/,
      ""
    );

    if (!base64String || base64String.length === 0) {
      throw new Error("Invalid base64 data after processing");
    }

    // Kiểm tra tính hợp lệ của base64
    if (!base64String.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
      throw new Error("Invalid base64 format");
    }

    const buffer = Buffer.from(base64String, "base64");

    if (buffer.length === 0) {
      throw new Error("Empty buffer after base64 conversion");
    }

    const uploadDir = path.join(__dirname, "../uploads/faces");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    console.log(
      `Successfully saved image: ${fileName}, size: ${buffer.length} bytes`
    );
    return filePath;
  } catch (error) {
    console.error("Error converting base64 to file:", error);
    throw new Error("Failed to process image data: " + error.message);
  }
};
const processFaceImage = async (imagePath) => {
  try {
    const processedImagePath = imagePath.replace(".jpg", "_processed.jpg");
    await sharp(imagePath)
      .resize(640, 640, { fit: "cover" })
      .jpeg({ quality: 85 })
      .toFile(processedImagePath);
    const img = await canvas.loadImage(processedImagePath);
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();
    // Xóa ảnh gốc (an toàn)
    try {
      await fs.promises.unlink(imagePath);
      console.log("Original image deleted:", imagePath);
    } catch (err) {
      console.warn("Can't delete original image:", err.message);
    }

    // Nếu không detect được face
    if (!detection) {
      try {
        if (fs.existsSync(processedImagePath)) {
          await fs.promises.unlink(processedImagePath);
        }
      } catch (err) {
        console.warn("Can't delete processed image:", err.message);
      }
      return null;
    }

    // Xóa processed image sau khi dùng nếu không cần lưu
    try {
      await fs.promises.unlink(processedImagePath);
    } catch (err) {
      console.warn("Can't delete processed image:", err.message);
    }
    return {
      descriptor: Array.from(detection.descriptor),
      imagePath: processedImagePath,
      faceBox: detection.detection.box,
      landmarks: detection.landmarks,
    };
  } catch (error) {
    console.error("Error in processFaceImage:", error);

    // Xóa cả hai file nếu có lỗi
    const filesToDelete = [imagePath, processedImagePath];

    for (const file of filesToDelete) {
      try {
        if (
          await fs.promises
            .access(file)
            .then(() => true)
            .catch(() => false)
        ) {
          await fs.promises.unlink(file);
          console.log("Cleanup - deleted file:", file);
        }
      } catch (err) {
        console.error("Error during cleanup:", err);
      }
    }

    throw error;
  }
};
// Hàm tính descriptor trung bình
const calculateAverageDescriptor = (descriptors) => {
  if (descriptors.length === 0) return null;
  const descriptorLength = descriptors[0].length;
  const average = new Array(descriptorLength).fill(0);
  descriptors.forEach((descriptor) => {
    descriptor.forEach((value, index) => {
      average[index] += value;
    });
  });
  return average.map((sum) => sum / descriptors.length);
};

const getUserFaceTrack = async (id) => {
  return await FaceData.findOne({ user: id });
};
exports.handleSaveFace = async (req, res) => {
  try {
    const { userId, fullName, images } = req.body;
    console.log(userId, fullName, images);

    if (!userId || !fullName) {
      return res.status(400).json({
        message: "UserId and fullName are required",
      });
    }
    if (!images || !Array.isArray(images) || images.length !== 4) {
      return res.status(400).json({
        message: "Exactly 4 image are required",
      });
    }
    await loadModels();

    // Kiểm tra user có tồn tại không
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Kiểm tra user đã có face data chưa
    const existingFaceData = await getUserFaceTrack(userId);
    console.log("Existing Face Data: ", existingFaceData);

    if (existingFaceData) {
      return res.status(200).json({
        message: "Face data already exists for this user",
        data: existingFaceData,
      });
    }
    const faceDescriptors = [];
    const imageUrls = [];
    const faceAnalysis = [];
    console.log(`Processing ${images.length} images for user: ${fullName}`);
    for (let i = 0; i < images.length; i++) {
      try {
        console.log(`Processing image ${i + 1}/4...`);
        // Tạo tên file unique
        const fileName = `${userId}_${uuidv4()}_${Date.now()}.jpg`;
        // Chuyển base64 thành file
        const imagePath = await base64ToFile(images[i].toString(), fileName);
        // Xử lý và phân tích khuôn mặt
        const faceResult = await processFaceImage(imagePath);
        if (!faceResult) {
          imageUrls.forEach((url) => {
            if (fs.existsSync(url)) fs.unlinkSync(url);
          });
          return res.status(400).json({
            message: `No face detected in image ${i + 1}`,
          });
        }
        faceDescriptors.push(faceResult.descriptor);
        imageUrls.push(faceResult.imagePath);
        console.log("Face box: ", faceResult.faceBox, 1234);

        faceAnalysis.push({
          imageIndex: i + 1,
          faceBox: faceResult.faceBox,
          descriptorLength: faceResult.descriptor.length,
        });
        console.log(`Image ${i + 1} processed successfully`);
      } catch (error) {
        console.error(`Error processing image ${i + 1}:`, error);

        // Cleanup files on error
        imageUrls.forEach((url) => {
          if (fs.existsSync(url)) fs.unlinkSync(url);
        });

        return res.status(500).json({
          message: `Failed to process image ${i + 1}`,
        });
      }
    }
    const averageDescriptor = calculateAverageDescriptor(faceDescriptors);
    if (!averageDescriptor) {
      return res.status(400).json({
        message: "Failed to calculate average descriptor",
      });
    }

    const faceData = {
      user: userId,
      faceDescriptors: faceDescriptors,
      averageDescriptor: averageDescriptor,
      faceAnalysis: faceAnalysis.map((analysis) => ({
        imageIndex: analysis.imageIndex,
        faceBox: analysis.faceBox,
        descriptorLength: analysis.descriptorLength,
      })),
      totalImages: images.length,
    };
    // Kiểm tra faceDescriptors và imageUrls
    console.log("faceDescriptors.length:", faceDescriptors.length);
    console.log("imageUrls.length:", imageUrls.length);
    if (faceDescriptors.length !== imageUrls.length) {
      return res.status(422).json({
        message: "Number of face descriptors must match number of images",
      });
    }

    const newFaceData = new FaceData(faceData);
    await newFaceData.save();
    res.status(200).json({
      success: true,
      message: "Face data saved successfully",
      data: {
        user: userId,
        fullName: fullName,
        totalImages: faceDescriptors.length,
        descriptorLength: averageDescriptor.length,
        imageUrls: imageUrls.map((url) => path.basename(url)), // Chỉ trả về tên file
        faceAnalysis: faceAnalysis,
        createdAt: faceData.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in handleSaveFace:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
};
exports.handleRecognizeFace = async (req, res) => {
  const { image, userId } = req.body;
  console.log({ image, userId });

  if (!image || !userId) {
    return res.status(400).json({
      success: false,
      error: "Image and userId is required",
    });
  }
  try {
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found !!",
      });
    }
    const existingFaceData = await getUserFaceTrack(userId);
    if (!existingFaceData) {
      return res.status(404).json({
        message: "User not found face ID",
      });
    }
    await loadModels();
    const fileName = `recognize_${uuidv4()}_${Date.now()}.jpg`;
    const imagePath = await base64ToFile(image.toString(), fileName);
    const faceResult = await processFaceImage(imagePath);
    if (!faceResult) {
      return res.status(400).json({
        success: false,
        error: "No face detected in image",
      });
    }
    const inputDescriptor = faceResult.descriptor;
    // Lấy tất cả face data từ database
    let bestMatch = null;
    let bestDistance = Infinity;
    const threshold = 0.6; // Ngưỡng nhận diện
    const distance = faceapi.euclideanDistance(
      inputDescriptor,
      existingFaceData.averageDescriptor
    );
    if (distance < bestDistance && distance < threshold) {
      bestDistance = distance;
      bestMatch = {
        userId: existingFaceData.user._id,
        fullName: existingFaceData.user.fullName,
        confidence: (1 - distance) * 100,
        distance: distance,
      };
    }
    const processedImagePath = faceResult.imagePath;
    console.log("Face processed successfully", distance);
    await cleanupFiles([imagePath, processedImagePath]);
    res.status(200).json({
      success: true,
      message: "Face processed successfully",
      data: {
        faceDetected: true,
        descriptorLength: inputDescriptor.length,
        faceBox: faceResult.faceBox,
      },
      // recognized: bestMatch ? true : false,
      // user: bestMatch
    });
  } catch (error) {
    console.error("Error in handleRecognizeFace:", error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
};
const cleanupFiles = async (filePaths) => {
  const filesToClean = filePaths.filter(
    (path) => path && typeof path === "string"
  );

  for (const filePath of filesToClean) {
    try {
      // Đợi một chút để đảm bảo file không còn bị lock
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const fileExists = await fs.promises
        .access(filePath)
        .then(() => true)
        .catch(() => false);

      if (fileExists) {
        await fs.promises.unlink(filePath);
        console.log(`✅ Successfully deleted file: ${filePath}`);
      } else {
        console.log(`ℹ️ File not found (already deleted): ${filePath}`);
      }
    } catch (error) {
      // Chỉ log warning cho EPERM, không coi là lỗi nghiêm trọng
      if (error.code === 'EPERM') {
        console.warn(`⚠️ File is in use, will be cleaned up later: ${path.basename(filePath)}`);
      } else {
        console.error(`❌ Cannot delete file ${filePath}:`, error.message);
      }
    }
  }
};

// Thêm cleanup job định kỳ để dọn các file cũ
exports.scheduleCleanupOldFiles = () => {
  setInterval(async () => {
    try {
      const uploadDir = path.join(__dirname, "../uploads/faces");
      const files = await fs.promises.readdir(uploadDir);
      const now = Date.now();
      
      for (const file of files) {
        if (file.startsWith('recognize_')) {
          const filePath = path.join(uploadDir, file);
          const stats = await fs.promises.stat(filePath);
          
          // Xóa files cũ hơn 1 giờ
          if (now - stats.mtime.getTime() > 60 * 60 * 1000) {
            try {
              await fs.promises.unlink(filePath);
              console.log(`🧹 Cleaned up old file: ${file}`);
            } catch (error) {
              console.warn(`⚠️ Cannot cleanup old file ${file}:`, error.message);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in scheduled cleanup:', error);
    }
  }, 30 * 60 * 1000); // Chạy mỗi 30 phút
};
