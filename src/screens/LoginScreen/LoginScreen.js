import React, {useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Platform} from 'react-native';
import {AlertCustom} from '../../components';
import {Voximplant} from 'react-native-voximplant';
import {logo, errMessage} from '../../constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {VOXIMPLANT_APP, VOXIMPLANT_ACCOUNT} from '../../constants';
import {
  Box,
  Text,
  Center,
  Heading,
  Stack,
  Input,
  Pressable,
  Icon,
  KeyboardAvoidingView,
  Button,
  Image,
  useSafeArea,
} from 'native-base';

export const LoginScreen = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const voximplant = Voximplant.getInstance();

  const loginConnect = async () => {
    if (!login || !password) {
      setErr(true);
      setMessage(errMessage.wrong);
      return;
    }
    try {
      setLoading(true);
      await voximplant.login(
        `${login}@${VOXIMPLANT_APP}.${VOXIMPLANT_ACCOUNT}.voximplant.com`,
        password,
      );
      setLoading(false);
      navigation.navigate('Main');
    } catch (e) {
      setLoading(false);
      showErrMessage(e.name);
    }
  };

  function showErrMessage(err) {
    switch (err) {
      case Voximplant.ClientEvents.ConnectionFailed:
        setMessage(errMessage.connect);
        break;
      case voximplant.ClientEvents.AuthResult:
        const mess = convertCodeMessage(e.code);
        setMessage(mess);
        break;
      default:
        setMessage(errMessage.unknown);
    }
  }

  function convertCodeMessage(code) {
    switch (code) {
      case 401:
        return errMessage.password;
      case 404:
        return errMessage.login;
      case 491:
        return errMessage.state;
      default:
        return errMessage.tryAgain;
    }
  }

  useEffect(() => {
    const connectToVoximplant = async () => {
      let clientState = await voximplant.getClientState();
      if (clientState === Voximplant.ClientState.DISCONNECTED) {
        await voximplant.connect();
      } else if (clientState === Voximplant.ClientState.LOGGED_IN) {
        navigation.navigate('Main');
      }
    };
    connectToVoximplant();
  }, []);

  const safeAreaProps = useSafeArea({
    safeAreaTop: true,
    pt: 2,
  });

  return (
    <KeyboardAwareScrollView>
      <Box {...safeAreaProps} borderWidth={1} flex={1} bg="gray.200">
        <Center flex={0.55} borderWidth={1}>
          <Image
            borderBottomRightRadius="lg"
            borderBottomLeftRadius="lg"
            w="100%"
            h="280"
            source={{
              uri: `${logo}`,
            }}
            alt={'Alternate Text '}
            resizeMode="cover"
          />
          <Heading mt={3} size="lg">
            Hello Again!
          </Heading>
          {!message ? (
            <Box
              flexDirection="column"
              alignItems="center"
              justifyContent="center">
              {' '}
              <Text mt={Platform.OS === 'android' ? 0 : 3} fontSize="lg">
                Wellcome back you've
              </Text>
              <Text fontSize="lg">Been missed!</Text>
            </Box>
          ) : (
            <Box>
              <AlertCustom
                show={!!message ? true : false}
                setShow={setMessage}
                title={message}
              />
            </Box>
          )}
        </Center>
        <Center flex={0.25} borderWidth={1}>
          <Stack space={4} w="100%" alignItems="center">
            <Input
              w={{
                base: '90%',
                md: '25%',
              }}
              h="40px"
              borderRadius="lg"
              borderColor={err ? 'red.400' : null}
              bg="white"
              value={login}
              onChangeText={text => setLogin(text)}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="person" />}
                  size={5}
                  ml="2"
                  color="muted.400"
                />
              }
              placeholder="Login"
            />
            <Input
              w={{
                base: '90%',
                md: '25%',
              }}
              h="40px"
              bg="white"
              borderRadius="lg"
              borderColor={err ? 'red.400' : null}
              type={show ? 'text' : 'password'}
              value={password}
              onChangeText={text => setPassword(text)}
              InputRightElement={
                <Pressable onPress={() => setShow(!show)}>
                  <Icon
                    as={
                      <MaterialIcons
                        name={show ? 'visibility' : 'visibility-off'}
                      />
                    }
                    size={5}
                    mr="2"
                    color="muted.400"
                  />
                </Pressable>
              }
              placeholder="Password"
            />
          </Stack>
        </Center>
        <Center flex={0.2} borderWidth={1} justifyContent="center">
          <Button
            w="90%"
            colorScheme="secondary"
            onPress={loginConnect}
            isLoading={loading}
            isLoadingText="Submitting">
            Submit
          </Button>
        </Center>
      </Box>
    </KeyboardAwareScrollView>
  );
};
