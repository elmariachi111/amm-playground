import { Flex, Text } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';

import { Token, TokenFeature } from '../../../../lib/Token';
import TokenSymbol from '../../atoms/TokenSymbol';

export default function TokenBalance({
  address,
  token,
}: {
  address: string;
  token: Token;
}) {
  const [balance, setBalance] = useState<number>(token.balanceOf(address));
  const [shares, setShares] = useState<number>();

  useEffect(() => {
    const off: Array<() => void> = [];
    const updateBalances = () => {
      const newBalance = token.balanceOf(address);
      setBalance(newBalance);
      if (token.feature === TokenFeature.LiquidityToken) {
        setShares(100 * (newBalance / token.totalSupply));
      }
    };

    off.push(token.on('Minted', (e) => updateBalances()));
    off.push(token.on('Transferred', (e) => updateBalances()));
    off.push(token.on('Burnt', (e) => updateBalances()));
    updateBalances();
    return () => {
      for (const _off of off) _off();
    };
  }, []);

  return (
    <Flex alignItems="center" mr={5}>
      <TokenSymbol
        symbol={token.symbol}
        mr={2}
        title={`${balance} ${token.name}`}
        shares={shares}
        size={15}
      />
      <Flex direction="column">
        <Text fontWeight="medium" fontSize="sm">
          {balance.toFixed(2)}
        </Text>
        <Text color="gray.300" fontSize="xs">
          {token.symbol}
        </Text>
      </Flex>
    </Flex>
  );
}
