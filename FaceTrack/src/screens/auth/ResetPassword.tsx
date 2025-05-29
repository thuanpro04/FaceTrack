import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import InputComponent from '../../components/Input/InputComponent';
import {
  ButtonComponent,
  ContainerComponent,
  SpaceComponent,
  TextComponent,
} from '../../components/layout';
import appColors from '../../constants/appColors';
import {authServices} from '../../services/authServices';
import {useRoute} from '@react-navigation/native';
import {showNotificating} from '../../utils/ShowNotification';
const ResetPassword = ({navigation}: any) => {
  const {email} = useRoute().params as {email: string};
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleResetPassword = async () => {
    if (!password) {
      setError('Vui lòng nhập mật khẩu.');
      return;
    }
    const passwordRegex =
      /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
    if (!passwordRegex.test(password)) {
      setError('Mật khẩu tối thiểu 6 ký tự và có ký tự đặc biệt');
      return;
    }
    setIsLoading(true);
    const res = await authServices.resetPassword({email, password});
    if (res?.data) {
      setTimeout(() => {
        showNotificating.activity(
          'success',
          'Cập nhật thành công',
          'Vui lòng đăng nhập lại với mật khẩu mới.',
        );
        navigation.navigate('login');
        setIsLoading(false);
      }, 1200);
    }
  };
  return (
    <ContainerComponent styles={styles.container}>
      <SpaceComponent height={50} />
      <View style={styles.main}>
        <TextComponent label="FaceTrack" title />
        <TextComponent label="Đặt lại mật khẩu mới" styles={styles.subtitle} />
        <View style={styles.inputWrapper}>
          <InputComponent
            placeHold="Nhập mật khẩu mới"
            isPass
            iconFirst={
              <Feather name="lock" size={18} color={appColors.buttonPrimary} />
            }
            onChangeText={setPassword}
          />
          {error && (
            <TextComponent
              label={error}
              color={appColors.error}
              styles={{marginLeft: 24}}
              size={14}
            />
          )}
        </View>
        <ButtonComponent
          label="Đổi mật khẩu"
          styles={styles.resetButton}
          labelColor={appColors.white}
          onPress={handleResetPassword}
        />
        <TouchableOpacity onPress={() => navigation.navigate('login')}>
          <TextComponent label="← Quay lại đăng nhập" styles={styles.back} />
        </TouchableOpacity>
      </View>
    </ContainerComponent>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {},
  main: {
    flex: 1,
    alignItems: 'center',
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
  resetButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
    width: '88%',
  },
  back: {
    marginTop: 16,
    color: appColors.primary,
    fontSize: 14,
  },
});
