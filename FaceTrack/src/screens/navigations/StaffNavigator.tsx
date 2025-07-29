import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AttendanceHistoryScreen from '../Staff/attendancehistory/AttendanceHistoryScreen';
import AwaitingModerationScreen from '../Staff/awaitingmoderation/AwaitingModerationScreen';
import Dashboard from '../Staff/dashboard/Dashboard';
import ExpandScreen from '../Staff/Expand/ExpandScreen';
import FaceRecognitionScreen from '../Staff/FaceRecognition/FaceRecognitionScreen';
import SetupFaceIdScreen from '../Staff/FaceRecognition/SetupFaceIdScreen';
import HomeStaffScreen from '../Staff/home/HomeStaffScreen';
import ManageListScreen from '../Staff/managelist/ManageListScreen';
import NotificationScreen from '../Staff/notification/NotificationScreen';
import MultiStepProfileSetUp from '../Staff/profile/MultiStepProfileSetUp';
import TutorialFaceScreen from '../Staff/profile/TutorialFaceScreen';
import StatiticsScreen from '../Staff/statitics/StatiticsScreen';
const Stack = createNativeStackNavigator();
const StaffNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="home" component={HomeStaffScreen} />
      <Stack.Screen name="face-scan" component={FaceRecognitionScreen} />
      <Stack.Screen name="edit" component={MultiStepProfileSetUp} />
      <Stack.Screen name="setup-face" component={SetupFaceIdScreen} />
      <Stack.Screen name="tutorial-face" component={TutorialFaceScreen} />
      <Stack.Screen
        name="attendance-history"
        component={AttendanceHistoryScreen}
      />
      <Stack.Screen name="awaiting" component={AwaitingModerationScreen} />
      <Stack.Screen name="manage-list" component={ManageListScreen} />
      <Stack.Screen name="statistics" component={StatiticsScreen} />
      <Stack.Screen name="expand" component={ExpandScreen} />
      <Stack.Screen name="notifi" component={NotificationScreen} />
      <Stack.Screen name="dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
};

export default StaffNavigator;
