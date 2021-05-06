import { Button } from '@chakra-ui/button';
import { FormControl } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightAddon } from '@chakra-ui/input';
import { Box, HStack, Text } from '@chakra-ui/layout';
import React, { FormEvent, useEffect, useState } from 'react';

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
  const [amount, setAmount] = useState<number>();
  const [quote, setQuote] = useState<number>(0);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    pool.buy(sender, from, to, amount);
  };
  useEffect(() => {
    const off = pool.on('ReservesChanged', (e) => {
      if (!amount) return;
      setQuote(pool.quote(from, to, amount));
    });
    return () => {
      off();
    };
  }, [pool, amount]);

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
                  const newVal = parseInt(val) || 0;
                  setAmount(newVal);
                  setQuote(pool.quote(from, to, newVal));
                })}
              />
              <InputRightAddon>{from.symbol} </InputRightAddon>
            </InputGroup>
          </FormControl>
          <Text whiteSpace="nowrap">to</Text>
          <Text>{quote.toFixed(2)} </Text>
          <Text>{to.symbol}</Text>
          <Button size="sm" colorScheme="linkedin" px={10} type="submit">
            Swap
          </Button>
        </HStack>
      </form>
    </Box>
  );
}
