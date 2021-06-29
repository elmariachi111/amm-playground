import { useColorModeValue } from '@chakra-ui/color-mode';
import { Image } from '@chakra-ui/image';
import { Box } from '@chakra-ui/layout';
import React from 'react';
import Identicon from 'react-identicons';

import { Token } from '../../lib/Token';
import { CoinInfo } from '../../types/Coingecko';

const TokenSymbol = (props: {
  token?: Token;
  coinInfo?: CoinInfo;
  symbol?: string;
  size?: number;
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const { token, symbol, size, coinInfo } = props;

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
    if (coinInfo) {
      image = <Image src={coinInfo.image.thumb} size={size || 30} alt={coinInfo.name} />;
    } else {
      image = <Identicon string={symbol} size={size || 30} />;
    }
  }

  return (
    <Box borderRadius="full" border="1px solid" borderColor={borderColor} bg={bg} p={2}>
      {image}
    </Box>
  );
};

export default TokenSymbol;
