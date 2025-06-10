import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet} from 'react-native';
import HomeScreen from '../HomeScreen/HomeScreen';
import PaymentScreen from '../PaymentScreen/PaymentScreen';
import AuthNavigator from './AuthNavigator';
import FaceRecognitionScreen from '../FaceRecognition/FaceRecognitionScreen';
import EditProfileScreen from '../profile/EditProfileScreen';
import SetupFaceID from '../FaceRecognition/SetupFaceID';
import TutorialFace from '../profile/TutorialFace';
const Stack = createNativeStackNavigator();
const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="home">
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="payment" component={PaymentScreen} />
      <Stack.Screen name="auth" component={AuthNavigator} />
      <Stack.Screen name="face-scan" component={FaceRecognitionScreen} />
      <Stack.Screen name="edit" component={EditProfileScreen} />
      <Stack.Screen name="setup-face" component={SetupFaceID} />
      <Stack.Screen name="tutorial-face" component={TutorialFace} />

    </Stack.Navigator>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({});
