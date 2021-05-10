import { Button } from '@chakra-ui/button';
import { FormControl } from '@chakra-ui/form-control';
import { Input, InputGroup, InputLeftAddon, InputRightAddon } from '@chakra-ui/input';
import { VStack } from '@chakra-ui/layout';
import React, { FormEvent, useState } from 'react';

import { Pool } from '../../../lib/Pool';
import { setField } from '../../helpers';

export default function RedeemForm({
  pool,
  from,
  onDone,
}: {
  pool: Pool;
  from: string;
  onDone?: () => void;
}) {
  const [amount, setAmount] = useState<number>(pool.poolToken.balanceOf(from));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    pool.withdrawLiquidity(from, amount);
    onDone && onDone();
  };

  return (
    <form onSubmit={onSubmit}>
      <VStack>
        <FormControl id="amount">
          <InputGroup size="sm">
            <InputLeftAddon>{pool.poolToken.symbol}</InputLeftAddon>
            <Input
              size="sm"
              type="number"
              name="amount"
              value={amount}
              onChange={setField((val: string) => {
                setAmount(parseInt(val));
              })}
            />
            <InputRightAddon onClick={() => setAmount(pool.poolToken.balanceOf(from))}>
              max
            </InputRightAddon>
          </InputGroup>
        </FormControl>
        <Button
          size="sm"
          disabled={!pool.poolToken}
          colorScheme="red"
          px={10}
          type="submit">
          Burn
        </Button>
      </VStack>
    </form>
  );
}
