import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {ReactNode, useEffect, useRef} from 'react';
import appColors from '../../../constants/appColors';
interface Props {
  borderColor: string;
}
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const overlaySize = screenWidth * 0.65;
const overlayHeight = overlaySize * 1.4;
const overlayTop = screenHeight * 0.28;

export default function OvalFace(props: Props) {
  const {borderColor} = props;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);
  return (
    <Animated.View
      style={[
        styles.ovalFrame,
        {
          width: overlaySize,
          height: overlayHeight,
          top: overlayTop,
          left: (screenWidth - overlaySize) / 2,
          borderColor: borderColor,
          transform: [{scale: pulseAnim}],
          shadowColor: borderColor,
          shadowOpacity: 0.5,
          shadowRadius: 10,
          shadowOffset: {
            width: 0,
            height: 0,
          },
        },
      ]}>
      {/* Corner indicators */}
      <View style={[styles.cornerIndicator, styles.topLeft]} />
      <View style={[styles.cornerIndicator, styles.topRight]} />
      <View style={[styles.cornerIndicator, styles.bottomLeft]} />
      <View style={[styles.cornerIndicator, styles.bottomRight]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ovalFrame: {
    position: 'absolute',
    borderWidth: 3,
    borderRadius: 200,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  },
  cornerIndicator: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: appColors.white,
  },
  topLeft: {
    top: -3,
    left: -3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: -3,
    right: -3,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: -3,
    left: -3,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: -3,
    right: -3,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
});
