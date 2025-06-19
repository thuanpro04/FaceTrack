import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {TextComponent} from '../../../../components/layout';
interface Props {
  item: any;
  index: number;
  onPress: () => void;
}
const {width} = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2;
const EnhancedCardComponent = (props: Props) => {
  const {index, item, onPress} = props;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  useEffect(() => {
    const delay = index * 100;
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  const Icon = item.icon;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };
  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{scale: scaleAnim}, {translateY: translateYAnim}],
          opacity: opacityAnim,
        },
      ]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.cardTouchable}>
        <LinearGradient
          colors={item.gradient || ['#667eea', '#764ba2']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradientCard}>
          <View style={styles.backgroundPattern}>
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
            <View style={[styles.circle, styles.circle3]} />
          </View>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <Icon height={32} width={32} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.textContent}>
              <TextComponent
                numberLine={2}
                label={item.title}
                styles={styles.cardTitle}
              />
              <TextComponent
                label={item.description}
                styles={styles.cardDescription}
                numberLine={2}
              />
            </View>
            {item.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default EnhancedCardComponent;

const styles = StyleSheet.create({
  cardContainer: {
    width: COLUMN_WIDTH,
    height: 160,
  },
  cardTouchable: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientCard: {
    flex: 1,
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0,1)',
    borderRadius: 50,
  },
  circle1: {
    width: 60,
    height: 60,
    top: -20,
    right: -20,
  },
  circle2: {
    width: 40,
    height: 40,
    bottom: -10,
    left: -10,
  },
  circle3: {
    width: 80,
    height: 80,
    top: '50%',
    right: -40,
    opacity: 0.5,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    marginTop: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  cardDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
  },
  iconContainer: {
    alignSelf: 'flex-start',
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
