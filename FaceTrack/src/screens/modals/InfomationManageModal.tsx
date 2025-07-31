import {Image, Modal, StyleSheet, Text, View, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import appColors from '../../constants/appColors';
import {
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../components/layout';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {appSize} from '../../constants/appSize';
import ButtonAnimation from '../../components/layout/ButtonAnimation';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
  visible: boolean;
  onClose: () => void;
  user: any;
}

const InfomationManageModal = (props: Props) => {
  const {visible, onClose, user} = props;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 120,
          friction: 7,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none">
      <Animated.View style={[styles.overlay, {opacity: fadeAnim}]}>
        <Animated.View style={[styles.main, {transform: [{scale: scaleAnim}]}]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Thông tin quản lý</Text>
            <ButtonAnimation onPress={onClose} styles={styles.closeBtn}>
              <AntDesign name="close" size={16} color={appColors.gray} />
            </ButtonAnimation>
          </View>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {user?.profileImageUrl ? (
                <Image
                  source={{uri: user.profileImageUrl}}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.placeholderAvatar]}>
                  <AntDesign name="user" size={24} color={appColors.gray} />
                </View>
              )}
            </View>
            <TextComponent
              label={user?.fullName || 'Người dùng'}
              styles={styles.userName}
            />
          </View>

          {/* Info List */}
          <View style={styles.infoList}>
            <RowComponent styles={styles.infoItem}>
              <FontAwesome name="phone" size={16} color={appColors.primary} />

              <TextComponent
                label={`0${user?.phone}` || 'Chưa cập nhật'}
                styles={styles.infoText}
              />
            </RowComponent>

            <RowComponent styles={styles.infoItem}>
              <AntDesign name="man" size={16} color={appColors.primary} />
              <TextComponent
                label={
                  user?.gender == 'nam'
                    ? 'Nam'
                    : user?.gender === 'nữ'
                    ? 'Nữ'
                    : 'Chưa cập nhật'
                }
                styles={styles.infoText}
              />
            </RowComponent>

            <RowComponent styles={styles.infoItem}>
              <MaterialIcons name="email" size={16} color={appColors.primary} />
              <TextComponent
                label={user?.email || 'Chưa cập nhật'}
                styles={styles.infoText}
              />
            </RowComponent>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default InfomationManageModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  main: {
    backgroundColor: appColors.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: 300,
    paddingVertical: 20,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.text,
    flex: 1,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: appColors.textGrey + '33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: appColors.primary + '20',
  },
  placeholderAvatar: {
    backgroundColor: appColors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.text,
    textAlign: 'center',
  },
  infoList: {
    gap: 16,
  },
  infoItem: {},
  infoText: {
    fontSize: 15,
    color: appColors.text,
    marginLeft: 12,
    flex: 1,
  },
});
