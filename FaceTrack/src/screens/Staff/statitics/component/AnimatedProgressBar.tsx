import {Animated, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
interface Props {
  progress: number;
  color: string;
  height: number;
}
const AnimatedProgressBar = (props: Props) => {
  const {color, height, progress} = props;
  const progressAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [progress]);
  return (
    <View style={[styles.progressBarContainer, {height}]}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            backgroundColor: color,
            transform: [
              {
                scaleX: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, 1],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

export default AnimatedProgressBar;

const styles = StyleSheet.create({
  progressBar: {},
  progressBarContainer: {},
});
