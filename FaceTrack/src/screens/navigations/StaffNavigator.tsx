import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeStaffScreen from '../Staff/home/HomeStaffScreen';
import FaceRecognitionScreen from '../Staff/FaceRecognition/FaceRecognitionScreen';
import EditProfileScreen from '../Staff/profile/EditProfileScreen';
import SetupFaceIdScreen from '../Staff/FaceRecognition/SetupFaceIdScreen';
import TutorialFaceScreen from '../Staff/profile/TutorialFaceScreen';
import AttendanceHistoryScreen from '../Staff/attendancehistory/AttendanceHistoryScreen';
import AwaitingModerationScreen from '../Staff/awaitingmoderation/AwaitingModerationScreen';
import ManageListScreen from '../Staff/managelist/ManageListScreen';
import StatiticsScreen from '../Staff/statitics/StatiticsScreen';
import ExpandScreen from '../Staff/Expand/ExpandScreen';
const Stack = createNativeStackNavigator();
const StaffNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="home" component={HomeStaffScreen} />
      <Stack.Screen name="face-scan" component={FaceRecognitionScreen} />
      <Stack.Screen name="edit" component={EditProfileScreen} />
      <Stack.Screen name="setup-face" component={SetupFaceIdScreen} />
      <Stack.Screen name="tutorial-face" component={TutorialFaceScreen} />
      <Stack.Screen name="attendance-history" component={AttendanceHistoryScreen} />
      <Stack.Screen name="awaiting" component={AwaitingModerationScreen} />
      <Stack.Screen name="manage-list" component={ManageListScreen} />
      <Stack.Screen name="statitics" component={StatiticsScreen} />
      <Stack.Screen name="expand" component={ExpandScreen} />

      
    </Stack.Navigator>
  );
};

export default StaffNavigator;
