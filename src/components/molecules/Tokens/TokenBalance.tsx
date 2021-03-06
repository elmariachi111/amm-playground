import { Flex, Text } from '@chakra-ui/layout';
import React, { useCallback, useEffect, useState } from 'react';

import { currency } from '../../../helpers';
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
    off.push(token.on('Minted', updateBalances));
    off.push(token.on('Transferred', updateBalances));
    off.push(token.on('Burnt', updateBalances));
    updateBalances();
    return () => {
      off.map((_off) => _off());
    };
  }, []);

  return (
    <Flex alignItems="center" mr={5}>
      <TokenSymbol token={token} size={15} />

      <Flex direction="column" ml={1}>
        <Text fontWeight="medium" fontSize="sm">
          {currency(balance)}
        </Text>
        <Text color="gray.400" fontSize="xs">
          {token.symbol}
        </Text>
      </Flex>
    </Flex>
  );
}
