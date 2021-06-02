import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import Icon from '@chakra-ui/icon';
import { Box, Flex, Text, Wrap, WrapItem } from '@chakra-ui/layout';
import avatar from 'gradient-avatar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaCaretRight } from 'react-icons/fa';
import { HiCheck } from 'react-icons/hi';

import { colorRange } from '../../helpers';
import { Pool } from '../../lib/Pool';
import { Token } from '../../lib/Token';
import TokenBalance from './Tokens/TokenBalance';

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

  const updateTokens = useCallback(() => {
    setTokensWithBalance(tokens.filter((t) => t.balanceOf(address) > 0));
  }, [tokens]);

  useEffect(() => {
    updateTokens();
    const off = tokens.flatMap((t) => [
      t.on('Minted', updateTokens),
      t.on('Burnt', updateTokens),
      t.on('Transferred', updateTokens),
    ]);

    return () => {
      off.map((_off) => _off());
    };
  }, [tokens]);

  const accountColors = colorRange(address);
  const bgGradient = {
    bgGradient: `linear(to-b, ${accountColors[0]}, ${accountColors[1]})`,
  };

  const isPool = !!pools.find((p) => p.account === address);

  return (
    <Flex
      borderRadius={8}
      mb={3}
      width="100%"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden"
      {...(selected ? { width: '110%' } : {})}>
      {!isPool && (
        <Flex {...bgGradient} minWidth="4px">
          {' '}
        </Flex>
      )}
      <Flex
        direction="column"
        width="100%"
        {...(selected ? bgGradient : { bg: 'gray.100' })}>
        <Flex p={2} px={4} justifyContent="space-between" align="center">
          <Text
            fontSize="xl"
            fontWeight="normal"
            maxW="400px"
            isTruncated
            color={selected ? 'white' : 'gray.800'}>
            {address}
          </Text>
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
        <Wrap bgColor="white" p={3}>
          {tokensWithBalance.map((t) => (
            <WrapItem key={`tb-${address}-${t.symbol}`}>
              <TokenBalance address={address} token={t} />
            </WrapItem>
          ))}
        </Wrap>
      </Flex>
    </Flex>
  );
}
