import { useDisclosure } from '@chakra-ui/hooks';
import { Box } from '@chakra-ui/layout';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/popover';
import React from 'react';

import { Pool } from '../../../lib/Pool';
import TokenSymbol from '../TokenSymbol';
import AddLiquidityForm from './AddLiquidityForm';

export default function AddLiquidityPopover({
  from,
  pool,
}: {
  from: string;
  pool: Pool;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom"
      closeOnBlur={true}>
      <PopoverTrigger>
        <Box position="relative" h="50px" w="50px">
          <TokenSymbol symbol={pool.token1.symbol} position="absolute" />
          <TokenSymbol symbol={pool.token2.symbol} position="absolute" left="20px" />
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader fontWeight="semibold">
          Add Liquidity {pool.poolToken.name}
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <AddLiquidityForm address={from} pool={pool} onDone={onClose} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
