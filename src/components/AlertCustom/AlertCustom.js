import React from 'react';
import {
  Box,
  Alert,
  IconButton,
  HStack,
  VStack,
  CloseIcon,
  Text,
  Collapse,
} from 'native-base';

export const AlertCustom = ({show, setShow, title}) => {
  return (
    <Box w="100%" alignItems="center" mb={10}>
      <Collapse isOpen={show}>
        <Alert maxW="400" status="error">
          <VStack space={1} flexShrink={1} w="100%">
            <HStack
              flexShrink={1}
              space={2}
              alignItems="center"
              justifyContent="space-between">
              <HStack flexShrink={1} space={2} alignItems="center">
                <Alert.Icon />
                <Text
                  fontSize="md"
                  fontWeight="medium"
                  _dark={{
                    color: 'coolGray.800',
                  }}>
                  Error!
                </Text>
              </HStack>
              <IconButton
                variant="unstyled"
                _focus={{
                  borderWidth: 0,
                }}
                icon={<CloseIcon size="3" />}
                _icon={{
                  color: 'coolGray.600',
                }}
                onPress={() => setShow('')}
              />
            </HStack>
            <Box
              pl="6"
              _dark={{
                _text: {
                  color: 'coolGray.600',
                },
              }}>
              {title}
            </Box>
          </VStack>
        </Alert>
      </Collapse>
    </Box>
  );
};
