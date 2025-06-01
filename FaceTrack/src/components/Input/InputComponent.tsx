import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {ReactNode, useState} from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import appColors from '../../constants/appColors';
interface Props {
  iconFirst?: ReactNode;
  onChangeText: (e: string) => void;
  placeHold: string;
  isPass?: boolean;
}

const InputComponent = (props: Props) => {
  const {iconFirst, onChangeText, placeHold, isPass} = props;
  const [isShowPass, setIsShowPass] = useState(isPass);
  const [value, setValue] = useState('');

  const handleChangeText = (text: string) => {
    setValue(text);
    onChangeText(text);
  };
  const onClear = () => {
    setValue('');
  };
  return (
    <View style={{width: '88%'}}>
      <View style={styles.inputContainer}>
        {iconFirst && <View style={styles.iconContainer}>{iconFirst}</View>}
        <TextInput
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeHold}
          placeholderTextColor={appColors.textGrey}
          style={styles.input}
          secureTextEntry={isShowPass}
          
        />

        {isPass ? (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setIsShowPass(!isShowPass)}>
            {isShowPass ? (
              <FontAwesome6
                name="face-dizzy"
                size={16}
                color={appColors.textGrey}
              />
            ) : (
              <FontAwesome6
                name="face-laugh-squint"
                size={16}
                color={appColors.textGrey}
              />
            )}
          </TouchableOpacity>
        ) : value.length > 0 ? (
          <TouchableOpacity onPress={onClear} style={styles.iconRight}>
            <Ionicons name="close" size={22} color={appColors.textGrey} />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default InputComponent;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    height: 50,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    // Shadow cho iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Shadow cho Android
    elevation: 3,
  },
  iconContainer: {
    paddingLeft: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    color: appColors.text,
  },
  iconRight: {marginRight: 12},
});
