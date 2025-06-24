import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {ReactNode} from 'react';
import {MockUserData, YearlyData} from '../../../data/user.type';
import {RowComponent} from '../../../../components/layout';
import StatCard from './StatCard';
import AnimatedChart from './AnimatedChart';
import {LineChart} from 'react-native-chart-kit';
interface Props {
  yearlyData: YearlyData;
  shouldAnimateNumbers: boolean;
  chartFadeAnim: any;
  chartScaleAnim: any;
}
const {width: screenWidth} = Dimensions.get('window');

const YearlyStats = (props: Props) => {
  const {yearlyData, shouldAnimateNumbers, chartFadeAnim, chartScaleAnim} =
    props;

  return (
    <View>
      <RowComponent styles={styles.statsGrid}>
        <StatCard
          title="Ngày làm việc"
          value={`${yearlyData.presentDays}/${yearlyData.totalWorkDays}`}
          subtitle="Ngày trong name"
          color="#4ade80"
          index={0}
          shouldAnimateNumbers={shouldAnimateNumbers}
          selectedPeriod={'year'}
        />
        <StatCard
          title="Nghĩ việc"
          value={`${yearlyData.absentDays}`}
          subtitle="ngày nghỉ"
          color="#ef4444"
          index={1}
          shouldAnimateNumbers={shouldAnimateNumbers}
          selectedPeriod={'year'}
        />
        <StatCard
          title="Làm thêm"
          value={`${yearlyData.overtimeHours}h`}
          subtitle="giờ thêm"
          color="#8b5cf6"
          index={2}
          shouldAnimateNumbers={shouldAnimateNumbers}
          selectedPeriod={'year'}
        />
        <StatCard
          title="Tỷ lệ chấm công"
          value="71.4%"
          subtitle="cả năm"
          color="#10b981"
          index={3}
          shouldAnimateNumbers={shouldAnimateNumbers}
          selectedPeriod={'year'}
        />
      </RowComponent>
      <AnimatedChart
        chartFadeAnim={chartFadeAnim}
        chartScaleAnim={chartScaleAnim}
        title='Tỷ lệ chấm công theo tháng'
        ChartComponent={LineChart}
        chartProps={{
          data: yearlyData.monthlyAttendance,
            width: screenWidth - 40,
            height: 220,
            chartConfig: {
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
              style: {borderRadius: 16},
              propsForDots: {
                r: '4',
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

export default YearlyStats;

const styles = StyleSheet.create({
  statsGrid: {
    flexWrap: 'wrap',
    gap: 12,
  },
});
