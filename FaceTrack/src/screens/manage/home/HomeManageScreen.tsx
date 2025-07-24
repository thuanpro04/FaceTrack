import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components/layout';
import {useSelector} from 'react-redux';
import {authSelector} from '../../../redux/slices/authSlice';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {appSize} from '../../../constants/appSize';
import appColors from '../../../constants/appColors';
import ButtonAnimation from '../../../components/layout/ButtonAnimation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Clipboard from '@react-native-clipboard/clipboard';
import {showNotificating} from '../../../utils/ShowNotification';

const {width: screenWidth} = Dimensions.get('window');
const CONTAINER_PADDING = 16;
const CARD_MARGIN = 12;

const HomeManageScreen = ({navigation}: any) => {
  const [isCLoseNotifi, setIsCLoseNotifi] = useState(false);
  const auth = useSelector(authSelector);
  const copyToClipboard = (code: string) => {
    Clipboard.setString(code);
    ToastAndroid.showWithGravity(
      'Sao chép thành công',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  };
  const HeaderManageComponent = () => {
    return (
      <View style={styles.headerContainer}>
        <RowComponent styles={styles.headerMain}>
          <View style={styles.headerContent}>
            <TextComponent label="Xin chào" styles={styles.title} />
            <TextComponent label="Phan Minh Thuận" styles={styles.name} title />
            <TouchableOpacity
              onPress={() => copyToClipboard('ABCD234')}
              style={styles.codeContainer}>
              <TextComponent
                label={`Mã công ty: ${'ABCD234'}`}
                styles={styles.code}
              />
            </TouchableOpacity>
          </View>
          {auth.profileImageUrl ? (
            <ButtonAnimation
              onPress={() => console.log('ZOom')}
              styles={styles.btnImage}>
              <Image
                style={styles.avatar}
                source={{uri: auth.profileImageUrl}}
              />
            </ButtonAnimation>
          ) : (
            <View style={styles.avatarPlaceholder}>
              <EvilIcons
                name="user"
                size={appSize.iconLarge}
                color={appColors.iconDefault}
              />
            </View>
          )}
        </RowComponent>
      </View>
    );
  };

  const BannerComponent = () => {
    return (
      !isCLoseNotifi && (
        <View style={styles.bannerContainer}>
          <View style={styles.bannerContent}>
            <RowComponent styles={styles.bannerRow}>
              <AntDesign
                name="warning"
                color={'#FEC005'}
                size={appSize.iconMedium}
              />
              <View style={styles.bannerTextContainer}>
                <TextComponent
                  label="5 Nhân viên chưa điểm danh"
                  styles={styles.textNoti}
                />
                <TextComponent label={'9h30'} styles={styles.timePresent} />
              </View>
              <ButtonAnimation
                onPress={() => setIsCLoseNotifi(true)}
                styles={styles.closeBannerBtn}>
                <AntDesign
                  name="close"
                  color={appColors.iconDefault}
                  size={appSize.iconSmall}
                />
              </ButtonAnimation>
            </RowComponent>
          </View>
        </View>
      )
    );
  };

  const Advertisement = () => {
    return (
      <View style={styles.advertisementContainer}>
        <RowComponent styles={styles.advertisementRow}>
          <TextComponent
            label="Gói dùng thử"
            styles={styles.titleAdvertisement}
          />
          <MaterialIcons
            name="watch-later"
            size={appSize.iconMedium}
            color={'#FEC005'}
          />
        </RowComponent>
        <TextComponent
          label="Còn lại 25 ngày dùng thử miễn phí"
          styles={styles.description}
        />
        <TextComponent
          label="Nâng cấp Premium để sử dụng không giới hạn..."
          styles={styles.description}
        />
        <SpaceComponent height={12} />
        <ButtonAnimation
          styles={styles.btnPremium}
          onPress={() => console.log('Nâng cấp')}>
          <TextComponent
            label="Nâng cấp Premium - 55k/tháng"
            styles={styles.textBtnPremium}
          />
        </ButtonAnimation>
      </View>
    );
  };

  const Statistical = () => {
    const statisticsData = [
      {label: 'Tổng nhân...', value: '12', color: '#0079fd'},
      {label: 'Đang hoạt...', value: '10', color: '#2B793F'},
      {label: 'Có mặt', value: '8', color: '#11A5B6'},
      {label: 'Đi muộn', value: '2', color: '#F48c2f'},
    ];

    return (
      <View style={styles.statisticalContainer}>
        <TextComponent label="Thống kê nhanh" styles={styles.statistTitle} />
        <View style={styles.statisticsGrid}>
          {statisticsData.map((item, index) => (
            <View key={index} style={styles.statisticsItem}>
              <TextComponent
                label={item.value}
                styles={[styles.statistNum, {color: item.color}]}
              />
              <TextComponent label={item.label} styles={styles.statistLabel} />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const works = [
    {
      id: 1,
      label: 'Thêm nhân viên',
      icon: (
        <Ionicons name="person-add" size={appSize.iconSmall} color={'white'} />
      ),
      bgColor: '#4FAE52',
      screenName: 'addEmployee',
    },
    {
      id: 2,
      label: 'Xem điểm danh',
      icon: (
        <MaterialIcons
          name="watch-later"
          size={appSize.iconSmall}
          color={'#FFFFFF'}
        />
      ),
      bgColor: '#2196f3',
      screenName: 'attendance',
    },
    {
      id: 3,
      label: 'Quản lý công việc',
      icon: (
        <Ionicons name="bag-outline" size={appSize.iconSmall} color={'white'} />
      ),
      bgColor: '#9C28AF',
      screenName: 'taskmanage',
    },
    {
      id: 4,
      label: 'Báo cáo',
      icon: (
        <MaterialIcons
          name="insert-chart-outlined"
          size={appSize.iconMedium}
          color={'#FFFFFF'}
        />
      ),
      bgColor: '#FF9800',
      screenName: 'reports',
    },
    {
      id: 5,
      label: 'Cài đặt',
      icon: (
        <Ionicons
          name="settings-outline"
          size={appSize.iconSmall}
          color={'white'}
        />
      ),
      bgColor: '#607f8c',
      screenName: 'settingmanage',
    },
    {
      id: 6,
      label: 'Gửi thông báo',
      icon: (
        <Ionicons
          name="notifications-outline"
          size={appSize.iconSmall}
          color={'white'}
        />
      ),
      bgColor: '#F44437',
      screenName: 'sendNotification',
    },
  ];

  const RenderItems = () => {
    return (
      <View style={styles.statisticalContainer}>
        <TextComponent label="Thao tác nhanh" styles={styles.statistTitle} />
        <SpaceComponent height={12} />
        <View style={styles.actionGrid}>
          {works.map((item, index) => (
            <View key={item.id} style={styles.actionItem}>
              <ButtonAnimation
                onPress={() => navigation.navigate(item.screenName)}
                styles={[styles.btnItem, {backgroundColor: item.bgColor}]}>
                {item.icon}
              </ButtonAnimation>
              <TextComponent label={item.label} styles={styles.itemLabel} />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const staff = [
    {
      id: 1,
      name: 'Nguyên Văn B',
      position: 'Developer',
      attended: 'present',
      imageProfileUrl:
        'https://scontent.fvca1-1.fna.fbcdn.net/v/t39.30808-6/476494506_2211057015955753_6540347483900267937_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGDaqITdPq-fI4Isz_eH5dM40srH4O6GC_jSysfg7oYLyqKLHKs80OS8Z5yWQHVMIIeYfHnHLGNS3Ky9ItajG7D&_nc_ohc=G8CSQwJ_ilIQ7kNvwEphApK&_nc_oc=Adl6iAFM6lyFW_BnMUkvwFgsMqPEViBV0YlBaHFPvWAtn0wDyetU6QP5vCaR_XGEi2up_cvWJLdzr3NhZh47iGJV&_nc_zt=23&_nc_ht=scontent.fvca1-1.fna&_nc_gid=vyZ4ACRLVEj47eiBuBgyUA&oh=00_AfQ4sE1WJ3wxX9roLXlpbMv2yMpg1BgQT_UomzA90s4pOQ&oe=6887EC33',
    },
    {
      id: 2,
      name: 'Nguyên Thị D',
      position: 'Designer',
      attended: 'goLate',
      imageProfileUrl:
        'https://scontent.fvca1-1.fna.fbcdn.net/v/t39.30808-6/476494506_2211057015955753_6540347483900267937_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGDaqITdPq-fI4Isz_eH5dM40srH4O6GC_jSysfg7oYLyqKLHKs80OS8Z5yWQHVMIIeYfHnHLGNS3Ky9ItajG7D&_nc_ohc=G8CSQwJ_ilIQ7kNvwEphApK&_nc_oc=Adl6iAFM6lyFW_BnMUkvwFgsMqPEViBV0YlBaHFPvWAtn0wDyetU6QP5vCaR_XGEi2up_cvWJLdzr3NhZh47iGJV&_nc_zt=23&_nc_ht=scontent.fvca1-1.fna&_nc_gid=vyZ4ACRLVEj47eiBuBgyUA&oh=00_AfQ4sE1WJ3wxX9roLXlpbMv2yMpg1BgQT_UomzA90s4pOQ&oe=6887EC33',
    },
    {
      id: 3,
      name: 'Nguyên Văn C',
      position: 'Developer',
      attended: 'absent',
      imageProfileUrl:
        'https://scontent.fvca1-1.fna.fbcdn.net/v/t39.30808-6/476494506_2211057015955753_6540347483900267937_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGDaqITdPq-fI4Isz_eH5dM40srH4O6GC_jSysfg7oYLyqKLHKs80OS8Z5yWQHVMIIeYfHnHLGNS3Ky9ItajG7D&_nc_ohc=G8CSQwJ_ilIQ7kNvwEphApK&_nc_oc=Adl6iAFM6lyFW_BnMUkvwFgsMqPEViBV0YlBaHFPvWAtn0wDyetU6QP5vCaR_XGEi2up_cvWJLdzr3NhZh47iGJV&_nc_zt=23&_nc_ht=scontent.fvca1-1.fna&_nc_gid=vyZ4ACRLVEj47eiBuBgyUA&oh=00_AfQ4sE1WJ3wxX9roLXlpbMv2yMpg1BgQT_UomzA90s4pOQ&oe=6887EC33',
    },
  ];

  const getAttendanceStatus = (attended: any) => {
    switch (attended) {
      case 'present':
        return {
          icon: (
            <EvilIcons
              name="check"
              size={appSize.iconSmall}
              color={appColors.secondary}
            />
          ),
          label: 'Có mặt',
          color: appColors.secondary,
        };
      case 'goLate':
        return {
          icon: (
            <MaterialIcons
              name="watch-later"
              size={appSize.iconSmall}
              color={appColors.warning}
            />
          ),
          label: 'Đi muộn',
          color: appColors.warning,
        };
      case 'absent':
        return {
          icon: (
            <Ionicons
              name="close-circle-sharp"
              size={appSize.iconSmall}
              color={appColors.error}
            />
          ),
          label: 'Vắng mặt',
          color: appColors.error,
        };
      default:
        return {
          icon: null,
          label: 'Không xác định',
          color: appColors.textGrey,
        };
    }
  };

  const RenderHistoryAttend = () => {
    return (
      <View style={styles.statisticalContainer}>
        <RowComponent styles={styles.attendHeaderRow}>
          <TextComponent
            label="Nhân viên gần đây"
            styles={styles.attendTitle}
          />
          <ButtonAnimation onPress={() => {}} styles={styles.btnAttend}>
            <TextComponent label="Xem tất cả" styles={styles.btnLabel} />
          </ButtonAnimation>
        </RowComponent>
        <SpaceComponent height={16} />
        <View style={styles.attendMain}>
          {staff.map((item, index) => {
            const attendanceStatus = getAttendanceStatus(item.attended);
            return (
              <View key={item.id} style={styles.attendContent}>
                <RowComponent styles={styles.attendRow}>
                  {item.imageProfileUrl ? (
                    <Image
                      source={{uri: item.imageProfileUrl}}
                      style={styles.attendedAvatar}
                    />
                  ) : (
                    <View
                      style={[styles.attendedAvatar, styles.avatarPlaceholder]}>
                      <TextComponent
                        label={item.name.charAt(0)}
                        styles={styles.avatarText}
                      />
                    </View>
                  )}
                  <View style={styles.attendInfo}>
                    <TextComponent
                      label={item.name}
                      styles={styles.attendName}
                    />
                    <TextComponent
                      label={item.position}
                      styles={styles.attendPosition}
                    />
                    <RowComponent styles={styles.attendedRow}>
                      {attendanceStatus.icon}
                      <TextComponent
                        label={attendanceStatus.label}
                        color={attendanceStatus.color}
                        styles={styles.attendedLabel}
                      />
                    </RowComponent>
                  </View>
                  <View style={styles.attendActions}>
                    <ButtonAnimation
                      onPress={() => console.log('clock')}
                      styles={styles.btnAttended}>
                      <FontAwesome6
                        name="clock-rotate-left"
                        color={appColors.textGrey}
                        size={appSize.iconSmall}
                      />
                    </ButtonAnimation>
                    <ButtonAnimation
                      onPress={() => console.log('edit')}
                      styles={styles.btnAttended}>
                      <MaterialIcons
                        name="edit"
                        color={appColors.primary}
                        size={appSize.iconSmall}
                      />
                    </ButtonAnimation>
                  </View>
                </RowComponent>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <ContainerComponent>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <HeaderManageComponent />
        <View style={styles.body}>
          <BannerComponent />
          <SpaceComponent height={18} />
          <Advertisement />
          <SpaceComponent height={18} />
          <Statistical />
          <SpaceComponent height={18} />
          <RenderItems />
          <SpaceComponent height={18} />
          <RenderHistoryAttend />
          <SpaceComponent height={24} />
        </View>
      </ScrollView>
    </ContainerComponent>
  );
};

export default HomeManageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: appColors.card,
    paddingVertical: 16,
    paddingHorizontal: CONTAINER_PADDING,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  headerMain: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    gap: 5,
  },
  codeContainer: {
    alignSelf: 'flex-start',
  },
  btnImage: {
    marginLeft: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: appColors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: appColors.white,
    fontWeight: 'bold',
    fontSize: appSize.title,
  },
  title: {
    color: '#666',
    fontWeight: '300',
    fontStyle: 'italic',
    fontSize: appSize.body,
  },
  name: {
    fontSize: appSize.title,
    fontWeight: 'bold',
  },
  code: {
    backgroundColor: appColors.textGrey + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    color: appColors.textSecondary,
    fontSize: appSize.caption,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: CONTAINER_PADDING,
    backgroundColor: '#F9FAFC',
  },
  bannerContainer: {
    backgroundColor: appColors.card,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  bannerContent: {
    backgroundColor: '#FFF3CD',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderLeftColor: '#FEC005',
    borderLeftWidth: 4,
  },
  bannerRow: {
    alignItems: 'center',
    gap: 12,
  },
  bannerTextContainer: {
    flex: 1,
  },
  textNoti: {
    fontSize: appSize.body,
    fontWeight: '500',
    marginBottom: 2,
  },
  timePresent: {
    fontSize: appSize.caption,
    color: appColors.textSecondary,
  },
  closeBannerBtn: {
    padding: 4,
  },
  advertisementContainer: {
    backgroundColor: appColors.card,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  advertisementRow: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  titleAdvertisement: {
    fontSize: appSize.title,
    fontWeight: 'bold',
    flex: 1,
  },
  description: {
    color: '#666',
    fontSize: appSize.body,
    lineHeight: 20,
    marginBottom: 4,
  },
  btnPremium: {
    backgroundColor: '#4FAE52',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4FAE52',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  textBtnPremium: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: appSize.body,
  },
  statisticalContainer: {
    backgroundColor: appColors.card,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  statistTitle: {
    fontSize: appSize.title,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statisticsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statisticsItem: {
    alignItems: 'center',
    flex: 1,
  },
  statistNum: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statistLabel: {
    fontSize: appSize.microText,
    color: appColors.textSecondary,
    textAlign: 'center',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionItem: {
    alignItems: 'center',
    width: (screenWidth - CONTAINER_PADDING * 2 - 40 - 32) / 3, // 3 items per row with gaps
    marginBottom: 16,
  },
  itemLabel: {
    fontSize: appSize.caption,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  btnItem: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  attendHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  btnAttend: {
    backgroundColor: '#E8ECEF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnLabel: {
    color: appColors.primary,
    fontWeight: '500',
    fontSize: appSize.caption,
  },
  attendMain: {
    gap: 12,
  },
  attendContent: {
    backgroundColor: '#F9FAFC',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  attendRow: {
    alignItems: 'center',
    gap: 12,
  },
  attendInfo: {
    flex: 1,
  },
  attendName: {
    fontWeight: 'bold',
    fontSize: appSize.body,
    marginBottom: 2,
  },
  attendPosition: {
    color: appColors.textSecondary,
    fontSize: appSize.caption,
    marginBottom: 6,
  },
  attendedRow: {
    alignItems: 'center',
    gap: 6,
  },
  attendedLabel: {
    fontWeight: '500',
    fontSize: appSize.caption,
  },
  attendActions: {
    flexDirection: 'row',
    gap: 8,
  },
  btnAttended: {
    backgroundColor: appColors.card,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  attendedAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: appColors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
