import { Button } from '@chakra-ui/button';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { useDisclosure } from '@chakra-ui/hooks';
import {
  Box,
  Code,
  Container,
  Flex,
  Grid,
  Heading,
  Link,
  Text,
  VStack,
} from '@chakra-ui/layout';
import React from 'react';

import { Token } from '../../lib/Token';

export default function Intro({
  setDefaults,
  tokens,
  addToken,
}: {
  setDefaults: () => void;
  tokens: Token[];
  addToken: (t: Token) => void;
}) {
  const heroBg = useColorModeValue('gray.200', 'gray.600');
  const linkColor = useColorModeValue('linkedin.600', 'linkedin.300');

  const createToken = (name: string, symbol: string) => {
    if (tokens.filter((t) => t.symbol === symbol).length > 0) return;
    const tok = new Token(symbol, name);
    addToken(tok);
  };

  return (
    <Box bg="gray.75" fontSize="lg">
      <Container maxW="1800px">
        <Grid py={8} templateColumns="repeat(3, 1fr)" gridGap={12}>
          <Box>
            <Box mb={4}>
              <Heading size="lg">
                The <b>Automated Market Maker</b> Simulator
              </Heading>
              <Text fontSize="md" color="gray.500">
                a playground for liquidity pools based on{' '}
                <Code variant="subtle">x*y = k</Code>
              </Text>
            </Box>
            <Text my={3}>
              This is an{' '}
              <Link
                isExternal
                href="https://academy.binance.com/en/articles/what-is-an-automated-market-maker-amm">
                automated market maker
              </Link>{' '}
              <b>simulator</b>. It lets you try out various aspects of AMMs in a
              playground environment: you can invent and mint new tokens, add and withdraw
              liquidity to pools and play with price and position behaviour. The goal is
              to understand how Decentralized Exchanges like Uniswap, Curve or Sushi are
              working under the hood.
            </Text>
            <Text>
              Since this is all{' '}
              <Link isExternal href="https://github.com/elmariachi111/amm-playground">
                built in <b>plain Typescript</b>
              </Link>
              , there's no chain, no gas, no tx, no db involved.
            </Text>
            <Flex py={6} gridGap={6}>
              <Button colorScheme="green" variant="link" onClick={setDefaults}>
                Set some defaults
              </Button>
              <Button
                colorScheme="green"
                variant="link"
                onClick={() => location.reload(true)}>
                reload
              </Button>
            </Flex>
          </Box>

          <Box>
            <Box mb={4}>
              <Heading size="lg">Get started</Heading>
              <Text fontSize="md" color="gray.500">
                some simple instructions{' '}
              </Text>
            </Box>
            <Box>
              <Text>
                1. Mint some Eth. Just use real names as addresses (Mint 10 Eth to
                "alice")
              </Text>
              <Text>
                2. Create more tokens (e.g.{' '}
                <Text
                  as={Link}
                  onClick={() => {
                    createToken('Dai', 'DAI');
                  }}>
                  "DAI"
                </Text>
                or{' '}
                <Text
                  as={Link}
                  onClick={() => {
                    createToken('Wrapped Bitcoin', 'wBTC');
                  }}>
                  "wBTC"
                </Text>
                ).
              </Text>
              <Text>
                3. <b>Provide liquidity</b> using two tokens and choosing a pool fee
              </Text>
              <Text>
                4. Provide more liquidity from another account and watch the pool shares
              </Text>
              <Text>
                5. <b>swap</b> one token for another using another account
              </Text>
              <Text>
                6. <b>redeem</b> your position to get back your value + your share of
                accrued pool fees.
              </Text>
            </Box>
          </Box>
          <Box>
            <Box mb={4}>
              <Heading size="lg">Learn</Heading>
              <Text fontSize="md" color="gray.500">
                links to get you started{' '}
              </Text>
            </Box>
            <VStack alignItems="start" spacing={0} mt={2} fontSize=".9em">
              <Box>
                <Link
                  href="https://www.gemini.com/cryptopedia/amm-what-are-automated-market-makers#section-constant-product-formula"
                  isExternal>
                  What's an Automated Market Maker?
                </Link>{' '}
                |{' '}
                <Link
                  href="https://changelly.com/blog/automated-market-maker/"
                  isExternal>
                  alt
                </Link>
              </Box>
              <Link href="https://v2.info.uniswap.org/pairs" isExternal>
                Uniswap V2 Pairs
              </Link>
              <Box whiteSpace="nowrap">
                Uniswap Docs:{' '}
                <Link isExternal href="https://uniswap.org/docs/v2/">
                  V2
                </Link>{' '}
                |{' '}
                <Link
                  isExternal
                  href="https://docs.uniswap.org/concepts/introduction/what-is-uniswap">
                  V3
                </Link>
              </Box>
              <Link
                href="https://docs.google.com/spreadsheets/d/1VH-lbF9RDUpVozGeA3BtWwypjW66MjcD1DnOYzcHmzk/edit#gid=0"
                isExternal>
                Uniswap Math
              </Link>
              <Link href="https://defi-lab.xyz/" isExternal>
                defi-lab.xyz
              </Link>
              <Link
                href="https://ethresear.ch/t/improving-front-running-resistance-of-x-y-k-market-makers/1281"
                isExternal>
                on front running
              </Link>
            </VStack>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}
