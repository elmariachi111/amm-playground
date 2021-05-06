import { Button } from '@chakra-ui/button';
import { FormControl } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightAddon } from '@chakra-ui/input';
import { Box, HStack, Text } from '@chakra-ui/layout';
import React, { FormEvent, useState } from 'react';

import { Pool } from '../../../lib/Pool';
import { Token } from '../../../lib/Token';
import { setField } from '../../helpers';

export default function SwapControl({
  sender,
  pool,
  from,
  to,
}: {
  sender: string;
  pool: Pool;
  from: Token;
  to: Token;
}) {
  const [amount, setAmount] = useState<number>(0);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    pool.buy(sender, from, to, amount);
  };
  return (
    <Box my={3}>
      <form onSubmit={onSubmit}>
        <HStack>
          <Text>swap </Text>
          <FormControl id="amount">
            <InputGroup size="sm">
              <Input
                size="sm"
                type="number"
                name="amount"
                onChange={setField((val: string) => {
                  setAmount(parseInt(val));
                })}
              />
              <InputRightAddon>{from.symbol} </InputRightAddon>
            </InputGroup>
          </FormControl>
          <Text whiteSpace="nowrap">to</Text>
          <Text>{pool.quote(from, to, amount)} </Text>
          <Text>{to.symbol}</Text>
          <Button size="sm" colorScheme="linkedin" px={10} type="submit">
            Swap
          </Button>
        </HStack>
      </form>
    </Box>
  );
}
