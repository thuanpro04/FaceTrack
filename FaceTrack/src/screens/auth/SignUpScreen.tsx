import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import InputComponent from '../../components/Input/InputComponent';
import {
  ButtonComponent,
  ContainerComponent,
  TextComponent,
} from '../../components/layout';
import RowComponent from '../../components/layout/RowComponent';
import appColors from '../../constants/appColors';
import {authServices} from '../../services/authServices';
import {showNotificating} from '../../utils/ShowNotification';
import LoadingModal from '../modals/LoadingModal';
import CheckBox from '../../components/layout/CheckBox';
interface user {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  codeBy?: string;
}
const SignUpScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<any>();
  const [userInfo, setUserInfo] = useState<user>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    codeBy: '',
  });
  const [errors, setErrors] = useState<any>({});
  const checkError = () => {
    const newErrors: any = {};

    if (!userInfo.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    } else if (userInfo.fullName.length < 6) {
      newErrors.fullName = 'Vui lòng nhập họ và tên lớn hơn 6 kí tự';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userInfo.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(userInfo.email.trim())) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!userInfo.password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else {
      const passwordRegex =
        /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
      if (!passwordRegex.test(userInfo.password)) {
        newErrors.password = 'Mật khẩu tối thiểu 6 ký tự và có ký tự đặc biệt';
      }
    }

    if (!userInfo.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (userInfo.confirmPassword !== userInfo.password) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    if (!userInfo.role) {
      newErrors.role = 'Vui lòng chọn';
    } else {
      if (userInfo.role === 'staff') {
        if (!userInfo.codeBy) {
          newErrors.codeBy = 'Vui lòng điền mã code';
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  console.log(errors);

  const handleVerifyUser = async () => {
    const isValid = checkError();

    if (!isValid) return;

    setIsLoading(true);
    try {
      const res = await authServices.sendVerification(
        userInfo.email,
        'register',
      );
      if (res?.data) {
        showNotificating.activity(
          'success',
          'Gửi mã code thành công!',
          'Vui lòng kiểm tra email của bạn 📬',
        );
        navigation.navigate('verification', {
          code: res.data.code,
          email: userInfo.email,
          key: 'register',
          userInfo,
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      showNotificating.activity(
        'error',
        'Gửi mã thất bại!',
        'Vui lòng thử lại.',
      );
      console.log(error.response.data.message);
      setErrors({other: error.response.data.message});
      setIsLoading(false);
    }
  };
  const onChangeUserInfo = (key: string, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [key]: value,
    }));
    setErrors((prevErrors: any) => {
      if (prevErrors.hasOwnProperty(key)) {
        return {
          ...prevErrors,
          [key]: '',
        };
      }
      return prevErrors;
    });
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ContainerComponent>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.main}>
            <Image
              source={require('../../assets/Ice-skating.png')}
              style={{height: 45, width: 45}}
            />
            <TextComponent label="FaceTrack" styles={styles.title} title />
            <TextComponent label="Tạo tài khoản mới" styles={styles.subtitle} />

            <View style={styles.inputWrapper}>
              <InputComponent
                placeHold="Họ và tên"
                onChangeText={val => onChangeUserInfo('fullName', val)}
                iconFirst={
                  <FontAwesome6
                    name="user"
                    size={18}
                    color={appColors.buttonPrimary}
                  />
                }
              />
              {errors['fullName'] && (
                <TextComponent
                  label={errors['fullName']}
                  color={appColors.error}
                  styles={{marginLeft: 24}}
                  size={14}
                />
              )}
              <InputComponent
                placeHold="Email"
                iconFirst={
                  <Entypo
                    name="address"
                    size={18}
                    color={appColors.buttonPrimary}
                  />
                }
                onChangeText={val => onChangeUserInfo('email', val)}
              />
              {errors['email'] && (
                <TextComponent
                  label={errors['email']}
                  color={appColors.error}
                  styles={{marginLeft: 24}}
                  size={14}
                />
              )}
              <InputComponent
                placeHold="Mật khẩu"
                iconFirst={
                  <Feather
                    name="lock"
                    size={18}
                    color={appColors.buttonPrimary}
                  />
                }
                isPass
                onChangeText={val => onChangeUserInfo('password', val)}
              />
              {errors['password'] && (
                <TextComponent
                  label={errors['password']}
                  color={appColors.error}
                  styles={{marginLeft: 24}}
                  size={14}
                />
              )}
              <InputComponent
                isPass
                placeHold="Xác nhận mật khẩu"
                onChangeText={val => onChangeUserInfo('confirmPassword', val)}
                iconFirst={
                  <Feather
                    name="lock"
                    size={18}
                    color={appColors.buttonPrimary}
                  />
                }
              />
              {errors['confirmPassword'] && (
                <TextComponent
                  label={errors['confirmPassword']}
                  color={appColors.error}
                  styles={{marginLeft: 24}}
                  size={14}
                />
              )}
              <CheckBox
                isPlaceHoldColor={errors['codeBy']}
                isBorderColor={errors['role']}
                code={userInfo.codeBy}
                setCode={val => onChangeUserInfo('codeBy', val)}
                onSelect={id => onChangeUserInfo('role', id)}
                label="Vai trò"
                data={[
                  {id: 'leader', name: 'Quản lý'},
                  {id: 'staff', name: 'Nhân viên'},
                ]}
              />

              {errors['other'] && (
                <TextComponent
                  label={errors['other']}
                  color={appColors.error}
                  styles={{marginLeft: 24}}
                  size={14}
                />
              )}
            </View>
            <ButtonComponent
              disable={isLoading}
              label="Đăng ký"
              styles={styles.loginButton}
              labelColor={appColors.white}
              onPress={handleVerifyUser}
            />
            <RowComponent styles={{gap: 8, marginBottom: 12}}>
              <TextComponent
                label="Đã có tài khoản?"
                styles={styles.footerText}
              />
              <ButtonComponent
                label="Đăng nhập"
                bgColor="transparent"
                labelColor="#3E8EDE"
                onPress={() => navigation.navigate('login')}
              />
            </RowComponent>
          </View>
        </ScrollView>
        <LoadingModal isVisible={isLoading} />
      </ContainerComponent>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {flexGrow: 1},
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputWrapper: {
    gap: 12,
    marginBottom: 24,
  },
  loginButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
    width: '88%',
  },
  loginText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    color: '#777',
  },
  forgotText: {
    textAlign: 'right',
    color: '#3E8EDE',
    marginTop: 4,
    marginBottom: 12,
    fontWeight: '500',
  },
});
