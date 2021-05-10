import { Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import { FlexibleXYPlot, LineSeries, XAxis, XYPlot, YAxis } from 'react-vis';
import Hint from 'react-vis/es/plot/hint';

import { Pool, PoolInfo } from '../../lib/Pool';
import TokenSymbol from './TokenSymbol';

const PoolDiagram = ({ pool, poolInfo }: { pool: Pool; poolInfo: PoolInfo }) => {
  const [data, setData] = useState<
    {
      x: string | number;
      y: number;
    }[]
  >([]);
  const [selectedDataPoint, setSelectedDataPoint] = useState<{
    x: string | number;
    y: string | number;
  }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const steps = 20;
    const _data = [];
    for (let i = 1; i <= steps; i++) {
      const x = (i / steps) * poolInfo.reserves[0];
      const y = poolInfo.k / x;
      _data.push({ x, y });
    }
    console.log(poolInfo, _data);
    setData(_data);
  }, [poolInfo]);

  return (
    <XYPlot width={480} height={480}>
      <Hint value={selectedDataPoint} align={{ vertical: 'top', horizontal: 'right' }}>
        <Box bg="linkedin.800" p={2}>
          <Text>
            {selectedDataPoint.x} {pool.token1.symbol}
          </Text>
          <Text>
            {selectedDataPoint.y} {pool.token2.symbol}
          </Text>
        </Box>
      </Hint>
      <XAxis title={pool.token1.symbol} />
      <YAxis title={pool.token2.symbol} />
      <LineSeries
        curve={'curveMonotoneX'}
        data={data}
        onNearestX={(datapoint, event) => {
          setSelectedDataPoint(datapoint);
        }}
      />
    </XYPlot>
  );
};

const PoolView = ({ pool }: { pool: Pool }) => {
  const [poolInfo, setPoolInfo] = useState<PoolInfo>(pool.poolInfo());

  useEffect(() => {
    const off1 = pool.on('LiquidityChanged', (args) => {
      setPoolInfo(pool.poolInfo());
    });
    const off2 = pool.on('ReservesChanged', (args) => {
      setPoolInfo(pool.poolInfo());
    });
    return () => {
      off1();
      off2();
    };
  }, [pool]);

  return (
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
              {pool.poolToken.name}
            </Heading>

            <Text fontSize="sm" fontWeight="bold">
              k: {poolInfo.k}
            </Text>
            <Text fontSize="sm" isTruncated maxWidth={200}>
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
          <PoolDiagram pool={pool} poolInfo={poolInfo} />
        )}
      </Box>
    </HStack>
  );
};

export { PoolView };
