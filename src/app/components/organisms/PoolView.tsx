import { Box, Flex, Heading, HStack, Spacer, Text, VStack } from '@chakra-ui/layout';
import { Table, TableCaption, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import { Tag } from '@chakra-ui/tag';
import React, { useEffect, useState } from 'react';

import { Pool, PoolInfo } from '../../../lib/Pool';
import CardBox from '../atoms/CardBox';
import TokenSymbol from '../atoms/TokenSymbol';
import PoolHeader from '../molecules/Pool/PoolHeader';
import { PoolDiagram } from '../molecules/PoolDiagram';
import { PoolHistory } from '../molecules/PoolHistory';

const PfxVal = ({ pfx, val, sfx }: { pfx: string; val: string; sfx?: string }) => {
  return (
    <Flex align="center">
      <Text
        color="gray.400"
        textTransform="uppercase"
        mr={2}
        fontSize="xs"
        fontWeight="medium">
        {pfx}
      </Text>
      <Text>{val}</Text>
      {sfx && <Text>{sfx}</Text>}
    </Flex>
  );
};

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

  /*

            <Th isNumeric>{pool.token1.symbol} Reserves</Th>
            <Th isNumeric> {pool.token2.symbol} Reserves</Th>
            <Th isNumeric>
              {pool.token1.symbol}/{pool.token2.symbol} Price
            </Th>
            <Th isNumeric>
              {pool.token2.symbol}/{pool.token1.symbol} Price
            </Th>
            <Th isNumeric>k</Th>
          </Tr>

          {history.map((pi, idx) => (
              <Tr key={`hist-${idx}`}>
                <Td isNumeric>{pi.reserves[0].toFixed(2)}</Td>
                <Td isNumeric>{pi.reserves[1].toFixed(2)}</Td>
                <Td isNumeric>{pi.prices[0].toFixed(4)}</Td>
                <Td isNumeric>{pi.prices[1].toFixed(4)}</Td>
                <Td isNumeric>{pi.k.toFixed(2)}</Td>
              </Tr>
            ))}

          */
  return (
    <CardBox>
      <PoolHeader pool={pool} />
      <Flex>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th></Th>
              <Th>Current Values</Th>
              <Th>Delta</Th>
              <Th>Last</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr bg="gray.100">
              <Td rowSpan={2}>
                <Flex align="center" gridGap={2}>
                  <TokenSymbol symbol={pool.token1.symbol} size={10} />
                  <Text>{pool.token1.symbol}</Text>
                </Flex>
              </Td>
              <Td>
                <PfxVal pfx="vol" val={poolInfo.reserves[0].toFixed(2)} />
              </Td>
              <Td>
                <Flex>
                  <Text color="green.300">501</Text>
                </Flex>
              </Td>
              <Td>
                <PfxVal pfx="vol" val={poolInfo.reserves[0].toFixed(2)} />
              </Td>
            </Tr>
            <Tr bg="gray.100">
              <Td>
                <PfxVal
                  pfx="pri"
                  val={poolInfo.prices[0].toFixed(2)}
                  sfx={pool.token2.symbol}
                />
              </Td>
              <Td>
                <Flex>
                  <Text color="green.300">25%</Text>
                </Flex>
              </Td>
              <Td>
                <PfxVal
                  pfx="pri"
                  val={poolInfo.prices[0].toFixed(2)}
                  sfx={pool.token2.symbol}
                />
              </Td>
            </Tr>

            <Tr>
              <Td rowSpan={2}>
                <Flex align="center" gridGap={2}>
                  <TokenSymbol symbol={pool.token2.symbol} size={10} />
                  <Text>{pool.token2.symbol}</Text>
                </Flex>
              </Td>
              <Td>
                <PfxVal pfx="vol" val={poolInfo.reserves[1].toFixed(2)} />
              </Td>
              <Td>
                <Flex>
                  <Text color="red.300">501</Text>
                </Flex>
              </Td>
              <Td>
                <PfxVal pfx="vol" val={poolInfo.reserves[1].toFixed(2)} />
              </Td>
            </Tr>
            <Tr>
              <Td>
                <PfxVal
                  pfx="pri"
                  val={poolInfo.prices[1].toFixed(2)}
                  sfx={pool.token1.symbol}
                />
              </Td>
              <Td>
                <Flex>
                  <Text color="green.300">25%</Text>
                </Flex>
              </Td>
              <Td>
                <PfxVal
                  pfx="pri"
                  val={poolInfo.prices[1].toFixed(2)}
                  sfx={pool.token1.symbol}
                />
              </Td>
            </Tr>
            <Tr bg="gray.100">
              <Td>
                <Text>Const</Text>
              </Td>
              <Td>
                <PfxVal pfx="k" val={poolInfo.k.toFixed()} />
              </Td>
              <Td></Td>
              <Td>
                <PfxVal pfx="k" val={poolInfo.k.toFixed()} />
              </Td>
            </Tr>
          </Tbody>
        </Table>
        <Box w="350" h="350" p={3}>
          {poolInfo.reserves[0] + poolInfo.reserves[1] > 0 && (
            <PoolDiagram pool={pool} poolInfos={history} />
          )}
        </Box>
      </Flex>
    </CardBox>
  );
};

export { PoolView };
