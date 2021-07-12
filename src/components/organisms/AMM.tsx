import Icon from '@chakra-ui/icon';
import { Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/layout';
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useBreakpointValue,
} from '@chakra-ui/react';
import React from 'react';

// import { BsDownload } from 'react-icons/bs';
// import { ImExit } from 'react-icons/im';
// import { RiArrowLeftRightFill } from 'react-icons/ri';
import { Pool } from '../../lib/Pool';
import { Token, TokenFeature } from '../../lib/Token';
import AddLiquidityForm from './AddLiquidityForm';
import { DepositIcon, SwapIcon, WithdrawIcon } from './AMM/Icons';
import SwapControl from './SwapControl';
import WithdrawForm from './WithdrawForm';

const DESCR_MIN_HEIGHT = 150;

interface PanelProps {
  pools: Pool[];
  readonly account: string;
  tokens: Token[];
  poolAdded: (p: Pool) => void;
}

const SwapPanel = (props: PanelProps) => {
  const { pools } = props;
  const minHeight = useBreakpointValue({ xl: DESCR_MIN_HEIGHT, md: 'auto' });
  return (
    <Flex direction="column">
      <Heading size="lg" mb={3} d={{ xl: 'inline', md: 'none' }}>
        <SwapIcon /> Swap
      </Heading>
      <Text py={4} fontSize="sm" minHeight={minHeight}>
        Exchange one token for another in one atomic swap transaction. You&apos;ll have to
        pay a swap fee that goes into the pool&apos;s reserves. Swaps have an effect on
        the pool reserves&apos; equilibrium and therefore affect the quoted exchange
        price.
        {pools.length == 0 &&
          `To swap, you first need to create a token pair pool and deposit
        liquidity into it.`}
      </Text>

      {pools.length > 0 && <SwapControl {...props} />}
    </Flex>
  );
};

const DepositPanel = (props: PanelProps) => {
  const minHeight = useBreakpointValue({ xl: DESCR_MIN_HEIGHT, md: 'auto' });
  return (
    <Flex direction="column">
      <Heading size="lg" mb={3} d={{ xl: 'inline', md: 'none' }}>
        <DepositIcon /> Deposit
      </Heading>

      <Text py={4} fontSize="sm" minHeight={minHeight}>
        Add tokens to / create new pools. Ensure to deposit tokens at an equal{' '}
        <b>$ value</b>, otherwise your position is in risk of being arbitraged. As the
        first liquidity provider, you may choose a pool fee that swap transactions must
        pay to the pool.
      </Text>

      <AddLiquidityForm
        {...props}
        tokens={props.tokens.filter(
          (token: Token) => token.feature !== TokenFeature.LiquidityToken,
        )}
      />
    </Flex>
  );
};

const WithdrawPanel = (props: PanelProps) => {
  const minHeight = useBreakpointValue({ xl: DESCR_MIN_HEIGHT, md: 'auto' });
  return (
    <Flex direction="column" pr={4}>
      <Heading size="lg" mb={3} d={{ xl: 'inline', md: 'none' }}>
        <WithdrawIcon /> Withdraw
      </Heading>
      <Text py={4} fontSize="sm" minHeight={minHeight}>
        Burn your liquidity pool tokens. This will return your share of the pool, relative
        to the current pool reserves.
      </Text>
      <WithdrawForm {...props} />
    </Flex>
  );
};

const AMM = (props: Omit<PanelProps, 'account'> & { account?: string | undefined }) => {
  const displayType = useBreakpointValue({ xl: 'grid', md: 'tabs' });

  return (
    <Box
      rounded="md"
      px={4}
      py={6}
      background="gray.100"
      boxShadow="base"
      border="1px solid"
      borderColor="gray.200">
      {props.account ? (
        displayType === 'grid' ? (
          <SimpleGrid columns={3} spacing={10} pl={4}>
            <SwapPanel {...(props as PanelProps)} />
            <DepositPanel {...(props as PanelProps)} />
            <WithdrawPanel {...(props as PanelProps)} />
          </SimpleGrid>
        ) : (
          <Tabs isFitted variant="soft-rounded" colorScheme="green">
            <TabList mb="1em">
              <Tab isDisabled={props.pools.length === 0}>
                <SwapIcon />
                <Text ml={2}> Swap</Text>
              </Tab>
              <Tab>
                <DepositIcon />
                <Text ml={2}> Deposit</Text>
              </Tab>
              <Tab isDisabled={props.pools.length === 0}>
                <WithdrawIcon />
                <Text ml={2}> Withdraw</Text>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SwapPanel {...(props as PanelProps)} />
              </TabPanel>
              <TabPanel>
                <DepositPanel {...(props as PanelProps)} />
              </TabPanel>
              <TabPanel>
                <WithdrawPanel {...(props as PanelProps)} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        )
      ) : (
        <Text>select an account</Text>
      )}
    </Box>
  );
};

export default AMM;
