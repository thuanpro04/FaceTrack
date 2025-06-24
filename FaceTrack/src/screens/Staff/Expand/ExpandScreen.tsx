import {
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
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

const ExpandScreen = ({navigation}: any) => {
  const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>(menu);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  const scrollY = useRef(new Animated.Value(0)).current;

  // Enhanced responsive logic
  const getResponsiveConfig = () => {
    const {width, height} = screenData;
    const isLandscape = width > height;
    const isTablet = width > 768; // iPad breakpoint
    const isLargeTablet = width > 1024; // iPad Pro breakpoint

    let numColumns, itemWidth, spacing;

    if (isLandscape) {
      if (isLargeTablet) {
        numColumns = 5;
        itemWidth = (width - 80) / 5; // 5 columns with spacing
        spacing = 16;
      } else if (isTablet) {
        numColumns = 4;
        itemWidth = (width - 64) / 4; // 4 columns
        spacing = 12;
      } else {
        numColumns = 3;
        itemWidth = (width - 48) / 3; // 3 columns for phone landscape
        spacing = 8;
      }
    } else {
      // Portrait mode
      if (isTablet) {
        numColumns = 3;
        itemWidth = (width - 48) / 3;
        spacing = 12;
      } else {
        numColumns = 2;
        itemWidth = (width - 28) / 2;
        spacing = 8;
      }
    }

    return {
      isLandscape,
      isTablet,
      numColumns,
      itemWidth,
      spacing,
      screenWidth: width,
      screenHeight: height,
    };
  };

  const responsiveConfig = getResponsiveConfig();

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

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setScreenData(window);
    });
    return () => subscription?.remove();
  }, []);

  const renderItems = ({item, index}: any) => {
    return (
      <View
        style={[
          styles.itemContainer,
          {
            width: responsiveConfig.itemWidth - responsiveConfig.spacing,
            marginHorizontal: responsiveConfig.spacing / 2,
          },
        ]}>
        <EnhancedCardComponent
          item={item}
          index={index}
          onPress={() => onNavigation(item.screen)}
        />
      </View>
    );
  };

  const renderEmptyState = () => (
    <View
      style={[
        styles.emptyState,
        {
          width: responsiveConfig.screenWidth - 28,
          minHeight: responsiveConfig.screenHeight * 0.4,
        },
      ]}>
      <Category size={responsiveConfig.isTablet ? 80 : 64} color="#E0E0E0" />
      <TextComponent
        styles={[
          styles.emptyStateText,
          {fontSize: responsiveConfig.isTablet ? 20 : 18},
        ]}
        label="Không tìm thấy chức năng"
      />
      <TextComponent
        label="Thử tìm kiếm với từ khóa khác"
        styles={[
          styles.emptyStateSubtext,
          {fontSize: responsiveConfig.isTablet ? 16 : 14},
        ]}
      />
    </View>
  );

  return (
    <ContainerComponent styles={styles.container}>
      {/* Header Section */}
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={[
          styles.headerGradient,
          responsiveConfig.isLandscape && styles.headerGradientLandscape,
        ]}>
        <HeaderComponent onNavigationIcon={() => navigation.goBack()} />
        <View>
          <View style={styles.titleRow}>
            <Category
              size={responsiveConfig.isTablet ? 32 : 28}
              color="#667eea"
            />
            <View style={styles.titleTextContainer}>
              <TextComponent
                label="Chức năng"
                styles={[
                  styles.mainTitle,
                  {fontSize: responsiveConfig.isTablet ? 32 : 28},
                ]}
              />
              <TextComponent
                label={`${filteredMenu.length} tính năng có sẵn`}
                styles={[
                  styles.subtitle,
                  {fontSize: responsiveConfig.isTablet ? 16 : 14},
                ]}
              />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Animated Header Effect */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerOpacity,
            transform: [{translateY: headerTranslateY}],
          },
        ]}
      />

      {/* Filter Section */}
      <View
        style={[
          styles.filterSection,
          responsiveConfig.isLandscape && styles.filterSectionLandscape,
        ]}>
        {!responsiveConfig.isLandscape && (
          <SearchComponent onSearch={menuUtils.searchMenu} />
        )}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </View>

      {/* Main Content - FlatList */}
      <Animated.FlatList
        key={`${responsiveConfig.numColumns}-${responsiveConfig.isLandscape}`} // Force re-render on orientation change
        numColumns={responsiveConfig.numColumns}
        data={filteredMenu}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: responsiveConfig.spacing,
            paddingBottom: responsiveConfig.isLandscape ? 20 : 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItems}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
        ListEmptyComponent={renderEmptyState}
        // Responsive item separator
        ItemSeparatorComponent={() => (
          <View style={{height: responsiveConfig.spacing}} />
        )}
        // Improved performance for large lists
        removeClippedSubviews={true}
        maxToRenderPerBatch={responsiveConfig.numColumns * 3}
        windowSize={10}
        initialNumToRender={responsiveConfig.numColumns * 4}
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
  headerGradientLandscape: {
    paddingBottom: 12, // Reduce padding in landscape
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  mainTitle: {
    fontSize: 28,
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
  filterSectionLandscape: {
    paddingVertical: 12, // Reduce padding in landscape
  },
  listContent: {
    paddingTop: 16,
    flexGrow: 1,
  },
  itemContainer: {
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7F8C8D',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#BDC3C7',
    textAlign: 'center',
    lineHeight: 20,
  },
});
