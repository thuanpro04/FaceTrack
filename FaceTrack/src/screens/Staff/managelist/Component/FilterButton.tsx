import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useRef} from 'react';
import {TextComponent} from '../../../../components/layout';
interface Props {
  title: string;
  value: string;
  isSelected: boolean;
  onChangeSelectedFilter: (value: string) => void;
}
const FilterButton = (props: Props) => {
  const {isSelected, title, value, onChangeSelectedFilter} = props;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onChangeSelectedFilter(value);
  };
  return (
    <Animated.View
      style={{
        transform: [
          {
            scale: scaleAnim,
          },
        ],
      }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={[styles.filterButton, isSelected && styles.filterButtonActive]}>
        <TextComponent
          label={title}
          styles={(styles.filterText, isSelected && styles.filterTextActive)}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FilterButton;

const styles = StyleSheet.create({
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterText: {
    fontSize: 14,
    color: '#657786',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
  },
});
