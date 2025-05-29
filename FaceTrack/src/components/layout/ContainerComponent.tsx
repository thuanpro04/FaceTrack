import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';
import React, {ReactNode} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SafeAreaProvider} from 'react-native-safe-area-context';

interface Props {
  children: ReactNode;
  isScroll?: boolean;
  styles?: StyleProp<any>;
}
const ContainerComponent = (props: Props) => {
  const {children, isScroll, styles} = props;
  const insets = useSafeAreaInsets();

  return isScroll ? (
    <ScrollView
      style={[locaStyle.container, {marginBottom: 18}, styles]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <SafeAreaProvider
      style={[
        locaStyle.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        styles,
      ]}>
      {children}
    </SafeAreaProvider>
  );
};

export default ContainerComponent;

const locaStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
});
