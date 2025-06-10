import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import RenderProgressRing from './RenderProgressRing';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
interface Props {
  stepColor: string;
  isCapturing: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
  progress: number;
}
const CaptureButton = (props: Props) => {
  const {stepColor, isCapturing, onPressIn, onPressOut,progress} = props;
  return (
    <View style={styles.captureButtonContainer}>
      <RenderProgressRing
        color={stepColor}
        progress={progress}
      />
      <TouchableOpacity
        style={[
          styles.captureButton,
          {borderColor: stepColor},
        ]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.8}>
        <View style={styles.captureButtonInner}>
          {isCapturing ? (
            <View
              style={[
                styles.capturingIndicator,
                {backgroundColor: stepColor},
              ]}
            />
          ) : (
            <MaterialIcons
              name="camera-alt"
              size={24}
              color={stepColor}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CaptureButton;

const styles = StyleSheet.create({
  captureButtonContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturingIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
