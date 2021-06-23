import Icon from '@chakra-ui/icon';
import { Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/layout';
import React from 'react';
import { BsDownload } from 'react-icons/bs';
import { ImExit } from 'react-icons/im';
import { RiArrowLeftRightFill } from 'react-icons/ri';

import { Pool } from '../../lib/Pool';
import { Token, TokenFeature } from '../../lib/Token';
import AddLiquidityForm from './AddLiquidityForm';
import SwapControl from './SwapControl';
import WithdrawForm from './WithdrawForm';

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
  const DESCR_MIN_HEIGHT = 140;

  return (
    <Box
      borderRadius={8}
      px={4}
      py={6}
      background="gray.100"
      border="1px solid"
      boxShadow="lg"
      borderColor="gray.300">
      {account ? (
        <SimpleGrid columns={3} spacing={10}>
          <Flex direction="column" pl={4}>
            <Heading size="lg" mb={3}>
              <Icon as={RiArrowLeftRightFill} /> Swap
            </Heading>
            <Text py={4} fontSize="sm" minHeight={DESCR_MIN_HEIGHT}>
              Exchange one token for another in one atomic swap transaction. You&apos;ll
              have to pay a swap fee that goes into the pool&apos;s reserves. Swaps are
              changing the balance of a pool&apos;s reserves and thereby have an effect on
              the exchange price.
              {pools.length == 0 &&
                `To swap, you first need to create a token pair pool and deposit
                    liquidity into it.`}
            </Text>

            {pools.length > 0 && (
              <SwapControl sender={account} pools={pools} tokens={tokens} />
            )}
          </Flex>
          <Flex direction="column">
            <Heading size="lg" mb={3}>
              <Icon as={BsDownload} /> Deposit
            </Heading>

            <Text py={4} fontSize="sm" minHeight={DESCR_MIN_HEIGHT}>
              Create new or add tokens to pools. Ensure to provide liquidity with an equal{' '}
              <b>value</b>, otherwise your position is in risk of being arbitraged. As the
              first liquidity provider, you may choose a pool fee that swap transactions
              must pay to the pool.
            </Text>

            <AddLiquidityForm
              address={account}
              tokens={tokens.filter(
                (token: Token) => token.feature !== TokenFeature.LiquidityToken,
              )}
              pools={pools}
              poolAdded={poolAdded}
            />
          </Flex>
          <Flex direction="column" pr={4}>
            <Heading size="lg" mb={3}>
              <Icon as={ImExit} /> Withdraw
            </Heading>
            <Text py={4} fontSize="sm" minHeight={DESCR_MIN_HEIGHT}>
              Burn your liquidity pool tokens. This will return your share of the pool,
              relative to the current pool reserves.
            </Text>
            <WithdrawForm from={account} pools={pools} />
          </Flex>
        </SimpleGrid>
      ) : (
        <Text>select an account</Text>
      )}
    </Box>
  );
};

export default AMM;
