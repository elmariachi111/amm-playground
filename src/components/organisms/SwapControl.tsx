import { Button } from '@chakra-ui/button';
import { FormControl } from '@chakra-ui/form-control';
import { Input, InputGroup } from '@chakra-ui/input';
import { Flex, Stack, Text } from '@chakra-ui/layout';
import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { currency, setNumericalField } from '../../helpers';
import { Pool } from '../../lib/Pool';
import { Token, TokenFeature } from '../../lib/Token';
import TokenValueChooser from '../molecules/TokenValueChooser';
import { SwapIcon } from './AMM/Icons';

export default function SwapControl({
  account,
  pools,
  tokens,
}: {
  account: string;
  pools: Pool[];
  tokens: Token[];
}) {
  const [amount, setAmount] = useState<number | undefined>();
  const [quote, setQuote] = useState<number>(0);

  const [fromOptions, setFromOptions] = useState<Token[]>([]);
  const [toOptions, setToOptions] = useState<Token[]>([]);
  const [from, setFrom] = useState<Token>();
  const [to, setTo] = useState<Token>();
  const [pool, setPool] = useState<Pool>();

  useEffect(() => {
    setAmount(0);
  }, [account]);

  useEffect(() => {
    setFromOptions(tokens.filter((t) => t.feature !== TokenFeature.LiquidityToken));
  }, [tokens]);

  useEffect(() => {
    setToOptions(fromOptions.filter((t) => from !== t));
  }, [from]);

  const updateQuote = useCallback(() => {
    //console.log(amount, pool?.poolToken.symbol, from?.symbol, to?.symbol, account);
    if (amount && pool && from && to) {
      setQuote(pool.quote(from, to, amount));
    } else {
      if (from && pool && to) pool.quote(from, to, 0);
      setQuote(0);
    }
  }, [amount, pool, from, to, account]);

  useEffect(updateQuote, [amount]);

  useEffect(() => {
    if (pool) {
      const off: Array<() => void> = [];
      off.push(pool.on('LiquidityChanged', updateQuote));
      off.push(pool.on('ReservesChanged', updateQuote));
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
      //setAmount(0);
    }
  }, [pools, from, to]);

  const onFromChanged = (symbol: string) => {
    if (!symbol) {
      setFrom(undefined);
      return;
    } else {
      const newFrom = tokens.find((t) => t.symbol === symbol);
      if (to === newFrom) {
        setTo(from);
        setAmount(quote);
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
    if (!from || !to || !pool) return;
    pool.buy(account, from, to, amount!);
  };

  const hasSufficientFunds = useMemo(() => {
    if (!from || !amount) return true;
    return amount <= from.balanceOf(account);
  }, [account, amount, from]);

  const fromUsdValue = useMemo(() => {
    if (!amount || !from) return '';
    const val = amount * from.marketPrice;
    return val;
  }, [amount, from]);

  const toUsdValue = useMemo(() => {
    if (!quote || !to) return '';
    const val = quote * to.marketPrice;
    return val;
  }, [quote, to]);

  const canSubmit = useMemo(() => {
    return pool && from && to && amount && amount > 0 && hasSufficientFunds;
  }, [amount, from, to, amount, hasSufficientFunds, pool]);

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
          footer={
            <Text color="gray.400" fontSize="small">
              {fromUsdValue ? `${currency(fromUsdValue, true)}` : <span>&nbsp;</span>}
            </Text>
          }
          isFirst>
          <FormControl id="amount" isInvalid={!hasSufficientFunds}>
            <InputGroup>
              <Input
                size="lg"
                placeholder="0.0"
                textAlign="right"
                step="0.00001"
                type="number"
                name="amount"
                value={amount}
                disabled={!from}
                onChange={setNumericalField(setAmount)}
              />
            </InputGroup>
          </FormControl>
        </TokenValueChooser>

        <TokenValueChooser
          onTokenChanged={onToChanged}
          tokens={toOptions}
          selected={to}
          footer={
            <Text color="gray.400" fontSize="small">
              {fromUsdValue && toUsdValue ? (
                `${currency(toUsdValue, true)} (${(-(
                  100 -
                  (100 * toUsdValue) / fromUsdValue
                )).toFixed(2)} %)`
              ) : (
                <span>&nbsp;</span>
              )}
            </Text>
          }>
          <Flex justifyContent="flex-end" width="100%" py={0} px={1}>
            <Text fontSize="lg">{quote?.toFixed(2)}</Text>
          </Flex>
        </TokenValueChooser>
        {from && to && !pool && (
          <Text color="red.300" align="right" pt={2} fontSize="sm">
            there&apos;s no {from.symbol}|{to.symbol} pool
          </Text>
        )}

        {pool && pool.feeRate > 0 && (
          <Text color="gray.500" align="right" fontSize="small" pt={2}>
            pool takes a {pool.feeRate * 100}% swap fee
            {from && amount && amount > 0 ? (
              <span> ({`${amount * pool.feeRate} ${from.symbol}`})</span>
            ) : (
              <span></span>
            )}
          </Text>
        )}

        {from && to && amount && quote ? (
          <>
            <Text color="gray.500" align="right" pt={2} fontSize="sm">
              1 {from.symbol} = {currency(quote / amount)} {to.symbol}
            </Text>
            <Text color="gray.500" align="right" pt={2} fontSize="sm">
              1 {to.symbol} = {currency(amount / quote)} {from.symbol}
            </Text>
          </>
        ) : (
          <>
            <Text pt={2} fontSize="sm">
              &nbsp;
            </Text>
            <Text pt={2} fontSize="sm">
              &nbsp;
            </Text>
          </>
        )}
      </Stack>

      <Button
        mt={3}
        size="lg"
        colorScheme="green"
        variant="solid"
        isFullWidth
        leftIcon={<SwapIcon color="white" />}
        disabled={!canSubmit}
        type="submit">
        Swap
      </Button>
    </Flex>
  );
}
