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
}
const ButtonAnimation = (props: Props) => {
  const {styles, children, onPress} = props;
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
      onPress={onPress}
      style={[styles]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View style={{transform: [{scale: scaleAnim}]}}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ButtonAnimation;

const styles = StyleSheet.create({});
