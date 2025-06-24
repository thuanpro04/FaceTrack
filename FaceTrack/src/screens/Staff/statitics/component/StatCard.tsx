import {Animated, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TextComponent} from '../../../../components/layout';
import AnimatedNumber from './AnimatedNumber';
import AnimatedProgressBar from './AnimatedProgressBar';
interface Props {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  index: number;
  selectedPeriod: string;
  shouldAnimateNumbers: boolean;
}
const StatCard = (props: Props) => {
  const {
    color,
    index,
    subtitle,
    title,
    value,
    selectedPeriod,
    shouldAnimateNumbers,
  } = props;
  return (
    <Animated.View
      key={`${selectedPeriod}-${index}`}
      style={[
        styles.statCard,
        {
          borderLeftColor: color,
        },
      ]}>
      <TextComponent label={title} styles={styles.statTitle} />
      {shouldAnimateNumbers ? (
        <AnimatedNumber
          value={value}
          style={[styles.statValue]}
          duration={1200 + index * 200}
        />
      ) : (
        <TextComponent styles={styles.statSubtitle} label={subtitle} />
      )}
      {subtitle && (
        <TextComponent styles={styles.statSubtitle} label={subtitle} />
      )}
      {value.includes('%') && (
        <View style={styles.statProgressContainer}>
          <AnimatedProgressBar
            progress={parseFloat(value.replace('%', ''))}
            color={color}
            height={3}
          />
        </View>
      )}
    </Animated.View>
  );
};

export default StatCard;

const styles = StyleSheet.create({
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 11,
    color: '#9ca3af',
  },
  statProgressContainer: {},
});
