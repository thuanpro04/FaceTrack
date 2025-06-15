import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useSelector} from 'react-redux';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import { authSelector } from '../../../redux/slices/authSlice';
import axiosInstance from '../../../api/axiosInstance';
import { API_PATHS } from '../../../api/apiPaths';
import appColors from '../../../constants/appColors';
import { appSize } from '../../../constants/appSize';
import { ContainerComponent, TextComponent } from '../../../components/layout';
import ButtonImagePicker from '../../../components/layout/ButtonImagePicker';

const {width} = Dimensions.get('window');
interface info {
  profileImageUrl?: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  gender: 'nam' | 'nữ' | 'khác';
  dob: Date | null;
}
const EditProfileScreen = ({navigation}: any) => {
  const [focusedInput, setFocusedInput] = useState('');
  const [user, setUser] = useState<info>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dob: null,
    gender: 'nam',
    profileImageUrl: '',
  });
  const profile = useSelector(authSelector);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const onChangeUserInfo = (key: string, value: string) => {
    setUser(prev => ({...prev, [key]: value}));
  };
  const handleSaveProfile = () => {
    // Xử lý lưu thông tin profile
    console.log('Saving profile...', user);
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
    setFocusedInput('dob');
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setFocusedInput('');
  };

  const handleDateConfirm = (selectedDate: any) => {
    console.log('Selected date: ', selectedDate);
    onChangeUserInfo('dob', selectedDate);
    hideDatePicker();
  };

  const handleDateCancel = () => {
    console.log('Date picker cancelled');
    hideDatePicker();
  };
  const handleImageUrl = async (value: ImageOrVideo) => {
    console.log(value, 122);
    const formData = new FormData();
    formData.append('image', {
      uri: value.path,
      type: value.mime,
      name: value.filename || 'photo.jpg',
    });
    try {
      const response = await axiosInstance.post(
        API_PATHS.IMAGE.UPLOAD_AVATAR,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response?.data) {
        console.log('Res: ', response?.data);
        onChangeUserInfo('profileImageUrl', response.data.profileImageUrl);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };
  const facePhotos = [
    'front_face.jpg', // Ảnh nhìn thẳng (bắt buộc)
    'slight_left.jpg', // Nghiêng trái 15°
    'slight_right.jpg', // Nghiêng phải 15°
    'with_smile.jpg', // Có nụ cười
    'serious_face.jpg', // Biểu cảm nghiêm túc
  ];

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ContainerComponent isScroll>
        {/* Header Gradient */}
        <LinearGradient
          colors={['#2C698D', '#00C897']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.headerGradient}>
          <AntDesign
            name="arrowleft"
            color={appColors.white}
            size={appSize.iconMedium}
            onPress={() => navigation.goBack()}
          />
          <TextComponent label="Chỉnh sửa hồ sơ" styles={styles.headerTitle} />
          <TextComponent
            label="Cập nhật thông tin cá nhân của bạn"
            styles={styles.headerSubtitle}
          />
        </LinearGradient>

        <ContainerComponent>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
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
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <TextComponent
              label="Thông tin cá nhân"
              styles={styles.sectionTitle}
            />

            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 'fullName' && styles.inputWrapperFocused,
                ]}>
                <Icon
                  name="person"
                  size={20}
                  color={focusedInput === 'fullName' ? '#667eea' : '#9ca3af'}
                />
                <TextInput
                  style={styles.input}
                  value={user.fullName}
                  onChangeText={text => onChangeUserInfo('fullName', text)}
                  placeholder="Họ và tên"
                  placeholderTextColor="#9ca3af"
                  onFocus={() => setFocusedInput('fullName')}
                  onBlur={() => setFocusedInput('')}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 'email' && styles.inputWrapperFocused,
                ]}>
                <Icon
                  name="email"
                  size={20}
                  color={focusedInput === 'email' ? '#667eea' : '#9ca3af'}
                />
                <TextInput
                  style={styles.input}
                  value={user.email}
                  onChangeText={text => onChangeUserInfo('email', text)}
                  placeholder="Email"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput('')}
                />
              </View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 'phone' && styles.inputWrapperFocused,
                ]}>
                <Icon
                  name="phone"
                  size={20}
                  color={focusedInput === 'phone' ? '#667eea' : '#9ca3af'}
                />
                <TextInput
                  style={styles.input}
                  value={user.phone}
                  onChangeText={text => onChangeUserInfo('phone', text)}
                  placeholder="Số điện thoại"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  onFocus={() => setFocusedInput('phone')}
                  onBlur={() => setFocusedInput('')}
                />
              </View>
            </View>
            {/* Address Input */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 'address' && styles.inputWrapperFocused,
                ]}>
                <Icon
                  name="location-on"
                  size={20}
                  color={focusedInput === 'address' ? '#667eea' : '#9ca3af'}
                />
                <TextInput
                  style={styles.input}
                  value={user.address}
                  onChangeText={text => onChangeUserInfo('address', text)}
                  placeholder="Địa chỉ"
                  placeholderTextColor="#9ca3af"
                  onFocus={() => setFocusedInput('address')}
                  onBlur={() => setFocusedInput('')}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={[
                  styles.inputWrapper,
                  focusedInput === 'dob' && styles.inputWrapperFocused,
                  {
                    width: '80%',
                  },
                ]}
                activeOpacity={0.7}
                onPress={showDatePicker}
                onFocus={() => setFocusedInput('dob')}>
                <Icon
                  name="cake"
                  size={20}
                  color={
                    focusedInput === 'dob' || isDatePickerVisible
                      ? '#667eea'
                      : '#9ca3af'
                  }
                />
                <TextComponent
                  label={
                    user.dob
                      ? `${user.dob.getDate().toString().padStart(2, '0')}/${(
                          user.dob.getMonth() + 1
                        )
                          .toString()
                          .padStart(2, '0')}/${user.dob.getFullYear()}`
                      : 'Chọn ngày sinh'
                  }
                  styles={[
                    styles.input,
                    {color: user.dob ? '#1f2937' : '#9ca3af'},
                  ]}
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                date={user.dob || new Date(2000, 0, 1)}
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
            </View>
            {/* Gender Selection */}
            <View style={styles.genderSection}>
              <TextComponent label="Giới tính" styles={styles.genderLabel} />
              <View style={styles.genderContainer}>
                {['Nam', 'Nữ', 'Khác'].map(option => (
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
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.saveButtonContainer}>
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
          </View>
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
    paddingBottom: 40,
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
