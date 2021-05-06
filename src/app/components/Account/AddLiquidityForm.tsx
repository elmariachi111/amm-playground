import { Button } from '@chakra-ui/button';
import { FormControl } from '@chakra-ui/form-control';
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/input';
import { VStack } from '@chakra-ui/layout';
import React, { FormEvent, useState } from 'react';

import { Pool } from '../../../lib/Pool';
import { setField } from '../../helpers';

export default function AddLiquidityForm({
  address,
  pool,
  onDone,
}: {
  address: string;
  pool: Pool;
  onDone: () => void;
}) {
  const [amt1, setAmt1] = useState(0);
  const [amt2, setAmt2] = useState(0);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    pool.addLiquidity(address, amt1, amt2);
    onDone();
  };

  return (
    <form onSubmit={onSubmit}>
      <VStack>
        <FormControl id="amount">
          <InputGroup size="sm">
            <InputLeftAddon>{pool.token1.symbol}</InputLeftAddon>
            <Input
              size="sm"
              type="number"
              name="amount1"
              onChange={setField((val: string) => {
                setAmt1(parseInt(val));
              })}
            />
          </InputGroup>
        </FormControl>
        <FormControl id="to">
          <InputGroup size="sm">
            <InputLeftAddon>{pool.token2.symbol}</InputLeftAddon>
            <Input
              size="sm"
              type="number"
              name="amount2"
              onChange={setField((val: string) => {
                setAmt2(parseInt(val));
              })}
            />
          </InputGroup>
        </FormControl>
        <Button size="sm" colorScheme="linkedin" px={10} type="submit">
          Add Liquidity
        </Button>
      </VStack>
    </form>
  );
}
