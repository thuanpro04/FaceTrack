import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import AppRouter from './src/screens/router/AppRouter';
import {Host} from 'react-native-portalize';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <Host>
          <NavigationContainer>
            <AppRouter />
            <Toast />
          </NavigationContainer>
        </Host>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({});
