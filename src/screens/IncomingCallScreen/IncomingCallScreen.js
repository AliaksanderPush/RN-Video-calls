import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const IncomingCallScreen = () => {
  return (
    <View style={styles.container}>
      <Text>IncomingCallScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
