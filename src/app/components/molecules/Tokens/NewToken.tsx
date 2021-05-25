import { Button } from '@chakra-ui/button';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import Icon from '@chakra-ui/icon';
import { Input } from '@chakra-ui/input';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import React, { FormEvent, useState } from 'react';
import { HiPlus } from 'react-icons/hi';

import { Token } from '../../../../lib/Token';
import { setField } from '../../../helpers';
import TokenSymbol from '../../atoms/TokenSymbol';

function NewTokenForm({ onNew }: { onNew: (t: Token) => void }) {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const token = new Token(symbol, name);
    onNew(token);
    setName('');
    setSymbol('');
  };

  const inputBg = useColorModeValue('white', 'gray.800');
  const buttonColor = useColorModeValue('linkedin.200', 'linkedin.600');
  const bgColor = useColorModeValue('twitter.100', 'twitter.800');

  return (
    <Box bg={bgColor} p={3} alignItems="start">
      <Flex justifyContent="space-between">
        <Heading size="md" mb={5}>
          Create a token
        </Heading>
        <TokenSymbol symbol={symbol} />
      </Flex>

      <form onSubmit={onSubmit} autoComplete="off">
        <FormControl id="symbol" my={3}>
          <FormLabel>Symbol</FormLabel>
          <Input
            variant="outline"
            background={inputBg}
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
            background={inputBg}
            type="text"
            name="name"
            value={name}
            onChange={setField(setName)}
          />
        </FormControl>
        <Button mt={3} type="submit" bg={buttonColor}>
          Create {symbol}
        </Button>
      </form>
    </Box>
  );
}

export default function NewToken({ onNew }: { onNew: (t: Token) => void }) {
  const [form, setForm] = useState<boolean>(false);

  const onNewToken = (token: Token) => {
    onNew(token);
    setForm(false);
  };
  return form ? (
    <NewTokenForm onNew={onNewToken} />
  ) : (
    <Button colorScheme="green" isFullWidth onClick={() => setForm(true)}>
      <Flex align="end">
        <Icon as={HiPlus} w={6} h={6} />
        New Token
      </Flex>
    </Button>
  );
}
