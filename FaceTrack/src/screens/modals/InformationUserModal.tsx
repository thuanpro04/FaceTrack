import {Image, Modal, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import appColors from '../../constants/appColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {appSize} from '../../constants/appSize';
import {infoBase} from '../data/user.type';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ButtonAnimation from '../../components/layout/ButtonAnimation';
import {RowComponent, TextComponent} from '../../components/layout';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
interface Props {
  visible: boolean;
  onClose: () => void;
  user: infoBase;
}
const InformationUserModal = (props: Props) => {
  const {visible, onClose, user} = props;
  const getGenderIcon = (gender?: 'nam' | 'nữ' | 'khác') => {
    switch (gender) {
      case 'nam':
        return 'male';
      case 'nữ':
        return 'female';
      default:
        return 'male-female';
    }
  };
  const getGenderDisplay = (gender?: 'nam' | 'nữ' | 'khác') => {
    switch (gender) {
      case 'nam':
        return 'Nam';
      case 'nữ':
        return 'Nữ';
      case 'khác':
        return 'Khác';
      default:
        return 'Chưa cập nhật';
    }
  };
  const HeaderComponent = () => {
    return (
      <View style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <ButtonAnimation onPress={onClose} styles={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </ButtonAnimation>
        </View>
        {/* Profile Section trong header */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user.profileImageUrl ? (
              <Image
                source={{uri: user.profileImageUrl}}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.defaultAvatar}>
                <FontAwesome name="user" size={32} color="#FFFFFF" />
              </View>
            )}
            <View style={styles.avatarBorder} />
          </View>
          <TextComponent
            label={user.fullName ?? 'Người dùng'}
            styles={styles.fullName}
          />
          <TextComponent label={'Nhân viên'} styles={styles.userRole} />
        </View>
      </View>
    );
  };

  const BodyComponent = () => {
    return (
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <RowComponent styles={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <MaterialIcons name="work" size={20} color="#4F46E5" />
            </View>
            <TextComponent
              label={user.staff.totalWorkplaces.toString() ?? '0'}
              styles={styles.statNumber}
            />
            <TextComponent label={'Nơi làm việc'} styles={styles.statLabel} />
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <MaterialIcons name="timeline" size={20} color="#059669" />
            </View>
            <TextComponent
              label={user.staff.experience.toString() ?? '0'}
              styles={styles.statNumber}
            />
            <TextComponent
              label={'Năm kinh nghiệm'}
              styles={styles.statLabel}
            />
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <MaterialIcons name="stars" size={20} color="#DC2626" />
            </View>
            <TextComponent
              label={user.staff.skills?.length.toString() ?? '0'}
              styles={styles.statNumber}
            />
            <TextComponent label={'Kỹ năng'} styles={styles.statLabel} />
          </View>
        </RowComponent>
        {/* Contact Info */}
        <View style={styles.section}>
          <TextComponent
            label="Thông tin liên hệ"
            styles={styles.sectionTitle}
          />
          <View style={styles.card}>
            <RowComponent styles={styles.infoItem}>
              <View style={[styles.iconWrapper, {backgroundColor: '#EF4444'}]}>
                <Ionicons name="call" size={18} color="#FFFFFF" />
              </View>
              <View style={styles.infoContent}>
                <TextComponent
                  label="Số điện thoại"
                  styles={styles.infoLabel}
                />
                <TextComponent label={user.phone} styles={styles.infoValue} />
              </View>
            </RowComponent>
            <View style={styles.divider} />
            <RowComponent styles={styles.infoItem}>
              <View style={[styles.iconWrapper, {backgroundColor: '#10B981'}]}>
                <Ionicons name="location" size={18} color="#FFFFFF" />
              </View>
              <View style={styles.infoContent}>
                <TextComponent label="Địa chỉ" styles={styles.infoLabel} />
                <TextComponent
                  label={user.location}
                  styles={styles.infoValue}
                />
              </View>
            </RowComponent>
          </View>
        </View>
        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          <View style={styles.card}>
            <RowComponent styles={styles.infoItem}>
              <View style={[styles.iconWrapper, {backgroundColor: '#8B5CF6'}]}>
                <Ionicons
                  name={getGenderIcon(user.gender)}
                  size={18}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.infoContent}>
                <TextComponent label="Giới tính" styles={styles.infoLabel} />
                <TextComponent
                  label={getGenderDisplay(user.gender)}
                  styles={styles.infoValue}
                />
              </View>
            </RowComponent>

            <View style={styles.divider} />

            <RowComponent styles={styles.infoItem}>
              <View style={[styles.iconWrapper, {backgroundColor: '#F59E0B'}]}>
                <Ionicons name="calendar" size={18} color="#FFFFFF" />
              </View>
              <View style={styles.infoContent}>
                <TextComponent label="Ngày sinh" styles={styles.infoLabel} />
                <TextComponent
                  label={user.birthDay?.toString() ?? '24/03/2004'}
                  styles={styles.infoValue}
                />
              </View>
            </RowComponent>
          </View>
        </View>
        {user.staff?.skills && user.staff?.skills.length > 0 && (
          <View style={styles.section}>
            <TextComponent
              label="Kỹ năng chuyên môn"
              styles={styles.sectionTitle}
            />
            <View style={styles.card}>
              <View style={styles.skillsContainer}>
                {user.staff.skills.map((skill, index) => (
                  <View key={index} style={styles.skillChip}>
                    <TextComponent label={skill} styles={styles.skillText} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
        {user.staff.bio && (
          <View style={styles.section}>
            <TextComponent
              label={'Giới thiệu bản thân'}
              styles={styles.sectionTitle}
            />
            <View style={styles.card}>
              <TextComponent label={user.staff.bio} styles={styles.bioText} />
            </View>
          </View>
        )}
      </ScrollView>
    );
  };
  return (
    <Modal
      style={styles.modalContainer}
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <HeaderComponent />
          {/* Body content */}
          <BodyComponent />
        </View>
      </View>
    </Modal>
  );
};

export default InformationUserModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    minHeight: '70%',
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    backgroundColor: '#4F46E5',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 20,
    position: 'relative',
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 5,
    borderWidth: 4,
    borderColor: appColors.card,
  },
  defaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: appColors.card,
  },
  avatarBorder: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 54,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  fullName: {
    fontSize: appSize.title,
    fontWeight: '700',
    color: appColors.white,
    marginBottom: 4,
    textAlign: 'center',
  },
  userRole: {
    fontSize: appSize.body,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: appColors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(79,70,229,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 8,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: appColors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoItem: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
    marginLeft: 52,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#374151',
    fontWeight: '400',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  skillText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
});
