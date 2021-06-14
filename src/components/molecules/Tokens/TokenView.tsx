import { useColorModeValue } from '@chakra-ui/color-mode';
import { Flex, Text } from '@chakra-ui/layout';
import { Editable, EditableInput, EditablePreview } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { colorRange } from '../../../helpers';
import { Token, TokenFeature } from '../../../lib/Token';
import PfxVal from '../../atoms/PfxVal';
import TokenSymbol from '../../atoms/TokenSymbol';
import MintForm from './MintForm';

const MarketPrice = ({ token }: { token: Token }) => {
  const [marketPrice, setMarketPrice] = useState<number | undefined>(token.marketPrice);

  useEffect(() => {
    const off = [
      token.on('MarketPriceUpdated', (args) => {
        setMarketPrice(args.price);
      }),
    ];
    return () => {
      off.map((_off) => _off());
    };
  }, [token]);
  return (
    <Flex align="center">
      <Text color="gray.400" textTransform="uppercase" fontSize="xs" fontWeight="medium">
        $
      </Text>
      <Editable
        fontSize="x-small"
        textAlign="right"
        defaultValue={marketPrice?.toFixed(2)}
        onSubmit={(nextVal: string) => {
          const newPrice = parseFloat(nextVal);
          token.setMarketPrice(newPrice);
        }}>
        <EditablePreview />
        <EditableInput />
      </Editable>
    </Flex>
  );
  //return <PfxVal pfx="$" val={marketPrice} />;
};

const TokenView = ({ token }: { token: Token }) => {
  const [totalSupply, setTotalSupply] = useState<number>(token.totalSupply);

  useEffect(() => {
    const off = [
      token.on('Minted', (args) => {
        setTotalSupply(token.totalSupply);
      }),
      token.on('Burnt', (args) => {
        setTotalSupply(token.totalSupply);
      }),
    ];

    return () => {
      off.map((_off) => _off());
    };
  }, [token]);

  const bgColor = useColorModeValue('twitter.100', 'twitter.800');
  const headerBg = useColorModeValue('linkedin.200', 'linkedin.600');

  const tokenColor = colorRange(token.symbol)[0];

  return (
    <Flex
      borderRadius={8}
      mb={3}
      width="100%"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden">
      <Flex backgroundColor={tokenColor} width="5px"></Flex>
      <Flex direction="column" width="100%">
        <Flex p={3} align="center" justifyContent="space-between" bg="gray.100">
          <Flex align="center">
            <TokenSymbol token={token} size={15} />
            <Text
              fontSize="xl"
              fontWeight="normal"
              maxW="400px"
              ml={2}
              title={token.coinInfo?.id || token.name}>
              {token.symbol}
            </Text>
          </Flex>
          <Flex direction="column" align="end">
            <PfxVal pfx="supply" val={totalSupply} justify="end" />
            <MarketPrice token={token} />
          </Flex>
        </Flex>
        {token.feature !== TokenFeature.LiquidityToken && (
          <Flex bgColor="white" p={3} borderBottomRadius={4}>
            <MintForm token={token} />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export { TokenView };
