import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchComponent from '../../components/Input/SearchComponent';
import {
  ContainerComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../components/layout';
import AnimatedCameraIcon from '../../components/layout/AnimatedCameraIcon';
import CardComponent from '../../components/layout/CardComponent';
import appColors from '../../constants/appColors';
import {appSize} from '../../constants/appSize';
import DropdownMenu from '../../modal/DropdownMenu';
import {authSelector} from '../../redux/slices/authSlice';
import {menu} from '../data/data';
import PlanBannerModal from '../modals/PlanBannerModal';

const HomeScreen = ({navigation}: any) => {
  const [isVisible, setVisible] = useState(false);
  const user = useSelector(authSelector);
  const [isBanner, setIsBanner] = useState(user.role === 'leader');
  const HeaderHome = () => {
    return (
      <RowComponent styles={{marginVertical: 12, paddingHorizontal: 12}}>
        <RowComponent styles={{flex: 1, gap: 12}}>
          <TouchableOpacity
            onPress={() => setVisible(!isVisible)}
            style={{justifyContent: 'center'}}>
            <Image
              source={require('../../assets/img/foto_Perfil.png')}
              style={{height: 48, width: 48}}
            />
          </TouchableOpacity>
          <View>
            <TextComponent
              label={`${user.fullName}`}
              styles={styles.textName}
            />
            <TextComponent
              label={user.role}
              color={appColors.textSecondary}
              size={12}
            />
          </View>
        </RowComponent>
        <View
          style={{
            backgroundColor: appColors.white,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
          }}>
          <Ionicons
            name="notifications-outline"
            size={appSize.iconLarge}
            style={{padding: 6}}
          />
          <View
            style={{
              height: 8,
              width: 8,
              backgroundColor: 'green',
              borderRadius: 80,
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          />
        </View>
        <DropdownMenu
          navigation={navigation}
          visible={isVisible}
          onClose={onCloseModal}
        />
      </RowComponent>
    );
  };
  const onCloseModal = () => {
    setVisible(false);
  };
  const firstRow = menu.slice(0, Math.ceil(menu.length / 2));
  const secondRow = menu.slice(Math.ceil(menu.length / 2));

  const scannedHistory = [
    {
      id: 'scan001',
      userId: 'user123',
      name: 'Nguyễn Văn A',
      department: 'Phòng Kỹ thuật',
      qrCode: 'QRA123456',
      scannedAt: '2025-05-18T08:45:00Z',
      status: 'Hợp lệ',
    },
    {
      id: 'scan002',
      userId: 'user456',
      name: 'Trần Thị B',
      department: 'Phòng Kế toán',
      qrCode: 'QRA654321',
      scannedAt: '2025-05-18T07:20:00Z',
      status: 'Hết hạn',
    },
    {
      id: 'scan003',
      userId: 'user123',
      name: 'Nguyễn Văn A',
      department: 'Phòng Kỹ thuật',
      qrCode: 'QRA999888',
      scannedAt: '2025-05-17T16:00:00Z',
      status: 'Hợp lệ',
    },
  ];

  return (
    <ContainerComponent>
      <HeaderHome />
      <ContainerComponent
        isScroll
        styles={{paddingHorizontal: 12, marginTop: 0}}>
        <SearchComponent />
        <SpaceComponent height={28} />
        <View style={{alignItems: 'center'}}>
          <View style={styles.infoBar}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color={appColors.gray} />

              <TextComponent
                label={new Date().toLocaleTimeString('vi-VN')}
                styles={styles.infoText}
              />
            </View>
            <View style={styles.infoItem}>
              <Ionicons
                name="location-outline"
                size={16}
                color={appColors.gray}
              />
              <TextComponent label={'Văn phòng'} styles={styles.infoText} />
            </View>
          </View>
          {/* thiết kế biểu tượng  */}
          <AnimatedCameraIcon navigation={navigation} />
        </View>
        <View style={{marginVertical: 18}}>
          <RowComponent styles={{paddingHorizontal: 12}}>
            <TextComponent label="Chức năng" styles={styles.title} />
            <TouchableOpacity
              onPress={() => console.log('Xem thêm')}
              style={{
                paddingHorizontal: 12,
                borderRadius: 12,
                borderWidth: 0.3,
                justifyContent: 'center',
              }}>
              <TextComponent
                label="Xem thêm"
                styles={{
                  color: appColors.textSecondary,
                  fontStyle: 'italic',
                  fontSize: 12,
                }}
              />
            </TouchableOpacity>
          </RowComponent>
          <RowComponent styles={{gap: 12, justifyContent: 'center'}}>
            {firstRow.map(item => {
              const Icon = item.Icon;
              return (
                <CardComponent
                  key={item.id}
                  onPress={() => {}}
                  title={item.title}
                  description={item.description}
                  img={<Icon height={110} width={'100%'} />}
                />
              );
            })}
          </RowComponent>
          <RowComponent styles={{gap: 12, justifyContent: 'center'}}>
            {secondRow.map(item => {
              const Icon = item.Icon;
              return (
                <CardComponent
                  key={item.id}
                  onPress={() => {}}
                  title={item.title}
                  description={item.description}
                  img={<Icon height={110} width={'100%'} />}
                />
              );
            })}
          </RowComponent>
          <SpaceComponent height={18} />
          <TextComponent label="📌 Quét gần nhất" styles={styles.title} />
          <SpaceComponent height={18} />

          {scannedHistory.slice(0, 5).map(item => (
            <View
              key={item.id}
              style={{
                backgroundColor: '#ffffff',
                padding: 16,
                borderRadius: 16,
                marginBottom: 20,
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 4,
                borderWidth: 1,
                borderColor: '#e0f2f1',
              }}>
            
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => console.log('Xem chi tiết')}
                  style={{flex: 1}}>
                  <TextComponent
                    label={`Phòng: ${item.department}`}
                    size={13}
                    color="#666"
                  />
                  <TextComponent
                    label={`Mã QR: ${item.qrCode}`}
                    size={13}
                    color="#555"
                  />
                  <TextComponent
                    label={`🕒 ${new Date(item.scannedAt).toLocaleString()}`}
                    size={12}
                    color="#777"
                  />
                </TouchableOpacity>

                {/* Status chip */}
                <View
                  style={{
                    backgroundColor:
                      item.status === 'Hợp lệ' ? '#c8e6c9' : '#ffcdd2',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}>
                  <Text
                    style={{
                      color: item.status === 'Hợp lệ' ? '#2e7d32' : '#c62828',
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        <PlanBannerModal
          visible={isBanner}
          onClose={() => setIsBanner(false)}
          onUpgrade={() => navigation.navigate('payment')}
        />
      </ContainerComponent>
    </ContainerComponent>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  textName: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 24,
  },
  btnLogout: {
    borderWidth: 0.2,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: 'center',
    backgroundColor: appColors.white,
    paddingVertical: 8,
  },
  title: {
    fontSize: appSize.title,
    fontStyle: 'italic',
    fontWeight: 'bold',
    flex: 1,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: appColors.gray,
    fontWeight: '500',
  },
});
