import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
const ManageNavigator = () => {
  return (
    <View>
      <Text>ManageNavigator</Text>
    </View>
  );
};

export default ManageNavigator;

const styles = StyleSheet.create({});
