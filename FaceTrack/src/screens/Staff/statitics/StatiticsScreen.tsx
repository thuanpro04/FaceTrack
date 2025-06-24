import {ArrowLeft2} from 'iconsax-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, ScrollView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {
  ContainerComponent,
  RowComponent,
  TextComponent,
} from '../../../components/layout';
import ButtonAnimation from '../../../components/layout/ButtonAnimation';
import appColors from '../../../constants/appColors';
import {appSize} from '../../../constants/appSize';
import {authSelector} from '../../../redux/slices/authSlice';
import {AttendanceRecord} from '../../data/user.type';
import AttendancehHistory from './component/AttendancehHistory';
import MonthlyStats from './component/MonthlyStats';
import PeriodButtons from './component/PeriodButtons';
import WeeklyStats from './component/WeeklyStats';
import YearlyStats from './component/YearlyStats';
const mockUserData = {
  user: {
    id: 'USER001',
    name: 'Nguyễn Văn An',
    position: 'Frontend Developer',
    department: 'IT Department',
    avatar: 'https://via.placeholder.com/80',
  },

  // Dữ liệu thống kê theo tuần (7 ngày gần nhất)
  weeklyData: {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    attendance: [1, 1, 0, 1, 1, 0, 0], // 1: có mặt, 0: vắng mặt
    workHours: [8.5, 8.0, 0, 9.2, 8.3, 0, 0],
    checkInTimes: ['08:15', '08:30', '--', '08:05', '08:20', '--', '--'],
    checkOutTimes: ['17:30', '17:00', '--', '18:12', '17:18', '--', '--'],
  },

  // Dữ liệu thống kê theo tháng
  monthlyData: {
    totalWorkDays: 22,
    presentDays: 20,
    absentDays: 2,
    lateDays: 3,
    earlyLeaveDays: 1,
    overtimeHours: 15.5,
    totalWorkHours: 168.5,
    attendanceRate: 90.9,

    // Dữ liệu cho biểu đồ theo tuần trong tháng
    weeklyAttendance: {
      labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
      datasets: [
        {
          data: [95, 87, 92, 88],
          color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
        },
      ],
    },

    // Dữ liệu phân bố thời gian làm việc
    workHoursDistribution: [
      {
        name: 'Đúng giờ',
        population: 70,
        color: '#4ade80',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
      {
        name: 'Đi muộn',
        population: 15,
        color: '#f59e0b',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
      {
        name: 'Về sớm',
        population: 5,
        color: '#ef4444',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
      {
        name: 'Làm thêm',
        population: 10,
        color: '#8b5cf6',
        legendFontColor: '#374151',
        legendFontSize: 12,
      },
    ],
  },

  // Dữ liệu thống kê theo năm
  yearlyData: {
    totalWorkDays: 252,
    presentDays: 235,
    absentDays: 17,
    lateDays: 28,
    overtimeHours: 156.5,
    attendanceRate: 93.3,

    // Dữ liệu theo tháng trong năm
    monthlyAttendance: {
      labels: [
        'T1',
        'T2',
        'T3',
        'T4',
        'T5',
        'T6',
        'T7',
        'T8',
        'T9',
        'T10',
        'T11',
        'T12',
      ],
      datasets: [
        {
          data: [92, 88, 95, 90, 94, 89, 96, 93, 91, 95, 88, 92],
          color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    },
  },

  // Lịch sử điểm danh gần đây
  recentAttendance: [
    {
      id: 1,
      date: '2024-06-24',
      dayOfWeek: 'Thứ 2',
      checkIn: '08:15',
      checkOut: '17:30',
      status: 'present',
      workHours: 8.5,
      note: '',
    },
    {
      id: 2,
      date: '2024-06-23',
      dayOfWeek: 'Chủ nhật',
      checkIn: '--',
      checkOut: '--',
      status: 'weekend',
      workHours: 0,
      note: 'Cuối tuần',
    },
    {
      id: 3,
      date: '2024-06-22',
      dayOfWeek: 'Thứ 7',
      checkIn: '--',
      checkOut: '--',
      status: 'weekend',
      workHours: 0,
      note: 'Cuối tuần',
    },
    {
      id: 4,
      date: '2024-06-21',
      dayOfWeek: 'Thứ 6',
      checkIn: '08:20',
      checkOut: '17:18',
      status: 'present',
      workHours: 8.3,
      note: '',
    },
    {
      id: 5,
      date: '2024-06-20',
      dayOfWeek: 'Thứ 5',
      checkIn: '08:05',
      checkOut: '18:12',
      status: 'overtime',
      workHours: 9.2,
      note: 'Làm thêm giờ',
    },
    {
      id: 6,
      date: '2024-06-19',
      dayOfWeek: 'Thứ 4',
      checkIn: '--',
      checkOut: '--',
      status: 'absent',
      workHours: 0,
      note: 'Nghỉ phép',
    },
    {
      id: 7,
      date: '2024-06-18',
      dayOfWeek: 'Thứ 3',
      checkIn: '08:30',
      checkOut: '17:00',
      status: 'late',
      workHours: 8.0,
      note: 'Đi muộn',
    },
  ] as AttendanceRecord[],
};
const StatiticsScreen = ({navigation}: any) => {
  const authUser = useSelector(authSelector);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, year

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  // Animation refs cho biểu đồ
  const chartFadeAnim = useRef(new Animated.Value(0)).current;
  const chartScaleAnim = useRef(new Animated.Value(0.8)).current;
  const statsCardsAnim = useRef(new Animated.Value(0)).current;
  const [chartAnimationKey, setChartAnimationKey] = useState(0);
  const [shouldAnimateNumbers, setShouldAnimateNumbers] = useState(false);

  const slideY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });
  const handleGoBack = () => {
    navigation.goBack();
  };
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      animateCharts();
    });
  }, []);
  const animateCharts = () => {
    chartFadeAnim.setValue(0);
    chartScaleAnim.setValue(0.8);
    statsCardsAnim.setValue(0);
    setShouldAnimateNumbers(false);
    Animated.sequence([
      Animated.timing(statsCardsAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(chartFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(chartScaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setShouldAnimateNumbers(true);
    });
    setChartAnimationKey(prev => prev + 1);
  };
  const handlePeriodChange = (period: string) => {
    setTimeout(() => {
      if (period !== selectedPeriod) {
        setSelectedPeriod(period);
        animateCharts();
      }
    }, 1000);
  };
  return (
    <ContainerComponent styles={styles.container}>
      <RowComponent styles={styles.topHeader}>
        <ButtonAnimation onPress={handleGoBack}>
          <ArrowLeft2 size={appSize.iconLarge} color={appColors.iconDefault} />
        </ButtonAnimation>
        <TextComponent label="Thống kê chấm công" styles={styles.screenTitle} />
        <View style={styles.placeholder} />
      </RowComponent>
      
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideY}],
            },
          ]}>
          <View style={[styles.header]}>
            <RowComponent styles={styles.userInfo}>
              <View style={styles.avatar}>
                <TextComponent
                  label={authUser.fullName.slice(0, 1)}
                  styles={styles.avatarText}
                />
              </View>
              <View style={styles.userDetails}>
                <TextComponent
                  label={authUser.fullName}
                  styles={styles.userName}
                />
                <TextComponent
                  styles={styles.userPosition}
                  label={authUser.position ?? mockUserData.user.position}
                />
                <TextComponent
                  styles={styles.userDepartment}
                  label={authUser.department ?? mockUserData.user.department}
                />
              </View>
            </RowComponent>
          </View>
          {/* Period Selection */}
          <PeriodButtons
            selectedPeriod={selectedPeriod}
            handlePeriodChange={handlePeriodChange}
          />
          {/* Statistics content */}
          {selectedPeriod === 'week' && (
            <WeeklyStats
              chartFadeAnim={chartFadeAnim}
              chartScaleAnim={chartScaleAnim}
              weeklyData={mockUserData.weeklyData}
              shouldAnimateNumbers={shouldAnimateNumbers}
            />
          )}
          {selectedPeriod === 'month' && (
            <MonthlyStats
              chartFadeAnim={chartFadeAnim}
              chartScaleAnim={chartScaleAnim}
              monthlyData={mockUserData.monthlyData}
              shouldAnimateNumbers={shouldAnimateNumbers}
            />
          )}
          {selectedPeriod === 'year' && (
            <YearlyStats
              chartFadeAnim={chartFadeAnim}
              chartScaleAnim={chartScaleAnim}
              yearlyData={mockUserData.yearlyData}
              shouldAnimateNumbers={shouldAnimateNumbers}
            />
          )}
          <AttendancehHistory
            fadeAmin={fadeAnim}
            shouldAnimateNumbers={shouldAnimateNumbers}
            recentAttendance={mockUserData.recentAttendance}
          />
        </Animated.View>
      </ScrollView>
    </ContainerComponent>
  );
};

export default StatiticsScreen;

const styles = StyleSheet.create({
  container: {},
  content: {
    padding: 20,
  },
  topHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  header: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  userInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: appColors.textGrey + '46',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userPosition: {
    fontSize: 14,
    color: '#4a90e2',
    marginBottom: 2,
  },
  userDepartment: {
    fontSize: 12,
    color: '#6b7280',
  },
});
