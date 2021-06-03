import { Button } from '@chakra-ui/button';
import { FormControl } from '@chakra-ui/form-control';
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/input';
import { VStack } from '@chakra-ui/layout';
import React, { FormEvent, useState } from 'react';

import { setField } from '../../helpers';
import { Token } from '../../lib/Token';

export default function TransferForm({
  token,
  from,
  onDone,
}: {
  token?: Token;
  from: string;
  onDone?: () => void;
}) {
  const [amount, setAmount] = useState<number>(0);
  const [to, setTo] = useState<string>('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    token!.transfer(from, to, amount);
    onDone && onDone();
  };

  return (
    <form onSubmit={onSubmit}>
      <VStack>
        <FormControl id="amount">
          <InputGroup size="sm">
            <InputLeftAddon>{token?.symbol}</InputLeftAddon>
            <Input
              size="sm"
              type="number"
              name="amount"
              onChange={setField((val: string) => {
                setAmount(parseInt(val));
              })}
            />
          </InputGroup>
        </FormControl>
        <FormControl id="to">
          <InputGroup size="sm">
            <InputLeftAddon>to</InputLeftAddon>
            <Input size="sm" type="text" name="to" onChange={setField(setTo)} />
          </InputGroup>
        </FormControl>
        <Button size="sm" disabled={!token} colorScheme="linkedin" px={10} type="submit">
          Transfer
        </Button>
      </VStack>
    </form>
  );
}
