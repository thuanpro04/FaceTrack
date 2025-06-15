import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

export interface Manager {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface ReferralRequest {
  id: string;
  referralCode: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  adminResponse?: {
    message: string;
    reviewedAt: Date;
  };
  manager?: Manager;
}

const ReferralStatusScreen = () => {
  const [referralRequests, setReferralRequests] = useState<ReferralRequest[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Dữ liệu mẫu
  useEffect(() => {
    const sampleData: ReferralRequest[] = [
      {
        id: 'req001',
        referralCode: 'TEAM123',
        status: 'approved',
        submittedAt: new Date('2024-01-15'),
        reviewedAt: new Date('2024-01-16'),
        adminResponse: {
          message: 'Mã giới thiệu hợp lệ và đã được phê duyệt.',
          reviewedAt: new Date('2024-01-16'),
        },
        manager: {
          id: 'mgr001',
          name: 'Nguyễn Văn An',
          position: 'Trưởng phòng Kinh doanh',
          department: 'Phòng Kinh doanh',
          email: 'nguyen.van.an@company.com',
          phone: '0912-345-678',
        },
      },
      {
        id: 'req002',
        referralCode: 'SALES456',
        status: 'pending',
        submittedAt: new Date('2024-01-18'),
        manager: {
          id: 'mgr002',
          name: 'Trần Thị Bình',
          position: 'Giám đốc Nhân sự',
          department: 'Phòng Nhân sự',
          email: 'tran.thi.binh@company.com',
          phone: '0987-654-321',
        },
      },
      {
        id: 'req003',
        referralCode: 'TECH789',
        status: 'rejected',
        submittedAt: new Date('2024-01-10'),
        reviewedAt: new Date('2024-01-12'),
        adminResponse: {
          message: 'Mã giới thiệu không hợp lệ hoặc đã hết hạn sử dụng.',
          reviewedAt: new Date('2024-01-12'),
        },
        manager: {
          id: 'mgr003',
          name: 'Lê Minh Cường',
          position: 'Trưởng phòng IT',
          department: 'Phòng Công nghệ',
          email: 'le.minh.cuong@company.com',
          phone: '0901-234-567',
        },
      },
      {
        id: 'req004',
        referralCode: 'MARKETING999',
        status: 'approved',
        submittedAt: new Date('2024-01-20'),
        reviewedAt: new Date('2024-01-21'),
        adminResponse: {
          message: 'Mã giới thiệu đã được xác nhận và phê duyệt thành công.',
          reviewedAt: new Date('2024-01-21'),
        },
        manager: {
          id: 'mgr004',
          name: 'Phạm Thu Hương',
          position: 'Giám đốc Marketing',
          department: 'Phòng Marketing',
          email: 'pham.thu.huong@company.com',
          phone: '0934-567-890',
        },
      },
      {
        id: 'req005',
        referralCode: 'FINANCE555',
        status: 'pending',
        submittedAt: new Date('2024-01-22'),
        manager: {
          id: 'mgr005',
          name: 'Hoàng Văn Đức',
          position: 'Trưởng phòng Tài chính',
          department: 'Phòng Tài chính',
          email: 'hoang.van.duc@company.com',
          phone: '0945-678-901',
        },
      },
    ];
    setReferralRequests(sampleData);
  }, []);

  const filteredRequests = referralRequests.filter(request => 
    selectedFilter === 'all' || request.status === selectedFilter
  );

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ActivityIndicator size={20} color="#FF9500" />;
      case 'approved':
        return <AntDesign name="checkcircle" size={20} color="#34C759" />;
      case 'rejected':
        return <AntDesign name="closecircle" size={20} color="#FF3B30" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Đang chờ duyệt';
      case 'approved':
        return 'Đã được duyệt';
      case 'rejected':
        return 'Đã bị từ chối';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9500';
      case 'approved':
        return '#34C759';
      case 'rejected':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const FilterButton = ({
    title,
    value,
    count,
  }: {
    title: string;
    value: 'all' | 'pending' | 'approved' | 'rejected';
    count: number;
  }) => {
    const isSelected = selectedFilter === value;
    return (
      <TouchableOpacity
        style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
        onPress={() => setSelectedFilter(value)}>
        <Text style={[styles.filterButtonText, isSelected && styles.filterButtonTextSelected]}>
          {title} ({count})
        </Text>
      </TouchableOpacity>
    );
  };

  const ReferralCard = ({request}: {request: ReferralRequest}) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => setExpanded(!expanded)}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.statusContainer}>
              {renderStatusIcon(request.status)}
              <Text style={[styles.statusText, {color: getStatusColor(request.status)}]}>
                {getStatusText(request.status)}
              </Text>
            </View>
            <Text style={styles.referralCode}>{request.referralCode}</Text>
            <Text style={styles.submitDate}>
              Gửi lúc: {formatDate(request.submittedAt)}
            </Text>
          </View>
          <AntDesign
            name={expanded ? 'up' : 'down'}
            size={16}
            color="#8E8E93"
          />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.cardContent}>
            {request.manager && (
              <View style={styles.managerSection}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="person" size={20} color="#007AFF" />
                  <Text style={styles.sectionTitle}>Thông tin Quản lý</Text>
                </View>
                <View style={styles.managerInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {request.manager.name.split(' ').pop()?.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.managerDetails}>
                    <Text style={styles.managerName}>{request.manager.name}</Text>
                    <Text style={styles.managerPosition}>{request.manager.position}</Text>
                    <Text style={styles.managerDepartment}>{request.manager.department}</Text>
                    <View style={styles.contactInfo}>
                      <View style={styles.contactRow}>
                        <MaterialIcons name="email" size={14} color="#8E8E93" />
                        <Text style={styles.contactText}>{request.manager.email}</Text>
                      </View>
                      <View style={styles.contactRow}>
                        <MaterialIcons name="phone" size={14} color="#8E8E93" />
                        <Text style={styles.contactText}>{request.manager.phone}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {request.adminResponse && (
              <View style={styles.responseSection}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="feedback" size={20} color="#34C759" />
                  <Text style={styles.sectionTitle}>Phản hồi từ Admin</Text>
                </View>
                <Text style={styles.responseMessage}>{request.adminResponse.message}</Text>
                <Text style={styles.responseDate}>
                  Phản hồi lúc: {formatDate(request.adminResponse.reviewedAt)}
                </Text>
              </View>
            )}

            <View style={styles.requestInfo}>
              <Text style={styles.requestId}>ID: {request.id}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const getStatusCount = (status: 'pending' | 'approved' | 'rejected') => {
    return referralRequests.filter(req => req.status === status).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trạng thái mã giới thiệu</Text>
        <Text style={styles.headerSubtitle}>
          Tổng cộng {referralRequests.length} mã đã gửi
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}>
        <FilterButton title="Tất cả" value="all" count={referralRequests.length} />
        <FilterButton title="Chờ duyệt" value="pending" count={getStatusCount('pending')} />
        <FilterButton title="Đã duyệt" value="approved" count={getStatusCount('approved')} />
        <FilterButton title="Từ chối" value="rejected" count={getStatusCount('rejected')} />
      </ScrollView>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredRequests.length > 0 ? (
          filteredRequests.map(request => (
            <ReferralCard key={request.id} request={request} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="inbox" size={64} color="#C7C7CC" />
            <Text style={styles.emptyStateText}>Không có mã giới thiệu nào</Text>
            <Text style={styles.emptyStateSubtext}>
              Các mã giới thiệu bạn gửi sẽ hiển thị ở đây
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReferralStatusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginRight: 12,
  },
  filterButtonSelected: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  filterButtonTextSelected: {
    color: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  referralCode: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  submitDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  managerSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 8,
  },
  managerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  managerDetails: {
    flex: 1,
  },
  managerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  managerPosition: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 2,
  },
  managerDepartment: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  contactInfo: {
    gap: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 6,
  },
  responseSection: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  responseMessage: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    marginBottom: 8,
  },
  responseDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  requestInfo: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
  },
  requestId: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#C7C7CC',
    textAlign: 'center',
  },
});