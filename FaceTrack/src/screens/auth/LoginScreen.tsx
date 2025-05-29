import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  TextComponent,
} from '../../components/layout';
import appColors from '../../constants/appColors';
import RowComponent from '../../components/layout/RowComponent';
import Feather from 'react-native-vector-icons/Feather';
import InputComponent from '../../components/Input/InputComponent';
import Entypo from 'react-native-vector-icons/Entypo';
import {authServices} from '../../services/authServices';
import {useDispatch} from 'react-redux';
import {addAuth} from '../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showNotificating} from '../../utils/ShowNotification';
import LoadingModal from '../modals/LoadingModal';

const LoginScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const dispath = useDispatch();
  function checkError() {
    const newErrors: any = {};
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  const handleLogin = async () => {
    const isValid = checkError();
    if (!isValid) return;
    setIsLoading(true);
    try {
      const res = await authServices.loginUser({email, password});
      if (res?.data) {
        setTimeout(async() => {
          dispath(addAuth(res.data));
          await AsyncStorage.setItem('user', JSON.stringify(res.data));
          showNotificating.activity(
            'success',
            'Đăng nhập thành công!',
            'Chào mừng bạn đến với FaceTrack 🎉',
          );
          // Điều hướng sang màn hình chính sau khi loading xong (nếu muốn)
          // navigation.replace('Home'); // Hoặc navigation.navigate(...)
          setIsLoading(false);
        }, 1200); // hoặc 1500ms tùy gu
      }
    } catch (error: any) {
      setIsLoading(false);
      showNotificating.activity(
        'error',
        '😓 Đăng nhập không thành công!',
        'Vui lòng kiểm tra lại tài khoản hoặc thử lại sau.',
      );
      console.log('Login fail: ', error.response.data.message);
      setErrors({other: error.response.data.message});
    }
  };

  return (
    <ContainerComponent>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <Image
            source={require('../../assets/img/Ice-skating.png')}
            style={{height: 45, width: 45}}
          />
          <TextComponent label="FaceTrack" styles={styles.title} title />
          <TextComponent
            label="Đăng nhập để tiếp tục"
            styles={styles.subtitle}
          />
          <View style={styles.inputWrapper}>
            <InputComponent
              placeHold="Email"
              iconFirst={
                <Entypo
                  name="address"
                  size={18}
                  color={appColors.buttonPrimary}
                />
              }
              onChangeText={setEmail}
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
              isPass
              iconFirst={
                <Feather
                  name="lock"
                  size={18}
                  color={appColors.buttonPrimary}
                />
              }
              onChangeText={setPassword}
            />
            {errors['password'] && (
              <TextComponent
                label={errors['password']}
                color={appColors.error}
                styles={{marginLeft: 24}}
                size={14}
              />
            )}
            {errors['other'] && (
              <TextComponent
                label={errors['other']}
                color={appColors.error}
                styles={{marginLeft: 24}}
                size={14}
              />
            )}
            <TouchableOpacity
              onPress={() => navigation.navigate('forgot')}
              style={{marginRight: 22}}>
              <TextComponent
                label="Quên mật khẩu?"
                styles={styles.forgotText}
              />
            </TouchableOpacity>
          </View>
          <ButtonComponent
            disable={isLoading}
            label="Đăng nhập"
            styles={styles.loginButton}
            labelColor={appColors.white}
            onPress={handleLogin}
          />
          <RowComponent styles={{gap: 8, marginBottom: 12}}>
            <TextComponent
              label="Chưa có tài khoản?"
              styles={styles.footerText}
            />
            <ButtonComponent
              label="Đăng ký"
              bgColor="transparent"
              labelColor="#3E8EDE"
              onPress={() => navigation.navigate('signup')}
            />
          </RowComponent>
        </View>
      </ScrollView>
      <LoadingModal isVisible={isLoading} />
    </ContainerComponent>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
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
