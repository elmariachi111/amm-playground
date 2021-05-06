import { Flex, Heading } from '@chakra-ui/layout';
import React from 'react';

export function Header() {
  return (
    <Flex
      bgGradient="linear(to-b,gray.800,linkedin.700)"
      pt={10}
      pb={8}
      justifyContent="center">
      <Heading
        size="xl"
        color="linkedin.100"
        fontWeight="thin"
        letterSpacing=".1em"
        fontFamily="monospace">
        amm playground
      </Heading>
    </Flex>
  );
}
