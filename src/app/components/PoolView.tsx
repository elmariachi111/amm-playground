import { Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';

import { Pool, PoolInfo } from '../../lib/Pool';
import TokenSymbol from './atoms/TokenSymbol';
import { PoolDiagram } from './PoolDiagram';
import { PoolHistory } from './PoolHistory';

const PoolView = ({ pool }: { pool: Pool }) => {
  const [poolInfo, setPoolInfo] = useState<PoolInfo>(pool.poolInfo());
  const [history, setHistory] = useState<PoolInfo[]>([pool.poolInfo()]);

  useEffect(() => {
    const off1 = pool.on('LiquidityChanged', (args) => {
      setPoolInfo(pool.poolInfo());
      setHistory((old) => [...old, pool.poolInfo()]);
    });
    const off2 = pool.on('ReservesChanged', (args) => {
      setPoolInfo(pool.poolInfo());
      setHistory((old) => [...old, pool.poolInfo()]);
    });
    return () => {
      off1();
      off2();
    };
  }, [pool]);

  return (
    <Box w="full">
      <HStack w="full" alignItems="start" justifyContent="start">
        <Box w="50%">
          <Flex mb={5} alignItems="top" h="50" alignContent="center">
            <Box position="relative" h="40px" w="80px" alignSelf="center">
              <TokenSymbol size={20} symbol={pool.token1.symbol} position="absolute" />
              <TokenSymbol
                size={20}
                symbol={pool.token2.symbol}
                position="absolute"
                left="20px"
              />
            </Box>
            <Box>
              <Heading alignSelf="center" size="md">
                {pool.token1.symbol} | {pool.token2.symbol} Pool
              </Heading>

              <Text fontSize="sm" fontWeight="bold">
                k: {poolInfo.k}
              </Text>
              <Text color="gray.400" fontSize="sm" isTruncated maxWidth={200}>
                Address: {pool.account}{' '}
              </Text>
            </Box>
          </Flex>

          <Heading size="sm" my={3}>
            Reserves
          </Heading>
          <VStack align="start">
            <Flex align="center" gridGap={3}>
              <TokenSymbol symbol={pool.token1.symbol} />
              <Text>
                {pool.token1.symbol}: {poolInfo.reserves[0]}{' '}
              </Text>
            </Flex>
            <Flex align="center" gridGap={3}>
              <TokenSymbol symbol={pool.token2.symbol} />
              <Text>
                {pool.token2.symbol}: {poolInfo.reserves[1]}{' '}
              </Text>
            </Flex>
            <Flex align="center" gridGap={3}>
              <TokenSymbol symbol={pool.poolToken.symbol} />
              <Text>Liq: {pool.poolToken.totalSupply} </Text>
            </Flex>
          </VStack>

          <Heading size="sm" my={3}>
            Prices
          </Heading>
          <Text>
            {pool.token1.symbol}/{pool.token2.symbol}: {poolInfo.prices[0]}
          </Text>
          <Text>
            {pool.token2.symbol}/{pool.token1.symbol}: {poolInfo.prices[1]}
          </Text>

          <Heading size="sm" my={3}>
            Swap Fees: {pool.feeRate * 100} %
          </Heading>
        </Box>
        <Box w="460" h="460">
          {poolInfo.reserves[0] + poolInfo.reserves[1] > 0 && (
            <PoolDiagram pool={pool} poolInfos={history} />
          )}
        </Box>
      </HStack>
      <Box my={5}>
        <PoolHistory pool={pool} history={history} />
      </Box>
    </Box>
  );
};

export { PoolView };
