import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {ContainerComponent} from '../../../components/layout';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeManageScreen = () => {
  const [userInfo, setUserInfo] = useState({
    name: 'Nguyễn Văn A',
    companyCode: 'ABC123',
    subscriptionType: 'Trial',
    daysLeft: 25,
    totalEmployees: 12,
    activeEmployees: 10,
  });

  const [stats, setStats] = useState({
    todayAttendance: 8,
    weeklyAttendance: 85,
    monthlyAttendance: 78,
    pendingRequests: 3,
  });

  const quickActions = [
    {id: 1, title: 'Quản lý nhân viên', icon: 'people', color: '#4CAF50'},
    {id: 2, title: 'Thống kê điểm danh', icon: 'analytics', color: '#2196F3'},
    {id: 3, title: 'Giao việc', icon: 'assignment', color: '#FF9800'},
    {id: 4, title: 'Thông báo', icon: 'notifications', color: '#9C27B0'},
    {id: 5, title: 'Báo cáo', icon: 'assessment', color: '#F44336'},
    {id: 6, title: 'Cài đặt', icon: 'settings', color: '#607D8B'},
  ];

  const handleQuickAction = actionId => {
    switch (actionId) {
      case 1:
        Alert.alert('Quản lý nhân viên', 'Chuyển đến trang quản lý nhân viên');
        break;
      case 2:
        Alert.alert('Thống kê điểm danh', 'Xem thống kê chi tiết');
        break;
      case 3:
        Alert.alert('Giao việc', 'Tạo công việc mới cho nhân viên');
        break;
      case 4:
        Alert.alert('Thông báo', 'Quản lý thông báo');
        break;
      case 5:
        Alert.alert('Báo cáo', 'Xem báo cáo tổng hợp');
        break;
      case 6:
        Alert.alert('Cài đặt', 'Cài đặt ứng dụng');
        break;
    }
  };

  const handleUpgrade = () => {
    Alert.alert(
      'Nâng cấp Premium',
      'Nâng cấp gói Premium với giá 55.000đ/tháng để tiếp tục sử dụng dịch vụ',
      [
        {text: 'Hủy', style: 'cancel'},
        {text: 'Nâng cấp', onPress: () => console.log('Redirect to payment')},
      ],
    );
  };

  return (
    <ContainerComponent>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Xin chào,</Text>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.companyCode}>
              Mã công ty: {userInfo.companyCode}
            </Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Icon name="account-circle" size={40} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        {/* Subscription Status */}
        <View
          style={[
            styles.subscriptionCard,
            userInfo.subscriptionType === 'Trial'
              ? styles.trialCard
              : styles.premiumCard,
          ]}>
          <View style={styles.subscriptionHeader}>
            <Text style={styles.subscriptionTitle}>
              {userInfo.subscriptionType === 'Trial'
                ? 'Gói dùng thử'
                : 'Gói Premium'}
            </Text>
            <Icon name="star" size={20} color="#FFD700" />
          </View>
          {userInfo.subscriptionType === 'Trial' ? (
            <>
              <Text style={styles.subscriptionText}>
                Còn lại {userInfo.daysLeft} ngày dùng thử
              </Text>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={handleUpgrade}>
                <Text style={styles.upgradeButtonText}>Nâng cấp Premium</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.subscriptionText}>Đang hoạt động</Text>
          )}
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Tổng quan hôm nay</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Icon name="how-to-reg" size={24} color="#4CAF50" />
              <Text style={styles.statNumber}>{stats.todayAttendance}</Text>
              <Text style={styles.statLabel}>Đã điểm danh</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="people" size={24} color="#2196F3" />
              <Text style={styles.statNumber}>{userInfo.activeEmployees}</Text>
              <Text style={styles.statLabel}>Nhân viên hoạt động</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="pending" size={24} color="#FF9800" />
              <Text style={styles.statNumber}>{stats.pendingRequests}</Text>
              <Text style={styles.statLabel}>Yêu cầu chờ</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(action => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => handleQuickAction(action.id)}>
                <View
                  style={[
                    styles.quickActionIcon,
                    {backgroundColor: action.color},
                  ]}>
                  <Icon name={action.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivityContainer}>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Icon name="check-circle" size={20} color="#4CAF50" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  Nguyễn Văn B đã điểm danh
                </Text>
                <Text style={styles.activityTime}>5 phút trước</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Icon name="person-add" size={20} color="#2196F3" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  Nhân viên mới yêu cầu tham gia
                </Text>
                <Text style={styles.activityTime}>1 giờ trước</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Icon name="assignment" size={20} color="#FF9800" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Công việc mới được tạo</Text>
                <Text style={styles.activityTime}>2 giờ trước</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Weekly Performance */}
        <View style={styles.performanceContainer}>
          <Text style={styles.sectionTitle}>Hiệu suất tuần này</Text>
          <View style={styles.performanceCard}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Điểm danh đúng giờ</Text>
              <Text style={styles.performanceValue}>
                {stats.weeklyAttendance}%
              </Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Hoàn thành công việc</Text>
              <Text style={styles.performanceValue}>
                {stats.monthlyAttendance}%
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ContainerComponent>
  );
};

export default HomeManageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 2,
  },
  companyCode: {
    fontSize: 14,
    color: '#666',
  },
  profileButton: {
    padding: 5,
  },
  subscriptionCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trialCard: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
  },
  premiumCard: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  subscriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  quickActionsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '30%',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  recentActivityContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  activityList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  performanceContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  performanceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  performanceLabel: {
    fontSize: 14,
    color: '#333',
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
