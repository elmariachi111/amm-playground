import { Flex, Text } from '@chakra-ui/layout';
import { useColorModeValue } from '@chakra-ui/react';
import { Td } from '@chakra-ui/table';
import React from 'react';

import { Pool, PoolInfo } from '../../../../lib/Pool';
import Diff from '../../../atoms/Diff';
import PfxVal from '../../../atoms/PfxVal';
import TokenSymbol from '../../../atoms/TokenSymbol';
import Tr from './Tr';

const TokenRow = ({
  pool,
  tokenIdx,
  poolInfoCur,
  poolInfoLast,
  odd,
}: {
  pool: Pool;
  tokenIdx: number;
  poolInfoCur: PoolInfo;
  poolInfoLast: PoolInfo | null;
  odd?: boolean | undefined;
}) => {
  const token = tokenIdx === 0 ? pool.token1 : pool.token2;
  const otherToken = tokenIdx === 0 ? pool.token2 : pool.token1;
  const border = useColorModeValue('gray.300', 'gray.500');

  return (
    <>
      <Tr odd={odd}>
        <Td
          rowSpan={2}
          borderColor={border}
          borderTop="1px solid"
          borderBottom="1px solid">
          <Flex align="center" gridGap={2} overflow="hidden">
            <TokenSymbol token={token} size={3} />
            <Text fontSize="xs">{token.symbol}</Text>
          </Flex>
        </Td>
        <Td borderColor={border} borderTop="1px solid">
          <PfxVal pfx="vol" val={poolInfoCur.reserves[tokenIdx].toLocaleString()} />
        </Td>
        <Td borderColor={border} borderTop="1px solid">
          <Diff
            cur={poolInfoCur.reserves[tokenIdx]}
            last={poolInfoLast?.reserves[tokenIdx]}
            type="abs"
          />
        </Td>
        <Td borderColor={border} borderTop="1px solid">
          <PfxVal pfx="vol" val={poolInfoLast?.reserves[tokenIdx].toLocaleString()} />
        </Td>
      </Tr>
      <Tr odd={odd}>
        <Td borderColor={border} borderTop="1px solid">
          <PfxVal pfx="pri" val={poolInfoCur.prices[tokenIdx]} sfx={otherToken.symbol} />
        </Td>
        <Td borderColor={border} borderTop="1px solid">
          <Diff
            cur={poolInfoCur.prices[tokenIdx]}
            last={poolInfoLast?.prices[tokenIdx]}
            type="rel"
          />
        </Td>
        <Td borderColor={border} borderTop="1px solid">
          <PfxVal
            pfx="pri"
            val={poolInfoLast?.prices[tokenIdx]}
            sfx={otherToken.symbol}
          />
        </Td>
      </Tr>
    </>
  );
};

export default TokenRow;
