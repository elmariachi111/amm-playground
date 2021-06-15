import { Flex, Text } from '@chakra-ui/layout';
import React, { useCallback, useEffect, useState } from 'react';

import { colorRange } from '../../../helpers';
import { Token } from '../../../lib/Token';
import TokenSymbol from '../../atoms/TokenSymbol';

export default function TokenBalance({
  address,
  token,
}: {
  address: string;
  token: Token;
}) {
  const [balance, setBalance] = useState<number>(token.balanceOf(address));
  const updateBalances = useCallback(() => {
    const newBalance = token.balanceOf(address);
    setBalance(newBalance);
  }, [token]);

  useEffect(() => {
    const off: Array<() => void> = [];
    off.push(token.on('Minted', (e) => updateBalances()));
    off.push(token.on('Transferred', (e) => updateBalances()));
    off.push(token.on('Burnt', (e) => updateBalances()));
    updateBalances();
    return () => {
      off.map((_off) => _off());
    };
  }, []);

  const tokenColor = colorRange(token.symbol)[0];

  return (
    <Flex alignItems="center" mr={5}>
      <TokenSymbol token={token} mr={1} title={`${balance} ${token.name}`} size={15} />

      <Flex direction="column">
        <Text fontWeight="medium" fontSize="sm">
          {balance.toFixed(2)}
        </Text>
        <Text color="gray.400" fontSize="xs">
          {token.symbol}
        </Text>
      </Flex>
    </Flex>
  );
}
