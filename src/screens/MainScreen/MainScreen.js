import React from 'react';
import {
  Center,
  VStack,
  Text,
  Box,
  Heading,
  Image,
  Select,
  CheckIcon,
  Button,
} from 'native-base';
import {mainImg, users} from '../../constants';
import {Platform, PermissionsAndroid} from 'react-native';

export const MainScreen = ({navigation}) => {
  const [service, setService] = React.useState('');

  const handleCall = async isVideoCall => {
    try {
      if (Platform.OS === 'android') {
        let permissions =
          [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
        if (isVideoCall) {
          permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
        }
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        const recordAudioGranted =
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
        const cameraGranted =
          granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
        if (recordAudioGranted) {
          if (isVideoCall && !cameraGranted) {
            console.warn(
              'MainScreen: handleCall: camera permission is not granted',
            );
            return;
          }
        } else {
          console.warn(
            'MainScreen: handleCall: record audio permission is not granted',
          );
          return;
        }
      }
      navigation.navigate('Call', {
        isVideoCall,
        callee: service,
        isIncomingCall: false,
      });
    } catch (e) {
      console.warn('MainScreen: handleCall:makeCall failed: `${e}`');
    }
  };

  console.log('user=>', users);
  return (
    <Box flex={1}>
      <Center flex={1 / 2} py={2} justifyContent="space-between">
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
          onPress={() => handleCall(false)}
          //isLoading={loading}
          // isLoadingText="Submitting">
        >
          CALL
        </Button>
      </Center>
    </Box>
  );
};
