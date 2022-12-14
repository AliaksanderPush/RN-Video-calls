import React from 'react';
import {StackNavigation} from './stack.navigation';
import {NavigationContainer} from '@react-navigation/native';

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
};
