import { useColorModeValue } from '@chakra-ui/color-mode';
import { Box, BoxProps } from '@chakra-ui/layout';
import React from 'react';
import Identicon from 'react-identicons';

//{shares && <Text>{shares.toFixed(1)}%</Text>}
const TokenSymbol = (
  props: { symbol: string; size?: number; shares?: number } & BoxProps,
) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      borderRadius="full"
      border="1px solid"
      borderColor={borderColor}
      bg={bg}
      p={2}
      {...props}>
      <Identicon string={props.symbol} size={props.size || 30} />
    </Box>
  );
};

export default TokenSymbol;
