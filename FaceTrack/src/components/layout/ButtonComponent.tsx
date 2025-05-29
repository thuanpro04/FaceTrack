import {
  StyleProp,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import TextComponent from './TextComponent';
import appColors from '../../constants/appColors';
interface Props {
  label?: string;
  labelColor?: string;
  labelSize?: number;
  bgColor?: string;
  styles?: StyleProp<ViewStyle>;
  onPress?: () => void;
  iconLast?: ReactNode;
  disable?: boolean;
}
const ButtonComponent = (props: Props) => {
  const {
    label,
    bgColor,
    labelColor,
    labelSize,
    styles,
    onPress,
    iconLast,
    disable,
  } = props;
  return (
    <TouchableOpacity
      disabled={disable}
      onPress={onPress}
      style={[
        {
          backgroundColor: disable
            ? appColors.buttonDisabled
            : bgColor
            ? bgColor
            : appColors.buttonPrimary,
        },
        styles,
      ]}>
      {label && (
        <TextComponent
          label={label}
          color={labelColor}
          size={labelSize}
          styles={{textAlign: 'center'}}
        />
      )}
      {iconLast && iconLast}
    </TouchableOpacity>
  );
};

export default ButtonComponent;

const styles = StyleSheet.create({});
