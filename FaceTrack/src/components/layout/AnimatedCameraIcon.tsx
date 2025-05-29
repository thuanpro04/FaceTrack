import {
  Animated,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {use, useEffect, useRef} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import appColors from '../../constants/appColors';
import TextComponent from './TextComponent';

const AnimatedCameraIcon = ({navigation}: any) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();
    return () => {
      pulseAnimation.stop();
    };
  }, []);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('camera')}
      activeOpacity={0.8}
      style={styles.cameraIconContainer}>
      <Animated.View style={[styles.cameraOuterRing]}>
        <View style={styles.cameraMiddleRing}>
          <Animated.View
            style={[
              styles.cameraInnerCircle,
              {transform: [{scale: pulseAnim}]},
            ]}>
            <Ionicons name="camera" size={32} color="white" />
            <View style={styles.faceIndicator}>
              <Ionicons name="person" size={12} color={appColors.primary} />
            </View>
          </Animated.View>
          <Animated.View
            style={[
              styles.pulseRing,
              {
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.1],
                  outputRange: [0.3, 0.1],
                }),
                transform: [{scale: pulseAnim}],
              },
            ]}
          />
        </View>
      </Animated.View>
      <TextComponent styles={styles.cameraLabel} label="Chấm công" />
      <TextComponent
        styles={styles.cameraSubLabel}
        label="Nhận diện khuôn mặt"
      />
      <View style={styles.statusIndicator}>
        <Animated.View
          style={[
            styles.statusDot,
            {
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.1],
                outputRange: [1, 0.6],
              }),
            },
          ]}
        />
        <TextComponent styles={styles.statusText} label="Sẵn sàng" />
      </View>
    </TouchableOpacity>
  );
};

export default AnimatedCameraIcon;

const styles = StyleSheet.create({
  cameraIconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
    position: 'relative',
  },

  cameraOuterRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${appColors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: `${appColors.primary}30`,
  },

  cameraMiddleRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${appColors.primary}25`,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  cameraInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: appColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 8,
    shadowColor: appColors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },

  faceIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: appColors.primary,
  },

  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: `${appColors.primary}40`,
    // Animation sẽ được thêm bằng Animated API
  },

  cameraLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: appColors.text,
    marginTop: 12,
  },

  cameraSubLabel: {
    fontSize: 12,
    color: appColors.textSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },

  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: `${appColors.success}15`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: appColors.success,
  },

  statusText: {
    fontSize: 11,
    color: appColors.success,
    fontWeight: '600',
  },
});
