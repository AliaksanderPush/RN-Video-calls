import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Voximplant} from 'react-native-voximplant';
import calls from '../../store';

export const CallScreen = ({route, navigation}) => {
  const {isVideoCall, callee, isIncomingCall} = route?.params;
  const [callState, setCallState] = useState('Connecting');
  const voximplant = Voximplant.getInstance();
  const callId = useRef(route?.params.callId);

  const endCall = useCallback(() => {
    let call = calls.get(callId.current);
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
    async function makeCall() {
      call = await voximplant.call(callee, callSetting);
      callId.current = call.callId;
      calls.set(call.callId, call);
      subscribeToCallEvents();
    }
    function subscribeToCallEvents() {
      call.on(Voximplant.ClientEvents.Connected, callEvent => {
        setCallState('Call Connected');
      });
      call.on(Voximplant.CallEvents.Disconnected, callEvent => {
        calls.delete(callEvent.call.callId);
        navigation.navigate('Main');
      });
      call.on(Voximplant.CallEvents.Failed, callEvent => {
        showError(callEvent.call.callId);
      });
      call.on(Voximplant.CallEvents.ProgressToneStart, callEvent => {
        setCallState('Ringing...');
      });
    }
    if (isIncomingCall) {
    } else {
      makeCall();
    }

    return function cleanUp() {
      call.off(Voximplant.ClientEvents.Connected);
      call.off(Voximplant.CallEvents.Disconnected);
      call.off(Voximplant.CallEvents.Failed);
      call.off(Voximplant.CallEvents.ProgressToneStart);
    };
  }, [isVideoCall]);
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
