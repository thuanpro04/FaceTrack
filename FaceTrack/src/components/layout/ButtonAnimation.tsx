import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactNode, useRef} from 'react';
import TextComponent from './TextComponent';
interface Props {
  styles?: StyleProp<ViewStyle>;
  children: ReactNode;
  onPress: () => void;
  activeOpacity?: number;
}
const ButtonAnimation = (props: Props) => {
  const {styles, children, onPress, activeOpacity} = props;
  const scaleAnim = useRef(new Animated.Value(1)).current;
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
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={[styles ?? localStyles.backButton]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View style={{transform: [{scale: scaleAnim}]}}>
      {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ButtonAnimation;
