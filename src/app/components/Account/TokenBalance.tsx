import { useDisclosure } from '@chakra-ui/hooks';
import { Flex, Text } from '@chakra-ui/layout';
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

import { Token } from '../../../lib/Token';
import TokenSymbol from '../TokenSymbol';
import TransferForm from './TransferForm';

export default function TokenBalance({
  address,
  token,
}: {
  address: string;
  token: Token;
}) {
  const [balance, setBalance] = useState<number>(token.balanceOf(address));
  const popover = useDisclosure();

  useEffect(() => {
    const off: Array<() => void> = [];

    off.push(token.on('Minted', (e) => setBalance(token.balanceOf(address))));
    off.push(token.on('Transferred', (e) => setBalance(token.balanceOf(address))));

    return () => {
      for (const _off of off) _off();
    };
  }, []);

  return (
    <Popover
      isOpen={popover.isOpen}
      onOpen={popover.onOpen}
      onClose={popover.onClose}
      placement="bottom"
      matchWidth={false}
      closeOnBlur={false}>
      <PopoverTrigger>
        <Flex alignItems="center" ml={5}>
          <TokenSymbol symbol={token.symbol} mr={2} title={`${balance} ${token.name}`} />

          <Text fontWeight="bold" fontSize="xl">
            {balance.toFixed(2)}
          </Text>
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
