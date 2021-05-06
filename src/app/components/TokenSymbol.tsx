import { Box, BoxProps } from '@chakra-ui/layout';
import React from 'react';
import Identicon from 'react-identicons';

const TokenSymbol = (props: { symbol: string } & BoxProps) => {
  return (
    <Box
      borderRadius="full"
      border="1px solid"
      borderColor="gray.200"
      background="white"
      p={3}
      {...props}>
      <Identicon string={props.symbol} size="30" />
    </Box>
  );
};

export default TokenSymbol;
