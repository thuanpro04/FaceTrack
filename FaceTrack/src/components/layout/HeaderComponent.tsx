import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import RowComponent from './RowComponent';
import {ArrowLeft, ArrowLeft2} from 'iconsax-react-native';
import {appSize} from '../../constants/appSize';
import appColors from '../../constants/appColors';
import TextComponent from './TextComponent';
import ButtonAnimation from './ButtonAnimation';
interface Props {
  label?: string;
  icon?: ReactNode;
  onNavigationIcon: () => void;
  labelRight?: string;
  onNavigationLabelRight?: () => void;
  textStyle?: StyleProp<TextStyle>;
  headerStyle?: StyleProp<ViewStyle>;
}
const HeaderComponent = (props: Props) => {
  const {
    label,
    icon,
    onNavigationIcon,
    labelRight,
    onNavigationLabelRight,
    headerStyle,
    textStyle,
  } = props;
  return (
    <RowComponent styles={[styles.topHeader, headerStyle]}>
      <ButtonAnimation onPress={onNavigationIcon}>
        {(icon && icon) ?? (
          <ArrowLeft2 size={appSize.iconLarge} color={appColors.iconDefault} />
        )}
      </ButtonAnimation>
      {label && (
        <TextComponent label={label} styles={[styles.text, textStyle]} />
      )}
      {labelRight && (
        <TouchableOpacity style={{flex: 1}} onPress={onNavigationLabelRight}>
          <TextComponent
            label={labelRight}
            styles={{
              textAlign: 'right',
              color: appColors.textSecondary,
            }}
          />
        </TouchableOpacity>
      )}
      <View style={styles.placeholder} />
    </RowComponent>
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({
  topHeader: {
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 12,
  },
  placeholder: {
    width: 40,
  },
  text: {
    textAlign: 'center',
    flex: 1,
    fontSize: appSize.title,
    fontWeight: '500',
  },
});
