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

import { Token, TokenFeature } from '../../../lib/Token';
import TokenSymbol from '../TokenSymbol';
import TransferForm from './TransferForm';

export default function TokenBalancePopover({
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
    updateBalances();
    return () => {
      for (const _off of off) _off();
    };
  }, []);

  return (
    <Popover
      isOpen={popover.isOpen}
      onOpen={popover.onOpen}
      onClose={popover.onClose}
      placement="bottom">
      <PopoverTrigger>
        <Flex alignItems="center" ml={5}>
          <TokenSymbol
            symbol={token.symbol}
            mr={2}
            title={`${balance} ${token.name}`}
            borderColor={
              token.feature === TokenFeature.LiquidityToken ? 'green.400' : 'gray.200'
            }
          />
          <Box>
            <Text fontWeight="bold" fontSize="xl">
              {balance.toFixed(2)}
            </Text>
            {shares && <Text>{shares.toFixed(1)}%</Text>}
          </Box>
        </Flex>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader fontWeight="semibold">Send {token.symbol}</PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <TransferForm token={token} from={address} onDone={popover.onClose} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
