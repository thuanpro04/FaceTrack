import React, {useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather'; // hoặc 'react-native-vector-icons/Feather'
import TextComponent from './TextComponent';
import appColors from '../../constants/appColors';

interface Props {
  data: {id: string; name: string}[];
  label: string;
  onSelect: (id: string) => void;
  isBorderColor: boolean;
}

const CheckBox = ({
  data,
  label,
  onSelect,

  isBorderColor,
}: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const toggleCheckbox = (id: string) => {
    setSelectedId(id);
    onSelect(id);
  };

  return (
    <View style={styles.container}>
      <TextComponent label={label} styles={styles.label} />
      {data.map(item => {
        const isChecked = selectedId === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.itemWrapper}
            onPress={() => toggleCheckbox(item.id)}
            activeOpacity={0.7}>
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: isBorderColor
                    ? appColors.buttonDanger
                    : appColors.buttonPrimary,
                },
                isChecked && styles.checkedBox,
              ]}>
              {isChecked && (
                <Feather name="check" size={14} color={appColors.white} />
              )}
            </View>

            <TextComponent
              label={item.name}
              styles={styles.itemText}
              color={isChecked ? appColors.buttonPrimary : appColors.text}
            />
          </TouchableOpacity>
        );
      })}
      {/* {selectedId === 'staff' && (
        <TextInput
          value={code}
          onChangeText={setCode}
          style={styles.input}
          placeholder="Mã giới thiệu"
          placeholderTextColor={
            isPlaceHoldColor ? appColors.buttonDanger : appColors.textSecondary
          }
        />
      )} */}
    </View>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: appColors.buttonPrimary,
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.white,
  },
  checkedBox: {
    backgroundColor: appColors.buttonPrimary,
  },
  itemText: {
    marginLeft: 12,
    fontSize: 15,
  },
  input: {
    borderBottomColor: appColors.buttonPrimary,
    borderBottomWidth: 1,
    paddingHorizontal: 12,
  },
});
