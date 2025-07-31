import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  ContainerComponent,
  RowComponent,
  TextComponent,
} from '../../../components/layout';
import HeaderComponent from '../../../components/layout/HeaderComponent';
import {TouchableOpacity} from 'react-native';
import appColors from '../../../constants/appColors';
import ButtonAnimation from '../../../components/layout/ButtonAnimation';
import {appSize} from '../../../constants/appSize';
import {staffServices} from '../../../services/staffServices';
import {useSelector} from 'react-redux';
import {authSelector} from '../../../redux/slices/authSlice';
import {useFocusEffect} from '@react-navigation/native';
import InfomationManageModal from '../../modals/InfomationManageModal';

const NotificationScreen = ({navigation}: any) => {
  const [isModal, setIsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notis, setNotis] = useState<any[]>([]);
  const user = useSelector(authSelector);
  const notifications = [
    {
      _id: '688a3997495dc29d3706986c',
      sender: '6861430febeb3b5180b13729',
      receiver: '686fcad30f81e5144ccfd9b9',
      type: 'invite',
      content: 'Bạn được mời vào nhóm bởi quản lý Hùng Mạnh',
      createAt: '2025-07-30T15:26:15.933Z',
      senderName: 'Hùng Mạnh',
      senderAvatar: 'https://i.pravatar.cc/150?img=1',
      isRead: false,
    },
    {
      _id: '688a3997495dc29d3706986d',
      sender: '6861430febeb3b5180b13730',
      receiver: '686fcad30f81e5144ccfd9b9',
      type: 'message',
      content: 'Bạn có tin nhắn mới từ Minh Tuấn',
      createAt: '2025-07-30T14:15:22.421Z',
      senderName: 'Minh Tuấn',
      senderAvatar: 'https://i.pravatar.cc/150?img=2',
      isRead: true,
    },
    {
      _id: '688a3997495dc29d3706986e',
      sender: '6861430febeb3b5180b13731',
      receiver: '686fcad30f81e5144ccfd9b9',
      type: 'alter',
      content: 'Thảo Linh đã thích bài viết của bạn',
      createAt: '2025-07-30T13:45:10.156Z',
      senderName: 'Thảo Linh',
      senderAvatar: 'https://i.pravatar.cc/150?img=3',
      isRead: true,
    },
  ];
  const getNotificationForUser = async () => {
    setIsLoading(true);
    try {
      const res = await staffServices.getNotiForUser(user._id);
      if (res && res.data) {
        console.log(res.data.message, res.data.result);
        setNotis(res.data.result);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Get noti for user error: ', error);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(async () => {
      await getNotificationForUser();
      setRefreshing(false);
    }, 1000);
  };
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'invite':
        return '👥';
      case 'message':
        return '💬';
      case 'alter':
        return '❤️';
      default:
        return '🔔';
    }
  };
  const formatTime = (dataString: any) => {
    const date: any = new Date(dataString);
    const now: any = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) {
      return 'Vừa xong';
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    }
  };
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'invite':
        return '#4CAF50';
      case 'message':
        return '#2196F3';
      case 'alter':
        return '#E91E63';
      default:
        return '#9E9E9E';
    }
  };
  const handleAgreeToTeam = async (id: string, code: string) => {
    try {
      setIsLoading(true);
      if (!id || !code) {
        console.log('handle agree to team error');
        setIsLoading(false);
        return;
      }
      const res = await staffServices.handleAgreeToTeam({
        id,
        code,
        userId: user._id,
      });
      if (res && res.data) {
        console.log(res.data.message);
        reSetNotis(id);
      }
    } catch (error) {
      console.log('Agree to team error: ', error);
      setIsLoading(false);
    }
  };
  const handleRejectToTeam = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await staffServices.handleRejectInvite(id);
      if (res && res.data) {
        console.log(res.data.message);
        reSetNotis(id);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('Reject to team error: ', error);
      setIsLoading(false);
    }
  };
  const reSetNotis = (id: string) => {
    setNotis(prev => prev.filter(item => item.notifications._id !== id));
  };
  useFocusEffect(
    useCallback(() => {
      getNotificationForUser();
    }, []),
  );
  const onOpenModal = (userInfo: any) => {
    setSelectedUser(userInfo);
    setIsModal(true);
  };
  const renderItemNotification = ({item, index}: any) => {
    const element = item.notifications;
    const userInfo = item.manages;
    return (
      <View key={index} style={styles.itemContainer}>
        <RowComponent styles={styles.NotifiItem}>
          <View style={styles.leftSection}>
            <View style={styles.avatarContainer}>
              <ButtonAnimation
                onPress={() => onOpenModal(userInfo)}
                styles={{}}>
                {userInfo.profileImageUrl ? (
                  <Image
                    source={{uri: userInfo.profileImageUrl}}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatar} />
                )}
              </ButtonAnimation>
              <View
                style={[
                  styles.typeIndicator,
                  {backgroundColor: getNotificationColor(element.type)},
                ]}>
                <TextComponent
                  styles={styles.typeIcon}
                  label={getNotificationIcon(element.type)}
                />
              </View>
            </View>
          </View>
          <View style={styles.contentSection}>
            <TextComponent
              label={element.content}
              styles={styles.contentText}
              numberLine={2}
            />
            <TextComponent
              label={formatTime(element.createAt)}
              styles={styles.timeText}
            />
          </View>
          {!element.isRead && <View style={styles.unreadDot} />}
        </RowComponent>
        {element.type === 'invite' && (
          <RowComponent styles={styles.rowBtn}>
            <ButtonAnimation
              styles={styles.btnItem}
              onPress={() =>
                handleAgreeToTeam(element._id, userInfo.referralCode)
              }>
              <TextComponent label="Đồng ý" styles={styles.labelBtn} />
            </ButtonAnimation>
            <ButtonAnimation
              onPress={() => handleRejectToTeam(element._id)}
              styles={[styles.btnItem, {backgroundColor: appColors.secondary}]}>
              <TextComponent
                label="Từ chối"
                styles={[styles.labelBtn, {color: appColors.white}]}
              />
            </ButtonAnimation>
          </RowComponent>
        )}
        <InfomationManageModal
          user={selectedUser}
          visible={isModal}
          onClose={() => setIsModal(false)}
        />
      </View>
    );
  };
  return (
    <ContainerComponent>
      <HeaderComponent
        onNavigationIcon={() => navigation.goBack()}
        label="Thông báo"
      />
      <View style={styles.main}>
        <FlatList
          data={notis}
          keyExtractor={item => item.notifications._id}
          renderItem={renderItemNotification}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </View>
    </ContainerComponent>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 8,
  },
  NotifiItem: {
    alignItems: 'center',
  },
  leftSection: {
    marginRight: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
  },
  typeIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  typeIcon: {
    fontSize: 12,
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
  },
  contentText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '400',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
    marginLeft: 12,
  },
  itemContainer: {
    backgroundColor: appColors.card,
    marginHorizontal: 16,
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  rowBtn: {
    gap: 12,
    marginTop: 22,
    justifyContent: 'center',
  },
  btnItem: {
    borderWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderColor: appColors.secondary,
    marginRight: 22,
  },
  labelBtn: {
    fontWeight: '500',
    fontSize: appSize.body,
    fontStyle: 'italic',
  },
});
