import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {ReactNode} from 'react';
import {MockUserData, MonthlyData} from '../../../data/user.type';
import {RowComponent} from '../../../../components/layout';
import StatCard from './StatCard';
import AnimatedChart from './AnimatedChart';
import {BarChart, LineChart, PieChart} from 'react-native-chart-kit';
interface Props {
  monthlyData: MonthlyData;
  shouldAnimateNumbers: boolean;
  chartFadeAnim: any;
  chartScaleAnim: any;
}
const {width: screenWidth} = Dimensions.get('window');

const MonthlyStats = (props: Props) => {
  const {monthlyData, shouldAnimateNumbers, chartFadeAnim, chartScaleAnim} =
    props;

  return (
    <View>
      <RowComponent styles={styles.statsGrid}>
        <StatCard
          title="Ngày có mặt"
          value={`${monthlyData.presentDays}/${monthlyData.totalWorkDays}`}
          subtitle="Ngày trong tháng"
          color="#4ade80"
          index={0}
          shouldAnimateNumbers={shouldAnimateNumbers}
          selectedPeriod={'month'}
        />
        <StatCard
          title="Tổng giờ làm"
          value={`${monthlyData.totalWorkHours}h`}
          subtitle="trong tháng"
          color="#3b82f6"
          index={1}
          shouldAnimateNumbers={shouldAnimateNumbers}
          selectedPeriod={'month'}
        />
        <StatCard
          title="Làm thêm"
          value={`${monthlyData.overtimeHours}h`}
          subtitle="giờ thêm"
          color="#f59e0b"
          index={2}
          shouldAnimateNumbers={shouldAnimateNumbers}
          selectedPeriod={'month'}
        />
        <StatCard
          title="Tỷ lệ chấm công"
          value={`${monthlyData.attendanceRate}%`}
          subtitle="tháng này"
          color="#8b5cf6"
          index={3}
          shouldAnimateNumbers={shouldAnimateNumbers}
          selectedPeriod={'month'}
        />
      </RowComponent>
      <AnimatedChart
        chartFadeAnim={chartFadeAnim}
        chartScaleAnim={chartScaleAnim}
        title="Tỷ lệ chấm công theo tuần"
        ChartComponent={BarChart}
        chartProps={{
          data: monthlyData.weeklyAttendance,
          width: screenWidth - 40,
          height: 200,
          chartConfig: {
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
            style: {borderRadius: 16},
          },
        }}
      />
      <AnimatedChart
        chartFadeAnim={chartFadeAnim}
        chartScaleAnim={chartScaleAnim}
        title="Phân bố thời gian làm việc"
        ChartComponent={PieChart}
        chartProps={{
          data: monthlyData.workHoursDistribution,
          width: screenWidth - 40,
          height: 200,
          chartConfig: {
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          },
          accessor: 'population',
          backgroundColor: 'transparent',
          paddingLeft: '15',
        }}
      />
    </View>
  );
};

export default MonthlyStats;

const styles = StyleSheet.create({
  statsGrid: {
    flexWrap: 'wrap',
    gap: 12,
  },
});
