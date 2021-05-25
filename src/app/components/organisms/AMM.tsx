import { Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/layout';
import React from 'react';

import { Pool } from '../../../lib/Pool';
import { Token, TokenFeature } from '../../../lib/Token';
import AddLiquidityForm from './AddLiquidityForm';
import SwapControl from './SwapControl';

const AMM = ({
  account,
  tokens,
  pools,
  poolAdded,
}: {
  account: string | undefined;
  tokens: Token[];
  pools: Pool[];
  poolAdded: (p: Pool) => void;
}) => {
  return (
    <Box
      borderRadius={4}
      p={4}
      background="gray.100"
      border="1px solid"
      borderColor="gray.300">
      {account ? (
        <VStack>
          <Flex direction="column">
            <Heading size="md">Swap</Heading>
            <SwapControl sender={account} pools={pools} />
          </Flex>
          <Flex direction="column">
            <Heading size="md">Provide</Heading>
            {
              <AddLiquidityForm
                address={account}
                tokens={tokens.filter(
                  (token: Token) => token.feature !== TokenFeature.LiquidityToken,
                )}
                pools={pools}
                poolAdded={poolAdded}
              />
            }
          </Flex>
          <Flex>
            <Heading size="md">Withdraw</Heading>
          </Flex>
        </VStack>
      ) : (
        <Text>select an account</Text>
      )}
    </Box>
  );
};

export default AMM;
