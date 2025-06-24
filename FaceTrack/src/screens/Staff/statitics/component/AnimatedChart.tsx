import {Animated, StyleSheet, Text, View} from 'react-native';
import React, {ReactNode} from 'react';
import {TextComponent} from '../../../../components/layout';
import AnimatedProgressBar from './AnimatedProgressBar';
import appColors from '../../../../constants/appColors';
interface Props {
  ChartComponent: any;
  chartProps: any;
  title: string;
  chartScaleAnim: any;
  chartFadeAnim: any;
}
const AnimatedChart = (props: Props) => {
  const {ChartComponent, chartProps, title, chartFadeAnim, chartScaleAnim} =
    props;
  return (
    <Animated.View
      style={[
        styles.chartContainer,
        {
          transform: [
            {
              scale: chartScaleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 1],
              }),
            },
          ],
        },
      ]}>
      <TextComponent label={title} styles={styles.chartTitle} />
      <Animated.View
        style={{
          transform: [
            {
              scale: chartScaleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
          ],
        }}>
        <ChartComponent {...chartProps} style={styles.chart} />
      </Animated.View>
      {/* Animated progress indicator */}
      <View style={styles.chartProgress}>
        <AnimatedProgressBar
          progress={chartFadeAnim.value * 100}
          color="#4a90e2"
          height={3}
        />
      </View>
    </Animated.View>
  );
};

export default AnimatedChart;

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems:'center'
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 12,
  },
  chartProgress: {},
});
