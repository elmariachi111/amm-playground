import { useColorMode } from '@chakra-ui/color-mode';
import { Box, Flex, Grid, Heading, Link, Spacer, Text, VStack } from '@chakra-ui/layout';
import { Switch } from '@chakra-ui/switch';
import React from 'react';

export function Footer() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Grid
      bgGradient="linear(to-t,gray.800,linkedin.700)"
      pt={10}
      pb={8}
      mt={10}
      templateColumns="repeat(3, 1fr)"
      justifyContent="center">
      <Flex color="white" direction="column" px={3} alignItems="start" justify="end">
        <Text>
          built by{' '}
          <Link isExternal href="https://twitter.com/stadolf">
            Stefan Adolf
          </Link>
        </Text>
        <Text>
          for{' '}
          <Link
            fontWeight="bold"
            textTransform="uppercase"
            href="https://turbinekreuzberg.com">
            Turbine Kreuzberg
          </Link>{' '}
        </Text>
        <Text>
          reach out via{' '}
          <Link fontWeight="bold" href="mailto:hello@turbinekreuzberg.com">
            email
          </Link>
        </Text>
      </Flex>
      <Box></Box>
      <Box color="white">
        <Heading size="sm">Background</Heading>
        <VStack alignItems="start" spacing={0} ml={2} mt={2} fontSize=".9em">
          <Box>
            <Link
              href="https://www.gemini.com/cryptopedia/amm-what-are-automated-market-makers#section-constant-product-formula"
              isExternal>
              Automated Market Makers
            </Link>{' '}
            |{' '}
            <Link href="https://changelly.com/blog/automated-market-maker/" isExternal>
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
            href="https://ethresear.ch/t/improving-front-running-resistance-of-x-y-k-market-makers/1281"
            isExternal>
            on front running
          </Link>
        </VStack>
      </Box>
    </Grid>
  );
}
