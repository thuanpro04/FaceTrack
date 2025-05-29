import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {TextComponent} from '../components/layout';

const WelcomToFaceTrack = ({navigation}: any) => {
  return (
    <ImageBackground
      source={require('../assets/img/welcom-bg.jpeg')} // ảnh nền công nghệ
      style={styles.background}
      resizeMode="cover">
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
        style={styles.overlay}>
        <View style={styles.container}>
          <TextComponent styles={styles.title} label="FaceTrack" />
          <TextComponent
            styles={styles.subtitle}
            label="Chấm công bằng AI & Blockchain"
          />
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('login')}>
            <TextComponent styles={styles.buttonText} label="Bắt đầu" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default WelcomToFaceTrack;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0af',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
