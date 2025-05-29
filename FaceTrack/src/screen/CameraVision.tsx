// utils/frameUtils.js

// Function để chuyển đổi frame thành format phù hợp
export const convertFrameToImageUri = (frame: any) => {
  // Tùy thuộc vào version của vision-camera, bạn có thể cần:
  // 1. Lưu frame thành file tạm
  // 2. Hoặc chuyển đổi thành base64
  // 3. Hoặc sử dụng frame buffer trực tiếp

  try {
    // Vision Camera v4 approach
    const path = frame.toString(); // hoặc frame.image
    return path;
  } catch (error) {
    console.error('Frame conversion error:', error);
    return null;
  }
};

// Throttle function để tránh xử lý quá nhiều frame
export const createThrottledProcessor = (
  callback: (...args: any[]) => void,
  delay = 500,
) => {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback(...args);
    }
  };
};

// Improved Face Detection Component
import FaceDetection, {Face} from '@react-native-ml-kit/face-detection';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {runOnJS} from 'react-native-reanimated';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';


const CameraVision = () => {
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef<Camera>(null);
  const [faces, setFaces] = useState<Face[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAutoDetecting, setIsAutoDetecting] = useState(true); // Bật auto detection mặc định
  const [detectionStatus, setDetectionStatus] = useState<'no_face' | 'face_detected'>('no_face');

  // Chọn format an toàn
  const selectedFormat = useMemo(() => {
    if (!device?.formats) return undefined;
    
    const simpleFormat = device.formats.find(format => 
      format.videoWidth <= 1280 && 
      format.videoHeight <= 720 &&
      format.maxFps >= 24
    );
    
    return simpleFormat || device.formats[0];
  }, [device]);

  // Convert file path to proper URI format
  const formatFileUri = (filePath: string): string => {
    if (filePath.startsWith('file://') || filePath.startsWith('content://')) {
      return filePath;
    }
    
    if (filePath.startsWith('/')) {
      return `file://${filePath}`;
    }
    
    return `file://${filePath}`;
  };

  // Function detect faces từ ảnh
  const detectFacesFromPhoto = async (photoPath: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const formattedUri = formatFileUri(photoPath);
      
      const detectedFaces: Face[] = await FaceDetection.detect(formattedUri, {
        performanceMode: 'fast',
        landmarkMode: 'none',
        classificationMode: 'none', // Tắt classification để tăng tốc độ
        minFaceSize: 0.1,
        contourMode: 'none',
      });

      setFaces(detectedFaces);
      
      // Cập nhật trạng thái detection
      if (detectedFaces.length > 0) {
        setDetectionStatus('face_detected');
        console.log(`✅ Detected ${detectedFaces.length} face(s)`);
      } else {
        setDetectionStatus('no_face');
        console.log('❌ No face detected');
      }
      
    } catch (error) {
      console.error('Face detection error:', error);
      setDetectionStatus('no_face');
      setFaces([]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto detection với interval ngắn hơn
  useEffect(() => {
    if (!isAutoDetecting || !isActive) return;
    
    const interval = setInterval(async () => {
      if (isProcessing || !cameraRef.current) return;
      
      try {
        const photo: any = await cameraRef.current.takePhoto({
          qualityPrioritization: 'speed',
          flash: 'off',
        });
        
        await detectFacesFromPhoto(photo.path);
        
      } catch (error) {
        console.error('Auto capture error:', error);
        setDetectionStatus('no_face');
        setFaces([]);
      }
    }, 1000); // Mỗi 1 giây capture một lần
    
    return () => clearInterval(interval);
  }, [isAutoDetecting, isActive, isProcessing]);

  // Manual capture
  const handleManualCapture = async () => {
    if (!cameraRef.current || isProcessing) return;
    
    try {
      const photo: any = await cameraRef.current.takePhoto({
        qualityPrioritization: 'balanced',
        flash: 'off',
      });
      
      if (!photo.path) {
        throw new Error('Photo path is empty');
      }
      
      await detectFacesFromPhoto(photo.path);
      
    } catch (error: any) {
      console.error('Manual capture error:', error);
      Alert.alert('Error', `Failed to capture photo: ${error.message}`);
    }
  };

  // Check permissions
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera permission required</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={isActive}
        format={selectedFormat}
        photo={true}
      />
      
      {/* Face Detection Overlay */}
      <View style={styles.overlay}>
        {/* Status Border - Khung màu bao quanh toàn bộ camera */}
        <View style={[
          styles.statusBorder,
          {
            borderColor: detectionStatus === 'face_detected' ? '#00FF00' : '#FF0000',
            borderWidth: 4,
          }
        ]} />
        
        {/* Individual Face Boxes */}
        {faces.map((face, index) => {
          const bounds = face.frame;
          if (!bounds) return null;
          
          return (
            <View
              key={index}
              style={[
                styles.faceBox,
                {
                  left: bounds.left,
                  top: bounds.top,
                  width: bounds.width,
                  height: bounds.height,
                  borderColor: '#00FF00', // Luôn màu xanh khi có face
                  borderWidth: 2,
                }
              ]}
            >
              <Text style={styles.faceLabel}>Face {index + 1}</Text>
            </View>
          );
        })}
        
        {/* Center Status Indicator */}
        <View style={styles.centerStatus}>
          <View style={[
            styles.statusDot,
            {
              backgroundColor: detectionStatus === 'face_detected' ? '#00FF00' : '#FF0000',
            }
          ]} />
          <Text style={[
            styles.statusText,
            {
              color: detectionStatus === 'face_detected' ? '#00FF00' : '#FF0000',
            }
          ]}>
            {detectionStatus === 'face_detected' ? 'FACE DETECTED' : 'NO FACE'}
          </Text>
        </View>
      </View>

      {/* Info panel */}
      <View style={styles.infoContainer}>
        <Text style={[
          styles.counterText,
          {
            color: detectionStatus === 'face_detected' ? '#00FF00' : '#FF0000',
          }
        ]}>
          Status: {detectionStatus === 'face_detected' ? 'FACE DETECTED' : 'NO FACE DETECTED'}
        </Text>
        <Text style={styles.statusText}>
          Faces Count: {faces.length}
        </Text>
        <Text style={styles.statusText}>
          Auto Detection: {isAutoDetecting ? 'ON' : 'OFF'}
        </Text>
        <Text style={styles.statusText}>
          Processing: {isProcessing ? 'YES' : 'NO'}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#007AFF' }]}
          onPress={handleManualCapture}
          disabled={isProcessing}
        >
          <Text style={styles.buttonText}>
            {isProcessing ? 'Processing...' : 'Manual Check'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, { 
            backgroundColor: isAutoDetecting ? '#FF3B30' : '#34C759',
            marginTop: 10 
          }]}
          onPress={() => setIsAutoDetecting(!isAutoDetecting)}
        >
          <Text style={styles.buttonText}>
            {isAutoDetecting ? 'Stop Auto' : 'Start Auto'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, { 
            backgroundColor: '#FF9500',
            marginTop: 10 
          }]}
          onPress={() => {
            setFaces([]);
            setDetectionStatus('no_face');
          }}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBorder: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 200,
    borderRadius: 10,
    borderStyle: 'solid',
  },
  faceBox: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 5,
    borderStyle: 'solid',
  },
  faceLabel: {
    position: 'absolute',
    top: -25,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#FFF',
    fontSize: 12,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  centerStatus: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
});
export default CameraVision;