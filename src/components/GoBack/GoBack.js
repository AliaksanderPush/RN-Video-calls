import React from 'react';
import {Box, Pressable} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/core';

export const GoBack = () => {
  const navigation = useNavigation();

  console.log('navi=>', navigation);
  return (
    <Pressable
      position="absolute"
      left={5}
      top={0}
      onPress={() => navigation.pop()}>
      <FontAwesome name="angle-left" size={40} />
    </Pressable>
  );
};
