import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
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
            bg="white"
            onChange={setField((val: string) => {
              setToMint(parseInt(val));
            })}
          />
        </FormControl>
        <FormControl id="name">
          <FormLabel>Recipient</FormLabel>
          <Input
            type="text"
            name="name"
            variant="outline"
            bg="white"
            onChange={setField(setRecipient)}
          />
        </FormControl>
        <Box mt={3}>
          <Button type="submit" colorScheme="linkedin">
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

  return (
    <Box borderRadius={10} bg="twitter.100">
      <Flex
        alignItems="start"
        justify="space-between"
        bg="linkedin.200"
        p={2}
        borderTopRadius={10}>
        <Box ml={2}>
          <Text fontSize={24}>{token.symbol}</Text>
          <Text>{token.name}</Text>
          <Text>Supply: {totalSupply.toFixed(4)}</Text>
        </Box>
        <TokenSymbol symbol={token.symbol} />
      </Flex>
      <MintForm token={token} />
    </Box>
  );
};

export { TokenView };
