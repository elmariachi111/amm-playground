import { Button } from '@chakra-ui/button';
import Icon from '@chakra-ui/icon';
import { Flex, Text, Wrap, WrapItem } from '@chakra-ui/layout';
import { useColorModeValue } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { FaCaretRight } from 'react-icons/fa';
import { HiCheck } from 'react-icons/hi';

import { colorRange, currency } from '../../helpers';
import { computeUsdValue, poolForToken } from '../../lib/computeUsdValue';
import { Pool } from '../../lib/Pool';
import { Token, TokenFeature } from '../../lib/Token';
import PoolBalance from './Tokens/PoolBalance';
import TokenBalance from './Tokens/TokenBalance';

function BalanceWrap({
  address,
  token,
  pools,
}: {
  token: Token;
  address: string;
  pools: Pool[];
}) {
  if (token.feature === TokenFeature.LiquidityToken) {
    const pool = poolForToken(pools, token);

    return pool ? <PoolBalance address={address} pool={pool} /> : <Text>no pool?!</Text>;
  } else {
    return <TokenBalance address={address} token={token} />;
  }
}

export default function Account({
  address,
  tokens,
  pools,
  selected,
  onSelect,
}: {
  address: string;
  tokens: Token[];
  pools: Pool[];
  selected: boolean;
  onSelect: (acc: string) => void;
}) {
  const [tokensWithBalance, setTokensWithBalance] = useState<Token[]>([]);
  const [usdValue, setUsdValue] = useState<number>(0);

  const updateTokens = useCallback(async () => {
    const _tokensWithBalance = tokens.filter((t) => t.balanceOf(address) > 0);
    setTokensWithBalance(_tokensWithBalance);
    setUsdValue(await computeUsdValue(address, _tokensWithBalance, pools));
  }, [pools, tokens]);

  useEffect(() => {
    updateTokens();
    const off = tokens.flatMap((t) => [
      t.on('Minted', updateTokens),
      t.on('Burnt', updateTokens),
      t.on('Transferred', updateTokens),
      t.on('MarketPriceUpdated', updateTokens),
    ]);

    return () => {
      off.map((_off) => _off());
    };
  }, [tokens]);

  const accountColors = colorRange(address);

  const isPool = !!pools.find((p) => p.account === address);
  const border = useColorModeValue('gray.200', 'gray.700');
  const bg = useColorModeValue('white', 'gray.600');
  const headerBg = useColorModeValue('gray.100', 'gray.500');
  return (
    <Flex
      rounded="md"
      mb={3}
      width="100%"
      boxShadow="sm"
      border="1px solid"
      borderColor={border}
      overflow="hidden"
      {...(selected ? { width: '110%' } : {})}>
      {!isPool && (
        <Flex
          bgGradient={`linear(to-b, ${accountColors[0]}, ${accountColors[1]})`}
          minWidth="4px">
          {' '}
        </Flex>
      )}
      <Flex
        direction="column"
        width="100%"
        {...(selected
          ? {
              bgGradient: `linear(to-r, ${accountColors[0]}, ${accountColors[1]})`,
            }
          : { bg: headerBg })}>
        <Flex
          p={2}
          px={4}
          justifyContent="space-between"
          align="center"
          borderBottom="1px solid"
          borderColor={border}>
          <Flex align="center" gridGap={3}>
            <Text
              fontSize="xl"
              fontWeight="normal"
              maxW="400px"
              isTruncated
              color={selected ? 'white' : ''}>
              {address}
            </Text>
            <Text color={selected ? 'white' : 'gray.400'} fontSize="sm">
              {currency(usdValue, true)}
            </Text>
          </Flex>
          {selected ? (
            <Text color="white" casing="uppercase" fontWeight="bold" fontSize="sm">
              <Icon as={HiCheck} mr={1} w={5} h={5} />
              selected
            </Text>
          ) : !isPool ? (
            <Button
              variant="link"
              colorScheme="green"
              onClick={() => onSelect(address)}
              rightIcon={<FaCaretRight />}>
              select
            </Button>
          ) : (
            <></>
          )}
        </Flex>
        <Wrap p={3} bg={bg}>
          {tokensWithBalance.map((t) => (
            <WrapItem key={`tb-${address}-${t.symbol}`}>
              <BalanceWrap address={address} token={t} pools={pools} />
            </WrapItem>
          ))}
        </Wrap>
      </Flex>
    </Flex>
  );
}
