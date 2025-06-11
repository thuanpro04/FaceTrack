import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Image} from 'react-native';
import {TextComponent} from '../../../components/layout';
import appColors from '../../../constants/appColors';
interface Props {
  lastPhoto?: string;
  currentStep: number;
}
const PreviewThumbnail = (props: Props) => {
  const {lastPhoto, currentStep} = props;

  return (
     (
      <TouchableOpacity
        style={styles.thumbnailContainer}
        onPress={() => {
          // Có thể thêm hành động khi nhấn vào thumbnail
          console.log('Preview photo:', lastPhoto);
        }}>
        <Image source={{uri: lastPhoto}} style={styles.thumbnail} />
        <View style={styles.stepBadge}>
          <TextComponent
            label={`${currentStep}/4`}
            styles={styles.stepBadgeText}
            color={appColors.white}
          />
        </View>
      </TouchableOpacity>
    )
  );
};

export default PreviewThumbnail;

const styles = StyleSheet.create({
  thumbnailContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 60,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: appColors.white,
    overflow: 'hidden',
    zIndex: 3,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  stepBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 2,
    alignItems: 'center',
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
