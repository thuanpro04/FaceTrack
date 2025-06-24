import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {RowComponent, TextComponent} from '../../../../components/layout';
import ButtonAnimation from '../../../../components/layout/ButtonAnimation';
import appColors from '../../../../constants/appColors';
interface Props {
  selectedPeriod: string;
  handlePeriodChange: (period: string) => void;
}
const PeriodButtons = (props: Props) => {
  const {selectedPeriod, handlePeriodChange} = props;
  return (
    <RowComponent styles={styles.periodContainer}>
      {[
        {key: 'week', label: 'Tuần'},
        {key: 'month', label: 'Tháng'},
        {key: 'year', label: 'Năm'},
      ].map(period => (
        <ButtonAnimation
          activeOpacity={0.8}
          key={period.key}
          styles={[
            styles.periodButton,
            selectedPeriod === period.key && styles.periodButtonActive,
          ]}
          onPress={() => handlePeriodChange(period.key)}>
          <TextComponent
            label={period.label}
            styles={[
              styles.periodButtonText,
              selectedPeriod === period.key && styles.periodButtonTextActive,
            ]}
          />
        </ButtonAnimation>
      ))}
    </RowComponent>
  );
};

export default PeriodButtons;

const styles = StyleSheet.create({
  periodContainer: {
    backgroundColor: appColors.white,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#4a90e2',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  periodButtonTextActive: {
    color: '#ffffff',
  },
});
