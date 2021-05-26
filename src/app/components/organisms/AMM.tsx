import { Box, Flex, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/layout';
import React from 'react';

import { Pool } from '../../../lib/Pool';
import { Token, TokenFeature } from '../../../lib/Token';
import AddLiquidityForm from './AddLiquidityForm';
import RedeemForm from './RedeemForm';
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
      px={4}
      py={6}
      background="gray.100"
      border="1px solid"
      boxShadow="lg"
      borderColor="gray.300">
      {account ? (
        <SimpleGrid columns={3} spacing={2}>
          <Flex direction="column">
            <Heading size="lg" mb={3}>
              Swap
            </Heading>
            <SwapControl sender={account} pools={pools} />
          </Flex>
          <Flex direction="column">
            <Heading size="lg" mb={3}>
              Provide
            </Heading>
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
          <Flex direction="column">
            <Heading size="lg" mb={3}>
              Redeem
            </Heading>
            <RedeemForm from={account} pools={pools} onDone={() => {}} />
          </Flex>
        </SimpleGrid>
      ) : (
        <Text>select an account</Text>
      )}
    </Box>
  );
};

export default AMM;
