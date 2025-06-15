import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TextComponent } from '../../../components/layout';
import appColors from '../../../constants/appColors';

const NoCameraDeviceError = () => {
  return (
    <View style={styles.centered}>
      <View style={styles.errorIconContainer}>
        <MaterialIcons name="camera-alt" size={80} color={appColors.error} />
      </View>
      <TextComponent label="Không tìm thấy camera" styles={styles.errorTitle} />
      <TextComponent
        label="Vui lòng kiểm tra thiết bị của bạn"
        styles={styles.errorSubtitle}
      />
    </View>
  );
};

export default NoCameraDeviceError;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorIconContainer: {
    width: 120,
    height: 120,
    backgroundColor: `${appColors.error}20`,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: appColors.error,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: appColors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
});
