import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft2 } from 'iconsax-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import {
  ContainerComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components/layout';
import ButtonAnimation from '../../../components/layout/ButtonAnimation';
import appColors from '../../../constants/appColors';
import { appSize } from '../../../constants/appSize';
import { authSelector } from '../../../redux/slices/authSlice';
import { staffServices } from '../../../services/staffServices';
import ReferralCard from './Component/ReferralCard';

export interface Manager {
  user: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    profileImageUrl?: string;
    status: 'active' | 'inactive';
    role: 'manager' | 'staff';
  };
  requestStaff?: [
    {
      referralCode: string;
      status: 'pending' | 'approved' | 'rejected';
      _id?: string;
      submittedAt: Date;
    },
  ];
  origanizations?: {
    name: string;
    description: string;
    address: string;
  };
}

const AwaitingModerationScreen = ({navigation}: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [manages, setManages] = useState<Manager[]>([]);

  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');
  const user = useSelector(authSelector);
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
    // Start entrance animations
    startEntranceAnimations();
  }, []);
  const getManageInfo = async () => {
    try {
      setIsLoading(true);
      const res = await staffServices.getManageInfo(user._id);
      if (res && res.data) {
        console.log(`${res.data.message}`, res.data.manageInfo);
        setManages(res.data.manageInfo);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('get manage info error: ', error);
      setIsLoading(false);
    }
  };

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
    return manages.reduce((count, manage) => {
      const staffArr = Array.isArray(manage.requestStaff)
        ? manage.requestStaff
        : [];
      return count + staffArr.filter(item => item.status === status).length;
    }, 0);
  };

  const filteredItems =
    selectedFilter === 'all'
      ? manages.flatMap((m:any) =>
          (m.requestStaff || []).map((item:any) => ({
            ...item,
            manager: m.user,
            referralCode: m.referralCode, // 👈 Thêm dòng này
          })),
        )
      : manages.flatMap((m: any) =>
          (m.requestStaff || [])
            .filter((item: any) => item.status === selectedFilter)
            .map((item: any) => ({
              ...item,
              manager: m.user,
              referralCode: m.referralCode, // 👈 Thêm dòng này
            })),
        );

  useEffect(() => {
    if (filteredItems.length === 0) {
      // Reset empty state animation
      emptyStateOpacity.setValue(0);
      emptyStateScale.setValue(0.8);
      // Start empty state animation
      setTimeout(animateEmptyState, 100);
    }
  }, [filteredItems.length]);

  const menu = [
    {
      title: 'Tất cả',
      value: 'all',
      count: manages.length,
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
  useFocusEffect(
    useCallback(() => {
      getManageInfo();
    }, []),
  );
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

    return <AnimatedReferralCard key={item._id} request={item} index={index} />;
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
          label={`Tổng cộng ${manages?.length} mã đã gửi`}
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
          data={filteredItems}
          keyExtractor={item => item._id?.toString() || item.referralCode}
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
