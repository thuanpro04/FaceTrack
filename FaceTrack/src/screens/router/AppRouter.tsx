import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addAuth, authSelector} from '../../redux/slices/authSlice';
import AuthNavigator from '../navigations/AuthNavigator';
import MainNavigator from '../navigations/MainNavigator';
import SplashScreen from '../SplashScreen';
import {useCameraPermission} from 'react-native-vision-camera';
import {showNotificating} from '../../utils/ShowNotification';
const AppRouter = () => {
  const {getItem, setItem} = useAsyncStorage('user');
  const [isShowSplash, setIsShowSplash] = useState(true);
  const {hasPermission, requestPermission} = useCameraPermission();

  const auth = useSelector(authSelector);
  const dispath = useDispatch();
  const checkLogin = async () => {
    const data: any = await getItem();
    const user = JSON.parse(data);
    dispath(addAuth(user));
  };

  useEffect(() => {
    checkLogin();
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);
 
  return (
    <>
      {isShowSplash ? (
        <SplashScreen />
      ) : auth?.accessToken ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </>
  );
};
export default AppRouter;

const styles = StyleSheet.create({});
