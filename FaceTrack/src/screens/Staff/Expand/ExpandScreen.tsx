import {
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {categories, menu, MenuItem, menuUtils} from '../../data/data';
import {ContainerComponent, TextComponent} from '../../../components/layout';
import LinearGradient from 'react-native-linear-gradient';
import HeaderComponent from '../../../components/layout/HeaderComponent';
import {ArrowLeft2, Category} from 'iconsax-react-native';
import {appSize} from '../../../constants/appSize';
import appColors from '../../../constants/appColors';
import CategoryFilter from './Component/CategoryFilter';
import SearchComponent from './Component/SearchComponent';
import EnhancedCardComponent from './Component/EnhancedCardComponent';
const {width} = Dimensions.get('window');
const ExpandScreen = ({navigation}: any) => {
  const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>(menu);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const scrollY = useRef(new Animated.Value(0)).current;
  const enhancedMenu = menu.map((item, index) => ({
    ...item,
    gradient: [
      ['#667eea', '#764ba2'],
      ['#f093fb', '#f5576c'],
      ['#4facfe', '#00f2fe'],
      ['#43e97b', '#38f9d7'],
      ['#fa709a', '#fee140'],
      ['#a8edea', '#fed6e3'],
      ['#ff9a9e', '#fecfef'],
      ['#ffecd2', '#fcb69f'],
    ][index % 8],
    isNew: index < 2,
  }));
  const onNavigation = (name: string) => {
    navigation.navigate(`${name}`);
  };
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredMenu(enhancedMenu);
    } else {
      const filtered = enhancedMenu.filter(item => item.category === category);
      setFilteredMenu(filtered);
    }
  };
  const renderItems = ({item, index}: any) => {
    return (
      <EnhancedCardComponent
        item={item}
        index={index}
        onPress={() => onNavigation(item.screen)}
      />
    );
  };
  return (
    <ContainerComponent styles={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={styles.headerGradient}>
        <HeaderComponent
          navigation={navigation}
          icon={
            <ArrowLeft2
              size={appSize.iconLarge}
              color={appColors.iconDefault}
              onPress={() => navigation.goBack()}
            />
          }
        />
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Category size={32} color="#667eea" />
            <View style={styles.titleTextContainer}>
              <Text style={styles.mainTitle}>Chức năng</Text>
              <TextComponent
                label={`${filteredMenu.length} tính năng có sẵn`}
                styles={styles.subtitle}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerOpacity,
            transform: [{translateY: headerTranslateY}],
          },
        ]}></Animated.View>
      <View style={styles.filterSection}>
        <SearchComponent onSearch={menuUtils.searchMenu} />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </View>
      <Animated.FlatList
        numColumns={2}
        data={filteredMenu}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={renderItems}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Category size={64} color="#E0E0E0" />
            <TextComponent
              styles={styles.emptyStateText}
              label="Không tìm thấy chức năng"
            />
            <TextComponent
              label="Thử tìm kiếm với từ khóa khác"
              styles={styles.emptyStateSubtext}
            />
          </View>
        )}
      />
    </ContainerComponent>
  );
};

export default ExpandScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    zIndex: 1000,
  },
  headerGradient: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  titleContainer: {},
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    width: width - 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7F8C8D',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#BDC3C7',
    textAlign: 'center',
  },
});
