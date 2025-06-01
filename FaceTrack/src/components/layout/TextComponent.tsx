import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';
import React from 'react';
import appColors from '../../constants/appColors';
interface Props {
  label: string;
  color?: string;
  size?: number;
  styles?: StyleProp<TextStyle>;
  title?: boolean;
  numberLine?: number;
}
const TextComponent = (props: Props) => {
  const {label, color, size, styles, title, numberLine} = props;
  return title ? (
    <Text
      style={[
        localStyles.text,
        {
          fontSize: size ?? 36,
          fontWeight: 'bold',
          color: color ?? appColors.title,
        },
        styles,
      ]}>
      {label}
    </Text>
  ) : (
    <Text
      numberOfLines={numberLine ?? 1}
      style={[
        localStyles.text,
        {fontSize: size ?? 18, color: color ?? 'black'},
        styles,
      ]}>
      {label}
    </Text>
  );
};

export default TextComponent;

const localStyles = StyleSheet.create({
  text: {
    color: 'black',
  },
});
