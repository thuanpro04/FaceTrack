import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeManageScreen from '../manage/home/HomeManageScreen';
const Stack = createNativeStackNavigator();
const ManageNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="home" component={HomeManageScreen} />
    </Stack.Navigator>
  );
};

export default ManageNavigator;

const styles = StyleSheet.create({});
