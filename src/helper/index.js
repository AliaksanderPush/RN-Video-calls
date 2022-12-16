import React from 'react';
import {Platform, PermissionsAndroid, Alert} from 'react-native';
import {errMessage} from '../constants';

export const checkPermissions = async isVideoCalling => {
  let permiss = true;
  const permissAndroidCamera = PermissionsAndroid.PERMISSIONS.CAMERA;
  const permissAndroidRecAudio = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;

  if (Platform.OS === 'android') {
    let permissions = [permissAndroidRecAudio];
    if (isVideoCalling) {
      permissions.push(permissAndroidCamera);
    }
    const granted = await PermissionsAndroid.requestMultiple(permissions);
    const recordAudioGranted = granted[permissAndroidRecAudio] === 'granted';
    const cameraGranted = granted[permissAndroidCamera] === 'granted';
    if (recordAudioGranted) {
      if (isVideoCalling && !cameraGranted) {
        Alert.alert(errMessage.camera);
        permiss = false;
      }
    } else {
      Alert.alert(errMessage.audio);
      permiss = false;
    }
  }
  return permiss;
};
