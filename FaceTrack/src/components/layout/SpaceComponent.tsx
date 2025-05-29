import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
interface Props {
  width?: number;
  height?: number;
}
const SpaceComponent = (props: Props) => {
  const {width, height} = props;
  return <View style={{height: height, width: width}} />;
};

export default SpaceComponent;

const styles = StyleSheet.create({});
