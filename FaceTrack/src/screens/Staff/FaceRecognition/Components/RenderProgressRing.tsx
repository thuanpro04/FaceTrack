import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
interface Props {
  progress: number;
  color: string;
}
const RenderProgressRing = (props: Props) => {
  const {progress, color} = props;
  return (
    <View style={styles.progressRing}>
      {Array.from({length: 60}).map((_, index) => {
        const rotation = index * 6; // 360/60 = 6 degrees per segment
        const isActive = progress >= (index + 1) * (100 / 60);
        return (
          <View
            key={index}
            style={[
              styles.progressSegment,
              {
                transform: [{rotate: `${rotation}deg`}],
                backgroundColor: isActive ? color : 'rgba(255,255,255,0.3)',
              },
            ]}
          />
        );
      })}
    </View>
  );
};

export default RenderProgressRing;

const styles = StyleSheet.create({
  progressRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  progressSegment: {
    position: 'absolute',
    width: 3,
    height: 8,
    left: '50%',
    top: 2,
    marginLeft: -1.5,
    transformOrigin: '50% 38px',
    borderRadius: 2,
  },
});
