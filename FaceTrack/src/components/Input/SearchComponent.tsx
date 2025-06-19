import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import appColors from '../../constants/appColors';
import {RowComponent} from '../layout';
import Feather from 'react-native-vector-icons/Feather';
import {appSize} from '../../constants/appSize';
interface Props {
  onSearch: () => void;
}
const SearchComponent = (props: Props) => {
  const {onSearch} = props;
  const [text, setText] = useState('');

  return (
    <RowComponent
      styles={{
        marginTop: 18,
        justifyContent: 'center',
        gap: 10,
      }}>
      <RowComponent
        styles={{
          gap: 10,
          backgroundColor: appColors.white,
          borderRadius: 12,
          paddingHorizontal: 12,
          flex: 1,
          height: 48,
        }}>
        <Feather
          name="search"
          size={appSize.iconLarge}
          color={appColors.gray}
          style={{alignSelf: 'center'}}
          onPress={onSearch}
        />
        <TextInput
          maxLength={150}
          value={text}
          multiline
          style={{paddingRight: 8, flex: 1}}
          onChangeText={setText}
          placeholder="facetrack..."
          placeholderTextColor={appColors.textGrey}
        />
      </RowComponent>
      <View
        style={{
          backgroundColor: appColors.buttonSecondary,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 12,
          height: 48,
          width: 48,
        }}>
        <Feather
          name="filter"
          size={appSize.iconMedium}
          color={appColors.white}
        />
      </View>
    </RowComponent>
  );
};

export default SearchComponent;

const styles = StyleSheet.create({});
