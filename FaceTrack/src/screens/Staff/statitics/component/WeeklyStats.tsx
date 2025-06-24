import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {ReactNode} from 'react';
import {MockUserData, WeeklyData} from '../../../data/user.type';
import {RowComponent} from '../../../../components/layout';
import StatCard from './StatCard';
import AnimatedChart from './AnimatedChart';
import {LineChart} from 'react-native-chart-kit';
interface Props {
  weeklyData: WeeklyData;
  shouldAnimateNumbers: boolean;
  chartFadeAnim: any;
  chartScaleAnim: any;
}
const {width: screenWidth} = Dimensions.get('window');

const WeeklyStats = (props: Props) => {
  const {weeklyData, shouldAnimateNumbers, chartFadeAnim, chartScaleAnim} =
    props;
  const chartData = {
    labels: weeklyData.labels,
    datasets: [
      {
        data: weeklyData.workHours,
        color: (opacity = 1) => `rgba(74,144,266,${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  return (
    <View>
      <RowComponent styles={styles.statsGrid}>
        <StatCard
          title="Ngày làm việc"
          value="5/7"
          subtitle="Ngày trong tuần"
          color="#4ade80"
          index={0}
          shouldAnimateNumbers={shouldAnimateNumbers}
          selectedPeriod={'week'}
        />
        <StatCard
          title="Tổng giờ làm"
          value="33.8h"
          subtitle="Trong tuần"
          color="#3b82f6"
          index={1}
          shouldAnimateNumbers={shouldAnimateNumbers}
          selectedPeriod={'week'}
        />
        <StatCard
          title="Đi muộn"
          value="1"
          subtitle="lần"
          color="#f59e0b"
          index={2}
          shouldAnimateNumbers={shouldAnimateNumbers}
          selectedPeriod={'week'}
        />
        <StatCard
          title="Tỷ lệ chấm công"
          value="71.4%"
          subtitle="Tuần này"
          color="#8b5cf6"
          index={3}
          shouldAnimateNumbers={shouldAnimateNumbers}
          selectedPeriod={'week'}
        />
      </RowComponent>
      <AnimatedChart
        chartFadeAnim={chartFadeAnim}
        chartScaleAnim={chartScaleAnim}
        title="Giờ làm việc trong tuần"
        ChartComponent={LineChart}
        chartProps={{
          data: chartData,
          width: screenWidth - 40,
          height: 220,
          chartConfig: {
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
            style: {borderRadius: 16},
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#4a90e2',
            },
          },
          bezier: true,
        }}
      />
    </View>
  );
};

export default WeeklyStats;

const styles = StyleSheet.create({
  statsGrid: {
    flexWrap: 'wrap',
    gap: 12,
  },
});
