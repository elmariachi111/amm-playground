import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Flex, Text } from '@chakra-ui/layout';
import avatar from 'gradient-avatar';
import React, { useMemo } from 'react';

import { Pool } from '../../../lib/Pool';
import { Token } from '../../../lib/Token';
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

  return (
    <Flex
      borderRadius={4}
      mb={3}
      width="100%"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden">
      <Flex bg="red" minWidth="4px">
        {' '}
      </Flex>
      <Flex direction="column" width="100%" bg={selected ? 'red' : 'gray.100'}>
        <Flex p={3} justifyContent="space-between">
          <Text size="lg" fontWeight="bold">
            {address}
          </Text>
          <Button variant="link" colorScheme="green" onClick={() => onSelect(address)}>
            select
          </Button>
        </Flex>
        <Flex bgColor="white" p={3}>
          {tokens.map((t) => (
            <TokenBalance key={`tb-${address}-${t.symbol}`} address={address} token={t} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}
