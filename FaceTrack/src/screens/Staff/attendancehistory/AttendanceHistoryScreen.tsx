import React, {useRef, useState} from 'react';
import {View, Text, FlatList, StyleSheet, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ContainerComponent, TextComponent} from '../../../components/layout';
import HeaderComponent from '../../../components/layout/HeaderComponent';
import {ArrowLeft2} from 'iconsax-react-native';
import {appSize} from '../../../constants/appSize';
import appColors from '../../../constants/appColors';
import ButtonAnimation from '../../../components/layout/ButtonAnimation';

export interface AttendanceHistoryItem {
  id: string;
  date: string; // ISO string hoặc 'YYYY-MM-DD'
  checkInTime: string; // 'HH:mm'
  checkOutTime: string; // 'HH:mm'
  status: 'present' | 'late' | 'absent' | 'leave';
  location: string;
  note?: string;
}
export const attendanceHistoryData: AttendanceHistoryItem[] = [
  {
    id: '1',
    date: '2024-06-01',
    checkInTime: '08:05',
    checkOutTime: '17:00',
    status: 'present',
    location: 'Văn phòng Hà Nội',
  },
  {
    id: '2',
    date: '2024-05-31',
    checkInTime: '08:25',
    checkOutTime: '17:00',
    status: 'late',
    location: 'Văn phòng Hà Nội',
    note: 'Đến muộn do tắc đường',
  },
  {
    id: '3',
    date: '2024-05-30',
    checkInTime: '',
    checkOutTime: '',
    status: 'absent',
    location: '',
    note: 'Nghỉ ốm',
  },
  {
    id: '4',
    date: '2024-05-29',
    checkInTime: '08:00',
    checkOutTime: '16:30',
    status: 'leave',
    location: 'Văn phòng Hà Nội',
    note: 'Về sớm có phép',
  },
];

const statusConfig = {
  present: {color: '#4caf50', label: 'Đúng giờ', icon: 'check-circle'},
  late: {color: '#ff9800', label: 'Đi muộn', icon: 'clock-alert'},
  absent: {color: '#f44336', label: 'Vắng mặt', icon: 'close-circle'},
  leave: {color: '#2196f3', label: 'Nghỉ phép', icon: 'calendar-remove'},
};

const AttendanceHistoryScreen = ({navigation}: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef(
    attendanceHistoryData.map(() => new Animated.Value(0)),
  ).current;
  const cardStagger = cardAnimations.map((anim, index) =>
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      delay: index * 100 + 400,
      useNativeDriver: true,
    }),
  );
  Animated.stagger(100, cardStagger).start();
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '2deg'],
  });
  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      cardAnimations.forEach((anim, index) => {
        anim.setValue(0);
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          delay: index * 50,
          useNativeDriver: true,
        }).start();
      });
    }, 1000);
  };
  const renderItem = ({
    item,
    index,
  }: {
    item: AttendanceHistoryItem;
    index: number;
  }) => {
    const status = statusConfig[item.status];
    return (
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              {
                translateY: cardAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
              {
                scale: scaleAnim,
              },
              {rotate},
              {translateX: translateXAnim},
            ],
          },
        ]}>
        <View style={styles.row}>
          <Icon
            name={status.icon}
            size={28}
            color={status.color}
            style={{marginRight: 12}}
          />
          <View>
            <TextComponent styles={styles.date} label={item.date} />
            <TextComponent
              label={status.label}
              styles={[styles.status, {color: status.color}]}
            />
          </View>
        </View>
        <View style={styles.infoRow}>
          <Icon name="login" size={18} color="#607d8b" />
          <TextComponent
            styles={styles.infoText}
            label={
              item.checkInTime
                ? `Check-in: ${item.checkInTime}`
                : 'Không check-in'
            }
          />
        </View>
        <View style={styles.infoRow}>
          <Icon name="logout" size={18} color="#607d8b" />
          <TextComponent
            label={
              item.checkOutTime
                ? `Check-out: ${item.checkOutTime}`
                : 'Không check-out'
            }
            styles={styles.infoText}
          />
        </View>
        <View style={styles.infoRow}>
          <Icon name="map-marker" size={18} color="#607d8b" />
          <TextComponent
            styles={styles.infoText}
            label={item.location || 'Không có địa điểm'}
          />
        </View>
        {item.note ? (
          <View style={styles.noteBox}>
            <Icon name="note-text" size={16} color="#9e9e9e" />
            <TextComponent styles={styles.noteText} label={item.note} />
          </View>
        ) : null}
      </Animated.View>
    );
  };

  return (
    <ContainerComponent styles={styles.container}>
      <HeaderComponent
        onNavigationIcon={() => navigation.goBack()}
        label="Lịch sử điểm danh"
        textStyle={styles.textHeader}
      />

      <FlatList
        onRefresh={onRefresh}
        refreshing={refreshing}
        data={attendanceHistoryData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingBottom: 24}}
        showsVerticalScrollIndicator={false}
      />
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  textHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 8,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 8,
  },
  noteText: {
    fontSize: 13,
    color: '#757575',
    marginLeft: 6,
    fontStyle: 'italic',
  },
});

export default AttendanceHistoryScreen;
