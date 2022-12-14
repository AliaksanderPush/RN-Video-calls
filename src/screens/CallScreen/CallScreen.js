import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const CallScreen = () => {
  return (
    <View style={styles.container}>
      <Text>CallScreen</Text>
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
