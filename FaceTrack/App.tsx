import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import CameraVision from './src/screen/CameraVision';
import {useCameraPermission} from 'react-native-vision-camera';

const App = () => {
  const {hasPermission, requestPermission} = useCameraPermission();
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  },[hasPermission]);
  return <CameraVision />;
};

export default App;

const styles = StyleSheet.create({});
