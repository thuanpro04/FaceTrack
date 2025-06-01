import {PermissionsAndroid, Platform} from 'react-native';
import Toast from 'react-native-toast-message';

const activity = (
  type: 'success' | 'error' | 'info',
  text1: string,
  text2: string,
) => {
  Toast.show({
    type,
    text1,
    text2,
    position: 'top',
    visibilityTime: 3000,
  });
};
const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Yêu cầu quyền truy cập vị trí',
        message: 'Ứng dụng cần truy cập vị trí của bạn',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};
export const showNotificating = {activity, requestLocationPermission};
