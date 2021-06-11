import { Table, TableCaption, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import React from 'react';

import { Pool, PoolInfo } from '../../../lib/Pool';

const PoolHistory = ({ pool, history }: { pool: Pool; history: PoolInfo[] }) => {
  return (
    <Table variant="simple" size="sm">
      <TableCaption placement="top">{pool.poolToken.symbol} History</TableCaption>
      <Thead>
        <Tr>
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
      </Thead>
      <Tbody>
        {history.map((pi, idx) => (
          <Tr key={`hist-${idx}`}>
            <Td isNumeric>{pi.reserves[0].toFixed(2)}</Td>
            <Td isNumeric>{pi.reserves[1].toFixed(2)}</Td>
            <Td isNumeric>{pi.prices[0].toFixed(4)}</Td>
            <Td isNumeric>{pi.prices[1].toFixed(4)}</Td>
            <Td isNumeric>{pi.k.toFixed(2)}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export { PoolHistory };
