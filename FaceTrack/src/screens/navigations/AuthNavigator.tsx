import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomToFaceTrack from '../WelcomToFaceTrack';
import LoginScreen from '../auth/LoginScreen';
import SignUpScreen from '../auth/SignUpScreen';
import ForgotPasswordScreen from '../auth/ForgotPasswordScreen';
import Verification from '../auth/Verification';
import ResetPassword from '../auth/ResetPassword';

const Stack = createNativeStackNavigator();
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="login">
      <Stack.Screen name="welcom" component={WelcomToFaceTrack} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="signup" component={SignUpScreen} />
      <Stack.Screen name="forgot" component={ForgotPasswordScreen} />
      <Stack.Screen name="verification" component={Verification} />
      <Stack.Screen name="reset" component={ResetPassword} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

const styles = StyleSheet.create({});
