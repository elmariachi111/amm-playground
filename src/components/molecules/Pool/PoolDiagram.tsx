import { Box, Text } from '@chakra-ui/layout';
import { useToken } from '@chakra-ui/system';
import React, { useEffect, useState } from 'react';
import { LineSeries, XAxis, XYPlot, YAxis } from 'react-vis';
import Hint from 'react-vis/es/plot/hint';

import { Pool, PoolInfo } from '../../lib/Pool';

type DataPoint = {
  x: number;
  y: number;
};

const PoolDiagram = ({ pool, poolInfos }: { pool: Pool; poolInfos: PoolInfo[] }) => {
  const [green300] = useToken('colors', ['green.300']);
  const [series, setSeries] = useState<DataPoint[][]>([]);
  const [selectedDataPoint, setSelectedDataPoint] = useState<DataPoint>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const steps = 100;
    const _series = [];
    const pi = poolInfos.filter((p) => !!p);
    for (const poolInfo of pi) {
      const data = [];
      for (let i = 1; i <= steps; i++) {
        const x = (i / steps) * poolInfo.reserves[0];
        //const y = poolInfo.reserves[1] - poolInfo.k / (x + poolInfo.reserves[0]);
        //const price = poolInfo.reserves[1] / x;
        //const y = Math.sqrt(poolInfo.k / price); //Math.sqrt();
        const y = poolInfo.k / x;
        data.push({ x, y });
      }
      _series.push(data);
    }
    //console.log(_series);
    setSeries(_series);
  }, [poolInfos]);

  return (
    <XYPlot width={300} height={300} margin={{ left: 55 }}>
      <XAxis title={pool.token1.symbol} />
      <YAxis title={pool.token2.symbol} />
      <Hint value={selectedDataPoint} align={{ vertical: 'top', horizontal: 'right' }}>
        <Box
          bg="rgba(255,255,255,0.9)"
          rounded="md"
          border="1px solid"
          borderColor="gray.200"
          p={2}>
          <Text color="gray.600">
            {selectedDataPoint.x.toFixed(2)} {pool.token1.symbol}
          </Text>
          <Text color="gray.600">
            {(poolInfos[0].k / selectedDataPoint.x).toFixed(2)} {pool.token2.symbol}
          </Text>
          {poolInfos[1] && (
            <Text color="gray.300">
              {(poolInfos[1].k / selectedDataPoint.x).toFixed(2)} {pool.token2.symbol}
            </Text>
          )}
        </Box>
      </Hint>

      {series.map((_series, idx) => (
        <LineSeries
          key={`hist-${idx}`}
          curve={'curveMonotoneX'}
          data={_series}
          color={green300}
          opacity={(idx + 1) / series.length}
          onNearestX={(datapoint, event) => {
            setSelectedDataPoint(datapoint);
          }}
        />
      ))}
    </XYPlot>
  );
};

export { PoolDiagram };
