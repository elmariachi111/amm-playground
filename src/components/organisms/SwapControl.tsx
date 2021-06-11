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
import { ImExit } from 'react-icons/im';
import { RiArrowLeftRightFill } from 'react-icons/ri';

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
  const [amount, setAmount] = useState<number | undefined>(0);
  const [quote, setQuote] = useState<number>(0);
  const [price, setPrice] = useState<number>();

  const [fromOptions, setFromOptions] = useState<Token[]>([]);
  const [toOptions, setToOptions] = useState<Token[]>([]);
  const [from, setFrom] = useState<Token>();
  const [to, setTo] = useState<Token>();
  const [pool, setPool] = useState<Pool>();
  const amtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFromOptions(tokens.filter((t) => t.feature !== TokenFeature.LiquidityToken));
  }, [tokens]);

  useEffect(() => {
    setToOptions(fromOptions.filter((t) => from !== t));
  }, [from]);

  const updateQuote = useCallback(() => {
    if (amount && pool && from && to) {
      setQuote(pool.quote(from, to, amount));
      setPrice(pool.price(from));
    } else {
      setQuote(0);
      setPrice(0);
    }
  }, [amount, pool]);

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
    }
  }, [pools, from, to]);

  const onFromChanged = (symbol: string) => {
    if (!symbol) {
      setFrom(undefined);
      setTo(undefined);
      setPool(undefined);
      setAmount(0);
      if (amtRef.current) {
        amtRef.current.value = '';
      }

      return;
    } else {
      const newFrom = tokens.find((t) => t.symbol === symbol);
      if (to === newFrom) {
        setTo(from);
        setAmount(quote);
        if (amtRef.current) {
          amtRef.current.value = quote.toString();
        }
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
    pool.buy(sender, from, to, amount!);
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
            <InputGroup alignItems="center">
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
              {from && (
                <Button
                  size="xs"
                  onClick={() => {
                    setAmount(from.balanceOf(sender));
                    if (amtRef.current) {
                      amtRef.current.value = from.balanceOf(sender).toString();
                    }
                  }}>
                  Max
                </Button>
              )}
            </InputGroup>
            <FormErrorMessage>not enough funds</FormErrorMessage>
          </FormControl>
        </TokenValueChooser>

        <TokenValueChooser onTokenChanged={onToChanged} tokens={toOptions} selected={to}>
          <InputGroup justifyContent="end" width="100%" p={3}>
            <Text fontSize="lg">{quote?.toFixed(2)}</Text>
          </InputGroup>
        </TokenValueChooser>

        {from && to && price && (
          <Text color="gray.500" align="right" pt={2}>
            1 {from.symbol} = {price.toFixed(4)} {to.symbol}{' '}
          </Text>
        )}

        {pool && pool.feeRate > 0 && (
          <Text color="gray.500" align="right">
            pool takes a {pool.feeRate * 100}% swap fee
            {amount && amount > 0 && from && (
              <Text fontSize="xs"> ({`${amount * pool.feeRate} ${from.symbol}`})</Text>
            )}
          </Text>
        )}

        {from && to && !pool && (
          <Text color="red.300" align="right" pt={2}>
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
        leftIcon={<RiArrowLeftRightFill />}
        disabled={!canSubmit}
        type="submit">
        Swap
      </Button>
    </Flex>
  );
}
