import { Flex, Text } from '@chakra-ui/layout';
import { Td } from '@chakra-ui/table';
import React from 'react';

import { Pool, PoolInfo } from '../../../../lib/Pool';
import { Token } from '../../../../lib/Token';
import Diff from '../../../atoms/Diff';
import PfxVal from '../../../atoms/PfxVal';
import TokenSymbol from '../../../atoms/TokenSymbol';
import Tr from './Tr';

const FeesRow = ({
  odd,
  pool,
  poolInfoCur,
  poolInfoLast,
}: {
  odd?: boolean | undefined;
  pool: Pool;
  poolInfoCur: PoolInfo;
  poolInfoLast: PoolInfo | null;
}) => {
  return (
    <>
      <Tr odd={odd}>
        <Td rowSpan={2} borderColor="gray.300" borderTop="1px solid">
          <Text>Fees</Text>
        </Td>
        <Td borderColor="gray.300" borderTop="1px solid">
          <PfxVal
            pfx="sum"
            val={poolInfoCur?.collectedFees[0]}
            sfx={pool.token1.symbol}
          />
        </Td>
        <Td borderColor="gray.300" borderTop="1px solid">
          <Diff
            cur={poolInfoCur.collectedFees[0]}
            last={poolInfoLast?.collectedFees[0]}
            type="abs"
          />
        </Td>
        <Td borderColor="gray.300" borderTop="1px solid">
          <PfxVal pfx="sum" val={poolInfoCur.collectedFees[1]} sfx={pool.token1.symbol} />
        </Td>
      </Tr>
      <Tr odd={odd}>
        <Td borderColor="gray.300" borderTop="1px solid">
          <PfxVal pfx="sum" val={poolInfoCur.collectedFees[1]} sfx={pool.token2.symbol} />
        </Td>
        <Td borderColor="gray.300" borderTop="1px solid">
          <Diff
            cur={poolInfoCur.collectedFees[1]}
            last={poolInfoLast?.collectedFees[1]}
            type="abs"
          />
        </Td>
        <Td borderColor="gray.300" borderTop="1px solid">
          <PfxVal
            pfx="sum"
            val={poolInfoLast?.collectedFees[1]}
            sfx={pool.token1.symbol}
          />
        </Td>
      </Tr>
    </>
  );
};

export default FeesRow;
