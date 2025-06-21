import {Animated, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ButtonAnimation from '../../../../components/layout/ButtonAnimation';
import {ArrowLeft2} from 'iconsax-react-native';
import {
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../../../components/layout';
import {appSize} from '../../../../constants/appSize';
import appColors from '../../../../constants/appColors';
import {Manager} from '../../../data/type';
interface Props {
  navigation: any;
  managers: Manager[];
}
const HeaderManageComponent = (props: Props) => {
  const {navigation, managers} = props;
  const headerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        },
      ]}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.header}>
        <ButtonAnimation onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={appSize.iconLarge} color={appColors.white} />
        </ButtonAnimation>
        <SpaceComponent height={12} />
        <RowComponent styles={styles.headerContent}>
          <View style={styles.titleSection}>
            <TextComponent label="Hi! Xin chào 👋" styles={styles.greeting} />
            <TextComponent
              label="Đây là danh sách"
              styles={styles.headerTitle}
            />
          </View>
          <RowComponent styles={styles.StatsContainer}>
            <View style={styles.statItem}>
              <TextComponent
                label={managers.length.toString() ?? '0'}
                styles={styles.statNumber}
              />
              <TextComponent label={'Quản lý'} styles={styles.statLabel} />
            </View>
            <View style={styles.statItem}>
              <TextComponent
                styles={styles.statNumber}
                label={managers
                  .filter(m => m.status === 'online')
                  .length.toString()}
              />
              <TextComponent label={'Trực tuyến'} styles={styles.statLabel} />
            </View>
          </RowComponent>
        </RowComponent>
      </LinearGradient>
    </Animated.View>
  );
};

export default HeaderManageComponent;

const styles = StyleSheet.create({
  headerContainer: {
    zIndex: 1000,
  },
  header: {
    paddingBottom: 30,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  StatsContainer: {
    gap: 12,
    alignSelf: 'flex-start',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 2,
  },
});
