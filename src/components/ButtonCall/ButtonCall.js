import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Pressable} from 'native-base';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export const ButtonCall = ({
  iconName,
  color,
  bg,
  onHandler,
  size = 60,
  typeName,
  disable = false,
}) => {
  const handleTypeName = (typeName, iconName, color) => {
    switch (typeName) {
      case 'FontAwesome5':
        return <FontAwesome5Icon name={iconName} color={color} size={32} />;
      case 'FontAwesome':
        return <FontAwesome name={iconName} color={color} size={32} />;

      default:
        setMessage(errMessage.unknown);
    }
  };
  console.log(disable);
  return (
    <Pressable
      isDisabled={disable}
      w={size}
      h={size}
      borderRadius={size}
      justifyContent="center"
      alignItems="center"
      opacity={disable ? 0.5 : 1}
      bg={bg}
      onPress={() => onHandler()}>
      {handleTypeName(typeName, iconName, color)}
    </Pressable>
  );
};
