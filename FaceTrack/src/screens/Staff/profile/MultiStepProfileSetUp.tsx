import React, {useState, useRef, useEffect} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {ArrowLeft, ArrowRight, Personalcard} from 'iconsax-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  SpaceComponent,
  RowComponent,
  ContainerComponent,
  TextComponent,
} from '../../../components/layout';
import {addAuth, authSelector} from '../../../redux/slices/authSlice';
import {appSize} from '../../../constants/appSize';
import appColors from '../../../constants/appColors';
import RenderSetUpStep2 from './components/RenderSetUpStep2';
import RenderSetUpStep1 from './components/RenderSetUpStep1';
import {ScrollView} from 'react-native-gesture-handler';
import {showNotificating} from '../../../utils/ShowNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authServices} from '../../../services/authServices';
import LoadingModal from '../../modals/LoadingModal';

const {width, height} = Dimensions.get('window');

export interface infoBase {
  profileImageUrl?: string;
  fullName?: string;
  phone: string;
  location: string;
  gender?: 'nam' | 'nữ' | 'khác';
  birthDay: String | null | Date;
  staff: infoAdvanced;
}

export interface infoAdvanced {
  totalWorkplaces: number;
  bio: string;
  experience: number;
  skills: string[];
}

const MultiStepProfileSetUp = ({navigation}: any) => {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');
  const profile = useSelector(authSelector);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const [user, setUser] = useState<infoBase>({
    fullName: profile.fullName,
    phone: profile.phone,
    location: profile.location,
    birthDay: profile.birthDay,
    gender: profile.gender ?? 'nam',
    profileImageUrl: profile.profileImageUrl,
    staff: {
      totalWorkplaces: 0,
      bio: '',
      experience: 0,
      skills: [],
    },
  });

  useEffect(() => {
    // Initial animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: step / 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [step]);

  const onChangeUserInfo = (key: string, value: string | number | string[]) => {
    if (key.includes('staff.')) {
      const staffKey = key.replace('staff.', '');
      setUser(prev => ({
        ...prev,
        staff: {
          ...prev.staff,
          [staffKey]: value,
        },
      }));
    } else {
      setUser(prev => ({...prev, [key]: value}));
    }
  };

  const checkErrorInfo = () => {
    const newErrors: any = {};

    if (step === 0) {
      if (!user.location) newErrors.location = 'Vui lòng nhập địa chỉ';
      if (!user.birthDay) newErrors.birthDay = 'Vui lòng lựa chọn ngày sinh';
      if (!user.phone) newErrors.phone = 'Vui lòng nhập số điện thoại';
      if (user.phone && !/^\d{10,11}$/.test(user.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
      if (user.fullName && user.fullName.length < 2) {
        newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
      }
    } else if (step === 1) {
      if (!user.staff.bio) newErrors.bio = 'Vui lòng nhập mô tả về bản thân';
      if (user.staff.experience < 0)
        newErrors.experience = 'Số năm kinh nghiệm không hợp lệ';
      if (user.staff.totalWorkplaces < 0)
        newErrors.totalWorkplaces = 'Số nơi làm việc không hợp lệ';
      if (user.staff.skills.length === 0)
        newErrors.skills = 'Vui lòng chọn ít nhất 1 kỹ năng';
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onPressContinue = async () => {
    const isValid = checkErrorInfo();
    if (!isValid) {
      Alert.alert('Thông báo', 'Vui lòng kiểm tra lại thông tin đã nhập');
      return;
    }

    if (step === 0) {
      setStep(1);
    } else {
      // Complete profile setup
      console.log('setup: ', user);
      setIsLoading(true);
      await handleSaveProfile();
      // Alert.alert('Thành công', 'Hồ sơ của bạn đã được thiết lập thành công!', [
      //   {text: 'OK', onPress: () => navigation.goBack()},
      // ]);
    }
  };
  const handleSaveProfile = async () => {
    // Button press animation
    const data = {...user, id: profile._id};
    // Xử lý lưu thông tin profile
    try {
      const res = await authServices.upload_Profile(data);
      if (res && res?.data) {
        console.log('Update success: ', res.data.result);
        const userInfo = {
          ...res.data.result,
          accessToken: profile.accessToken,
        };
        setTimeout(async () => {
          dispatch(addAuth(userInfo));
          await AsyncStorage.setItem('user', JSON.stringify(userInfo));
          showNotificating.activity(
            'success',
            'Cập nhật thành công!',
            'Chào mừng bạn đến với FaceTrack 🎉',
          );
          setIsLoading(false);
        }, 1200);
        navigation.navigate('home');
      }
    } catch (error) {
      console.log('Save profile error: ', error);
      showNotificating.activity(
        'error',
        '😓 Cập nhật không thành công!',
        'Vui lòng thử lại lần sau.',
      );
      setIsLoading(false);
    }
  };
  const onPressBack = () => {
    if (step === 0) {
      navigation.goBack();
    } else {
      setStep(step - 1);
    }
  };

  const HeaderComponent = () => {
    return (
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <TouchableOpacity
          onPress={onPressBack}
          style={styles.backButton}
          activeOpacity={0.8}>
          <LinearGradient
            colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
            style={styles.backButtonGradient}>
            <ArrowLeft size={22} color="#2C3E50" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TextComponent label={`${step + 1}/2`} styles={styles.stepText} />
        </View>
      </Animated.View>
    );
  };

  const StepIndicator = () => {
    return (
      <Animated.View
        style={[
          styles.stepIndicatorContainer,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground} />
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['50%', '100%'],
                }),
              },
            ]}
          />
        </View>

        <RowComponent styles={styles.stepContainer}>
          <View style={styles.stepIconContainer}>
            <LinearGradient
              colors={
                step >= 0 ? ['#667eea', '#764ba2'] : ['#e5e7eb', '#f3f4f6']
              }
              style={styles.stepIconGradient}>
              <Personalcard
                size={20}
                color={step >= 0 ? '#ffffff' : '#9ca3af'}
              />
            </LinearGradient>
            <TextComponent
              label="Thông tin"
              styles={[
                styles.stepLabel,
                {color: step >= 0 ? '#667eea' : '#9ca3af'},
              ]}
            />
          </View>

          <View style={styles.stepIconContainer}>
            <LinearGradient
              colors={
                step >= 1 ? ['#667eea', '#764ba2'] : ['#e5e7eb', '#f3f4f6']
              }
              style={styles.stepIconGradient}>
              <Icon
                name="work"
                size={20}
                color={step >= 1 ? '#ffffff' : '#9ca3af'}
              />
            </LinearGradient>
            <TextComponent
              label="Nghề nghiệp"
              styles={[
                styles.stepLabel,
                {color: step >= 1 ? '#667eea' : '#9ca3af'},
              ]}
            />
          </View>
        </RowComponent>
      </Animated.View>
    );
  };

  const ContinueButton = () => {
    return (
      <Animated.View
        style={[
          styles.continueButtonContainer,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <TouchableOpacity
          onPress={onPressContinue}
          style={styles.continueButton}
          disabled={isLoading}
          activeOpacity={0.9}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.continueButtonGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <TextComponent
              styles={styles.continueButtonText}
              label={step === 0 ? 'Tiếp tục' : 'Hoàn thành'}
            />
            <ArrowRight size={20} color="#ffffff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ContainerComponent>
      <HeaderComponent />
      <ScrollView style={styles.container}>
        <View style={styles.body}>
          <StepIndicator />
          <SpaceComponent height={24} />
          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: fadeAnim,
                transform: [{scale: scaleAnim}],
              },
            ]}>
            <TextComponent label="Thiết lập hồ sơ" styles={styles.title} />
            <TextComponent
              label={
                step === 0
                  ? 'Thông tin cá nhân của bạn'
                  : 'Thông tin nghề nghiệp'
              }
              styles={styles.subtitle}
            />
          </Animated.View>

          <SpaceComponent height={32} />

          {step === 0 ? (
            <RenderSetUpStep1
              user={user}
              error={error}
              focusedInput={focusedInput}
              setFocusedInput={setFocusedInput}
              onChangeUserInfo={onChangeUserInfo}
              fadeAnim={fadeAnim}
              slideAnim={slideAnim}
            />
          ) : (
            <RenderSetUpStep2
              user={user}
              error={error}
              focusedInput={focusedInput}
              setFocusedInput={setFocusedInput}
              onChangeUserInfo={onChangeUserInfo}
              fadeAnim={fadeAnim}
              slideAnim={slideAnim}
            />
          )}

          <ContinueButton />
        </View>
      </ScrollView>
      <LoadingModal isVisible={isLoading} />
    </ContainerComponent>
  );
};

export default MultiStepProfileSetUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  backButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepIndicatorContainer: {
    marginBottom: 20,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#e2e8f0',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 2,
  },
  stepContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  stepIconContainer: {
    alignItems: 'center',
  },
  stepIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#667eea',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  continueButtonContainer: {
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  continueButton: {
    shadowColor: '#667eea',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});
