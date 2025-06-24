import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {TextComponent} from '../../../../components/layout';
interface Props {
  value: string;
  suffix?: string;
  prefix?: string;
  duration: number;
  style?: StyleProp<TextStyle>;
}
const AnimatedNumber = (props: Props) => {
  const {duration = 1000, prefix = '', suffix = '', value, style} = props;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const numericValue =
      typeof value === 'string'
        ? parseFloat(value.replace(/[^\d.]/g, ''))
        : value;
    animatedValue.setValue(0);
    const animation = Animated.timing(animatedValue, {
      toValue: numericValue,
      duration: duration,
      useNativeDriver: true,
    });
    const listener = animatedValue.addListener(({value}) => {
      setDisplayValue(value);
    });
    animation.start();
    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value]);
  const formatValue = (val: any) => {
    if (value.includes('/')) {
      const parts = value.split('/');
      const animatedPart = Math.round(val);
      return `${animatedPart}/${parts[1]}`;
    }
    if (value.includes('%')) {
      return `${val.toFixed(1)}%`;
    }
    if (value.includes('h')) {
      return `${val.toFixed(1)}h`;
    }
    return Math.round(val).toString();
  };
  return (
    <TextComponent
      label={`${prefix} ${formatValue(displayValue)} ${suffix}`}
      styles={style}
    />
  );
};

export default AnimatedNumber;

const styles = StyleSheet.create({});
