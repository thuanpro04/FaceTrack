import {
  Animated,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ContainerComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components/layout';
import LinearGradient from 'react-native-linear-gradient';
import ButtonAnimation from '../../../components/layout/ButtonAnimation';
import {ArrowLeft2} from 'iconsax-react-native';
import {appSize} from '../../../constants/appSize';
import appColors from '../../../constants/appColors';
import HeaderManageComponent from './Component/HeaderManageComponent';
import {Manager} from '../../data/user.type';
import FilterButton from './Component/FilterButton';
import BodyManageComponent from './Component/BodyManageComponent';
import FootComponent from './Component/FootComponent';
const sampleManagers: Manager[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    role: 'Trưởng phòng kỹ thuật',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    department: 'Kỹ thuật',
    status: 'online',
    projects: 8,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Trần Thị B',
    role: 'Quản lý nhân sự',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    department: 'Nhân sự',
    status: 'offline',
    projects: 12,
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Phạm Văn C',
    role: 'Giám sát sản xuất',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    department: 'Sản xuất',
    status: 'online',
    projects: 6,
    rating: 4.6,
  },
  {
    id: '4',
    name: 'Lê Minh D',
    role: 'Trưởng phòng Marketing',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    department: 'Marketing',
    status: 'busy',
    projects: 15,
    rating: 4.7,
  },
];
const {width, height} = Dimensions.get('window');
const ManageListScreen = ({navigation}: any) => {
  const [searchText, setSearchText] = useState('');
  const [managers, setManagers] = useState<Manager[]>(sampleManagers);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const searchAnim = useRef(new Animated.Value(0)).current;
  const isLandscape = width > height;

  useEffect(() => {
    Animated.timing(searchAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      delay: 200,
    }).start();
  });
  return (
    <ContainerComponent styles={styles.container}>
      <HeaderManageComponent managers={managers} navigation={navigation} />
      <Animated.View
        style={[
          styles.searchSection,
          {
            opacity: searchAnim,
            transform: [
              {
                translateX: searchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-width, 0],
                }),
              },
            ],
          },
        ]}>
        <View style={styles.searchContainer}>
          <TextComponent styles={styles.searchIcon} label="🔍" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên..."
            placeholderTextColor={'#a0a0a0'}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <ButtonAnimation
              onPress={() => setSearchText('')}
              styles={styles.clearButton}>
              <TextComponent label="X" styles={styles.clearButtonText} />
            </ButtonAnimation>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}>
          <FilterButton
            onChangeSelectedFilter={setSelectedFilter}
            title="Tất cả"
            value="all"
            isSelected={selectedFilter === 'all'}
          />
          <FilterButton
            onChangeSelectedFilter={setSelectedFilter}
            title="Trực tuyến"
            value="online"
            isSelected={selectedFilter === 'online'}
          />
          <FilterButton
            onChangeSelectedFilter={setSelectedFilter}
            title="Bận"
            value="busy"
            isSelected={selectedFilter === 'busy'}
          />
          <FilterButton
            onChangeSelectedFilter={setSelectedFilter}
            title="Ngoại tuyến"
            value="offline"
            isSelected={selectedFilter === 'offline'}
          />
        </ScrollView>
      </Animated.View>
      <BodyManageComponent
        managers={managers}
        searchText={searchText}
        selectedFilter={selectedFilter}
      />
      <FootComponent />
    </ContainerComponent>
  );
};

export default ManageListScreen;

const styles = StyleSheet.create({
  container: {},
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    zIndex: 999,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2c3e50',
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#95a5a6',
  },
  filterContainer: {
    flexGrow: 0,
  },
});
