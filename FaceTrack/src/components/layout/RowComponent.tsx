import {
  StyleProp,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  styles?: StyleProp<ViewStyle>;
}
const RowComponent = (props: Props) => {
  const {children, onPress, styles} = props;
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0 : 1}
      onPress={onPress}
      style={[{flexDirection: 'row'}, styles]}>
      {children}
    </TouchableOpacity>
  );
};

export default RowComponent;

const styles = StyleSheet.create({});
