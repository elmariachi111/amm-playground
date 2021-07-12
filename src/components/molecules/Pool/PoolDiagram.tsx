import { Box, Flex, Text } from '@chakra-ui/layout';
import { Icon } from '@chakra-ui/react';
import { useToken } from '@chakra-ui/system';
import React, { useCallback, useEffect, useState } from 'react';
import { GoPrimitiveDot } from 'react-icons/go';
import {
  FlexibleXYPlot,
  LineSeries,
  LineSeriesPoint,
  MarkSeriesPoint,
  XAxis,
  YAxis,
} from 'react-vis';
import Hint from 'react-vis/es/plot/hint';
import MarkSeries from 'react-vis/es/plot/series/mark-series';

import { Pool, PoolInfo } from '../../../lib/Pool';
import { Token } from '../../../lib/Token';

const PoolDiagram = ({
  pool,
  poolInfos,
}: {
  pool: Pool;
  poolInfos: Array<PoolInfo | null>;
}) => {
  const [green300, pink300, purple300, orange300] = useToken('colors', [
    'green.300',
    'pink.300',
    'purple.300',
    'orange.300',
  ]);
  const [series, setSeries] = useState<LineSeriesPoint[][]>([]);
  const [markers, setMarkers] = useState<MarkSeriesPoint[]>([]);
  const [selectedDataPoint, setSelectedDataPoint] = useState<LineSeriesPoint | null>({
    x: 0,
    y: 0,
  });
  const [quote, setQuote] = useState<MarkSeriesPoint | null>(null);

  const markColors = [pink300, purple300, orange300];

  const updateQuote = useCallback(
    ({ amount, from }: { amount: number; from: Token }) => {
      if (amount == 0 || !poolInfos[0]) {
        setQuote(null);
        return;
      }

      let xy: { x: number; y: number };
      if (from == pool.token1) {
        const cur = poolInfos[0].reserves[0];
        xy = {
          x: cur + amount,
          y: poolInfos[0].k / (cur + amount),
        };
      } else {
        const cur = poolInfos[0].reserves[1];
        xy = {
          x: poolInfos[0].k / (cur + amount),
          y: cur + amount,
        };
      }
      const quoteMarker = {
        ...xy,
        color: orange300,
        size: '4',
      };

      setQuote(quoteMarker);
    },
    [console, poolInfos],
  );

  useEffect(() => {
    const off = [
      pool.on('Quoted', updateQuote),
      pool.on('ReservesChanged', () => {
        console.log('ResCh');
        updateQuote({ amount: 0, from: pool.token1 });
      }),
    ];
    updateQuote({ amount: 0, from: pool.token1 });
    return () => {
      off.map((o) => o());
    };
  }, [pool, poolInfos, updateQuote]);

  useEffect(() => {
    const steps = 20;
    const _series: LineSeriesPoint[][] = [];
    const _markers: MarkSeriesPoint[] = [];
    const pi = poolInfos.filter((p): boolean => !!p) as PoolInfo[];

    pi.forEach((poolInfo, idx) => {
      const data = [];
      const base = poolInfo.reserves[0];
      const range = base / 2;
      const start = Math.min(base - range, quote ? (quote.x as number) : Infinity);
      const end = Math.max(base + range, quote ? (quote.x as number) : 0);
      const stepSize = (end - start) / steps;

      for (let i = 0; i <= steps; i++) {
        const x = start + i * stepSize;
        const y = poolInfo.k / x;
        data.push({ x, y });
      }
      _series.push(data);
      _markers.push({
        x: poolInfo.reserves[0],
        y: poolInfo.reserves[1],
        color: markColors[idx],
        size: '4',
        note: idx === 0 ? 'current price' : 'last price',
      });
      if (quote) {
        _markers.push({
          note: 'pool after quote',
          ...quote,
        });
      }
    });
    setSeries(_series);
    setMarkers(_markers);
  }, [poolInfos, quote]);

  return (
    <FlexibleXYPlot margin={{ left: 50 }} onMouseLeave={() => setSelectedDataPoint(null)}>
      {series.map((_series, idx) => (
        <LineSeries
          key={`hist-${idx}`}
          curve={'curveMonotoneX'}
          data={_series}
          color={green300}
          opacity={(series.length - idx) / series.length}
        />
      ))}
      <MarkSeries
        data={markers}
        stroke="transparent"
        colorType="literal"
        sizeType="literal"
        onNearestXY={(datapoint) => {
          //@ts-ignore
          setSelectedDataPoint(datapoint);
        }}
      />
      <XAxis title={pool.token1.symbol} tickLabelAngle={-90} />
      <YAxis title={pool.token2.symbol} />
      {selectedDataPoint && (
        <Hint value={selectedDataPoint} align={{ vertical: 'top', horizontal: 'left' }}>
          <Box
            bg="rgba(255,255,255,0.8)"
            rounded="md"
            border="1px solid"
            borderColor="gray.200"
            fontSize="xs"
            minW="10rem"
            p={2}>
            <Flex direction="row">
              <Text color={selectedDataPoint.color as any}>
                <Icon as={GoPrimitiveDot} boxSize="1.2rem" />
                {selectedDataPoint.note}
              </Text>
            </Flex>
            <Text color="gray.600">
              1 {pool.token1.symbol} ={' '}
              {(selectedDataPoint.y / (selectedDataPoint.x as number)).toFixed(4)}{' '}
              {pool.token2.symbol}
            </Text>
            <Text color="gray.400">
              {(selectedDataPoint.x as number).toFixed(2)} {pool.token1.symbol} |{' '}
              {selectedDataPoint.y.toFixed(2)} {pool.token2.symbol}
            </Text>

            {/* {poolInfos[1] && (
            <Text color="gray.300">
              {(poolInfos[1].k / selectedDataPoint.x).toLocaleString()}{' '}
              {pool.token2.symbol}
            </Text>
          )} */}
          </Box>
        </Hint>
      )}
    </FlexibleXYPlot>
  );
};

export { PoolDiagram };
