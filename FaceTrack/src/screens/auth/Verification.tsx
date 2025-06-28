import {useFocusEffect, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {
  ButtonComponent,
  ContainerComponent,
  TextComponent,
} from '../../components/layout';
import appColors from '../../constants/appColors';
import {authServices} from '../../services/authServices';
import {showNotificating} from '../../utils/ShowNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {addAuth} from '../../redux/slices/authSlice';
import LoadingModal from '../modals/LoadingModal';
const Verification = ({navigation}: any) => {
  const {code, email, key, userInfo} = useRoute().params as {
    code: string;
    email: string;
    key?: string;
    userInfo?: string;
  };
  const [currentCode, setCurrentCode] = useState(code);
  const [codeValue, setCodeValue] = useState<any[]>(['', '', '', '']);
  const [timeLimit, setTimeLimit] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const reference = useRef<TextInput>(null);
  const reference2 = useRef<TextInput>(null);
  const reference3 = useRef<TextInput>(null);
  const reference4 = useRef<TextInput>(null);
  const dispath = useDispatch();
  const handleCode = (val: string, index: number) => {
    const data = [...codeValue];
    data[index] = val;
    setCodeValue(data);
  };
  const checkCodeValue = () => {
    return codeValue.join('') === currentCode.toString();
  };
  const handleVerify = async () => {
    navigation.navigate('reset', {email});
  };
  const handleSignupUser = async () => {
    reference4.current?.blur();
    setIsLoading(true);
    const res = await authServices.signupUser(userInfo);
    if (res?.data) {
      setTimeout(async () => {
        dispath(addAuth(res.data));
        showNotificating.activity(
          'success',
          'Tạo tài khoản thành công!',
          'Chào mừng bạn đến với FaceTrack 🎉',
        );
        await AsyncStorage.setItem('user', JSON.stringify(res.data));
      }, 1200);
    }
    setIsLoading(false);
  };

  const handleActionUser = async () => {
    const isEqual = checkCodeValue();
    if (isEqual) {
      key === 'register' ? await handleSignupUser() : await handleVerify();
    } else {
      showNotificating.activity(
        'error',
        'Mã xác nhận không đúng',
        'Hãy kiểm tra lại mã và thử lại.',
      );
      setCodeValue(['', '', '', '']);
      reference.current?.focus();
    }
  };
  const handleSendVerifi = async () => {
    if (timeLimit > 0) {
      return;
    }
    setIsLoading(true);
    const res = await authServices.sendVerification(email, key);
    if (res?.data) {
      console.log(res.data.code);

      setCurrentCode(res.data.code);
      console.log('Gửi lại mã thành công!!!');
      showNotificating.activity(
        'success',
        'Gửi mã code lại thành công!',
        'Vui lòng kiểm tra email của bạn 📬',
      );
      setCodeValue(['', '', '', '']);
      setTimeLimit(60);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (timeLimit > 0) {
      const interval = setInterval(() => {
        setTimeLimit(time => time - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLimit]);
  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        reference.current?.focus();
      }, 200);
    }, []),
  );
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
          label="Nhập mã xác minh đã gửi đến email của bạn"
          styles={styles.subtitle}
        />
        <View style={styles.inputWrapper}>
          <TextInput
            ref={reference}
            value={codeValue[0]}
            onChangeText={text => {
              if (text.length > 0) {
                reference2.current?.focus();
              }
              handleCode(text, 0);
            }}
            keyboardType="number-pad"
            placeholderTextColor={appColors.textGrey}
            placeholder="-"
            maxLength={1}
            style={styles.input}
          />
          <TextInput
            ref={reference2}
            value={codeValue[1]}
            onChangeText={text => {
              if (text.length > 0) {
                reference3.current?.focus(); // sang ô tiếp
              }
              handleCode(text, 1);
            }}
            keyboardType="number-pad"
            placeholderTextColor={appColors.textGrey}
            placeholder="-"
            maxLength={1}
            style={styles.input}
          />
          <TextInput
            ref={reference3}
            value={codeValue[2]}
            onChangeText={text => {
              if (text.length > 0) {
                reference4.current?.focus();
              }
              handleCode(text, 2);
            }}
            keyboardType="number-pad"
            placeholderTextColor={appColors.textGrey}
            placeholder="-"
            maxLength={1}
            style={styles.input}
          />
          <TextInput
            ref={reference4}
            value={codeValue[3]}
            onChangeText={text => {
              handleCode(text, 3);
            }}
            keyboardType="number-pad"
            placeholderTextColor={appColors.textGrey}
            placeholder="-"
            maxLength={1}
            style={styles.input}
          />
        </View>
        <ButtonComponent
          disable={timeLimit < 0 || codeValue.length < 4 || isLoading}
          label={`Xác minh`}
          styles={styles.verifyButton}
          labelColor={appColors.white}
          onPress={handleActionUser}
        />
        <TextComponent
          label={`Bạn chưa nhận được mã? ( ${timeLimit}s)`}
          styles={styles.footerText}
        />
        <ButtonComponent
          disable={timeLimit > 0}
          label="Gửi lại mã"
          bgColor="transparent"
          labelColor={appColors.buttonPrimary}
          onPress={handleSendVerifi}
        />
      </View>
      <LoadingModal isVisible={isLoading} />
    </ContainerComponent>
  );
};

export default Verification;

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
    flexDirection: 'row',
  },
  verifyButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
    width: '88%',
  },
  footerText: {
    textAlign: 'center',
    color: appColors.secondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    height: 55,
    width: 55,
    textAlign: 'center',
    borderRadius: 12,
    borderColor: appColors.textGrey,
    fontSize: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
