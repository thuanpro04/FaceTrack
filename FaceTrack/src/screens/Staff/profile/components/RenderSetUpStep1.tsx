import React, {useState, useRef, useEffect} from 'react';
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {authSelector} from '../../../../redux/slices/authSlice';
import {imageServices} from '../../../../services/imageService';
import ButtonImagePicker from '../../../../components/layout/ButtonImagePicker';
import {SpaceComponent, TextComponent} from '../../../../components/layout';
import appColors from '../../../../constants/appColors';

const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;
const CLOUD_NAME = process.env.CLOUD_NAME;

interface Props {
  user: any;
  error: any;
  focusedInput: string;
  setFocusedInput: (value: string) => void;
  onChangeUserInfo: (key: string, value: string) => void;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}
const RenderSetUpStep1 = ({
  user,
  error,
  focusedInput,
  setFocusedInput,
  onChangeUserInfo,
  fadeAnim,
  slideAnim,
}: Props) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const profile = useSelector(authSelector);

  const parseStringToDate = (dateString: any | null) => {
    if (!dateString) return new Date(2000, 0, 1);
    const parts = dateString.split('/');
    if (parts.length !== 3) return new Date(2000, 0, 1);
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date(2000, 0, 1);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
    setFocusedInput('birthDay');
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setFocusedInput('');
  };

  const handleDateConfirm = (selectedDate: Date) => {
    const dob = `${selectedDate.getDate().toString().padStart(2, '0')}/${(
      selectedDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${selectedDate.getFullYear()}`;
    onChangeUserInfo('birthDay', dob);
    hideDatePicker();
  };

  const handleDateCancel = () => {
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

    try {
      const res = await imageServices.getAvatarCloudinary(
        CLOUD_NAME ?? '',
        formData,
      );

      if (res && res.data) {
        onChangeUserInfo('profileImageUrl', res.data.secure_url);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const renderInput = (
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    iconName: string,
    keyboardType: any = 'default',
    fieldKey: string,
    animationIndex: number,
  ) => {
    const inputAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(inputAnim, {
        toValue: 1,
        duration: 500,
        delay: animationIndex * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.inputContainer,
          {
            opacity: inputAnim,
            transform: [
              {
                translateY: inputAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}>
        <View
          style={[
            styles.inputWrapper,
            focusedInput === fieldKey && styles.inputWrapperFocused,
            error[fieldKey] && styles.inputWrapperError,
          ]}>
          <LinearGradient
            colors={
              focusedInput === fieldKey
                ? ['#667eea', '#764ba2']
                : ['#f8fafc', '#f1f5f9']
            }
            style={styles.inputIconContainer}>
            <Icon
              name={iconName}
              size={20}
              color={focusedInput === fieldKey ? '#ffffff' : '#64748b'}
            />
          </LinearGradient>

          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#94a3b8"
            keyboardType={keyboardType}
            onFocus={() => setFocusedInput(fieldKey)}
            onBlur={() => setFocusedInput('')}
          />

          {value && (
            <TouchableOpacity
              onPress={() => onChangeText('')}
              style={styles.clearButton}
              activeOpacity={0.6}>
              <Icon name="close" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {error[fieldKey] && (
          <Animated.Text style={styles.errorText}>
            {error[fieldKey]}
          </Animated.Text>
        )}
      </Animated.View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.stepContent,
        {
          opacity: fadeAnim,
          transform: [{translateY: slideAnim}],
        },
      ]}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          {user.profileImageUrl ? (
            <Image
              source={{uri: user.profileImageUrl}}
              style={styles.avatarImage}
            />
          ) : (
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.avatarPlaceholder}>
              <TextComponent
                styles={styles.avatarText}
                label={profile.fullName?.charAt(0)?.toUpperCase() || 'U'}
              />
            </LinearGradient>
          )}

          <View style={styles.avatarEditButton}>
            <ButtonImagePicker
              onSelect={val =>
                val.type === 'url'
                  ? onChangeUserInfo('profileImageUrl', val.value.toString())
                  : handleImageUrl(val.value as ImageOrVideo)
              }
            />
          </View>
        </View>

        <TextComponent styles={styles.avatarLabel} label={'Ảnh đại diện'} />
      </View>

      <SpaceComponent height={32} />

      {/* Form Inputs */}
      {renderInput(
        'Họ và tên',
        user.fullName ?? '',
        text => onChangeUserInfo('fullName', text),
        'person',
        'default',
        'fullName',
        0,
      )}

      {renderInput(
        'Số điện thoại',
        user.phone,
        text => onChangeUserInfo('phone', text),
        'phone',
        'phone-pad',
        'phone',
        1,
      )}

      {renderInput(
        'Địa chỉ',
        user.location,
        text => onChangeUserInfo('location', text),
        'location-on',
        'default',
        'location',
        2,
      )}

      {/* Date Picker */}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <TouchableOpacity
          onPress={showDatePicker}
          activeOpacity={0.8}
          style={[
            styles.inputWrapper,
            focusedInput === 'birthDay' && styles.inputWrapperFocused,
            error['birthDay'] && styles.inputWrapperError,
          ]}>
          <LinearGradient
            colors={
              focusedInput === 'birthDay'
                ? ['#667eea', '#764ba2']
                : ['#f8fafc', '#f1f5f9']
            }
            style={styles.inputIconContainer}>
            <Icon
              name="cake"
              size={20}
              color={focusedInput === 'birthDay' ? '#ffffff' : '#64748b'}
            />
          </LinearGradient>

          <TextComponent
            styles={[
              styles.input,
              {
                color: user.birthDay ? '#1e293b' : '#94a3b8',
                paddingTop: Platform.OS === 'ios' ? 16 : 14,
              },
            ]}
            label={user.birthDay ? user.birthDay.toString() : 'Chọn ngày sinh'}
          />
        </TouchableOpacity>

        {error['birthDay'] && (
          <TextComponent styles={styles.errorText} label={error['birthDay']} />
        )}
      </Animated.View>

      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode="date"
        date={parseStringToDate(user.birthDay)}
        maximumDate={new Date()}
        minimumDate={new Date(1900, 0, 1)}
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
        confirmTextIOS="Xác nhận"
        cancelTextIOS="Hủy"
        locale="vi-VN"
        display="default"
      />

      {/* Gender Selection */}
      <Animated.View
        style={[
          styles.genderSection,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <TextComponent styles={styles.genderLabel} label={'Giới tính'} />
        <View style={styles.genderContainer}>
          {[
            {key: 'nam', label: 'Nam', icon: 'male'},
            {key: 'nữ', label: 'Nữ', icon: 'female'},
            {key: 'khác', label: 'Khác', icon: 'transgender'},
          ].map((option, index) => (
            <TouchableOpacity
              key={option.key}
              style={styles.genderOption}
              onPress={() => onChangeUserInfo('gender', option.key)}
              activeOpacity={0.8}>
              {user.gender === option.key ? (
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.genderOptionSelected}>
                  <Icon name={option.icon} size={20} color="#ffffff" />
                  <TextComponent
                    styles={styles.genderTextSelected}
                    label={option.label}
                  />
                </LinearGradient>
              ) : (
                <View style={styles.genderOptionUnselected}>
                  <Icon name={option.icon} size={20} color="#64748b" />
                  <TextComponent
                    styles={styles.genderText}
                    label={option.label}
                  />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default RenderSetUpStep1;

const styles = StyleSheet.create({
  stepContent: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: -22,
    marginBottom: 30,
  },
  avatarLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputWrapperFocused: {
    borderColor: '#667eea',
    shadowColor: '#667eea',
    shadowOpacity: 0.2,
    elevation: 4,
  },
  inputWrapperError: {
    borderColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOpacity: 0.2,
  },
  inputIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    paddingVertical: 16,
  },
  clearButton: {
    padding: 8,
    marginRight: 4,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 56,
    fontWeight: '500',
  },
  genderSection: {
    marginTop: 8,
  },
  genderLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  genderOptionSelected: {
    paddingVertical: 18,
    alignItems: 'center',
    gap: 8,
  },
  genderOptionUnselected: {
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    gap: 8,
  },
  genderText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  genderTextSelected: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  arSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#667eea',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
});
