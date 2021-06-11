import { useColorModeValue } from '@chakra-ui/color-mode';
import { Image } from '@chakra-ui/image';
import { Box, BoxProps } from '@chakra-ui/layout';
import React from 'react';
import Identicon from 'react-identicons';

import { Token } from '../../lib/Token';

const TokenSymbol = (
  props: { token?: Token; symbol?: string; size?: number; shares?: number } & BoxProps,
) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const { token, symbol, size } = props;

  let image;
  if (token) {
    if (token.coinInfo) {
      image = (
        <Image src={token.coinInfo.image.thumb} size={size || 30} alt={token.name} />
      );
    } else {
      image = <Identicon string={token.symbol} size={size || 30} />;
    }
  } else {
    image = <Identicon string={symbol} size={size || 30} />;
  }

  return (
    <Box
      borderRadius="full"
      border="1px solid"
      borderColor={borderColor}
      bg={bg}
      p={2}
      {...props}>
      {image}
    </Box>
  );
};

export default TokenSymbol;
