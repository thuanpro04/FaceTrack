import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';

const FootComponent = () => {
  const fabAnim = useRef(new Animated.Value(1)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const isLandscape = screenData.width > screenData.height;
  const handleFabPress = () => {
    Animated.sequence([
      Animated.timing(fabAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: -5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    floatingAnimation.start();
    return () => floatingAnimation.stop();
  }, []);
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setScreenData(window);
    });
    return () => subscription?.remove();
  });
  return (
    <Animated.View
      style={[
        styles.fab,
        {
          transform: [{scale: fabAnim}, {translateY: floatingAnim}],
          right: '10%',
          bottom: isLandscape ? '40%' : '12%',
        },
      ]}>
      <TouchableOpacity onPress={handleFabPress} activeOpacity={0.8}>
        <LinearGradient
          colors={['#ff6b6b', '#ee5a24', '#fd79a8']}
          style={styles.fabGradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <Text style={styles.fabText}>+</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FootComponent;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#ff6b6b',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
