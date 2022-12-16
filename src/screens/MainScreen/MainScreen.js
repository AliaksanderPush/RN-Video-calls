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
  HStack,
  VStack,
} from 'native-base';
import {mainImg, users} from '../../constants';
import {Alert} from 'react-native';
import {GoBack, ButtonCall} from '../../components';
import {Voximplant} from 'react-native-voximplant';
import {errMessage} from '../../constants';
import {checkPermissions} from '../../helper';
import calls from '../../store';

export const MainScreen = ({navigation}) => {
  const [service, setService] = useState('');
  const [sound, setSound] = useState(false);
  const [video, setVideo] = useState(true);
  const [microPhone, setMicrophone] = useState(true);

  const voximplant = Voximplant.getInstance();

  const handlemakeCall = () => {
    handleCall(video);
  };

  const handleCall = async isVideoCalling => {
    try {
      const responce = await checkPermissions(isVideoCalling);
      if (!responce) {
        return;
      }
      navigation.navigate('Call', {
        isVideoCall: isVideoCalling,
        callee: service,
        isIncomingCall: false,
      });
    } catch (e) {
      Alert.alert(`${errMessage.failed} ${e}`);
    }
  };

  const handleSound = () => {
    setSound(!sound);
  };
  const handleVideo = () => {
    setVideo(!video);
  };
  const handleMicrophone = () => {
    setMicrophone(!microPhone);
  };

  useEffect(() => {
    voximplant.on(Voximplant.ClientEvents.IncomingCall, incomingCallEvent => {
      calls.set(incomingCallEvent.call.callId, incomingCallEvent.call);
      navigation.navigate('IncomingCall', {
        callId: incomingCallEvent.call.callId,
      });
    });
    return () => {
      voximplant.off(Voximplant.ClientEvents.IncomingCall);
    };
  }, []);

  const safeAreaProps = useSafeArea({
    safeAreaTop: true,
    pt: 2,
  });

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
        <VStack
          w="80%"
          h="70%"
          mt={3}
          justifyContent="space-evenly"
          alignItems="center">
          <ButtonCall
            typeName="FontAwesome5"
            iconName="phone"
            bg="green.500"
            color="white"
            size={100}
            disable={!service ? true : false}
            onHandler={handlemakeCall}
          />
          <HStack w="100%" justifyContent="space-evenly">
            <ButtonCall
              typeName="FontAwesome"
              iconName={!sound ? 'volume-off' : 'volume-up'}
              bg={!sound ? 'gray.300' : 'gray.500'}
              color={'white'}
              size={70}
              onHandler={handleSound}
            />
            <ButtonCall
              typeName="FontAwesome5"
              iconName={video ? 'video' : 'video-slash'}
              bg={video ? 'gray.500' : 'gray.300'}
              color={'white'}
              size={70}
              onHandler={handleVideo}
            />
            <ButtonCall
              typeName="FontAwesome"
              iconName={microPhone ? 'microphone' : 'microphone-slash'}
              bg={microPhone ? 'gray.500' : 'gray.300'}
              color={'white'}
              size={70}
              onHandler={handleMicrophone}
            />
          </HStack>
        </VStack>
      </Center>
    </Box>
  );
};
