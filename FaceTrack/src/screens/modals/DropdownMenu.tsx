import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../components/layout';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {appSize} from '../../constants/appSize';
import appColors from '../../constants/appColors';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {removeAuth} from '../../redux/slices/authSlice';
import Feather from 'react-native-vector-icons/Feather';
import InputCodeModal from './InputCodeModal';
interface Props {
  visible: boolean;
  onClose: () => void;
  navigation: any;
}
const DropdownMenu = (props: Props) => {
  const {visible, onClose, navigation} = props;
  const [isVisible, setIsVisible] = useState(false);
  const [isCodeModal, setIsCodeModal] = useState(false);
  const dispatch = useDispatch();

  const handleItem = (key: string) => {
    
    switch (key) {
      case 'edit':
        navigation.navigate('edit');
        onClose();
        break;
      case 'code':
        setIsCodeModal(true);
        break;
      case 'logout':
        handleLogout();
        onClose();
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
  return !isCodeModal ? (
    <Modal visible={isVisible} transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.menu}>
              <RowComponent
                styles={styles.itemMenu}
                onPress={() => handleItem('edit')}>
                <MaterialIcons
                  name="mode-edit"
                  size={appSize.iconMedium}
                  color={appColors.iconSecondary}
                />
                <TextComponent label="Editar" size={16} />
              </RowComponent>
              <SpaceComponent height={5} />
              <RowComponent
                styles={styles.itemMenu}
                onPress={() => handleItem('code')}>
                <Feather
                  name="codepen"
                  size={appSize.iconMedium}
                  color={appColors.iconSecondary}
                />
                <TextComponent label="Code" size={16} />
              </RowComponent>
              <SpaceComponent height={5} />
              <RowComponent
                onPress={() => handleItem('logout')}
                styles={[styles.itemMenu, {backgroundColor: '#B66DFF26'}]}>
                <MaterialIcons
                  name="logout"
                  size={appSize.iconMedium}
                  color={appColors.iconSecondary}
                />
                <TextComponent label="Sair" size={16} />
              </RowComponent>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  ) : (
    <InputCodeModal
      onSubmit={() => console.log('Code submitted')}
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
  },
});
