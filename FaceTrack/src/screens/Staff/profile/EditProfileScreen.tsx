import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {ArrowLeft2} from 'iconsax-react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {ContainerComponent, TextComponent} from '../../../components/layout';
import ButtonAnimation from '../../../components/layout/ButtonAnimation';
import ButtonImagePicker from '../../../components/layout/ButtonImagePicker';
import appColors from '../../../constants/appColors';
import {appSize} from '../../../constants/appSize';
import {addAuth, authSelector} from '../../../redux/slices/authSlice';
import {authServices} from '../../../services/authServices';
import {imageServices} from '../../../services/imageService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showNotificating} from '../../../utils/ShowNotification';

const {width} = Dimensions.get('window');

export interface info {
  profileImageUrl?: string;
  fullName?: string;
  phone: string;
  address: string;
  gender?: 'nam' | 'nữ' | 'khác';
  birthDay: String | null | Date;
}
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET; // tạo ở bước 3
const CLOUD_NAME = process.env.CLOUD_NAME; // lấy ở dashboard
const EditProfileScreen = ({navigation}: any) => {
  const [focusedInput, setFocusedInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<info>({
    fullName: '',
    phone: '',
    address: '',
    birthDay: null,
    gender: 'nam',
    profileImageUrl: '',
  });
  const [error, setError] = useState<info>({
    address: '',
    birthDay: '',
    phone: '',
  });
  const profile = useSelector(authSelector);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const dispatch = useDispatch();
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [avatarScale] = useState(new Animated.Value(0.8));
  const [buttonPulse] = useState(new Animated.Value(1));
  const [formAnimations] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.2)),
      }),
      Animated.spring(avatarScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered form animations
    const formAnimationSequence = formAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    );

    Animated.stagger(100, formAnimationSequence).start();

    // Pulse animation for save button
    const pulseAnimation = () => {
      Animated.sequence([
        Animated.timing(buttonPulse, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulseAnimation());
    };

    setTimeout(pulseAnimation, 2000);
  }, []);

  const onChangeUserInfo = (key: string, value: string) => {
    setUser(prev => ({...prev, [key]: value}));
  };
  const checkErrorInfo = () => {
    const newErros: any = {};
    if (!user.address) {
      newErros.address = 'Vui lòng nhập địa chỉ';
    }
    if (!user.birthDay) {
      newErros.birthDay = 'Vui lòng lựa chọn ngày sinh';
    }
    if (!user.phone) {
      newErros.phone = 'Vui lòng nhập số điện thoại';
    }

    setError(newErros);
    return Object.keys(newErros).length === 0;
  };
  const handleSaveProfile = async () => {
    // Button press animation
    setIsLoading(true);
    Animated.sequence([
      Animated.timing(buttonPulse, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonPulse, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    const isValid = checkErrorInfo();

    if (!isValid) {
      return;
    }
    const data = {...user, id: profile._id};
    // Xử lý lưu thông tin profile
    try {
      const res = await authServices.upload_Profile(data);
      if (res && res?.data) {
        console.log('Update success: ', res.data);
        const userInfo = {
          ...res.data,
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

  const showDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
    setFocusedInput('birthDay');
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setFocusedInput('');
  };

  const handleDateConfirm = (selectedDate: Date) => {
    console.log('Selected date: ', selectedDate);
    const dob = `${selectedDate.getDate().toString().padStart(2, '0')}/${(
      selectedDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${selectedDate.getFullYear()}`;
    console.log('dob: ', dob);
    onChangeUserInfo('birthDay', dob); // Store as string
    hideDatePicker();
  };

  // Create helper function to convert string back to Date
  const parseStringToDate = (dateString: any | null): Date => {
    if (!dateString) return new Date(2000, 0, 1);
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }

    return new Date(2000, 0, 1);
  };
  const handleDateCancel = () => {
    console.log('Date picker cancelled');
    hideDatePicker();
  };

  const handleImageUrl = async (value: ImageOrVideo) => {
    const formData = new FormData();
    formData.append('file', {
      uri: value.path,
      type: value.mime,
      name: value.filename || 'photo.jpg',
    });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    console.log('Form Data: ', formData);

    try {
      const res = await imageServices.getAvatarCloudinary(
        CLOUD_NAME ?? '',
        formData,
      );

      if (res && res.data) {
        console.log('Data: ', res.data);
        console.log('Avatar: ', res.data.secure_url);
        onChangeUserInfo('profileImageUrl', res.data.secure_url);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const renderAnimatedInput = (
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    iconName: string,
    keyboardType: any = 'default',
    fieldKey: string,
    animationIndex: number,
  ) => {
    return (
      <Animated.View
        style={[
          styles.inputContainer,
          {
            opacity: formAnimations[animationIndex],
            transform: [
              {
                translateY: formAnimations[animationIndex].interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}>
        <Animated.View
          style={[
            styles.inputWrapper,
            focusedInput === fieldKey && styles.inputWrapperFocused,
            {
              transform: [
                {
                  scale: focusedInput === fieldKey ? 1.02 : 1,
                },
              ],
            },
          ]}>
          <Icon
            name={iconName}
            size={20}
            color={focusedInput === fieldKey ? '#667eea' : '#9ca3af'}
          />
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            keyboardType={keyboardType}
            onFocus={() => setFocusedInput(fieldKey)}
            onBlur={() => setFocusedInput('')}
          />
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ContainerComponent isScroll>
        {/* Header Gradient with Animation */}
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <LinearGradient
            colors={['#2C698D', '#00C897']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.headerGradient}>
            <ButtonAnimation onPress={() => navigation.goBack()}>
              <ArrowLeft2 color={appColors.white} size={appSize.iconLarge} />
            </ButtonAnimation>
            <TextComponent
              label="Chỉnh sửa hồ sơ"
              styles={styles.headerTitle}
            />
            <TextComponent
              label="Cập nhật thông tin cá nhân của bạn"
              styles={styles.headerSubtitle}
            />
          </LinearGradient>
        </Animated.View>

        <ContainerComponent>
          {/* Avatar Section with Animation */}
          <Animated.View
            style={[
              styles.avatarSection,
              {
                opacity: fadeAnim,
                transform: [{scale: avatarScale}],
              },
            ]}>
            <View style={styles.avatarContainer}>
              {user.profileImageUrl ? (
                <Image
                  source={{
                    uri: user.profileImageUrl ?? profile.profileImageUrl,
                  }}
                  style={styles.avatarGradient}
                />
              ) : (
                <View style={styles.avatarGradient}>
                  <TextComponent label={profile.fullName.slice(0, 1)[0]} />
                </View>
              )}
              <ButtonImagePicker
                onSelect={val =>
                  val.type === 'url'
                    ? onChangeUserInfo('profileImageUrl', val.value.toString())
                    : handleImageUrl(val.value as ImageOrVideo)
                }
              />
            </View>
            <TouchableOpacity
              style={styles.faceSetupButton}
              onPress={() => navigation.navigate('face')}>
              <LinearGradient
                colors={['#00C897', '#2C698D']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.faceSetupGradient}>
                <MaterialCommunityIcons
                  name="face-recognition"
                  size={18}
                  color="#fff"
                />
                <TextComponent
                  label="Thiết lập Face ID"
                  styles={styles.faceSetupButtonText}
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Form Container with Animations */}
          <View style={styles.formContainer}>
            <Animated.View
              style={[
                {
                  opacity: formAnimations[0],
                  transform: [
                    {
                      translateY: formAnimations[0].interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}>
              <TextComponent
                label="Thông tin cá nhân"
                styles={styles.sectionTitle}
              />
            </Animated.View>

            {/* Animated Form Inputs */}
            {renderAnimatedInput(
              'Họ và tên',
              user.fullName ?? '',
              text => onChangeUserInfo('fullName', text),
              'person',
              'default',
              'fullName',
              1,
            )}

            {renderAnimatedInput(
              'Số điện thoại',
              user.phone,
              text => onChangeUserInfo('phone', text),
              'phone',
              'phone-pad',
              'phone',
              3,
            )}

            {renderAnimatedInput(
              'Địa chỉ',
              user.address,
              text => onChangeUserInfo('address', text),
              'location-on',
              'default',
              'address',
              4,
            )}

            {/* Date Picker with Animation */}
            <Animated.View
              style={[
                styles.inputContainer,
                {
                  opacity: formAnimations[5],
                  transform: [
                    {
                      translateY: formAnimations[5].interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}>
              <TouchableOpacity
                style={[
                  styles.inputWrapper,
                  focusedInput === 'birthDay' && styles.inputWrapperFocused,
                  {
                    width: '80%',
                  },
                ]}
                activeOpacity={0.7}
                onPress={showDatePicker}
                onFocus={() => setFocusedInput('birthDay')}>
                <Icon
                  name="cake"
                  size={20}
                  color={
                    focusedInput === 'birthDay' || isDatePickerVisible
                      ? '#667eea'
                      : '#9ca3af'
                  }
                />
                <TextComponent
                  label={
                    user.birthDay ? user.birthDay.toString() : 'Chọn ngày sinh'
                  }
                  styles={[
                    styles.input,
                    {color: user.birthDay ? '#1f2937' : '#9ca3af'},
                  ]}
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                date={parseStringToDate(user.birthDay)}
                maximumDate={new Date()}
                minimumDate={new Date(1950, 0, 1)}
                onConfirm={handleDateConfirm}
                onCancel={handleDateCancel}
                confirmTextIOS="Xác nhận"
                cancelTextIOS="Hủy"
                locale="vi_VN"
                display="default"
                modalStyleIOS={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}
                pickerContainerStyleIOS={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  margin: 20,
                  padding: 20,
                }}
              />
            </Animated.View>

            {/* Gender Selection with Animation */}
            <Animated.View
              style={[
                styles.genderSection,
                {
                  opacity: formAnimations[5],
                  transform: [
                    {
                      translateY: formAnimations[5].interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}>
              <TextComponent label="Giới tính" styles={styles.genderLabel} />
              <View style={styles.genderContainer}>
                {['nam', 'nữ', 'khác'].map((option, index) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.genderOption,
                      user.gender === option && styles.genderOptionSelected,
                    ]}
                    onPress={() => onChangeUserInfo('gender', option)}
                    activeOpacity={0.7}>
                    {user.gender === option ? (
                      <LinearGradient
                        colors={['#2C698D', '#00C897']}
                        style={styles.genderGradient}>
                        <TextComponent
                          label={option}
                          styles={styles.genderTextSelected}
                        />
                      </LinearGradient>
                    ) : (
                      <TextComponent
                        label={option}
                        styles={styles.genderText}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </View>

          {/* Animated Save Button */}
          <Animated.View
            style={[
              styles.saveButtonContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {scale: buttonPulse},
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#00C897', '#2C698D']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.saveButtonGradient}>
                <Icon
                  name="save"
                  size={20}
                  color="#fff"
                  style={styles.saveIcon}
                />
                <TextComponent
                  label="Lưu thay đổi"
                  styles={styles.saveButtonText}
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ContainerComponent>
      </ContainerComponent>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: -22,
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
  },
  faceSetupButton: {
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#667eea',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  faceSetupGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  faceSetupButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  inputWrapperFocused: {
    borderColor: '#667eea',
    elevation: 4,
    shadowColor: '#667eea',
    shadowOpacity: 0.2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 16,
    paddingLeft: 12,
    fontWeight: '500',
  },
  genderSection: {
    marginTop: 8,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  genderOptionSelected: {},
  genderGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  genderText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 14,
  },
  genderTextSelected: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonContainer: {
    paddingHorizontal: 24,
  },
  saveButton: {
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#667eea',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
