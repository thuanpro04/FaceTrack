import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {ReactNode} from 'react';
import RowComponent from './RowComponent';
import {ArrowLeft, ArrowLeft2} from 'iconsax-react-native';
import {appSize} from '../../constants/appSize';
import appColors from '../../constants/appColors';
import TextComponent from './TextComponent';
interface Props {
  label?: string;
  icon?: ReactNode;
  navigation: any;
  labelRight?: string;
}
const HeaderComponent = (props: Props) => {
  const {label, icon, navigation, labelRight} = props;
  return (
    <RowComponent
      styles={{
        alignItems: 'center',
        marginVertical: 12,
      }}>
      {(icon && icon) ?? (
        <ArrowLeft
          size={appSize.iconLarge}
          color={appColors.iconDefault}
          onPress={() => navigation.goBack()}
        />
      )}
      {label && (
        <TextComponent
          label={'label'}
          styles={{
            textAlign: 'center',
            flex: 1,
            fontSize: appSize.title,
            fontWeight: '500',
          }}
        />
      )}
      {labelRight && (
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => navigation.navigate('setup-face')}>
          <TextComponent
            label={labelRight}
            styles={{
              textAlign: 'right',
              color: appColors.textSecondary,
            }}
          />
        </TouchableOpacity>
      )}
    </RowComponent>
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({});
