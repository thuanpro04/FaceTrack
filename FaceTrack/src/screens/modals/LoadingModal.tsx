import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import appColors from '../../constants/appColors';
import {TextComponent} from '../../components/layout';

interface Props {
  isVisible: boolean;
}
const {width} = Dimensions.get('window');
const DOT_SIZE = 10;
const SPACING = 8;
const LoadingModal = (props: Props) => {
  const {isVisible} = props;
  //Tạo giá trị động

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  //tạo hiệu ứng bắn hạt animation
  const pariticleAnims = Array(12)
    .fill(0)
    .map(() => ({
      opacity: useRef(new Animated.Value(0)).current, //độ trong suốt
      position: useRef(new Animated.Value(0)).current, // vị trí di chuyển
      scale: useRef(new Animated.Value(0)).current, //thu phóng kích thước
    }));
  //fill gắn giá trị 0
  const dotAnims = Array(3)
    .fill(0)
    .map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(opacityAnim, {
        toValue: 1, // 👈 Chuyển giá trị opacity từ giá trị hiện tại đến 1 (tức là hiện rõ)
        duration: 300, // 👈 Thời gian chuyển động là 300ms
        useNativeDriver: true, // 👈 Sử dụng "native driver" để tăng hiệu suất (rất khuyên dùng cho opacity, transform,...)
      }).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start(); // 👈 Bắt đầu hiệu ứng
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(progressAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(progressAnim, {
            toValue: 0.1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ).start();
      dotAnims.forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 500,
              delay: index * 150,
              easing: Easing.inOut(Easing.ease), // 👉 Làm mượt quá trình
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 500,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ).start();
      });
      pariticleAnims.forEach((particle, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.timing(particle.opacity, {
                toValue: Math.random() * 0.7 + 0.3,
                duration: 1000,
                delay: index * 100,
                useNativeDriver: true,
              }),
              Animated.timing(particle.position, {
                toValue: 1,
                duration: 2000 + Math.random() * 2000,
                delay: index * 100,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(particle.scale, {
                toValue: Math.random() * 0.5 + 0.5,
                duration: 2000,
                delay: index * 100,
                useNativeDriver: true,
              }),
            ]),
            Animated.delay(100),
            Animated.parallel([
              Animated.timing(particle.opacity, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(particle.position, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(particle.scale, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ).start();
      });
    } else {
      // Reset animations when modal is hidden
      opacityAnim.setValue(0);
    }
  }, [isVisible]);
  const logoScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.1],
  });
  const logoOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1, 0.8],
  });
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.1, width * 0.7],
  });

  const progressColor = progressAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      appColors.primary,
      appColors.primary + '99',
      appColors.primary,
    ],
  });

  const LoadingIndicator = ({index}: {index: number}) => {
    const scale = dotAnims[index].interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.5],
    });

    const opacity = dotAnims[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    });

    return (
      <Animated.View
        style={[
          styles.dot,
          {
            transform: [{scale}],
            opacity,
          },
        ]}
      />
    );
  };
  const FloatingParticles = () => {
    return (
      <View style={styles.particlesContainer}>
        {pariticleAnims.map((particle, index) => {
          const translateY = particle.position.interpolate({
            inputRange: [0, 1],
            outputRange: [80, -120 - Math.random() * 50],
          });

          const translateX = particle.position.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [
              Math.random() * 40 - 20,
              Math.random() * 60 - 30,
              Math.random() * 40 - 20,
            ],
          });

          const particleScale = particle.scale.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0.3 + Math.random() * 0.7],
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.particle,
                {
                  width: 6 + Math.random() * 6,
                  height: 6 + Math.random() * 6,
                  borderRadius: 10,
                  backgroundColor:
                    index % 3 === 0
                      ? '#ffffff'
                      : index % 3 === 1
                      ? appColors.primary + '99'
                      : appColors.primary,
                  opacity: particle.opacity,
                  transform: [
                    {translateY},
                    {translateX},
                    {scale: particleScale},
                  ],
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <Modal visible={isVisible} transparent style={{flex: 1}}>
      <Animated.View style={[styles.container, {opacity: opacityAnim}]}>
        <FloatingParticles />

        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{scale: logoScale}, {rotate}],
              opacity: logoOpacity,
            },
          ]}>
          <View style={styles.logo}>
            <TextComponent label="T" styles={styles.logoText} />
          </View>
        </Animated.View>

        <View style={styles.loadingTextContainer}>
          <TextComponent label="Loading" styles={styles.loadingText} />

          <View style={styles.dotsContainer}>
            {[0, 1, 2].map(index => (
              <LoadingIndicator key={index} index={index} />
            ))}
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>
      </Animated.View>
    </Modal>
  );
};

export default LoadingModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(35, 48, 68, 0.75)',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: appColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: appColors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  logoText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  loadingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 5,
  },
  dotsContainer: {
    flexDirection: 'row',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#fff',
    marginHorizontal: SPACING / 2,
  },
  progressContainer: {
    width: width * 0.7,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
  },
});
