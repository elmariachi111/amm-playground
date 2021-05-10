import { useColorModeValue } from '@chakra-ui/color-mode';
import { Box, BoxProps } from '@chakra-ui/layout';
import React from 'react';
import Identicon from 'react-identicons';

const TokenSymbol = (props: { symbol: string; size?: number } & BoxProps) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      borderRadius="full"
      border="1px solid"
      borderColor={borderColor}
      bg={bg}
      p={3}
      {...props}>
      <Identicon string={props.symbol} size={props.size || 30} />
    </Box>
  );
};

export default TokenSymbol;
