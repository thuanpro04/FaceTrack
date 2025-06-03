import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  TextComponent,
} from '../../components/layout';
import appColors from '../../constants/appColors';
import {appSize} from '../../constants/appSize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const {width} = Dimensions.get('window');

const EditProfileScreen = ({navigation}: any) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [focusedInput, setFocusedInput] = useState('');
  const [dob, setDob] = useState<any>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const handleSaveProfile = () => {
    // Xử lý lưu thông tin profile
    console.log('Saving profile...');
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
    setDob(selectedDate);
    hideDatePicker();
  };

  const handleDateCancel = () => {
    console.log('Date picker cancelled');
    hideDatePicker();
  };
  return (
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
            <LinearGradient
              colors={['#00C897', '#2C698D']}
              style={styles.avatarGradient}>
              <Icon name="person" size={50} color="#fff" />
            </LinearGradient>
            <TouchableOpacity style={styles.cameraButton}>
              <Icon name="camera-alt" size={16} color="#fff" />
            </TouchableOpacity>
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
                value={fullName}
                onChangeText={setFullName}
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
                value={email}
                onChangeText={setEmail}
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
                value={phone}
                onChangeText={setPhone}
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
                value={address}
                onChangeText={setAddress}
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
              <Text
                style={[styles.input, {color: dob ? '#1f2937' : '#9ca3af'}]}>
                {dob
                  ? `${dob.getDate().toString().padStart(2, '0')}/${(
                      dob.getMonth() + 1
                    )
                      .toString()
                      .padStart(2, '0')}/${dob.getFullYear()}`
                  : 'Chọn ngày sinh'}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              date={dob || new Date(2000, 0, 1)}
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
                    gender === option && styles.genderOptionSelected,
                  ]}
                  onPress={() => setGender(option)}
                  activeOpacity={0.7}>
                  {gender === option ? (
                    <LinearGradient
                      colors={['#2C698D', '#00C897']}
                      style={styles.genderGradient}>
                      <TextComponent
                        label={option}
                        styles={styles.genderTextSelected}
                      />
                    </LinearGradient>
                  ) : (
                    <TextComponent label={option} styles={styles.genderText} />
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
              <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ContainerComponent>
    </ContainerComponent>
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
    marginTop: -30,
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
    elevation: 8,
    shadowColor: '#667eea',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00C897',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
  genderOptionSelected: {
    borderColor: '#2C698D',
  },
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
