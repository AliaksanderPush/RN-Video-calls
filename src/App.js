import 'react-native-gesture-handler';
import React from 'react';
import {RootNavigator} from './navigation/root.navigation';
import {NativeBaseProvider, Box} from 'native-base';

const App = () => {
  return (
    <NativeBaseProvider>
      <RootNavigator />
    </NativeBaseProvider>
  );
};

export default App;
