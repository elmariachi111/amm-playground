import { Flex, Text } from '@chakra-ui/layout';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/progress';
import React, { useCallback, useEffect, useState } from 'react';

import { colorRange } from '../../../helpers';
import { Token, TokenFeature } from '../../../lib/Token';
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

  const updateBalances = useCallback(() => {
    const newBalance = token.balanceOf(address);
    setBalance(newBalance);
    if (token.feature === TokenFeature.LiquidityToken) {
      setShares(100 * (newBalance / token.totalSupply));
    }
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
  const symbol =
    token.feature === TokenFeature.LiquidityToken ? (
      <CircularProgress
        value={shares}
        color={tokenColor}
        capIsRound={false}
        size="2.8rem"
        mr={1}>
        <CircularProgressLabel>{shares?.toFixed(0)}%</CircularProgressLabel>
      </CircularProgress>
    ) : (
      <TokenSymbol
        token={token}
        mr={1}
        title={`${balance} ${token.name}`}
        shares={shares}
        size={15}
      />
    );
  return (
    <Flex alignItems="center" mr={5}>
      {symbol}
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
