import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {TextComponent} from '../../components/layout';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import appColors from '../../constants/appColors';

interface Props {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void; // Hàm điều hướng sang trang thanh toán
}

const PlanBannerModal = ({visible, onClose, onUpgrade}: Props) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Nút đóng */}
          <View style={styles.header}>
            <EvilIcons
              name="close"
              size={28}
              color={appColors.iconDefault}
              onPress={onClose}
            />
          </View>

          {/* Tiêu đề */}
          <TextComponent
            label="✨Gói Free đang được kích hoạt – Hãy khám phá ngay!"
            title
            styles={{fontSize: 26.5, fontStyle: 'italic'}}
          />

          {/* Nội dung */}
          <TextComponent
            label="Gói miễn phí 30 ngày cho tối đa 60 người dùng"
            styles={styles.description}
          />
          <Text style={styles.divider}>────────── hoặc ──────────</Text>

          {/* Thông tin gói Premium */}
          <View style={styles.premiumBox}>
            <TextComponent
              label="🔥 Nâng cấp lên Premium"
              styles={styles.premiumTitle}
            />
            <TextComponent
              label="Không giới hạn người dùng • Hỗ trợ 24/7 • Tính năng nâng cao"
              styles={styles.premiumDescription}
            />

            <TouchableOpacity style={styles.upgradeBtn} onPress={onUpgrade}>
              <TextComponent
                label="Nâng cấp ngay"
                styles={styles.upgradeText}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PlanBannerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: appColors.background,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
  },
  description: {
    fontSize: 14,
    color: appColors.textSecondary,
    textAlign: 'center',
  },
  divider: {
    color: appColors.textSecondary,
    marginVertical: 8,
  },
  premiumBox: {
    backgroundColor: appColors.primary,
    borderRadius: 10,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  premiumDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  upgradeBtn: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  upgradeText: {
    color: appColors.primary,
    fontWeight: 'bold',
  },
});
