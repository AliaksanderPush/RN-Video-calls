import React, {useEffect, useState} from 'react';
import {Voximplant} from 'react-native-voximplant';
import {
  useSafeArea,
  Box,
  Center,
  Text,
  Pressable,
  HStack,
  VStack,
} from 'native-base';
import {errMessage} from '../../constants';
import {GoBack} from '../../components';
import Feather from 'react-native-vector-icons/Feather';
import calls from '../../store';

export const IncomingCallScreen = ({route, navigation}) => {
  const {callId} = route.params;
  const [caller, setCaller] = useState('Unknown');

  const safeAreaProps = useSafeArea({
    safeAreaTop: true,
    pt: 2,
  });

  async function answerCall(isVideoCalling) {
    try {
      if (Platform.OS === 'android') {
        let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
        if (isVideoCalling) {
          permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
        }
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        const recordAudioGranted =
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
        const cameraGranted =
          granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
        if (recordAudioGranted) {
          if (isVideoCalling && !cameraGranted) {
            console.warn(errMessage.camera);
            return;
          }
        } else {
          console.warn(errMessage.audio);
          return;
        }
      }
      navigation.navigate('Call', {
        isVideoCall: isVideoCalling,
        callId: callId,
        isIncomingCall: true,
      });
    } catch (e) {
      console.warn(`${errMessage.failed} ${e}`);
    }
  }

  async function declineCall() {
    let call = calls.get(callId);
    call.decline();
  }

  useEffect(() => {
    let call = calls.get(callId);
    setCaller(call.getEndpoints()[0].displayName);
    call.on(Voximplant.ClientEvents.Disconnected, callEvent => {
      calls.delete(callEvent.call.callId);
      navigation.navigate('Main');
    });
    return function cleanUp() {
      call.off(Voximplant.ClientEvents.Disconnected);
    };
  }, [callId]);

  return (
    <Box flex={1} {...safeAreaProps}>
      <Box h="75%" position="relative" w="100%">
        <GoBack />
      </Box>
      <Center>
        <Text pb={5}>{caller}</Text>
        <HStack h={105} width="100%" justifyContent="space-evenly">
          <VStack justifyContent="space-between" alignItems="center">
            <Pressable
              w={70}
              h={70}
              borderRadius={70}
              justifyContent="center"
              alignItems="center"
              bg="green.500"
              onPress={() => answerCall(true)}>
              <Feather name="check" color="white" size={40} />
            </Pressable>
            <Text color="green">ANSWER</Text>
          </VStack>
          <VStack justifyContent="space-between" alignItems="center">
            <Pressable
              w={70}
              h={70}
              borderRadius={70}
              justifyContent="center"
              alignItems="center"
              bg="error.500"
              onPress={() => declineCall()}>
              <Feather name="x" color="white" size={40} />
            </Pressable>
            <Text>DECLINE</Text>
          </VStack>
        </HStack>
      </Center>
    </Box>
  );
};
