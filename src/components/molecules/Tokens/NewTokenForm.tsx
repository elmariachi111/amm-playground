import { Button } from '@chakra-ui/button';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Flex, Heading, Text } from '@chakra-ui/layout';
import React, { FormEvent, useState } from 'react';

import { setField } from '../../../helpers';
import { Token } from '../../../lib/Token';
import TokenSymbol from '../../atoms/TokenSymbol';

const NewTokenForm = ({ onNew }: { onNew: (t: Token) => void }) => {
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
    <Flex
      borderRadius={8}
      mb={3}
      width="100%"
      border="1px solid"
      borderColor="gray.200"
      direction="column"
      overflow="hidden">
      <Flex direction="column">
        <Flex p={3} align="center" bg="gray.100">
          <TokenSymbol symbol={symbol} size={15} />
          <Text fontSize="xl" fontWeight="normal" maxW="400px" ml={2}>
            {symbol}
          </Text>
        </Flex>

        <Flex
          as="form"
          onSubmit={onSubmit}
          autoComplete="off"
          direction="column"
          p={3}
          gridGap={4}>
          <FormControl id="symbol">
            <Input
              variant="flushed"
              background={inputBg}
              type="text"
              name="symbol"
              placeholder="Symbol"
              value={symbol}
              onChange={setField(setSymbol)}
            />
          </FormControl>
          <FormControl id="name">
            <Input
              variant="flushed"
              background={inputBg}
              placeholder="Name"
              type="text"
              name="name"
              value={name}
              onChange={setField(setName)}
            />
          </FormControl>
          <Button mt={3} type="submit" colorScheme="green" variant="solid" isFullWidth>
            Create {symbol}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default NewTokenForm;
