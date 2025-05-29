import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {ReactNode} from 'react';
import appColors from '../../constants/appColors';

import TextComponent from './TextComponent';
import {appSize} from '../../constants/appSize';
interface Props {
  title: string;
  description: string;
  img: ReactNode;
  onPress: () => void;
}
const CardComponent = (props: Props) => {
  const {title, description, img, onPress} = props;
  return (
    <TouchableOpacity
    activeOpacity={0.8}
      onPress={onPress}
      style={{
        backgroundColor: appColors.white,
        width: '45%',
        height: 200,
        borderRadius: 12,
        elevation: 4,
        justifyContent: 'center',
        paddingHorizontal: 12,
        marginVertical: 12,
      }}>
      {img}
      <TextComponent
        label={title}
        styles={{fontSize: appSize.title, fontWeight: 'bold'}}
      />
      <TextComponent
        label={description}
        styles={{color: appColors.textSecondary}}
      />
    </TouchableOpacity>
  );
};

export default CardComponent;

const styles = StyleSheet.create({});
