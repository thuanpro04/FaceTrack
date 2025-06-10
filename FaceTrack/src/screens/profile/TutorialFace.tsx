import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  ContainerComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../components/layout';
import appColors from '../../constants/appColors';
import Entypo from 'react-native-vector-icons/Entypo';
import {appSize} from '../../constants/appSize';
import HeaderComponent from '../../components/layout/HeaderComponent';

const TutorialFace = ({navigation}: any) => {
  const tutorio = [
    {
      id: 1,
      label: 'Đặt khuôn mặt vào khung tròn',
    },
    {
      id: 2,
      label: 'Giữ khoảng cách 50-80cm',
    },
    {
      id: 3,
      label: 'Ánh sáng đầy đủ, không ngược sáng',
    },
    {
      id: 4,
      label: 'Nhìn thẳng vào camera',
    },
    {
      id: 5,
      label: 'Không đeo khẩu trang hoặc kính cận',
    },
    ,
    {
      id: 6,
      label: 'Nhấn giữ nút chụp trong 3s',
    },
  ];
  return (
    <ContainerComponent styles={styles.container}>
      <ContainerComponent isScroll>
        <HeaderComponent navigation={navigation} labelRight="next" />
        <View style={styles.instructionsContainer}>
          <TextComponent
            label="Hướng dẫn chụp ảnh:"
            styles={{fontWeight: '500', fontStyle: 'italic'}}
          />
          <SpaceComponent height={12} />
          <View style={styles.card}>
            {tutorio.map(item => {
              return (
                item && (
                  <RowComponent
                    styles={{gap: 12, marginVertical: 4}}
                    key={item.id.toString()}>
                    <Entypo
                      name="check"
                      color={appColors.iconSuccess}
                      size={appSize.iconSmall}
                    />
                    <TextComponent
                      label={item.label}
                      styles={{}}
                      color={appColors.textSecondary}
                    />
                  </RowComponent>
                )
              );
            })}
          </View>
        </View>
      </ContainerComponent>
    </ContainerComponent>
  );
};

export default TutorialFace;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
  },
  instructionsContainer: {
    flex: 0,
    paddingBottom: 20,
  },
  card: {
    marginLeft: 12,
    padding: 6,
    borderLeftWidth: 5,
    borderRadius: 12,
    backgroundColor: appColors.card,
    borderLeftColor: appColors.primary,
  },
});
