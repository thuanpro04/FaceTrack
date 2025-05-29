import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {SpaceComponent, TextComponent} from '../components/layout';

const SplashScreen = () => {
  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.centerContent}>
        <Image
          source={require('../assets/img/Ice-skating.png')}
          style={{height: 45, width: 45}}
        />
        <TextComponent styles={styles.logo} label="FaceTrack" />
        <TextComponent
          styles={styles.slogan}
          label="Chấm công bằng AI & Blockchain"
        />
        <SpaceComponent height={22} />
        <ActivityIndicator size={22} color={'#3E8EDE'} />
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  slogan: {
    marginTop: 10,
    fontSize: 16,
    color: '#ccc',
  },
});
