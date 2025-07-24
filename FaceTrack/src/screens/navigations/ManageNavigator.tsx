import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeManageScreen from '../manage/home/HomeManageScreen';
import AddEmployeeScreen from '../manage/addEmployee/AddEmployeeScreen';
import AttendanceScreen from '../manage/attendance/AttendanceScreen';
import TaskManagementScreen from '../manage/taskManagement/TaskManagementScreen';
import ReportScreen from '../manage/reports/ReportScreen';
import SendNotificationScreen from '../manage/sendNotification/SendNotificationScreen';
import SettingScreen from '../manage/settings/SettingScreen';
const Stack = createNativeStackNavigator();
const ManageNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="home" component={HomeManageScreen} />
      <Stack.Screen name="addEmployee" component={AddEmployeeScreen} />
      <Stack.Screen name="attendance" component={AttendanceScreen} />
      <Stack.Screen name="taskmanage" component={TaskManagementScreen} />
      <Stack.Screen name="reports" component={ReportScreen} />
      <Stack.Screen name="settingmanage" component={SettingScreen} />

      <Stack.Screen
        name="sendNotification"
        component={SendNotificationScreen}
      />
    </Stack.Navigator>
  );
};

export default ManageNavigator;

const styles = StyleSheet.create({});
