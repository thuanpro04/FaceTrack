import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PermissionsPage from './PermissionsPage';
import NoCameraDeviceError from './NoCameraDeviceError';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';
import {TextComponent} from '../../components/layout';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import FaceDetection, {Face} from '@react-native-ml-kit/face-detection';

const {width, height} = Dimensions.get('window');

const FaceRecognitionScreen = ({navigation}: any) => {
  const [cameraPosition, setCameraPosition] = useState('front');
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recognitionProgress, setRecognitionProgress] = useState(0);
  const [faces, setFaces] = useState<Face[]>([]);
  const [detectionStatus, setDetectionStatus] = useState('');
  const {hasPermission} = useCameraPermission();
  const frontDevice = useCameraDevice('front');
  const backDevice = useCameraDevice('back');
  const currentDevice = cameraPosition === 'front' ? frontDevice : backDevice;
  const cameraRef = useRef<Camera>(null);

  // Animations
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const frameAnimation = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;
  //độ phân giải và 30 khung ảnh/ 1s
  const format = useCameraFormat(currentDevice, [
    {photoResolution: 'max', fps: 30},
  ]);
  // bật đèn
  const toggleTorch = () => {
    setTorchEnabled(!torchEnabled);
  };
  // onChange camera
  const toggleCamera = () => {
    setCameraPosition(prev => (prev === 'front' ? 'back' : 'front'));
    setIsCameraActive(false);
    setTimeout(() => setIsCameraActive(true), 300);
  };

  const simulateRecognition = () => {
    setIsRecognizing(true);
    setRecognitionProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setRecognitionProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsRecognizing(false);
            setRecognitionProgress(0);
            // Here you would navigate to success screen
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  };

  const takePicture = () => {
    if (!isLoading && !isRecognizing) {
      simulateRecognition();
    }
  };
  const formatFileUri = (filePath: string) => {
    if (filePath.startsWith('file://') || filePath.startsWith('content://')) {
      return filePath;
    }
    if (filePath.startsWith('/')) {
      return `file://${filePath}`;
    }
    return `file://${filePath}`;
  };
  const detectFacesFromPhoto = async (photoPath: string) => {
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
        setDetectionStatus('Vui lòng nhìn thẳng vào màng hình và giữ yên.');
        console.log('Vui lòng nhìn thẳng vào màng hình và giữ yên.');
        return;
      }
      setFaces(normalFaces);
      console.log('Detected face: ', normalFaces);
    } catch (error) {
      console.error('Face detection error:', error);
    }
  };

  useEffect(() => {
    if (!isCameraActive) return;
    const interval = setInterval(async () => {
      if (!cameraRef.current) return;
      try {
        const options: any = {
          qualityPrioritization: 'speed',
          flash: 'off',
        };
        const photo = await cameraRef.current.takePhoto(options);
        await detectFacesFromPhoto(photo.path);
      } catch (error: any) {
        console.log('error: ', error.message);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isCameraActive]);
  // Animation effects
  useEffect(() => {
    if (isCameraActive) {
      // Scanning line animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnimation, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnimation, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Frame pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(frameAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(frameAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Glow effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      scanAnimation.stopAnimation();
      frameAnimation.stopAnimation();
      glowAnimation.stopAnimation();
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isCameraActive]);

  useEffect(() => {
    if (hasPermission && currentDevice) {
      setIsCameraActive(true);
    }
  }, [hasPermission, currentDevice]);

  if (!hasPermission) return <PermissionsPage />;
  if (currentDevice == null) return <NoCameraDeviceError />;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e']}
        style={StyleSheet.absoluteFill}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      />

      {/* Camera */}
      <Camera
        isActive={isCameraActive}
        ref={cameraRef}
        style={[StyleSheet.absoluteFill, {opacity: 0.8}]}
        device={currentDevice}
        photo
        enableZoomGesture
        format={format}
        torch={torchEnabled ? 'on' : 'off'}
      />

      {/* Dark overlay */}
      <View style={styles.overlay} />

      {/* Face Detection Overlay */}
      <Animated.View style={[styles.faceOverlay, {opacity: fadeAnimation}]}>
        {/* Face Frame with animated corners */}
        <View style={styles.faceFrame}>
          {/* Animated corners */}
          <Animated.View
            style={[
              styles.corner,
              styles.topLeft,
              {
                opacity: frameAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
                transform: [
                  {
                    scale: frameAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1.05],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.corner,
              styles.topRight,
              {
                opacity: frameAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.corner,
              styles.bottomLeft,
              {
                opacity: frameAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.corner,
              styles.bottomRight,
              {
                opacity: frameAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              },
            ]}
          />

          {/* Center crosshair */}
          <View style={styles.crosshair}>
            <Animated.View
              style={[
                styles.crosshairHorizontal,
                {
                  opacity: glowAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ]}
            />
            <Animated.View
              style={[
                styles.crosshairVertical,
                {
                  opacity: glowAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ]}
            />
          </View>

          {/* Scanning line */}
          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [
                  {
                    translateY: scanAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, width * 0.9],
                    }),
                  },
                ],
                opacity: scanAnimation.interpolate({
                  inputRange: [0, 0.1, 0.9, 1],
                  outputRange: [0, 1, 1, 0],
                }),
              },
            ]}
          />
        </View>

        {/* Instruction */}
        <Animated.View
          style={[
            styles.instructionContainer,
            {
              transform: [
                {
                  scale: pulseAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.98, 1.02],
                  }),
                },
              ],
            },
          ]}>
          <MaterialIcons name="face" size={24} color="#00d4ff" />
          <Text style={styles.instructionText}>
            Đặt khuôn mặt vào khung và giữ yên
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity
          style={[styles.controlBtn, styles.closeBtn]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>

        <View style={styles.topRightControls}>
          {currentDevice === backDevice && (
            <TouchableOpacity
              style={[
                styles.controlBtn,
                torchEnabled && styles.activeControlBtn,
              ]}
              onPress={toggleTorch}
              activeOpacity={0.7}>
              <Ionicons
                name={torchEnabled ? 'flashlight' : 'flashlight-outline'}
                size={24}
                color={torchEnabled ? '#FFD700' : 'white'}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.controlBtn}
            onPress={toggleCamera}
            activeOpacity={0.7}>
            <Ionicons name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Recognition Overlay */}
      {isRecognizing && (
        <View style={styles.recognitionOverlay}>
          <LinearGradient
            colors={['rgba(0, 212, 255, 0.1)', 'rgba(0, 0, 0, 0.9)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.recognitionContent}>
            <View style={styles.progressContainer}>
              <Animated.View
                style={[
                  styles.progressRing,
                  {
                    transform: [
                      {
                        rotate: progressAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <View style={styles.progressCenter}>
                <MaterialIcons name="face" size={40} color="#00d4ff" />
                <Text style={styles.progressText}>{recognitionProgress}%</Text>
              </View>
            </View>

            <Text style={styles.recognitionText}>
              Đang nhận diện khuôn mặt...
            </Text>
            <Text style={styles.recognitionSubtext}>
              Vui lòng giữ yên trong giây lát
            </Text>
          </View>
        </View>
      )}

      {/* Bottom Controls */}
      {isCameraActive && !isRecognizing && (
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={[styles.captureBtn, isLoading && styles.captureBtnDisabled]}
            onPress={takePicture}
            disabled={isLoading}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#00d4ff', '#0099cc', '#006699']}
              style={styles.captureBtnGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <View style={styles.captureBtnContent}>
                  <MaterialIcons name="fingerprint" size={32} color="white" />
                  <Text style={styles.captureText}>Chấm Công</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.captureHint}>
            Nhấn để chụp ảnh và xác thực khuôn mặt
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  faceOverlay: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  faceFrame: {
    width: width * 0.9,
    height: width,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderColor: '#00d4ff',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  crosshair: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -20}, {translateY: -20}],
  },
  crosshairHorizontal: {
    width: 40,
    height: 3,
    backgroundColor: '#00d4ff',
    position: 'absolute',
    top: 18.5,
    shadowColor: '#00d4ff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  crosshairVertical: {
    width: 3,
    height: 40,
    backgroundColor: '#00d4ff',
    position: 'absolute',
    left: 18.5,
    shadowColor: '#00d4ff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 4,
    backgroundColor: '#00d4ff',
    shadowColor: '#00d4ff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 50,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  topControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  topRightControls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeControlBtn: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
  },
  closeBtn: {
    backgroundColor: 'rgba(220, 20, 60, 0.8)',
    borderColor: 'rgba(220, 20, 60, 0.5)',
  },
  recognitionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  recognitionContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 40,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  progressContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    borderTopColor: '#00d4ff',
  },
  progressCenter: {
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    color: '#00d4ff',
    fontSize: 18,
    fontWeight: '700',
  },
  recognitionText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  recognitionSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 20,
  },
  captureBtn: {
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#00d4ff',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  captureBtnGradient: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 30,
    minWidth: 220,
  },
  captureBtnDisabled: {
    opacity: 0.6,
  },
  captureBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  captureText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  captureHint: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
  },
});
export default FaceRecognitionScreen;
