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
  SafeAreaView,
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
import {
  ContainerComponent,
  SpaceComponent,
  TextComponent,
} from '../../components/layout';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import FaceDetection, {Face} from '@react-native-ml-kit/face-detection';
import {imageServices} from '../../services/imageService';
import RecognizingModal from './Components/RecognizingModal';
import OvalFace from './Components/OvalFace';
import {showNotificating} from '../../utils/ShowNotification';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/slices/authSlice';

const {width, height} = Dimensions.get('window');

const FaceRecognitionScreen = ({navigation}: any) => {
  const [cameraPosition, setCameraPosition] = useState('front');
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFace, setIsFace] = useState(false);
  const [image, setImage] = useState('');
  const {hasPermission} = useCameraPermission();
  const frontDevice = useCameraDevice('front');
  const backDevice = useCameraDevice('back');
  const currentDevice = cameraPosition === 'front' ? frontDevice : backDevice;
  const user = useSelector(authSelector);
  const cameraRef = useRef<Camera>(null);
  // Animations
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const frameAnimation = useRef(new Animated.Value(0)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;
  //độ phân giải và 30 khung ảnh/ 1s
  const format = useCameraFormat(currentDevice, [
    {photoResolution: {height: 854, width: 640}, fps: 30},
  ]);

  // onChange camera
  const toggleCamera = () => {
    setCameraPosition(prev => (prev === 'front' ? 'back' : 'front'));
    setIsCameraActive(false);
    setTimeout(() => setIsCameraActive(true), 300);
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const options: any = {
        qualityPrioritization: 'speed',
        flash: 'off',
      };
      const photo = await cameraRef.current.takePhoto(options);
      const result = await imageServices.checkDetectFacesFromPhoto(photo.path);
      if (result) {
        setIsFace(true);
        setImage(photo.path);
      } else {
        setIsFace(false);
      }
    } catch (error: any) {
      console.log('error: ', error.message);
    }
  };
  const handleRecognizeFace = async () => {
    try {
      setIsLoading(true);
      const response = await imageServices.timekeepingStaff(user._id, image);
      // Log toàn bộ response object
      console.log('📋 Full Response Object:', response);
      console.log('📋 Response Status:', response?.status);
      console.log('📋 Response Data:', response?.data);
      console.log('📋 Response Success:', response?.data?.success);
      if (response && response.data) {
        showNotificating.activity(
          'success',
          'Thành công',
          'Bạn đã chấm công thành công.',
        );
        console.log('Face Data: ', response.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('Timekeeping staff error: ', error);
      showNotificating.activity(
        'error',
        'Thất bại',
        'Chấm công thất bại. Vui lòng thực hiện lại !!',
      );
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!isCameraActive) return;
    const interval = setInterval(async () => {
      await takePicture();
    }, 2000);
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
    <SafeAreaView style={styles.container}>
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
      />

      {/* Dark overlay */}
      <View style={styles.overlay} />
      <View style={{bottom: 28}}>
        <OvalFace borderColor={isFace ? '#00d4ff' : '#004466'} />
      </View>
      {/* Face Detection Overlay */}
      <Animated.View style={[styles.faceOverlay, {opacity: fadeAnimation}]}>
        {/* Face Frame with animated corners */}
        <View style={styles.faceFrame}>
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
                backgroundColor: isFace ? '#00d4ff' : '#004466',
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
          <MaterialIcons
            name="face"
            size={24}
            color={isFace ? '#00d4ff' : '#0077aa'}
          />
          <TextComponent
            label="Đặt khuôn mặt vào khung và giữ yên"
            styles={styles.instructionText}
          />
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
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={toggleCamera}
          activeOpacity={0.7}>
          <Ionicons name="camera-reverse" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Recognition Overlay */}
      {isLoading && <RecognizingModal isLoading={isLoading} />}
      {/* Bottom Controls */}
      {isCameraActive && (
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={[styles.captureBtn, isLoading && styles.captureBtnDisabled]}
            onPress={handleRecognizeFace}
            disabled={!isFace}
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
          <SpaceComponent height={22} />
        </View>
      )}
    </SafeAreaView>
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

  crosshair: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -20}, {translateY: -20}],
  },

  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 4,
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
