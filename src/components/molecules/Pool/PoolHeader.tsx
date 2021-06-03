import { Box, Flex, Heading, Spacer, Text } from '@chakra-ui/layout';
import { Tag } from '@chakra-ui/tag';
import React from 'react';

import { Pool } from '../../../lib/Pool';
import TokenSymbol from '../../atoms/TokenSymbol';

const PoolHeader = ({ pool }: { pool: Pool }) => {
  return (
    <Flex bg="gray.75" p={4}>
      <Flex align="center" gridGap={4}>
        <Box position="relative" h="40px" w="50px">
          <TokenSymbol size={20} symbol={pool.token1.symbol} position="absolute" />
          <TokenSymbol
            size={20}
            symbol={pool.token2.symbol}
            position="absolute"
            left="20px"
          />
        </Box>
        <Heading size="md">{pool.poolToken.symbol} Pool</Heading>
        <Text color="gray.400" fontSize="md">
          {pool.account}
        </Text>
      </Flex>
      <Spacer />
      <Flex align="center" gridGap={3}>
        <Text fontSize="md" color="gray.400">
          Swap Fees{' '}
        </Text>
        <Tag colorScheme="green" fontWeight="normal">
          {pool.feeRate * 100} %
        </Tag>
      </Flex>
    </Flex>
  );
};

export default PoolHeader;
