import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useCameraPermission} from 'react-native-vision-camera';
import appColors from '../../../constants/appColors';
import { TextComponent } from '../../../components/layout';
const PermissionsPage = () => {
  const {requestPermission} = useCameraPermission();
  return (
    <View style={styles.centered}>
      <View style={styles.permissionIconContainer}>
        <MaterialIcons name="camera-alt" size={80} color={appColors.primary} />
      </View>
      <TextComponent
        label="Cần quyền truy cập camera"
        styles={styles.permissionTitle}
      />
      <TextComponent
        label=" Để sử dụng tính năng chấm công bằng khuôn mặt"
        styles={styles.permissionSubtitle}
      />
      <TouchableOpacity
        style={styles.permissionBtn}
        onPress={requestPermission}
        activeOpacity={0.8}>
        <MaterialIcons name="security" size={20} color="white" />
        <Text style={styles.permissionBtnText}>Cấp quyền truy cập</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PermissionsPage;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  permissionIconContainer: {
    width: 120,
    height: 120,
    backgroundColor: `${appColors.primary}20`,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: appColors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionSubtitle: {
    fontSize: 16,
    color: appColors.gray,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  permissionBtn: {
    backgroundColor: appColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    elevation: 4,
    shadowColor: appColors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  permissionBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
