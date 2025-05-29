import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  TextComponent,
} from '../../components/layout';
import appColors from '../../constants/appColors';
import InputComponent from '../../components/Input/InputComponent';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {showNotificating} from '../../utils/ShowNotification';
import {authServices} from '../../services/authServices';
const ForgotPasswordScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSendVerifi = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Vui lòng nhập gmail?');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError('Email không hợp lệ?');
      return;
    }
    setIsLoading(true);
    try {
      const res = await authServices.sendVerification(email);

      if (res?.data) {
        showNotificating.activity(
          'success',
          'Gửi mã code thành công!',
          'Vui lòng kiểm tra email của bạn 📬',
        );
        navigation.navigate('verification', {
          code: res.data.code,
          email: email,
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      console.log(error.response.data.message || error.messageF);
      setError(error.response.data.message);
      setIsLoading(false);
    }
  };
  return (
    <ContainerComponent styles={styles.container}>
      <FontAwesome6
        name="chevron-left"
        color={appColors.iconDefault}
        size={24}
        style={{marginLeft: 22}}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.main}>
        <TextComponent label="FaceTrack" title />

        <TextComponent
          label="Nhập email để đặt lại mật khẩu"
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
          label="Gửi liên kết"
          styles={styles.resetButton}
          labelColor={appColors.white}
          onPress={handleSendVerifi}
        />
      </View>
    </ContainerComponent>
  );
};

export default ForgotPasswordScreen;

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
});
