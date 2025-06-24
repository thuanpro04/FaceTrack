import {Animated, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AttendanceRecord} from '../../../data/user.type';
import {RowComponent, TextComponent} from '../../../../components/layout';
import appColors from '../../../../constants/appColors';
import AnimatedNumber from './AnimatedNumber';
interface Props {
  recentAttendance: AttendanceRecord[];
  fadeAmin: any;
  shouldAnimateNumbers: boolean;
}
const AttendancehHistory = (props: Props) => {
  const {recentAttendance, fadeAmin, shouldAnimateNumbers} = props;
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return '#4ade80';
      case 'absent':
        return '#ef4444';
      case 'late':
        return '#f59e0b';
      case 'overtime':
        return '#8b5cf6';
      case 'weekend':
        return '#9ca3af';
      default:
        return '#6b7280';
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'present':
        return 'Có mặt';
      case 'absent':
        return 'Vắng mặt';
      case 'late':
        return 'Đi muộn';
      case 'overtime':
        return 'Làm thêm';
      case 'weekend':
        return 'Cuối tuần';
      default:
        return '';
    }
  };

  return (
    <View style={styles.historyContainer}>
      <TextComponent
        label="Lịch sử điểm danh gần đây"
        styles={styles.historyTitle}
      />
      {recentAttendance.map((record, index) => (
        <Animated.View
          key={record.id}
          style={[
            styles.historyItem,
            {
              opacity: fadeAmin,
              transform: [
                {
                  translateX: fadeAmin.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}>
          <View style={styles.historyDate}>
            <TextComponent
              styles={styles.historyDateText}
              label={record.date}
            />
            <TextComponent
              styles={styles.historyDayText}
              label={record.dayOfWeek}
            />
          </View>
          <View style={styles.historyDetails}>
            <RowComponent styles={styles.historyTime}>
              <TextComponent
                styles={styles.timeLabel}
                label={`Vào: ${record.checkIn}`}
              />
              <TextComponent
                styles={styles.historyDayText}
                label={`Ra: ${record.checkOut}`}
              />
            </RowComponent>
            {shouldAnimateNumbers ? (
              <AnimatedNumber
                value={record.workHours.toString()}
                suffix="h"
                style={styles.workHours}
                duration={800 + index * 100}
              />
            ) : (
              <TextComponent label="0h" styles={styles.workHours} />
            )}
          </View>
          <View style={styles.historyStatus}>
            <Animated.View
              style={[
                styles.statusDot,
                {
                  backgroundColor: getStatusColor(record.status),
                  transform: [
                    {
                      scale: fadeAmin.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                  ],
                },
              ]}
            />
            <TextComponent
              label={getStatusText(record.status)}
              styles={[
                styles.statusText,
                {
                  color: getStatusColor(record.status),
                },
              ]}
            />
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

export default AttendancehHistory;

const styles = StyleSheet.create({
  historyContainer: {
    backgroundColor: appColors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  historyDate: {
    width: 80,
  },
  historyDateText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  historyDayText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  historyDetails: {
    flex: 1,
    paddingHorizontal: 12,
  },
  historyTime: {
    marginBottom: 4,
    gap: 12,
  },
  timeLabel: {
    fontSize: 12,
    color: '#374151',
  },
  workHours: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a90e2',
  },
  historyStatus: {
    alignItems: 'center',
    width: 80,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});
