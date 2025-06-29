import AsyncStorage from '@react-native-async-storage/async-storage';
import {Electricity, Happyemoji} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
import {RowComponent, TextComponent} from '../../components/layout';
import appColors from '../../constants/appColors';
import {appSize} from '../../constants/appSize';
import {removeAuth} from '../../redux/slices/authSlice';
import InputCodeModal from './InputCodeModal';
import {authServices} from '../../services/authServices';
interface Props {
  visible: boolean;
  onClose: () => void;
  navigation: any;
  id: string;
}
const menu = [
  {
    id: 'edit',
    label: 'Editar',
    icon: (
      <MaterialIcons
        name="mode-edit"
        size={appSize.iconMedium}
        color={appColors.iconSecondary}
      />
    ),
  },
  {
    id: 'code',
    label: 'Code',
    icon: (
      <Electricity size={appSize.iconMedium} color={appColors.iconSecondary} />
    ),
  },
  {
    id: 'faceId',
    label: 'Face Setting',
    icon: (
      <Happyemoji size={appSize.iconMedium} color={appColors.iconSecondary} />
    ),
  },
  {
    id: 'logout',
    label: 'Sair',
    icon: (
      <MaterialIcons
        name="logout"
        size={appSize.iconMedium}
        color={appColors.iconSecondary}
      />
    ),
  },
];
const DropdownMenu = (props: Props) => {
  const {visible, onClose, navigation, id} = props;
  const [isVisible, setIsVisible] = useState(false);
  const [isCodeModal, setIsCodeModal] = useState(false);
  const dispatch = useDispatch();
  const handleItem = (key: string) => {
    switch (key) {
      case 'edit':
        onClose();
        navigation.navigate('edit');
        break;
      case 'code':
        setIsCodeModal(true);
        break;
      case 'faceId':
        onClose();
        navigation.navigate('tutorial-face');
        break;
      case 'logout':
        onClose();
        handleLogout();
        break;
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    dispatch(removeAuth());
    navigation.navigate('auth');
  };
  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);
  const onCloseCodeModal = () => {
    setIsCodeModal(false);
    onClose();
  };
  const onSubmitCode = async (code: string) => {
    try {
      const res = await authServices.upload_Code(id, code);
      if (res && res?.data) {
        console.log('Update code successfully !!!');
      }
    } catch (error) {
      console.log('Submit update code error: ', error);
    }
  };
  return !isCodeModal ? (
    <Modal visible={isVisible} transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.menu}>
              {menu.map(item => (
                <RowComponent
                  key={item.id}
                  styles={styles.itemMenu}
                  onPress={() => handleItem(item.id)}>
                  {item.icon}
                  <TextComponent label={item.label} size={16} />
                </RowComponent>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  ) : (
    <InputCodeModal
      onSubmit={onSubmitCode}
      onClose={onCloseCodeModal}
      visible={isCodeModal}
    />
  );
};

export default DropdownMenu;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    marginTop: 72,
    marginLeft: 20,
  },
  menu: {
    width: 180,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    // có thể thêm shadow nếu cần
  },
  itemMenu: {
    gap: 12,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginVertical: 5,
  },
});
