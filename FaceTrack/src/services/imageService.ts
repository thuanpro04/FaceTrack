import FaceDetection, {Face} from '@react-native-ml-kit/face-detection';
import CryptoJS from 'react-native-crypto-js';
import RNFS from 'react-native-fs';
import axiosInstance from '../api/axiosInstance';
import {API_PATHS} from '../api/apiPaths';

const formatFileUri = (filePath: string) => {
  if (filePath.startsWith('file://') || filePath.startsWith('content://')) {
    return filePath;
  }
  if (filePath.startsWith('/')) {
    return `file://${filePath}`;
  }
  return `file://${filePath}`;
};
const detectFacesFromPhotoStep1 = async (photoPath: string) => {
  try {
    const formattedUri = formatFileUri(photoPath);
    const detectedFaces: Face[] = await FaceDetection.detect(formattedUri, {
      performanceMode: 'fast', // so sánh nhanh
      landmarkMode: 'none', // tắt nhận dạng mắt mũi...
      classificationMode: 'all', // phân loại biểu cảm
      minFaceSize: 0.1, // khuôn mặt chiếm 10%/ảnh
      contourMode: 'none', // đường viền khuôn mặt
    });
    // Lọc ra các khuôn mặt “bình thường”
    const normalFaces = detectedFaces.filter(
      face =>
        (face.smilingProbability ?? 0) < 0.2 &&
        (face.leftEyeOpenProbability ?? 1) > 0.8 &&
        (face.rightEyeOpenProbability ?? 1) > 0.8 &&
        Math.abs(face.rotationY ?? 0) < 10 &&
        Math.abs(face.rotationX ?? 0) < 10 &&
        Math.abs(face.rotationZ ?? 0) < 10,
    );

    if (normalFaces.length == 0) {
      console.log('Vui lòng nhìn thẳng vào màng hình và giữ yên.');
      return {
        status: 404,
        message: 'Vui lòng nhìn thẳng vào màng hình và giữ yên.',
      };
    }
    console.log('Detected face: ', normalFaces);
    return {
      status: 200,
      data: normalFaces,
      message: 'Step 1 success',
    };
  } catch (error) {
    console.error('Face detection error:', error);
  }
};
const detectFacesFromPhotoStep2 = async (photoPath: string) => {
  try {
    const formattedUri = formatFileUri(photoPath);
    const detectedFaces: Face[] = await FaceDetection.detect(formattedUri, {
      performanceMode: 'fast',
      landmarkMode: 'none',
      classificationMode: 'all',
      minFaceSize: 0.1,
      contourMode: 'none',
    });

    // Lọc ra các khuôn mặt nghiêng trái
    const leftTiltedFaces = detectedFaces.filter(
      face =>
        (face.rotationY ?? 0) <= -15 &&
        (face.rotationY ?? 0 <= -45) &&
        Math.abs(face.rotationX ?? 0) < 10 &&
        Math.abs(face.rotationZ ?? 0) < 10 &&
        (face.leftEyeOpenProbability ?? 1) > 0.8 &&
        (face.rightEyeOpenProbability ?? 1) > 0.8,
    );

    if (leftTiltedFaces.length === 0) {
      return {
        status: 400,
        message: 'Vui lòng nghiêng đầu sang trái một chút và giữ yên.',
      };
    }

    return {
      status: 200,
      data: leftTiltedFaces,
      message: 'Step 2 success',
    };
  } catch (error) {
    console.error('Face detection error:', error);
    return {
      status: 500,
      message: 'Có lỗi xảy ra khi kiểm tra khuôn mặt.',
    };
  }
};
const detectFacesFromPhotoStep3 = async (photoPath: string) => {
  try {
    const formattedUri = formatFileUri(photoPath);
    const detectedFaces: Face[] = await FaceDetection.detect(formattedUri, {
      performanceMode: 'fast',
      landmarkMode: 'none',
      minFaceSize: 0.1,
      contourMode: 'none',
    });
    const rightTiltedFaces = detectedFaces.filter(
      face =>
        // Góc nghiêng Y từ 15 đến 45 độ (nghiêng trái)
        (face.rotationY ?? 0) >= 15 &&
        (face.rotationY ?? 0) <= 45 &&
        // Đảm bảo không nghiêng lên xuống quá nhiều
        Math.abs(face.rotationX ?? 0) < 10 &&
        // Đảm bảo đầu không xoay
        Math.abs(face.rotationZ ?? 0) < 10 &&
        // Mắt vẫn mở
        (face.leftEyeOpenProbability ?? 1) > 0.8 &&
        (face.rightEyeOpenProbability ?? 1) > 0.8,
    );
    if (rightTiltedFaces.length === 0) {
      return {
        status: 400,
        message: 'Vui lòng nghiêng đầu sang phải một chút và giữ yên.',
      };
    }

    return {
      status: 200,
      data: rightTiltedFaces,
      message: 'Step 3 success',
    };
  } catch (error) {
    console.error('Face detection error:', error);
    return {
      status: 500,
      message: 'Có lỗi xảy ra khi kiểm tra khuôn mặt.',
    };
  }
};
const detectFacesFromPhotoStep4 = async (photoPath: string) => {
  try {
    const formattedUri = formatFileUri(photoPath);
    const detecctedFaces: Face[] = await FaceDetection.detect(formattedUri, {
      performanceMode: 'fast',
      landmarkMode: 'none',
      classificationMode: 'all',
      minFaceSize: 0.1,
      contourMode: 'none',
      
    });
    const smilingFaces = detecctedFaces.filter(
      face =>
        (face.smilingProbability ?? 0) > 0.8 &&
        Math.abs(face.rotationY ?? 0) < 10 &&
        Math.abs(face.rotationX ?? 0) < 10 &&
        Math.abs(face.rotationZ ?? 0) < 10 &&
        (face.leftEyeOpenProbability ?? 1) > 0.7 &&
        (face.rightEyeOpenProbability ?? 1) > 0.7,
    );
    if (smilingFaces.length === 0) {
      return {
        status: 400,
        message: 'Vui lòng mỉm cười tự nhiên và nhìn thẳng vào camera.',
      };
    }

    return {
      status: 200,
      data: smilingFaces,
      message: 'Step 4 success',
    };
  } catch (error) {
    console.error('Face detection error:', error);
    return {
      status: 500,
      message: 'Có lỗi xảy ra khi kiểm tra khuôn mặt.',
    };
  }
};
const encryptImageToBase64 = async (imagePath: string) => {
  try {
    const imageBase64 = await RNFS.readFile(imagePath, 'base64');
    // Mã hóa chuỗi base64
    const encrypted = CryptoJS.AES.encrypt(
      imageBase64,
      process.env.ENCRYPTION_KEY ?? 'thuanne',
    ).toString();
    return encrypted;
  } catch (error) {
    console.log('Encryption error:', error);
    throw error;
  }
};
const decryptBase64Image = (encryptedData: string) => {
  try {
    // Giải mã
    const decrypted = CryptoJS.AES.decrypt(
      encryptedData,
      process.env.ENCRYPTION_KEY ?? 'thuanne',
    );
    const originalBase64 = decrypted.toString(CryptoJS.enc.Utf8);
    return originalBase64;
  } catch (error) {
    console.log('Decryption error:', error);
    throw error;
  }
};
const ActionSaveFace = async (data: any) => {
  try {
    return await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_FACE, data);
  } catch (error) {
    console.log('Save face error: ', error);
  }
};
export const imageServices = {
  formatFileUri,
  detectFacesFromPhotoStep1,
  detectFacesFromPhotoStep2,
  detectFacesFromPhotoStep3,
  detectFacesFromPhotoStep4,
  encryptImageToBase64,
  decryptBase64Image,
  ActionSaveFace,
};
