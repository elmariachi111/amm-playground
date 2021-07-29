import { Flex, Text } from '@chakra-ui/layout';
import { useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { colorRange, currency } from '../../helpers';
import { Token, TokenFeature } from '../../lib/Token';
import { PfxText } from '../atoms/PfxText';
import TokenSymbol from '../atoms/TokenSymbol';
import MarketPriceForm from '../molecules/Tokens/MarketPriceForm';
import MintForm from '../molecules/Tokens/MintForm';

const TokenHeader = ({ token }: { token: Token }) => {
  const [totalSupply, setTotalSupply] = useState<number>(token.totalSupply);
  useEffect(() => {
    const off = [
      token.on('Minted', () => {
        setTotalSupply(token.totalSupply);
      }),
      token.on('Burnt', () => {
        setTotalSupply(token.totalSupply);
      }),
    ];

    return () => {
      off.map((_off) => _off());
    };
  }, [token]);

  const border = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.100', 'gray.500');

  return (
    <Flex
      p={2}
      align="center"
      borderBottom="1px solid"
      borderColor={border}
      justifyContent="space-between"
      bg={headerBg}>
      <Flex align="center">
        <TokenSymbol token={token} size={5} />
        <Text
          fontSize="lg"
          fontWeight="normal"
          maxW="400px"
          ml={2}
          title={token.coinInfo?.id || token.name}>
          {token.symbol}
        </Text>
      </Flex>
      <Flex direction="row" align="center" gridGap={5}>
        <Flex direction="column">
          <PfxText>Supply</PfxText>
          <Text fontSize="sm">{currency(totalSupply)}</Text>
        </Flex>
        {token.feature !== TokenFeature.LiquidityToken && (
          <MarketPriceForm token={token} />
        )}
      </Flex>
    </Flex>
  );
};

const TokenView = ({ token }: { token: Token }) => {
  const border = useColorModeValue('gray.200', 'gray.700');
  const bg = useColorModeValue('white', 'gray.600');

  const tokenColor = colorRange(token.symbol)[0];

  return (
    <Flex
      rounded="md"
      mb={3}
      width="100%"
      boxShadow="sm"
      border="1px solid"
      borderColor={border}
      overflow="hidden">
      <Flex backgroundColor={tokenColor} width="5px"></Flex>
      <Flex direction="column" width="100%">
        <TokenHeader token={token} />
        {token.feature !== TokenFeature.LiquidityToken && (
          <Flex bgColor={bg} borderBottomRadius={4}>
            <MintForm token={token} />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export { TokenView };
