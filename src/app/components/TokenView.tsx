import { Button } from '@chakra-ui/button';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { FormControl, FormHelperText, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Flex, Heading, Text } from '@chakra-ui/layout';
import React, { FormEvent, useEffect, useState } from 'react';

import { Token } from '../../lib/Token';
import { setField } from '../helpers';
import TokenSymbol from './TokenSymbol';

const MintForm = ({ token }: { token: Token }) => {
  const [toMint, setToMint] = useState(0);
  const [recipient, setRecipient] = useState<string>('');

  const mint = (e: FormEvent) => {
    e.preventDefault();
    token.mint(toMint, recipient);
  };
  const inputBg = useColorModeValue('white', 'gray.800');
  const buttonColor = useColorModeValue('linkedin.200', 'linkedin.600');

  return (
    <Box p={3} alignItems="start">
      <form onSubmit={mint}>
        <Heading size="md">Mint new {token.symbol}</Heading>
        <FormControl id="symbol">
          <FormLabel>Amount</FormLabel>
          <Input
            type="text"
            name="symbol"
            variant="outline"
            bg={inputBg}
            onChange={setField((val: string) => {
              setToMint(parseInt(val));
            })}
          />
        </FormControl>
        <FormControl id="name" mt={2}>
          <FormLabel htmlFor="name">Recipient</FormLabel>
          <Input
            type="text"
            name="name"
            variant="outline"
            bg={inputBg}
            onChange={setField(setRecipient)}
          />
          <FormHelperText>just use any string here.</FormHelperText>
        </FormControl>
        <Box mt={3}>
          <Button type="submit" bg={buttonColor}>
            Mint {token.symbol}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

const TokenView = ({ token }: { token: Token }) => {
  const [totalSupply, setTotalSupply] = useState<number>(token.totalSupply);

  useEffect(() => {
    const off = token.on('Minted', (args) => {
      setTotalSupply(token.totalSupply);
    });
    return () => {
      off();
    };
  }, [token]);

  const bgColor = useColorModeValue('twitter.100', 'twitter.800');
  const headerBg = useColorModeValue('linkedin.200', 'linkedin.600');

  return (
    <Box borderRadius={10} bg={bgColor}>
      <Flex
        alignItems="start"
        justify="space-between"
        bg={headerBg}
        p={2}
        borderTopRadius={10}>
        <Box ml={2}>
          <Text fontSize={24} title={token.name}>
            {token.symbol}
          </Text>
          <Text>Supply: {totalSupply.toFixed(4)}</Text>
        </Box>
        <TokenSymbol symbol={token.symbol} />
      </Flex>
      <MintForm token={token} />
    </Box>
  );
};

export { TokenView };
