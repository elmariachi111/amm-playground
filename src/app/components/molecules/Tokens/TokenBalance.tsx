import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Flex, Text } from '@chakra-ui/layout';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/popover';
import React, { useEffect, useState } from 'react';

import { Token, TokenFeature } from '../../../../lib/Token';
import TokenSymbol from '../../atoms/TokenSymbol';
import RedeemForm from './RedeemForm';
import TransferForm from './TransferForm';

export default function TokenBalance({
  address,
  token,
}: {
  address: string;
  token: Token;
}) {
  const [balance, setBalance] = useState<number>(token.balanceOf(address));
  const [shares, setShares] = useState<number>();

  const popover = useDisclosure();

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
      <Box>
        <Text fontWeight="bold" fontSize="lg">
          {balance.toFixed(2)}
        </Text>
        <Text color="gray.300">{token.symbol}</Text>
      </Box>
    </Flex>
  );
}
