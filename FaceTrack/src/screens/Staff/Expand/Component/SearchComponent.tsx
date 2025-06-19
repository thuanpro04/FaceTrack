import {SearchNormal1} from 'iconsax-react-native';
import {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import appColors from '../../../../constants/appColors';

const SearchComponent = ({onSearch}: {onSearch: (text: string) => void}) => {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <SearchNormal1 size={20} color={appColors.iconDefault} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm chức năng..."
          placeholderTextColor="#A0A0A0"
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            onSearch(text);
          }}
        />
      </View>
    </View>
  );
};
export default SearchComponent
const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
});
