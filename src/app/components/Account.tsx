import { Image } from '@chakra-ui/image';
import { Box, Center, Divider, Flex, Heading, Text } from '@chakra-ui/layout';
import { Collapse } from '@chakra-ui/transition';
import avatar from 'gradient-avatar';
import React from 'react';

import { Pool } from '../../lib/Pool';
import { Token } from '../../lib/Token';
import AddLiquidityPopover from './Account/LiquidityPopover';
import SwapControl from './Account/SwapControl';
import TokenBalance from './Account/TokenBalance';

export default function Account({
  address,
  tokens,
  pools,
}: {
  address: string;
  tokens: Token[];
  pools: Pool[];
}) {
  const svg = btoa(avatar(address, 50));

  return (
    <Collapse in={true} startingHeight={0} animateOpacity>
      <Box my={5}>
        <Flex alignItems="center">
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
          {tokens.map((t) => (
            <TokenBalance address={address} token={t} key={`tb-${address}-${t.symbol}`} />
          ))}
          <Center height="50px" px={5}>
            <Divider orientation="vertical" />
          </Center>

          {pools.map((pool) => (
            <Box h="50px" key={`liq-${address}-${pool.poolToken.symbol}`}>
              <AddLiquidityPopover pool={pool} from={address} />
            </Box>
          ))}
        </Flex>

        <Heading size="sm" my={5}>
          Swap Tokens / Add Liquidity
        </Heading>
        {pools.map((pool) => (
          <>
            <SwapControl
              sender={address}
              pool={pool}
              from={pool.token1}
              to={pool.token2}
              key={`swap-${pool.account}`}
            />
            <SwapControl
              sender={address}
              pool={pool}
              from={pool.token2}
              to={pool.token1}
              key={`swap-${pool.account}`}
            />
          </>
        ))}
      </Box>
    </Collapse>
  );
}
