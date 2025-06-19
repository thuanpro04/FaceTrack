import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {TextComponent} from '../../../../components/layout';
import {CategoriesItem} from '../../../data/data';
interface Props {
  categories: CategoriesItem[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}
const CategoryFilter = (props: Props) => {
  const {categories, onCategorySelect, selectedCategory} = props;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryContent}
      style={styles.categoryContainer}>
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryButton,
            selectedCategory === category.id && styles.categoryButtonActive,
          ]}
          onPress={() => onCategorySelect(category.id)}>
          <TextComponent
            styles={[
              styles.categoryButtonText,
              selectedCategory === category.id &&
                styles.categoryButtonTextActive,
            ]}
            label={category.name}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategoryFilter;

const styles = StyleSheet.create({
  categoryContainer: {
    paddingLeft: 16,
  },
  categoryContent: {
    paddingRight: 16,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#667eea',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
});
