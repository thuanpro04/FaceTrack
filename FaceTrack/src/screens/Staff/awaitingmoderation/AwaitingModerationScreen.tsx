import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
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
import ButtonAnimation from '../../../components/layout/ButtonAnimation';

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
  const [refreshing, setRefreshing] = useState(false);
  const [referralRequests, setReferralRequests] = useState<ReferralRequest[]>(
    [],
  );
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');

  // Animation refs
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-30)).current;
  const filterOpacity = useRef(new Animated.Value(0)).current;
  const filterTranslateX = useRef(new Animated.Value(-50)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;
  const listTranslateY = useRef(new Animated.Value(50)).current;
  const emptyStateScale = useRef(new Animated.Value(0.8)).current;
  const emptyStateOpacity = useRef(new Animated.Value(0)).current;

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

    // Start entrance animations
    startEntranceAnimations();
  }, []);

  const startEntranceAnimations = () => {
    // Header animation
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    // Filter animation (delayed)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(filterOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(filterTranslateX, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    // List animation (delayed)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(listOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(listTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]).start();
    }, 600);
  };

  const animateEmptyState = () => {
    Animated.parallel([
      Animated.timing(emptyStateOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(emptyStateScale, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getStatusCount = (status: 'pending' | 'approved' | 'rejected') => {
    return referralRequests.filter(req => req.status === status).length;
  };

  const filteredRequests = referralRequests.filter(
    request => selectedFilter === 'all' || request.status === selectedFilter,
  );

  useEffect(() => {
    if (filteredRequests.length === 0) {
      // Reset empty state animation
      emptyStateOpacity.setValue(0);
      emptyStateScale.setValue(0.8);
      // Start empty state animation
      setTimeout(animateEmptyState, 100);
    }
  }, [filteredRequests.length]);

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
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const isSelected = selectedFilter === value;

    const handlePress = () => {
      // Button press animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]).start();

      setSelectedFilter(value);
    };

    return (
      <Animated.View style={{transform: [{scale: scaleAnim}]}}>
        <TouchableOpacity
          onPress={handlePress}
          style={[
            styles.filterButton,
            isSelected && styles.filterButtonSelected,
          ]}
          activeOpacity={0.8}>
          <TextComponent
            label={`${title} ${count}`}
            styles={[
              styles.filterButtonText,
              isSelected && styles.filterButtonTextSelected,
            ]}
          />
        </TouchableOpacity>
      </Animated.View>
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
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  const AnimatedReferralCard = ({request, index}: any) => {
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const cardTranslateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
      // Stagger card animations
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(cardTranslateY, {
            toValue: 0,
            duration: 400,
            easing: Easing.out(Easing.back(1.1)),
            useNativeDriver: true,
          }),
        ]).start();
      }, index * 100);
    }, []);

    return (
      <Animated.View
        style={{
          opacity: cardOpacity,
          transform: [{translateY: cardTranslateY}],
        }}>
        <ReferralCard request={request} />
      </Animated.View>
    );
  };
  const renderCardItems = ({item, index}: any) => {
    return <AnimatedReferralCard key={item.id} request={item} index={index} />;
  };
  return (
    <ContainerComponent styles={styles.container}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{translateY: headerTranslateY}],
          },
        ]}>
        <ButtonAnimation
          onPress={() => navigation.goBack()}
          styles={{marginBottom: 0}}>
          <ArrowLeft2 size={appSize.iconMedium} color={appColors.iconDefault} />
        </ButtonAnimation>
        <SpaceComponent height={12} />
        <TextComponent
          label="Trạng thái mã giới thiệu"
          styles={styles.headerTitle}
        />
        <TextComponent
          label={`Tổng cộng ${referralRequests.length} mã đã gửi`}
          styles={styles.headerSubtitle}
        />
      </Animated.View>

      {/* Animated Filter */}
      <Animated.View
        style={{
          opacity: filterOpacity,
          transform: [{translateX: filterTranslateX}],
        }}>
        <FlatList
          data={menu}
          showsVerticalScrollIndicator={false}
          renderItem={RenderItems}
          horizontal
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
          keyExtractor={(item, index) => index.toString()}
        />
      </Animated.View>

      {/* Animated List */}
      <Animated.View
        style={[
          styles.listContainer,
          {
            opacity: listOpacity,
            transform: [{translateY: listTranslateY}],
          },
        ]}>
        <FlatList
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={filteredRequests}
          keyExtractor={item => item.id}
          renderItem={renderCardItems}
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Animated.View
              style={[
                styles.emptyStateContainer,
                {
                  opacity: emptyStateOpacity,
                  transform: [{scale: emptyStateScale}],
                },
              ]}>
              <MaterialIcons name="inbox" size={64} color="#C7C7CC" />
              <TextComponent
                label="Không có mã giới thiệu nào"
                styles={styles.emptyStateText}
              />
              <TextComponent
                label="Các mã giới thiệu bạn gửi sẽ hiển thị ở đây"
                styles={styles.emptyStateSubtext}
              />
            </Animated.View>
          )}
        />
      </Animated.View>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#C7C7CC',
    textAlign: 'center',
  },
});
