import { useDisclosure } from '@chakra-ui/hooks';
import { Image } from '@chakra-ui/image';
import { Box, Center, Divider, Flex, Text, Wrap, WrapItem } from '@chakra-ui/layout';
import { Collapse } from '@chakra-ui/transition';
import avatar from 'gradient-avatar';
import React, { useMemo } from 'react';

import { Pool } from '../../lib/Pool';
import { Token } from '../../lib/Token';
import AddLiquidityPopover from './Account/LiquidityPopover';
import SwapControl from './Account/SwapControl';
import TokenBalancePopover from './Account/TokenBalancePopover';

export default function Account({
  address,
  tokens,
  pools,
}: {
  address: string;
  tokens: Token[];
  pools: Pool[];
}) {
  const svg = useMemo(() => {
    return btoa(avatar(address, 50));
  }, [address]);

  const { isOpen: swapOpen, onToggle: toggleSwap } = useDisclosure();

  return (
    <Box my={5}>
      <Wrap align="center">
        <WrapItem alignItems="center">
          <Image
            mr={3}
            borderRadius="full"
            src={`data:image/svg+xml;base64,${svg}`}
            alt={address}
            title={address}
          />
          <Text size="sm" isTruncated maxWidth={100}>
            {address}
          </Text>
        </WrapItem>
        {tokens.map((t) => (
          <WrapItem key={`tb-${address}-${t.symbol}`}>
            <TokenBalancePopover address={address} token={t} />
          </WrapItem>
        ))}

        <Center height="50px" px={5}>
          <Divider orientation="vertical" />
        </Center>

        {pools.map((pool) => (
          <WrapItem key={`liq-${address}-${pool.poolToken.symbol}`}>
            <Box h="50px" w="80px" title={`mint ${pool.poolToken.name} liquidity`}>
              <AddLiquidityPopover pool={pool} from={address} />
            </Box>
          </WrapItem>
        ))}
      </Wrap>

      <Flex my={5} alignItems="center" onClick={toggleSwap} style={{ cursor: 'pointer' }}>
        <Divider bgColor="gray.400"></Divider>
        <Text color={swapOpen ? 'gray.800' : 'gray.400'} whiteSpace="nowrap" mx={4}>
          Swap Tokens
        </Text>
        <Divider bgColor="gray.400"></Divider>
      </Flex>

      <Collapse in={swapOpen} startingHeight={1}>
        {pools.map((pool) => (
          <Box key={`swap-${pool.account}`}>
            <SwapControl
              sender={address}
              pool={pool}
              from={pool.token1}
              to={pool.token2}
            />
            <SwapControl
              sender={address}
              pool={pool}
              from={pool.token2}
              to={pool.token1}
            />
          </Box>
        ))}
      </Collapse>
    </Box>
  );
}
