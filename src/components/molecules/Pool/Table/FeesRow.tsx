import { Flex, Text } from '@chakra-ui/layout';
import { Td } from '@chakra-ui/table';
import React from 'react';

import { Token } from '../../../../lib/Token';
import PfxVal from '../../../atoms/PfxVal';
import TokenSymbol from '../../../atoms/TokenSymbol';
import Tr from './Tr';

const FeesRow = ({ poolInfos }: { poolInfos: PoolInfo[]; odd?: boolean | undefined }) => {
  return (
    <>
      <Tr odd={odd}>
        <Td rowSpan={2}>
          <Flex align="center" gridGap={2}>
            <TokenSymbol symbol={token.symbol} size={10} />
            <Text>{token.symbol}</Text>
          </Flex>
        </Td>
        <Td>
          <PfxVal pfx="vol" val={reserves.toFixed(2)} />
        </Td>
        <Td>
          <Text color="green.300">501</Text>
        </Td>
        <Td>
          <PfxVal pfx="vol" val={reserves.toFixed(2)} />
        </Td>
      </Tr>
      <Tr odd={odd}>
        <Td>
          <PfxVal pfx="pri" val={price.toFixed(2)} sfx={otherToken.symbol} />
        </Td>
        <Td>
          <Flex>
            <Text color="green.300">25%</Text>
          </Flex>
        </Td>
        <Td>
          <PfxVal pfx="pri" val={price.toFixed(2)} sfx={otherToken.symbol} />
        </Td>
      </Tr>
    </>
  );
};

export default FeesRow;
