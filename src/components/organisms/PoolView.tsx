import { Flex, Stack, Text } from '@chakra-ui/layout';
import { Table, Tbody, Td, Th, Thead } from '@chakra-ui/table';
import React, { useCallback, useEffect, useState } from 'react';

import { Pool, PoolInfo } from '../../lib/Pool';
import CardBox from '../atoms/CardBox';
import PfxVal from '../atoms/PfxVal';
import { PoolDiagram } from '../molecules/Pool/PoolDiagram';
import PoolHeader from '../molecules/Pool/PoolHeader';
import { FeesRow, PoolTokenRow, TokenRow } from '../molecules/Pool/Table';
import Tr from '../molecules/Pool/Table/Tr';

const PoolView = ({ pool }: { pool: Pool }) => {
  const [poolInfo, setPoolInfo] = useState<PoolInfo>(pool.poolInfo());
  //const [history, setHistory] = useState<PoolInfo[]>([pool.poolInfo()]);
  const [lastPoolInfo, setLastPoolInfo] = useState<PoolInfo | null>(null);

  const updatePoolInfo = useCallback(() => {
    setPoolInfo((old) => {
      const nw = pool.poolInfo();
      setLastPoolInfo(old);
      return nw;
    });
  }, []);

  useEffect(() => {
    const off = [
      pool.on('LiquidityChanged', updatePoolInfo),
      pool.on('ReservesChanged', updatePoolInfo),
    ];
    return () => {
      off.map((o) => o());
    };
  }, []);

  return (
    <CardBox>
      <PoolHeader pool={pool} />
      <Stack direction="row">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr odd={true}>
              <Th w="80px"></Th>
              <Th whiteSpace="nowrap">Current Values</Th>
              <Th>Delta</Th>
              <Th>Last</Th>
            </Tr>
          </Thead>
          <Tbody>
            <TokenRow
              pool={pool}
              tokenIdx={0}
              poolInfoCur={poolInfo}
              poolInfoLast={lastPoolInfo}
            />

            <TokenRow
              pool={pool}
              tokenIdx={1}
              poolInfoCur={poolInfo}
              poolInfoLast={lastPoolInfo}
              odd={true}
            />

            <PoolTokenRow
              pool={pool}
              poolInfoCur={poolInfo}
              poolInfoLast={lastPoolInfo}
              odd={false}
            />
            <FeesRow
              pool={pool}
              poolInfoCur={poolInfo}
              poolInfoLast={lastPoolInfo}
              odd={true}
            />

            <Tr odd={false}>
              <Td>
                <Text>Const</Text>
              </Td>
              <Td>
                <PfxVal pfx="k" val={poolInfo.k.toFixed()} />
              </Td>
              <Td></Td>
              <Td>
                <PfxVal pfx="k" val={lastPoolInfo?.k.toFixed()} />
              </Td>
            </Tr>
          </Tbody>
        </Table>
        <Flex p={3}>
          {poolInfo.reserves[0] + poolInfo.reserves[1] > 0 && (
            <PoolDiagram pool={pool} poolInfos={[poolInfo]} />
          )}
        </Flex>
      </Stack>
    </CardBox>
  );
};

export { PoolView };
