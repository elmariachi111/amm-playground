import { useColorModeValue } from '@chakra-ui/color-mode';
import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Flex, Text } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/react';
import React, { FormEvent, useState } from 'react';

import { setField, setNumericalField } from '../../../helpers';
import accounts from '../../../lib/Accounts';
import { Token } from '../../../lib/Token';

const MintForm = ({ token }: { token: Token }) => {
  const [toMint, setToMint] = useState<number | undefined>();
  const [recipient, setRecipient] = useState<string>('');

  const mint = (e: FormEvent) => {
    e.preventDefault();
    if (!recipient || !toMint) return;
    token.mint(toMint, recipient);
    setRecipient('');
  };
  const inputBg = useColorModeValue('white', 'gray.800');

  return (
    <form onSubmit={mint} autoComplete="off">
      <Flex px={3} py={2} alignItems="center" gridGap={2}>
        <Text>Mint</Text>
        <FormControl id="amount">
          <Input
            size="sm"
            type="number"
            step="0.00001"
            name="amount"
            variant="flushed"
            placeholder="Amount"
            value={toMint}
            bg={inputBg}
            onChange={setNumericalField(setToMint)}
          />
        </FormControl>
        <Text>to</Text>
        <FormControl id="name">
          <Select
            size="sm"
            name="name"
            variant="flushed"
            bg={inputBg}
            onChange={setField(setRecipient)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') mint(e);
            }}
            value={recipient}>
            <option value={''}></option>
            {accounts.map((account) => (
              <option value={account} key={`mint-to-${account}`}>
                {account}
              </option>
            ))}
          </Select>
        </FormControl>
      </Flex>
    </form>
  );
};

export default MintForm;
