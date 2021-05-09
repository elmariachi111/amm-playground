import { useColorMode } from '@chakra-ui/color-mode';
import { Flex, Grid, Heading, Spacer } from '@chakra-ui/layout';
import { Switch } from '@chakra-ui/switch';
import React from 'react';

export function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Grid
      bgGradient="linear(to-b,gray.800,linkedin.700)"
      pt={10}
      pb={8}
      templateColumns="repeat(3, 1fr)"
      justifyContent="center">
      <Spacer />
      <Heading
        size="xl"
        color="linkedin.100"
        fontWeight="thin"
        letterSpacing=".1em"
        whiteSpace="nowrap"
        fontFamily="monospace">
        amm playground
      </Heading>
      <Flex alignItems="center" justifyContent="end" mr={5}>
        <Switch size="md" isChecked={colorMode == 'dark'} onChange={toggleColorMode} />
      </Flex>
    </Grid>
  );
}
