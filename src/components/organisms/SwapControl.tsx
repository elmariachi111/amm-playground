import { Button } from '@chakra-ui/button';
import { FormControl, FormErrorMessage } from '@chakra-ui/form-control';
import { Input, InputGroup } from '@chakra-ui/input';
import { Flex, Stack, Text } from '@chakra-ui/layout';
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { setNumericalField } from '../../helpers';
import { Pool } from '../../lib/Pool';
import { Token, TokenFeature } from '../../lib/Token';
import TokenValueChooser from '../molecules/TokenValueChooser';

export default function SwapControl({
  sender,
  pools,
  tokens,
}: {
  sender: string;
  pools: Pool[];
  tokens: Token[];
}) {
  const [amount, setAmount] = useState<number>(0);
  const [quote, setQuote] = useState<number>(0);
  const [fromOptions, setFromOptions] = useState<Token[]>([]);
  const [toOptions, setToOptions] = useState<Token[]>([]);
  const [from, setFrom] = useState<Token>();
  const [to, setTo] = useState<Token>();
  const [pool, setPool] = useState<Pool>();
  const amtRef = useRef();

  useEffect(() => {
    setFromOptions(tokens.filter((t) => t.feature !== TokenFeature.LiquidityToken));
  }, [tokens]);

  useEffect(() => {
    setToOptions(fromOptions.filter((t) => from !== t));
  }, [from]);

  const updateQuote = useCallback(() => {
    console.debug('uip quote', amount);
    if (amount && pool && from && to) {
      setQuote(pool.quote(from, to, amount));
    } else {
      setQuote(0);
    }
  }, [amount, pool]);

  useEffect(updateQuote, [amount]);

  useEffect(() => {
    if (pool) {
      const off: Array<() => void> = [];
      off.push(pool.on('LiquidityChanged', (e) => updateQuote()));
      off.push(pool.on('ReservesChanged', (e) => updateQuote()));
      updateQuote();
      return () => {
        for (const _off of off) _off();
      };
    }
  }, [pool, updateQuote]);

  useEffect(() => {
    if (from && to) {
      const _pool = pools.find((p) => {
        const tokens = [p.token1, p.token2];
        if (from === tokens[0] && to === tokens[1]) return true;
        if (from === tokens[1] && to === tokens[0]) return true;
      });
      setPool(_pool);
    }
  }, [pools, from, to]);

  const onFromChanged = (symbol: string) => {
    if (!symbol) {
      setFrom(undefined);
      setTo(undefined);
      setPool(undefined);
      setAmount(0);
      amtRef.current.value = null;
      return;
    } else {
      const newFrom = tokens.find((t) => t.symbol === symbol);
      if (to === newFrom) {
        setTo(from);
        setAmount(quote);
        amtRef.current.value = quote;
      }
      setFrom(newFrom);
      updateQuote();
    }
  };

  const onToChanged = (symbol: string) => {
    setTo(tokens.find((t) => t.symbol === symbol));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    pool?.buy(sender, from, to, amount);
  };

  const hasSufficientFunds = useMemo(() => {
    if (!from || !amount) return true;
    return amount <= from.balanceOf(sender);
  }, [amount, from]);

  const canSubmit = useMemo(() => {
    return from && hasSufficientFunds;
  }, [amount, hasSufficientFunds]);

  return (
    <Flex
      as="form"
      direction="column"
      onSubmit={onSubmit}
      justify="space-between"
      h="100%"
      autoComplete="off">
      <Stack direction="column" spacing={-1}>
        <TokenValueChooser
          onTokenChanged={onFromChanged}
          tokens={fromOptions}
          selected={from}
          isFirst>
          <FormControl id="amount" isInvalid={!hasSufficientFunds}>
            <InputGroup>
              <Input
                border="none"
                size="lg"
                placeholder="0.0"
                textAlign="right"
                type="text"
                name="amount"
                ref={amtRef}
                onChange={setNumericalField(setAmount)}
              />
            </InputGroup>
            <FormErrorMessage>not enough funds</FormErrorMessage>
          </FormControl>
        </TokenValueChooser>

        <TokenValueChooser onTokenChanged={onToChanged} tokens={toOptions} selected={to}>
          <InputGroup justifyContent="end" width="100%" p={3}>
            <Text fontSize="lg">{quote?.toFixed(2)}</Text>
          </InputGroup>
        </TokenValueChooser>

        {pool && pool.feeRate > 0 && (
          <Text color="gray.500" align="right" my={2}>
            pool takes a {pool.feeRate * 100}% swap fee
            {amount > 0 && from && (
              <Text fontSize="xs"> ({`${amount * pool.feeRate} ${from.symbol}`})</Text>
            )}
          </Text>
        )}
        {from && to && !pool && (
          <Text color="red.300" align="right" my={2}>
            there's no {from.symbol}|{to.symbol} pool
          </Text>
        )}
      </Stack>

      <Button
        mt={3}
        size="lg"
        colorScheme="green"
        variant="solid"
        isFullWidth
        disabled={!canSubmit}
        type="submit">
        Swap
      </Button>
    </Flex>
  );
}
