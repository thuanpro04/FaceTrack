import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components/layout';
import appColors from '../../../constants/appColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const overlaySize = screenWidth * 0.65;
const overlayHeight = overlaySize * 1.3;
const overlayTop = screenHeight * 0.28;
interface Props {
  currentStep: number;
  completedSteps: boolean[];
  faceSteps:any[]
}
const FaceOverLay = (props: Props) => {
  const {currentStep, completedSteps,faceSteps} = props;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const instructionFadeAnim = useRef(new Animated.Value(1)).current;
   useEffect(() => {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();
    }, []);
  
    // Instruction fade animation
    useEffect(() => {
      Animated.timing(instructionFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, [currentStep]);
  return (
    <View style={styles.overlayContainer}>
      {/* Background mờ */}
      <View style={styles.overlayBackground} />

      {/* Animated Oval Frame */}
      <Animated.View
        style={[
          styles.ovalFrame,
          {
            width: overlaySize,
            height: overlayHeight,
            top: overlayTop,
            left: (screenWidth - overlaySize) / 2,
            borderColor: faceSteps[currentStep].color,
            transform: [{scale: pulseAnim}],
          },
        ]}>
        {/* Corner indicators */}
        <View style={[styles.cornerIndicator, styles.topLeft]} />
        <View style={[styles.cornerIndicator, styles.topRight]} />
        <View style={[styles.cornerIndicator, styles.bottomLeft]} />
        <View style={[styles.cornerIndicator, styles.bottomRight]} />
      </Animated.View>

      {/* Progress Steps at top */}
      <View style={styles.stepsContainer}>
        <RowComponent styles={styles.stepsRow}>
          {faceSteps.map((step, index) => (
            <View key={step.id} style={styles.stepIndicator}>
              <View
                style={[
                  styles.stepCircle,
                  {
                    backgroundColor: completedSteps[index]
                      ? step.color
                      : index === currentStep
                      ? step.color + '40'
                      : appColors.gray + '40',
                    borderColor:
                      index === currentStep ? step.color : 'transparent',
                  },
                ]}>
                {completedSteps[index] ? (
                  <AntDesign name="check" size={12} color={appColors.white} />
                ) : (
                  <MaterialIcons
                    name={step.icon}
                    size={16}
                    color={index === currentStep ? step.color : appColors.gray}
                  />
                )}
              </View>
              {index < faceSteps.length - 1 && (
                <View
                  style={[
                    styles.stepConnector,
                    {
                      backgroundColor: completedSteps[index]
                        ? step.color
                        : appColors.gray + '40',
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </RowComponent>
      </View>

      {/* Current Step Instructions */}
      <Animated.View
        style={[styles.overlayInstructions, {opacity: instructionFadeAnim}]}>
        <View style={styles.instructionCard}>
          <MaterialIcons
            name={faceSteps[currentStep].icon}
            size={32}
            color={faceSteps[currentStep].color}
          />
          <SpaceComponent height={8} />
          <TextComponent
            label={faceSteps[currentStep].title}
            styles={styles.overlayText}
            color={appColors.white}
          />
          <TextComponent
            label={faceSteps[currentStep].subtitle}
            styles={styles.overlaySubText}
            color={appColors.white}
          />
          <SpaceComponent height={12} />
          <View style={styles.stepCounter}>
            <TextComponent
              label={`${currentStep + 1}/${faceSteps.length}`}
              styles={styles.stepCounterText}
              color={faceSteps[currentStep].color}
            />
          </View>
        </View>
      </Animated.View>

      {/* Bottom instruction */}
      <View style={styles.bottomInstruction}>
        <TextComponent
          label="Giữ nút chụp trong 3 giây"
          styles={styles.bottomInstructionText}
          color={appColors.white}
        />
      </View>
    </View>
  );
};

export default FaceOverLay;

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  ovalFrame: {
    position: 'absolute',
    borderWidth: 3,
    borderRadius: 200,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  },
  cornerIndicator: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: appColors.white,
  },
  topLeft: {
    top: -3,
    left: -3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: -3,
    right: -3,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: -3,
    left: -3,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: -3,
    right: -3,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  stepsContainer: {
    position: 'absolute',
    top: '3%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  stepsRow: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepConnector: {
    width: 30,
    height: 2,
    marginHorizontal: 4,
  },
  overlayInstructions: {
    position: 'absolute',
    top: '8%',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minWidth: 200,
  },
  overlayText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  overlaySubText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  stepCounter: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepCounterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomInstruction: {
    position: 'absolute',
    bottom: 110,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomInstructionText: {
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
