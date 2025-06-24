import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {Manager} from '../../../data/user.type';
import {Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {TextComponent} from '../../../../components/layout';
interface Props {
  managers: Manager[];
  searchText: string;
  selectedFilter: string;
}
const BodyManageComponent = (props: Props) => {
  const {managers, searchText, selectedFilter} = props;
  const [refreshing, setRefreshing] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const cardAnimations = useRef(
    managers.map(() => new Animated.Value(0)),
  ).current;
  const filteredManagers = managers.filter(manager => {
    const matchesSearch = manager.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesFilter =
      selectedFilter === 'all' || manager.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const cardStagger = cardAnimations.map((anim, index) =>
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      delay: index * 100 + 400,
      useNativeDriver: true,
    }),
  );
  Animated.stagger(100, cardStagger).start();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#00d4aa';
      case 'offline':
        return '#95a5a6';
      case 'busy':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Trực tuyến';
      case 'offline':
        return 'Ngoại tuyến';
      case 'busy':
        return 'Bận';
      default:
        return 'Không xác định';
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      cardAnimations.forEach((anim, index) => {
        anim.setValue(0);
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          delay: index * 50,
          useNativeDriver: true,
        }).start();
      });
    }, 1000);
  };
  const AnimatedCard = ({
    item,
    index,
    cardAnim,
    pulseAnim,
    getStatusColor,
    getStatusText,
  }: {
    item: Manager;
    index: number;
    cardAnim: Animated.Value;
    pulseAnim: Animated.Value;
    getStatusColor: (status: string) => string;
    getStatusText: (status: string) => string;
  }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const translateXAnim = useRef(new Animated.Value(0)).current;
    const rotate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '2deg'],
    });
    const handlePressIn = () => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    };
    const handlePressOut = () => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    };
    return (
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              {
                translateY: cardAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
              {
                scale: scaleAnim,
              },
              {rotate},
              {translateX: translateXAnim},
            ],
          },
        ]}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}>
          <LinearGradient
            colors={['#ffffff', '#f8f9fa']}
            style={styles.cardGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <View style={styles.cardContent}>
              <View style={styles.avatarContainer}>
                <Image source={{uri: item.avatar}} style={styles.avatar} />
                <Animated.View
                  style={[
                    styles.statusIndicator,
                    {
                      backgroundColor: getStatusColor(item.status),
                      transform:
                        item.status === 'online'
                          ? [{scale: pulseAnim}]
                          : [{scale: 1}],
                    },
                  ]}
                />
              </View>
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <TextComponent label={item.name} styles={styles.name} />
                  <View style={styles.projectsBadge}>
                    <TextComponent
                      label={item.projects.toString()}
                      styles={styles.projectsText}
                    />
                  </View>
                </View>

                <TextComponent label={item.role} styles={styles.role} />

                <View style={styles.ratingContainer}>
                  <TextComponent
                    label={`⭐ ${item.rating}`}
                    styles={styles.ratingText}
                  />
                  <View style={styles.ratingBar}>
                    <View
                      style={[
                        styles.ratingFill,
                        {width: `${(item.rating / 5) * 100}%`},
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.bottomRow}>
                  <View style={styles.departmentTag}>
                    <TextComponent
                      label={item.department}
                      styles={styles.departmentText}
                    />
                  </View>
                  <TextComponent
                    label={getStatusText(item.status)}
                    styles={[
                      styles.status,
                      {color: getStatusColor(item.status)},
                    ]}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.moreButton}>
                <Text style={styles.moreButtonText}>⋯</Text>
                <TextComponent label="⋯" styles={styles.moreButtonText} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <FlatList
      renderItem={({item, index}) => (
        <AnimatedCard
          item={item}
          index={index}
          cardAnim={cardAnimations[index]}
          pulseAnim={pulseAnim}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      )}
      data={filteredManagers}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ItemSeparatorComponent={() => <View style={{height: 12}} />}
    />
  );
};

export default BodyManageComponent;

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  projectsBadge: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  projectsText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f39c12',
    marginRight: 8,
  },
  ratingBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#ecf0f1',
    borderRadius: 2,
    overflow: 'hidden',
  },
  ratingFill: {
    height: '100%',
    backgroundColor: '#f39c12',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  departmentTag: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  departmentText: {
    fontSize: 12,
    color: '#5d6d7e',
    fontWeight: '500',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  moreButtonText: {
    fontSize: 18,
    color: '#95a5a6',
    fontWeight: 'bold',
  },
});
