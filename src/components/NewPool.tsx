import { Button } from '@chakra-ui/button';
import { Input, InputGroup, InputRightAddon } from '@chakra-ui/input';
import { Box, Flex, Heading } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/select';
import React, { FormEvent, useState } from 'react';

import { setField, sha256hash } from '../helpers';
import { Pool } from '../lib/Pool';
import { Token } from '../lib/Token';

export default function NewPool({
  onCreated,
  tokens,
}: {
  onCreated: (p: Pool) => void;
  tokens: Token[];
}) {
  const [tokenSet, setTokenSet] = useState<string[]>([]);
  const [feeRate, setFeeRate] = useState<string>('');

  const onTokenSelected = (slot: number, tokenSymbol: string) => {
    setTokenSet((old) => {
      const ret = [...old];
      ret[slot] = tokenSymbol;
      return ret;
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fee = parseFloat(feeRate) || 0.0;

    const token1 = tokens.find((t) => t.symbol === tokenSet[0]);
    const token2 = tokens.find((t) => t.symbol === tokenSet[1]);
    const poolAddress = await sha256hash(token1!.symbol + token2!.symbol);

    const p = new Pool(`0x${poolAddress}`, token1!, token2!, fee);
    onCreated(p);
  };

  return (
    <Box>
      <Heading size="md">Create a new pool</Heading>
      <form onSubmit={onSubmit}>
        <Flex gridGap={3}>
          <Select
            placeholder="Select token 1"
            onChange={(e) => onTokenSelected(0, e.currentTarget.value)}>
            {tokens.map((t) => (
              <option value={t.symbol} defaultValue={''} key={`o1-${t.symbol}`}>
                {t.name}
              </option>
            ))}
          </Select>

          <Select
            placeholder="Select token 2"
            onChange={(e) => onTokenSelected(1, e.currentTarget.value)}>
            {tokens.map((t) => (
              <option value={t.symbol} defaultValue={''} key={`o2-${t.symbol}`}>
                {t.name}
              </option>
            ))}
          </Select>
          <InputGroup size="md">
            <Input
              size="md"
              type="string"
              name="fees"
              placeholder="swap fee %"
              value={feeRate}
              onChange={setField(setFeeRate)}
            />
            <InputRightAddon>%</InputRightAddon>
          </InputGroup>
          <Button type="submit" colorScheme="linkedin" w="full">
            Create {tokenSet[0]}/{tokenSet[1]} pool
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
