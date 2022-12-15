import React, {useEffect, useState} from 'react';
import {
  Center,
  Box,
  Heading,
  Image,
  Select,
  CheckIcon,
  Button,
  useSafeArea,
} from 'native-base';
import {mainImg, users} from '../../constants';
import {Platform, PermissionsAndroid} from 'react-native';
import {GoBack} from '../../components';
import {Voximplant} from 'react-native-voximplant';
import {errMessage} from '../../constants';
import calls from '../../store';

export const MainScreen = ({navigation}) => {
  const [service, setService] = useState('');

  const voximplant = Voximplant.getInstance();

  const safeAreaProps = useSafeArea({
    safeAreaTop: true,
    pt: 2,
  });

  const handleCall = async isVideoCalling => {
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
        callee: service,
        isIncomingCall: false,
      });
    } catch (e) {
      console.warn(`${errMessage.failed} ${e}`);
    }
  };

  useEffect(() => {
    voximplant.on(Voximplant.ClientEvents.IncomingCall, incomingCallEvent => {
      calls.set(incomingCallEvent.call.callId, incomingCallEvent.call);
      navigation.navigate('IncomingCall', {
        callId: incomingCallEvent.call.callId,
      });
    });
    return function cleanUp() {
      voximplant.off(Voximplant.ClientEvents.IncomingCall);
    };
  }, []);

  return (
    <Box flex={1} {...safeAreaProps}>
      <Center
        flex={1 / 2}
        position="relative"
        py={2}
        justifyContent="space-between">
        <GoBack navigation={navigation} />
        <Image
          w="70%"
          h="280"
          borderRadius="lg"
          source={{
            uri: `${mainImg}`,
          }}
          alt={'Alternate Text '}
          resizeMode="cover"
        />
        <Heading size="lg">Your phone book</Heading>
      </Center>
      <Center flex={1 / 2} justifyContent="flex-start">
        <Box maxW="500">
          <Select
            shadow={3}
            selectedValue={service}
            minWidth="90%"
            accessibilityLabel="Choose Service"
            placeholder="Choose Service"
            _selectedItem={{
              bg: 'secondary.500',
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={itemValue => setService(itemValue)}>
            {users?.map((item, index) => {
              return (
                <Select.Item key={item + index} label={item} value={item} />
              );
            })}
          </Select>
        </Box>
        <Button
          mt={10}
          w="90%"
          colorScheme="secondary"
          onPress={() => handleCall(true)}
          //isLoading={loading}
          // isLoadingText="Submitting">
        >
          CALL
        </Button>
      </Center>
    </Box>
  );
};
