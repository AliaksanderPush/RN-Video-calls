import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  MainScreen,
  LoginScreen,
  CallScreen,
  IncomingCallScreen,
} from '../screens';

const Stack = createNativeStackNavigator();
export const StackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Group>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Call" component={CallScreen} />
        <Stack.Screen name="IncomingCall" component={IncomingCallScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
