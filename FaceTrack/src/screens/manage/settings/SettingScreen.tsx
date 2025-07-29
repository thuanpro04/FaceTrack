import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {removeAuth} from '../../../redux/slices/authSlice';

const SettingScreen = ({navigation}: any) => {
  const dispath = useDispatch();
  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    dispath(removeAuth());
    navigation.navigate('auth');
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button onPress={handleLogout} title="Logout" />
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({});
