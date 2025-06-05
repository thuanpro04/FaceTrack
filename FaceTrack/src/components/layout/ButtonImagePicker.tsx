import {
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {ReactNode, useRef, useState} from 'react';
import ImageCropPicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import appColors from '../../constants/appColors';
import {BrushBig, Camera, Image, Link} from 'iconsax-react-native';
import {appSize} from '../../constants/appSize';
import Feather from 'react-native-vector-icons/Feather';
import RowComponent from './RowComponent';
import SpaceComponent from './SpaceComponent';
import TextComponent from './TextComponent';
import InputComponent from '../Input/InputComponent';
import ButtonComponent from './ButtonComponent';
import {BrushCleaning} from 'lucide-react';
interface Props {
  onSelect: (val: {
    type: 'url' | 'file';
    value: string | ImageOrVideo[] | ImageOrVideo;
  }) => void;
}
const ButtonImagePicker = (props: Props) => {
  const {onSelect} = props;
  const [isVisibleModalAddUrl, setIsVisibleModalAddUrl] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isPlaceHoldColor, setIsPlaceHoldColor] = useState(false);
  const modalizeRef = useRef<Modalize>(null);
  const choiceImages = [
    {
      key: 'camera',
      title: 'Picture',
      icon: (
        <Camera size={appSize.iconMedium} color={appColors.iconSecondary} />
      ),
    },
    {
      key: 'library',
      title: 'From_library',
      icon: (
        <Feather
          name="image"
          size={appSize.iconMedium}
          color={appColors.iconSecondary}
        />
      ),
    },
    {
      key: 'url',
      title: 'From_url',
      icon: <Link size={appSize.iconMedium} color={appColors.iconSecondary} />,
    },
  ];
  const onOpenModalize = () => {
    modalizeRef.current?.open();
  };
  const handleChoiceImages = (key: string) => {
    switch (key) {
      case 'library':
        ImageCropPicker.openPicker({
          cropping: true,
          mediaType: 'photo',
        })
          .then(res => onSelect({type: 'file', value: res}))
          .catch(error => {
            if (error.code === 'E_PICKER_CANCELLED') {
              console.log('User cancelled image selection');
            } else {
              console.log('Error selecting image: ', error);
            }
          });

        break;
      case 'camera':
        ImageCropPicker.openCamera({mediaType: 'photo'})
          .then(res => onSelect({type: 'file', value: res}))
          .catch(error => {
            if (error.code === 'E_PICKER_CANCELLED') {
              console.log('User cancelled image selection');
            } else {
              console.error('Error capturing image:', error);
            }
          });
        break;
      default:
        setIsVisibleModalAddUrl(true);
        break;
    }
    modalizeRef.current?.close();
  };
  const renderItems = (item: {icon: ReactNode; key: string; title: string}) => {
    return (
      <RowComponent
        key={item.key}
        styles={{gap: 6, paddingVertical: 6}}
        onPress={() => handleChoiceImages(item.key)}>
        {item.icon}
        <SpaceComponent height={30} />
        <TextComponent
          label={item.title}
          styles={{fontStyle: 'italic', fontWeight: '500'}}
          size={18}
        />
      </RowComponent>
    );
  };
  return (
    <View>
      <TouchableOpacity style={styles.cameraButton} onPress={onOpenModalize}>
        <Icon name="camera-alt" size={16} color="#fff" />
      </TouchableOpacity>
      <Portal>
        <Modalize
          adjustToContentHeight
          ref={modalizeRef}
          handlePosition="inside"
          modalStyle={{backgroundColor: appColors.background}}>
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 12,
            }}>
            {choiceImages.map(e => renderItems(e))}
          </View>
          <SpaceComponent height={54} />
        </Modalize>
      </Portal>
      <Modal
        visible={isVisibleModalAddUrl}
        style={{flex: 1, backgroundColor: appColors.background}}
        statusBarTranslucent
        transparent
        animationType="slide">
        <View
          style={[
            {
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <View
            style={[
              {
                borderRadius: 12,
                backgroundColor: appColors.background,
                width: '90%',
                padding: 20,
              },
            ]}>
            <RowComponent styles={{justifyContent: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => {
                  setIsVisibleModalAddUrl(false);
                  setImageUrl('');
                }}>
                <Icon name="close" size={24} color={appColors.iconDanger} />
              </TouchableOpacity>
            </RowComponent>
            <TextComponent label="Image Url" title size={18} />
            <RowComponent>
              <TextInput
                placeholder="URL"
                value={imageUrl}
                onChangeText={val => setImageUrl(val)}
                style={{
                  borderBottomColor: appColors.buttonPrimary,
                  borderBottomWidth: 1,
                  paddingHorizontal: 12,
                  flex: 1,
                  color: appColors.text,
                }}
                placeholderTextColor={appColors.textSecondary}
              />
              {imageUrl && (
                <BrushBig
                  size={appSize.iconSmall}
                  color={appColors.iconDefault}
                  onPress={() => setImageUrl('')}
                />
              )}
            </RowComponent>
            <SpaceComponent height={16} />
            <RowComponent styles={{justifyContent: 'flex-end'}}>
              <ButtonComponent
                disable={!imageUrl}
                label="Agree"
                onPress={() => {
                  setIsVisibleModalAddUrl(false);
                  onSelect({type: 'url', value: imageUrl});
                  setImageUrl('');
                }}
                styles={{
                  paddingHorizontal: 18,
                  paddingVertical: 6,
                  borderRadius: 12,
                }}
                labelColor={appColors.white}
              />
            </RowComponent>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ButtonImagePicker;

const styles = StyleSheet.create({
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00C897',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
