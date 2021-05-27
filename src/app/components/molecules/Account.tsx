import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Flex, Text } from '@chakra-ui/layout';
import avatar from 'gradient-avatar';
import React, { useEffect, useMemo } from 'react';

import { Pool } from '../../../lib/Pool';
import { Token } from '../../../lib/Token';
import { colorRange } from '../../helpers';
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
  const svg = useMemo(() => {
    return btoa(avatar(address, 50));
  }, [address]);

  const accountColors = colorRange(address);
  const bgGradient = {
    bgGradient: `linear(to-b, ${accountColors[0]}, ${accountColors[1]})`,
  };

  const isPool = !!pools.find((p) => p.account === address);
  return (
    <Flex
      borderRadius={4}
      mb={3}
      width="100%"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden"
      {...(selected ? { width: '107%' } : {})}>
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
            fontSize="2xl"
            fontWeight="normal"
            color={selected ? 'white' : 'gray.800'}>
            {address}
          </Text>
          {selected ? (
            <Text color="white" casing="uppercase" fontWeight="bold" fontSize="sm">
              selected
            </Text>
          ) : !isPool ? (
            <Button variant="link" colorScheme="green" onClick={() => onSelect(address)}>
              select
            </Button>
          ) : (
            <></>
          )}
        </Flex>
        <Flex bgColor="white" p={3}>
          {tokens
            .filter((t) => t.balanceOf(address) > 0)
            .map((t) => (
              <TokenBalance
                key={`tb-${address}-${t.symbol}`}
                address={address}
                token={t}
              />
            ))}
        </Flex>
      </Flex>
    </Flex>
  );
}
