import { Button } from '@chakra-ui/button';
import { FormControl, FormHelperText } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightAddon } from '@chakra-ui/input';
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/select';
import React, { FormEvent, useEffect, useState } from 'react';

import { Pool } from '../../../lib/Pool';
import { Token } from '../../../lib/Token';
import { setField } from '../../helpers';
import TokenValueChooser from '../molecules/TokenValueChooser';

export default function SwapControl({
  sender,
  pools,
}: {
  sender: string;
  pools: Pool[];
}) {
  const [amount, setAmount] = useState<number>();
  const [quote, setQuote] = useState<number>(0);
  const [fromOptions, setFromOptions] = useState<Token[]>([]);
  const [toOptions, setToOptions] = useState<Token[]>([]);
  const [from, setFrom] = useState<Token>();
  const [to, setTo] = useState<Token>();
  const [pool, setPool] = useState<Pool | null>(null);
  const [swaps, setSwaps] = useState<Record<string, Pool[]>>();
  // const onSubmit = (e: FormEvent) => {
  //   e.preventDefault();
  //   if (!amount) return;
  //   pool.buy(sender, from, to, amount);
  // };
  // useEffect(() => {
  //   if (!amount) return;
  //   const off = pools.map(pool => pool.on('ReservesChanged', (e) => {
  //     setQuote(pool.quote(from, to, amount));
  //   });
  //   return () => {
  //     off();
  //   };
  // }, [pools, amount]);

  useEffect(() => {
    const _fromOptions: Set<Token> = new Set();
    pools.forEach((pool) => {
      _fromOptions.add(pool.token1);
      _fromOptions.add(pool.token2);
    });
    setFromOptions([..._fromOptions]);
  }, [pools]);

  const onFromChanged = (symbol: string) => {
    const token = fromOptions.find((t) => t.symbol === symbol);
    setFrom(token);

    const _toOptions: Set<Token> = new Set();
    pools.forEach((p) => {
      if (p.token1.symbol == symbol) _toOptions.add(p.token2);
      if (p.token2.symbol == symbol) _toOptions.add(p.token1);
    });
    setToOptions([..._toOptions]);
    updateQuote('0');
    setTo(undefined);
  };

  const onToChanged = (symbol: string) => {
    const token = fromOptions.find((t) => t.symbol === symbol);
    setTo(token);

    const _pool = pools.find((pool) => {
      const tokens = [pool.token1, pool.token2];
      if (from === tokens[0] && token === tokens[1]) return true;
      if (from === tokens[1] && token === tokens[0]) return true;
    });
    if (!_pool) {
      console.error('pool has gone o0');
    } else {
      setPool(_pool);
    }
  };
  const updateQuote = (amount: string) => {
    const newVal = parseFloat(amount) || 0;
    setAmount(newVal);
    if (pool && from && to) {
      setQuote(pool.quote(from, to, newVal));
    } else {
      setQuote(0);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(amount);
  };

  return (
    <Flex
      as="form"
      direction="column"
      onSubmit={onSubmit}
      justify="space-between"
      h="100%"
      autoComplete="off">
      <Flex direction="column">
        <TokenValueChooser
          onTokenChanged={onFromChanged}
          tokens={fromOptions}
          selected={from}
          isFirst>
          <FormControl id="amount">
            <InputGroup>
              <Input
                border="none"
                size="lg"
                placeholder="0.0"
                textAlign="right"
                type="text"
                name="amount"
                value={amount}
                onChange={setField(updateQuote)}
              />
            </InputGroup>
          </FormControl>
        </TokenValueChooser>

        <TokenValueChooser onTokenChanged={onToChanged} tokens={toOptions} selected={to}>
          <InputGroup justifyContent="end" width="100%" p={3}>
            <Text fontSize="lg">{quote.toFixed(2)} </Text>
          </InputGroup>
        </TokenValueChooser>

        {pool && pool.feeRate > 0 && (
          <Text color="gray.500" align="right" my={2}>
            contains a {pool.feeRate * 100}% swap fee
            {amount && from && amount > 0 && (
              <span> ({`${amount * pool.feeRate} ${from.symbol}`})</span>
            )}
          </Text>
        )}
      </Flex>
      <Button
        mt={3}
        size="lg"
        colorScheme="green"
        variant="solid"
        isFullWidth
        type="submit">
        Swap
      </Button>
    </Flex>
  );
}
