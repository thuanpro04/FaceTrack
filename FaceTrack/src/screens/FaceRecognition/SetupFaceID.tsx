import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Image,
  Text,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import {
  ContainerComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../components/layout';
import appColors from '../../constants/appColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {appSize} from '../../constants/appSize';
import FaceOverLay from './Components/FaceOverLay';
import RenderProgressRing from './Components/RenderProgressRing';
import CaptureButton from './Components/CaptureButton';
import PreviewThumbnail from './Components/PreviewThumbnail';
import {imageServices} from '../../services/imageService';
import {showNotificating} from '../../utils/ShowNotification';
import {useSelector} from 'react-redux';
import {authSelector} from '../../redux/slices/authSlice';
import RecognizingModal from './Components/RecognizingModal';
interface ImageInfo {
  userId: string;
  fullName: string;
  images: any[];
}
const faceSteps = [
  {
    id: 0,
    title: 'Nhìn thẳng vào camera',
    subtitle: 'Giữ đầu thẳng và nhìn vào camera',
    icon: 'face',
    color: appColors.primary,
  },
  {
    id: 1,
    title: 'Nghiêng đầu sang trái',
    subtitle: 'Từ từ nghiêng đầu về phía trái',
    icon: 'sentiment-satisfied-alt',
    color: '#FF6BE3',
  },
  {
    id: 2,
    title: 'Nghiêng đầu sang phải',
    subtitle: 'Từ từ nghiêng đầu về phía phải',
    icon: 'sentiment-satisfied-alt',
    color: '#4ECDC4',
  },
  {
    id: 3,
    title: 'Nở một nụ cười',
    subtitle: 'Hãy mỉm cười tự nhiên',
    icon: 'sentiment-satisfied',
    color: '#FFD93D',
  },
];

const SetupFaceID = ({navigation}: any) => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [lastPhoto, setLastPhoto] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [completedSteps, setCompletedSteps] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const auth = useSelector(authSelector);
  const cameraRef = useRef<any>(null);
  const frontCamera = useCameraDevice('front');
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  // Animation values

  const instructionFadeAnim = useRef(new Animated.Value(1)).current;

  const actionResultFace = async (result: any, photo: any) => {
    if (result?.status === 200) {
      // Move to next step or finish
      if (currentStep < faceSteps.length - 1) {
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          Animated.timing(instructionFadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            Animated.timing(instructionFadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }).start();
          });
        }, 1000);
      } // Đảm bảo mảng luôn có 4 phần tử
      setLastPhoto(prev => {
        const newImages = Array(4).fill(null); // Khởi tạo mảng với 4 phần tử null
        // Copy các giá trị cũ
        prev.forEach((val, idx) => {
          newImages[idx] = val;
        });
        // Thêm ảnh mới
        newImages[currentStep] = `file://${photo.path}`;
        return newImages;
      });

      const newCompletedSteps = [...completedSteps];
      newCompletedSteps[currentStep] = true;
      setCompletedSteps(newCompletedSteps);

      if (currentStep === faceSteps.length - 1) {
        setIsLoading(true);
        const encryptedImages = await Promise.all(
          lastPhoto.map(item => imageServices.encryptImageToBase64(item)),
        );

        const faceInfo: ImageInfo = {
          userId: auth._id,
          fullName: auth.fullName,
          images: encryptedImages,
        };
        console.log('Face ID setup completed!', faceInfo);
        const response = await imageServices.ActionSaveFace(faceInfo);
        if (response && response.data) {
          console.log('res: ', response.data);

          setIsLoading(false);
          navigation.navigate('home');
          showNotificating.activity(
            'success',
            'Thành công',
            'Face ID setup completed!',
          );
        }
        //  else {
        //   navigation.goBack();
        //   showNotificating.activity(
        //     'error',
        //     'Thất bại',
        //     'Face ID setup failed!',
        //   );
        // }
        setIsLoading(false);
      }
    } else {
      console.log(result?.message);
      showNotificating.activity('error', 'Thất bại', result.message);
      setIsLoading(false);
    }
  };

  const onPressCheckPhoto = async (step: number, photoPath: string) => {
    let result;
    switch (step) {
      case 0:
        // Kiểm tra khuôn mặt thẳng
        result = await imageServices.detectFacesFromPhotoStep1(photoPath);
        break;
      case 1:
        // Kiểm tra khuôn mặt nghiêng trái
        result = await imageServices.detectFacesFromPhotoStep2(photoPath);
        break;
      case 2:
        // Kiểm tra khuôn mặt nghiêng phải
        result = await imageServices.detectFacesFromPhotoStep3(photoPath);
        break;
      case 3:
        // Kiểm tra khuôn mặt cười
        result = await imageServices.detectFacesFromPhotoStep4(photoPath);
        break;
      default:
        result = {status: 400, message: 'Bước chụp không hợp lệ'};
    }
    return result;
  };

  const handleTakePhoto = async () => {
    if (cameraRef.current && isCameraReady && !isCapturing) {
      try {
        setIsCapturing(true);
        const photo = await cameraRef.current.takePhoto({
          quality: 0.8,
          skipMetadata: true,
          enableAutoStabilization: true,
          flash: 'off',
          enableShutterSound: false,
          orientation: 'portrait',
        });

        const photoPath = photo.path;
        const result = await onPressCheckPhoto(currentStep, photoPath);
        actionResultFace(result, photo);
        // console.log('Photo taken:', photo);
      } catch (error) {
        console.error('Error taking photo:', error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  useEffect(() => {
    if (isHolding) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval.current!);
            setIsHolding(false);
            handleTakePhoto();
            return 0;
          }
          return prev + 3;
        });
      }, 50);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      setProgress(0);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isHolding]);
  const formatCamera = useCameraFormat(frontCamera, [
    {
      photoResolution: {width: 640, height: 640},
    },
    {
      fps: 30,
    },
  ]);
  return (
    <ContainerComponent styles={styles.container}>
      <View style={styles.cameraContainer}>
        {frontCamera && (
          <>
            <Camera
              format={formatCamera}
              ref={cameraRef}
              style={styles.camera}
              device={frontCamera}
              isActive={true}
              photo={true}
              onInitialized={() => setIsCameraReady(true)}
            />
            <FaceOverLay
              faceSteps={faceSteps}
              completedSteps={completedSteps}
              currentStep={currentStep}
            />
            {
              <PreviewThumbnail
                currentStep={currentStep}
                lastPhoto={lastPhoto[currentStep - 1]}
              />
            }
            {/* Enhanced Capture Button */}
            <CaptureButton
              isCapturing={isCapturing}
              onPressIn={() => setIsHolding(true)}
              onPressOut={() => setIsHolding(false)}
              progress={progress}
              stepColor={faceSteps[currentStep].color}
            />
          </>
        )}
        {isLoading && <RecognizingModal isLoading={isLoading} />}
      </View>
    </ContainerComponent>
  );
};

export default SetupFaceID;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    backgroundColor: appColors.background,
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 16,
  },
  camera: {
    flex: 1,
  },
});
