import { IconButton } from '@chakra-ui/button';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Flex, Text } from '@chakra-ui/layout';
import React, { FormEvent, useState } from 'react';
import { HiArrowRight } from 'react-icons/hi';

import { setField } from '../../../helpers';
import { Token } from '../../../lib/Token';

const MintForm = ({ token }: { token: Token }) => {
  const [toMint, setToMint] = useState(0);
  const [recipient, setRecipient] = useState<string>('');

  const mint = (e: FormEvent) => {
    e.preventDefault();
    token.mint(toMint, recipient);
  };
  const inputBg = useColorModeValue('white', 'gray.800');

  return (
    <form onSubmit={mint} autoComplete="off">
      <Flex px={3} py={2} alignItems="center" gridGap={2}>
        <Text>Mint</Text>
        <FormControl id="symbol">
          <Input
            size="sm"
            type="text"
            name="symbol"
            variant="flushed"
            placeholder="Amount"
            bg={inputBg}
            onChange={setField((val: string) => {
              setToMint(parseInt(val));
            })}
          />
        </FormControl>
        <Text>to</Text>
        <FormControl id="name">
          <Input
            type="text"
            size="sm"
            name="name"
            variant="flushed"
            placeholder="recipient"
            bg={inputBg}
            onChange={setField(setRecipient)}
          />
        </FormControl>
        <IconButton
          colorScheme="green"
          size="sm"
          variant="link"
          type="submit"
          aria-label="Submit"
          icon={<HiArrowRight />}
        />
      </Flex>
    </form>
  );
};

export default MintForm;
