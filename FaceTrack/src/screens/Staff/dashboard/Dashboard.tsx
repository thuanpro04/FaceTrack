import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';

const {width} = Dimensions.get('window');

// Dữ liệu mẫu
const mockData = {
  todayStats: {
    totalEmployees: 245,
    checkedIn: 238,
    lateArrivals: 12,
    earlyDepartures: 5,
    aiAccuracy: 97.8,
    blockchainTxs: 476,
    blockchainStatus: 'active',
  },
  hourlyData: [
    {hour: '07:00', count: 15},
    {hour: '08:00', count: 89},
    {hour: '09:00', count: 134},
    {hour: '10:00', count: 23},
    {hour: '11:00', count: 8},
    {hour: '12:00', count: 67},
    {hour: '13:00', count: 78},
    {hour: '17:00', count: 156},
    {hour: '18:00', count: 89},
  ],
  weeklyTrend: [
    {day: 'T2', percentage: 96.2},
    {day: 'T3', percentage: 94.8},
    {day: 'T4', percentage: 97.1},
    {day: 'T5', percentage: 95.5},
    {day: 'T6', percentage: 98.3},
    {day: 'T7', percentage: 92.1},
    {day: 'CN', percentage: 89.4},
  ],
  recentRecords: [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      time: '08:15',
      status: 'late',
      aiConfidence: 98.5,
      blockchainHash: '0x7f8a...2b1c',
      avatar: '👨‍💼',
    },
    {
      id: '2',
      name: 'Trần Thị B',
      time: '07:45',
      status: 'ontime',
      aiConfidence: 99.2,
      blockchainHash: '0x3d2f...8e9a',
      avatar: '👩‍💼',
    },
    {
      id: '3',
      name: 'Lê Hoàng C',
      time: '08:02',
      status: 'ontime',
      aiConfidence: 96.8,
      blockchainHash: '0xa1b2...5d6e',
      avatar: '👨‍💻',
    },
    {
      id: '4',
      name: 'Phạm Thị D',
      time: '08:30',
      status: 'late',
      aiConfidence: 97.1,
      blockchainHash: '0x9c8b...3f2e',
      avatar: '👩‍🎨',
    },
    {
      id: '5',
      name: 'Hoàng Văn E',
      time: '07:55',
      status: 'ontime',
      aiConfidence: 98.9,
      blockchainHash: '0x4e5f...7a8b',
      avatar: '👨‍🔬',
    },
  ],
  alerts: [
    {
      id: '1',
      type: 'warning',
      message: 'Phát hiện 3 lần nhận diện không chính xác trong 1 giờ qua',
      time: '10 phút trước',
    },
    {
      id: '2',
      type: 'info',
      message: 'Blockchain sync hoàn tất - 476 giao dịch đã xác nhận',
      time: '15 phút trước',
    },
  ],
};

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const StatCard = ({title, value, subtitle, color = '#2196F3', icon}) => (
    <View style={[styles.statCard, {borderLeftColor: color}]}>
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, {color}]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const ChartBar = ({data}) => {
    const maxValue = Math.max(...data.map(item => item.count));
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Chấm công theo giờ</Text>
        <View style={styles.chartBars}>
          {data.map((item, index) => (
            <View key={index} style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (item.count / maxValue) * 120,
                    backgroundColor: item.count > 100 ? '#4CAF50' : '#2196F3',
                  },
                ]}
              />
              <Text style={styles.barLabel}>{item.hour}</Text>
              <Text style={styles.barValue}>{item.count}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const WeeklyChart = ({data}) => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Xu hướng 7 ngày</Text>
      <View style={styles.weeklyChart}>
        {data.map((item, index) => (
          <View key={index} style={styles.weeklyItem}>
            <Text style={styles.weeklyDay}>{item.day}</Text>
            <View style={styles.weeklyBarContainer}>
              <View
                style={[
                  styles.weeklyBar,
                  {
                    height: item.percentage,
                    backgroundColor:
                      item.percentage >= 95 ? '#4CAF50' : '#FF9800',
                  },
                ]}
              />
            </View>
            <Text style={styles.weeklyValue}>{item.percentage}%</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const RecentRecord = ({item}) => (
    <View style={styles.recordItem}>
      <View style={styles.recordLeft}>
        <Text style={styles.recordAvatar}>{item.avatar}</Text>
        <View style={styles.recordInfo}>
          <Text style={styles.recordName}>{item.name}</Text>
          <Text style={styles.recordTime}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.recordRight}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'ontime' ? '#E8F5E8' : '#FFF3E0',
            },
          ]}>
          <Text
            style={[
              styles.statusText,
              {
                color: item.status === 'ontime' ? '#4CAF50' : '#FF9800',
              },
            ]}>
            {item.status === 'ontime' ? 'Đúng giờ' : 'Muộn'}
          </Text>
        </View>
        <Text style={styles.recordHash}>{item.blockchainHash}</Text>
        <Text style={styles.recordAI}>AI: {item.aiConfidence}%</Text>
      </View>
    </View>
  );

  const AlertItem = ({item}) => (
    <View
      style={[
        styles.alertItem,
        {
          borderLeftColor: item.type === 'warning' ? '#FF9800' : '#2196F3',
        },
      ]}>
      <Text style={styles.alertIcon}>
        {item.type === 'warning' ? '⚠️' : 'ℹ️'}
      </Text>
      <View style={styles.alertContent}>
        <Text style={styles.alertMessage}>{item.message}</Text>
        <Text style={styles.alertTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard Chấm Công</Text>
          <Text style={styles.headerSubtitle}>
            {currentTime.toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
        <View style={styles.blockchainStatus}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Blockchain Active</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Tổng NV"
          value={mockData.todayStats.totalEmployees}
          subtitle={`${mockData.todayStats.checkedIn} đã chấm công`}
          color="#2196F3"
          icon="👥"
        />
        <StatCard
          title="Đi muộn"
          value={mockData.todayStats.lateArrivals}
          subtitle="Hôm nay"
          color="#FF9800"
          icon="⏰"
        />
        <StatCard
          title="Độ chính xác AI"
          value={`${mockData.todayStats.aiAccuracy}%`}
          subtitle="Trung bình"
          color="#4CAF50"
          icon="🤖"
        />
        <StatCard
          title="Blockchain TXs"
          value={mockData.todayStats.blockchainTxs}
          subtitle="Đã xác nhận"
          color="#9C27B0"
          icon="⛓️"
        />
      </View>

      {/* Charts */}
      <ChartBar data={mockData.hourlyData} />
      <WeeklyChart data={mockData.weeklyTrend} />

      {/* Recent Records */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bản ghi gần đây</Text>
        <FlatList
          data={mockData.recentRecords}
          renderItem={({item}) => <RecentRecord item={item} />}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Xem tất cả →</Text>
        </TouchableOpacity>
      </View>

      {/* Alerts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cảnh báo & thông báo</Text>
        {mockData.alerts.map(alert => (
          <AlertItem key={alert.id} item={alert} />
        ))}
      </View>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  blockchainStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 15,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: (width - 45) / 2,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  barValue: {
    fontSize: 10,
    color: '#333',
    fontWeight: '600',
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  weeklyItem: {
    alignItems: 'center',
    flex: 1,
  },
  weeklyDay: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  weeklyBarContainer: {
    height: 80,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  weeklyBar: {
    width: 15,
    borderRadius: 8,
  },
  weeklyValue: {
    fontSize: 10,
    color: '#333',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  recordTime: {
    fontSize: 14,
    color: '#666',
  },
  recordRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recordHash: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  recordAI: {
    fontSize: 10,
    color: '#666',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  alertIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#999',
  },
});