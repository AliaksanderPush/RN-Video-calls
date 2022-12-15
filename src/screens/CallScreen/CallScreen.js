import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert} from 'react-native';
import {Center, Box, Text, useSafeArea, Pressable, View} from 'native-base';
import {Voximplant} from 'react-native-voximplant';
import {GoBack} from '../../components';
import Entypo from 'react-native-vector-icons/Entypo';
import calls from '../../store';

export const CallScreen = ({route, navigation}) => {
  const {isVideoCall, callee, isIncomingCall} = route?.params;
  const [callState, setCallState] = useState('Connecting');
  const [localVideoStreamId, setLocalVideoStreamId] = useState('');
  const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');

  const safeAreaProps = useSafeArea({
    safeAreaTop: true,
    pt: 2,
  });

  const voximplant = Voximplant.getInstance();
  const callId = useRef(route?.params.callId);
  const endCall = useCallback(() => {
    let call = calls.get(callId.current);
    call.hungup();
  }, []);

  function showError(reason) {
    Alert.alert('Call failed', `Reason: ${reason}`, [
      {
        text: 'Ok',
        onPress: () => {
          calls.delete(callId.current);
          navigation.navigate('Main');
        },
      },
    ]);
  }

  useEffect(() => {
    let callSetting = {
      video: {
        sendVideo: isVideoCall,
        receiveVideo: isVideoCall,
      },
    };
    let call;
    let endpoint;
    async function makeCall() {
      call = await voximplant.call(callee, callSetting);
      callId.current = call.callId;
      calls.set(call.callId, call);
      subscribeToCallEvents();
      console.log('make =>', call.callId);
      console.log('make callId=>', calls.get(callId.current));
    }
    async function answerCall() {
      call = calls.get(callId.current);
      subscribeToCallEvents();
      await call.answer(callSetting);
      endpoint = call.getEndpoints()[0];
      subscribeToEndpointEvents();
    }

    function subscribeToCallEvents() {
      call.on(Voximplant.CallEvents.Connected, callEvent => {
        setCallState('Call Connected');
      });
      call.on(Voximplant.CallEvents.Disconnected, callEvent => {
        calls.delete(callEvent.call.callId);
        navigation.navigate('Main');
      });
      call.on(Voximplant.CallEvents.Failed, callEvent => {
        console.log('popali v event=>', callEvent);
        showError(callEvent.reason);
      });
      call.on(Voximplant.CallEvents.ProgressToneStart, callEvent => {
        setCallState('Ringing...');
      });
      call.on(Voximplant.CallEvents.LocalVideoStreamAdded, callEvent => {
        setLocalVideoStreamId(callEvent.videoStream.id);
      });
      call.on(Voximplant.CallEvents.EndpointAdded, callEvent => {
        endpoint = callEvent.endpoint;
        subscribeToEndpointEvents();
      });
    }

    function subscribeToEndpointEvents() {
      endpoint.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        endpointEvent => {
          setRemoteVideoStreamId(endpointEvent.videoStream.id);
        },
      );
    }

    if (isIncomingCall) {
      answerCall();
    } else {
      makeCall();
    }

    return function cleanUp() {
      call.off(Voximplant.CallEvents.Connected);
      call.off(Voximplant.CallEvents.Disconnected);
      call.off(Voximplant.CallEvents.Failed);
      call.off(Voximplant.CallEvents.ProgressToneStart);
      call.off(Voximplant.CallEvents.LocalVideoStreamAdded);
      call.off(Voximplant.CallEvents.EndpointAdded);
    };
  }, [isVideoCall]);

  return (
    <Box flex={1} {...safeAreaProps}>
      <Box h="80%" position="relative" w="100%">
        <GoBack />
        <View w="100%" h="100%" bg="amber.100">
          <Voximplant.VideoView
            videoStreamId={remoteVideoStreamId}
            scaleType={Voximplant.RenderScaleType.SCALE_FIT}
            style={{width: '100%', height: '50%'}}
          />

          <Voximplant.VideoView
            videoStreamId={localVideoStreamId}
            showOnTop={true}
            scaleType={Voximplant.RenderScaleType.SCALE_FIT}
            style={{width: '100%', height: '50%'}}
          />
        </View>
      </Box>
      <Center>
        <Text py={3}>{callState}</Text>
        <Pressable
          w={70}
          h={70}
          borderRadius={70}
          justifyContent="center"
          alignItems="center"
          bg="error.600"
          onPress={() => endCall()}>
          <Entypo name="phone" size={36} color="white" />
        </Pressable>
      </Center>
    </Box>
  );
};
