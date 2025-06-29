import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet} from 'react-native';
import PaymentScreen from '../PaymentScreen/PaymentScreen';
import AuthNavigator from './AuthNavigator';
import StaffNavigator from './StaffNavigator';
import SettingScreen from '../setting/SettingScreen';
const Stack = createNativeStackNavigator();
const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="homestaff">
      <Stack.Screen name="auth" component={AuthNavigator} />
      <Stack.Screen name="homestaff" component={StaffNavigator} />
      <Stack.Screen name="payment" component={PaymentScreen} />
      <Stack.Screen name="settings" component={SettingScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({});
