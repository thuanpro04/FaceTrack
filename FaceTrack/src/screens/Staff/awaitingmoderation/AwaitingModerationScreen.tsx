import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  ContainerComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components/layout';
import ReferralCard from './Component/ReferralCard';
import {ArrowLeft2} from 'iconsax-react-native';
import {appSize} from '../../../constants/appSize';
import appColors from '../../../constants/appColors';
import HeaderComponent from '../../../components/layout/HeaderComponent';
export interface Manager {
  fullName: string;
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

const AwaitingModerationScreen = ({navigation}: any) => {
  const [referralRequests, setReferralRequests] = useState<ReferralRequest[]>(
    [],
  );
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');
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
          fullName: 'Nguyễn Văn An',
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
          fullName: 'Trần Thị Bình',
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
          fullName: 'Lê Minh Cường',
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
          fullName: 'Phạm Thu Hương',
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
          fullName: 'Hoàng Văn Đức',
          position: 'Trưởng phòng Tài chính',
          department: 'Phòng Tài chính',
          email: 'hoang.van.duc@company.com',
          phone: '0945-678-901',
        },
      },
    ];
    setReferralRequests(sampleData);
  }, []);

  const getStatusCount = (status: 'pending' | 'approved' | 'rejected') => {
    return referralRequests.filter(req => req.status === status).length;
  };
  const filteredRequests = referralRequests.filter(
    request => selectedFilter === 'all' || request.status === selectedFilter,
  );
  const menu = [
    {
      title: 'Tất cả',
      value: 'all',
      count: referralRequests.length,
    },
    {
      title: 'Chờ duyệt',
      value: 'pending',
      count: getStatusCount('pending'),
    },
    {
      title: 'Đã duyệt',
      value: 'approved',
      count: getStatusCount('approved'),
    },
    {
      title: 'Từ chối',
      value: 'rejected',
      count: getStatusCount('rejected'),
    },
  ];
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
        onPress={() => setSelectedFilter(value)}
        style={[
          styles.filterButton,
          isSelected && styles.filterButtonSelected,
        ]}>
        <TextComponent
          label={`${title} ${count}`}
          styles={[
            styles.filterButtonText,
            isSelected && styles.filterButtonTextSelected,
          ]}
        />
      </TouchableOpacity>
    );
  };

  const RenderItems = ({item, index}: any) => {
    return (
      <FilterButton
        title={item.title}
        value={item.value}
        count={item.count}
        key={index}
      />
    );
  };
  return (
    <ContainerComponent styles={styles.container}>
      <View style={styles.header}>
        <ArrowLeft2
          size={appSize.iconMedium}
          color={appColors.iconDefault}
          onPress={() => navigation.goBack()}
        />
        <SpaceComponent height={12} />
        <TextComponent
          label="Trạng thái mã giới thiệu"
          styles={styles.headerTitle}
        />
        <TextComponent
          label={`Tổng cộng ${referralRequests.length} mã đã gửi`}
          styles={styles.headerSubtitle}
        />
      </View>
      <FlatList
        data={menu}
        showsVerticalScrollIndicator={false}
        renderItem={RenderItems}
        horizontal
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
        keyExtractor={(item, index) => index.toString()}
      />

      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}>
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request, index) => (
            <ReferralCard key={index.toString()} request={request} />
          ))
        ) : (
          <View>
            <MaterialIcons name="inbox" size={64} color="#C7C7CC" />
            <TextComponent
              label="Không có mã giới thiệu nào"
              styles={styles.emptyStateText}
            />
            <TextComponent
              label="Các mã giới thiệu bạn gửi sẽ hiển thị ở đây"
              styles={styles.emptyStateSubtext}
            />
          </View>
        )}
      </ScrollView>
    </ContainerComponent>
  );
};

export default AwaitingModerationScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
  },
  header: {
    paddingHorizontal: 8,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    maxHeight: 75,
  },
  filterContent: {
    paddingHorizontal: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  filterButtonTextSelected: {
    color: '#FFFFFF',
  },
  filterButtonSelected: {
    backgroundColor: '#007AFF',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 16,
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
