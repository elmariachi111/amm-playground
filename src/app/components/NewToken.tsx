import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import React, { FormEvent, useState } from 'react';

import { Token } from '../../lib/Token';
import { setField } from '../helpers';
import TokenSymbol from './TokenSymbol';

export default function NewToken({ onNew }: { onNew: (t: Token) => void }) {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const token = new Token(symbol, name);
    onNew(token);
    setName('');
    setSymbol('');
  };

  return (
    <Box bg="linkedin.100" p={3} alignItems="start">
      <Flex justifyContent="space-between">
        <Heading size="md" mb={5}>
          Create a token
        </Heading>
        <TokenSymbol symbol={symbol} />
      </Flex>

      <form onSubmit={onSubmit}>
        <FormControl id="symbol" my={3}>
          <FormLabel>Symbol</FormLabel>
          <Input
            variant="outline"
            background="white"
            type="text"
            name="symbol"
            value={symbol}
            onChange={setField(setSymbol)}
          />
        </FormControl>
        <FormControl id="name" my={3}>
          <FormLabel>Name</FormLabel>
          <Input
            variant="outline"
            background="white"
            type="text"
            name="name"
            value={name}
            onChange={setField(setName)}
          />
        </FormControl>
        <Button mt={3} type="submit" colorScheme="linkedin">
          Create {symbol}
        </Button>
      </form>
    </Box>
  );
}
