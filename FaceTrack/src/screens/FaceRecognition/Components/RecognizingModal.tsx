import {Animated, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TextComponent} from '../../../components/layout';
interface Props {
  isLoading: boolean;
}
const RecognizingModal = (props: Props) => {
  const {isLoading} = props;
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionProgress, setRecognitionProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const progressAnimation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (isLoading) {
      // Reset progress
      setRecognitionProgress(0);

      // Định nghĩa các mốc progress và thời gian
      const stages = [
        {target: 30, duration: 1000}, // 0-30% trong 2s
        {target: 60, duration: 1000}, // 30-60% trong 2s
        {target: 85, duration: 1000}, // 60-85% trong 2s
        {target: 95, duration: 1000}, // 85-95% trong 2s
      ];

      let currentStage = 0;
      let startTime = Date.now();
      let startProgress = 0;

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const stage = stages[currentStage];

        if (!stage) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return;
        }

        // Tính toán progress hiện tại dựa trên thời gian
        const progress = Math.min(
          startProgress +
            ((stage.target - startProgress) * elapsed) / stage.duration,
          stage.target,
        );

        setRecognitionProgress(Math.round(progress));

        // Chuyển sang stage tiếp theo nếu đã hoàn thành stage hiện tại
        if (elapsed >= stage.duration) {
          currentStage++;
          startTime = Date.now();
          startProgress = progress;
        }
      }, 50); // Update mỗi 50ms để animation mượt

      // Animation xoay vòng loading
      Animated.loop(
        Animated.timing(progressAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ).start();

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        progressAnimation.setValue(0);
      };
    }
  }, [isLoading]);

  if (!isLoading) return null;
  return (
    <View style={styles.recognitionOverlay}>
      <LinearGradient
        colors={['rgba(0, 212, 255, 0.1)', 'rgba(0, 0, 0, 0.9)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.recognitionContent}>
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressRing,
              {
                transform: [
                  {
                    rotate: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          />
          <View style={styles.progressCenter}>
            <MaterialIcons name="face" size={40} color="#00d4ff" />
            <TextComponent
              label={`${recognitionProgress}%`}
              styles={styles.progressText}
            />
          </View>
        </View>
        <TextComponent
          label="Đang nhận diện khuôn mặt..."
          styles={styles.recognitionText}
        />

        <TextComponent
          label="Vui lòng giữ yên trong giây lát"
          styles={styles.recognitionText}
        />
      </View>
    </View>
  );
};

export default RecognizingModal;

const styles = StyleSheet.create({
  recognitionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  recognitionContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 40,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  progressContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    borderTopColor: '#00d4ff',
  },
  progressCenter: {
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    color: '#00d4ff',
    fontSize: 18,
    fontWeight: '700',
  },
  recognitionText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  recognitionSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
  },
});
