import { Flex, Text } from '@chakra-ui/layout';
import { Td } from '@chakra-ui/table';
import React from 'react';

import { Pool, PoolInfo } from '../../../../lib/Pool';
import Diff from '../../../atoms/Diff';
import PfxVal from '../../../atoms/PfxVal';
import TokenSymbol from '../../../atoms/TokenSymbol';
import Tr from './Tr';

const PoolTokenRow = ({
  odd,
  poolInfoCur,
  poolInfoLast,
  pool,
}: {
  poolInfoCur: PoolInfo;
  poolInfoLast: PoolInfo | null;
  pool: Pool;
  odd?: boolean | undefined;
}) => {
  return (
    <Tr odd={odd}>
      <Td>
        <Flex align="center" gridGap={2}>
          <TokenSymbol symbol={pool.poolToken.symbol} size={10} />
          <Text>{pool.poolToken.symbol}</Text>
        </Flex>
      </Td>
      <Td>
        <PfxVal pfx="sup" val={poolInfoCur.liqTokenSupply} />
      </Td>
      <Td>
        <Diff
          cur={poolInfoCur.liqTokenSupply}
          last={poolInfoLast?.liqTokenSupply}
          type="abs"
        />
      </Td>
      <Td>
        <PfxVal pfx="sup" val={poolInfoLast?.liqTokenSupply} />
      </Td>
    </Tr>
  );
};

export default PoolTokenRow;
