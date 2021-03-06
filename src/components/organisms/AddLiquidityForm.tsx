import { Button } from '@chakra-ui/button';
import { FormControl } from '@chakra-ui/form-control';
import { Input, InputGroup } from '@chakra-ui/input';
import { Flex, Stack, Text } from '@chakra-ui/layout';
import { Radio, RadioGroup } from '@chakra-ui/radio';
import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { setNumericalField } from '../../helpers';
import { predictMarketPrice } from '../../lib/computeUsdValue';
import { Pool } from '../../lib/Pool';
import { Token } from '../../lib/Token';
import TokenValueChooser from '../molecules/TokenValueChooser';
import { DepositIcon } from './AMM/Icons';

const predefinedFees: Record<string, number> = {
  '0': 0.0,
  '0.05': 0.05,
  '0.3': 0.3,
  '1': 1,
};

export default function AddLiquidityForm({
  account,
  tokens,
  pools,
  poolAdded,
}: {
  account: string;
  tokens: Token[];
  pools: Pool[];
  poolAdded: (p: Pool) => void;
}) {
  const [firstToken, setFirstToken] = useState<Token>();
  const [secondToken, setSecondToken] = useState<Token>();
  const [balances, setBalances] = useState<{ [sym: string]: number }>({});

  const [amt1, setAmt1] = useState<number>();
  const [amt2, setAmt2] = useState<number>();
  const [marketPrice, setMarketPrice] = useState<number>();

  const [newPoolFee, setNewPoolFee] = useState<string>();
  const [pool, setPool] = useState<Pool>();
  const [balanceWarning, setBalanceWarning] = useState<string>();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!amt1 || !amt2) return;

    if (!pool) {
      const poolFee = predefinedFees[newPoolFee || '0'] || 0;
      const p = new Pool(
        `0x${firstToken?.symbol.toLowerCase()}${secondToken?.symbol.toLowerCase()}pool`,
        firstToken!,
        secondToken!,
        poolFee,
      );
      p.addLiquidity(account, amt1, amt2);
      poolAdded(p);
      setPool(p);
    } else {
      if (firstToken === pool.token1) {
        pool.addLiquidity(account, amt1, amt2);
      } else {
        pool.addLiquidity(account, amt2, amt1);
      }
    }
    updateBalances();
  };

  useEffect(() => {
    setAmt1(0);
    updateBalances();
  }, [account]);

  useEffect(() => {
    const pool = pools.find((pool) => {
      if (pool.token1 == firstToken && pool.token2 == secondToken) return true;
      if (pool.token2 == firstToken && pool.token1 == secondToken) return true;
    });
    setPool(pool);
  }, [pools, firstToken, secondToken]);

  useEffect(() => {
    if (!secondToken) return;

    const updateBestPrice = () => {
      if (firstToken) {
        if (firstToken !== secondToken && amt1) {
          const marketPrice = predictMarketPrice(firstToken, secondToken, amt1);
          setMarketPrice(marketPrice);
          setAmt2(marketPrice);
        } else {
          setAmt2(0);
        }
      }
    };

    const off = pool
      ? [
          pool.on('LiquidityChanged', updateBestPrice),
          pool.on('LiquidityChanged', updateBalances),
          pool.on('ReservesChanged', updateBestPrice),
          firstToken?.on('MarketPriceUpdated', updateBestPrice),
          secondToken?.on('MarketPriceUpdated', updateBestPrice),
        ]
      : [];

    updateBestPrice();
    return () => {
      off.map((o) => o && o());
    };
  }, [pool, amt1, firstToken, secondToken]);

  const updateBalances = useCallback(() => {
    if (!firstToken || !secondToken) return false;
    const bal = {
      [firstToken?.symbol]: firstToken.balanceOf(account),
      [secondToken?.symbol]: secondToken.balanceOf(account),
    };
    setBalances(bal);
  }, [account, firstToken, secondToken]);

  useEffect(() => {
    const off = [
      firstToken?.on('Minted', updateBalances),
      secondToken?.on('Minted', updateBalances),
    ];
    updateBalances();
    return () => {
      off.map((o) => o && o());
    };
  }, [firstToken, secondToken]);

  const canSubmit = useMemo(() => {
    if (!amt1 || !amt2 || !firstToken || !secondToken) {
      setBalanceWarning(undefined);
      return false;
    }

    if (amt1 <= balances[firstToken?.symbol] && amt2 <= balances[secondToken?.symbol]) {
      setBalanceWarning(undefined);
      return true;
    } else {
      setBalanceWarning('insufficient funds');
      return false;
    }
  }, [firstToken, secondToken, amt1, amt2, balances]);

  const createsNewPool = useMemo<boolean | undefined>(() => {
    return firstToken && secondToken && !pool;
  }, [firstToken, secondToken, pool]);

  return (
    <Flex
      direction="column"
      as="form"
      onSubmit={onSubmit}
      justify="space-between"
      h="100%"
      autoComplete="off">
      <Stack direction="column" spacing={-1}>
        <TokenValueChooser
          onTokenChanged={(symbol) => {
            setFirstToken(tokens.find((t) => t.symbol === symbol));
          }}
          tokens={tokens}
          selected={firstToken}
          isFirst>
          <FormControl id="amount1">
            <InputGroup>
              <Input
                size="lg"
                placeholder="0.0"
                textAlign="right"
                type="number"
                step="0.00001"
                name="amount"
                value={amt1}
                isInvalid={firstToken && balances[firstToken.symbol] < amt1!}
                onChange={setNumericalField(setAmt1)}
              />
            </InputGroup>
          </FormControl>
        </TokenValueChooser>

        <TokenValueChooser
          onTokenChanged={(symbol) => {
            setSecondToken(tokens.find((t) => t.symbol === symbol));
          }}
          tokens={tokens.filter((t) => t != firstToken)}
          selected={secondToken}>
          <FormControl id="amount2">
            <InputGroup>
              <Input
                size="lg"
                variant="outline"
                placeholder="0.0"
                textAlign="right"
                type="number"
                step="0.00001"
                name="amount"
                value={amt2}
                disabled={!secondToken}
                isInvalid={secondToken && balances[secondToken.symbol] < amt2!}
                onChange={setNumericalField(setAmt2)}
              />
            </InputGroup>
            {balanceWarning && (
              <Text color="red.300" fontSize="xs" align="right" my={1}>
                insufficient funds
              </Text>
            )}
          </FormControl>
        </TokenValueChooser>
        <Flex>
          {amt1 && amt1 > 0 && marketPrice != amt2 ? (
            <Text color="orange.400" fontSize="sm" align="right" mt={2}>
              not providing at market price leads to arbitrage opportunity.
            </Text>
          ) : (
            <></>
          )}
        </Flex>
      </Stack>

      {createsNewPool && (
        <Flex direction="column" mt={4}>
          <Text color="gray.500" align="start" mt={2}>
            choose a pool fee
          </Text>
          <RadioGroup
            onChange={setNewPoolFee}
            value={newPoolFee}
            defaultValue="0"
            colorScheme="green">
            <Stack direction="row" spacing={3} justify="space-between">
              {Object.keys(predefinedFees)
                .sort()
                .map((fee) => (
                  <Radio key={`np-fee-${fee}`} value={fee}>
                    <Text whiteSpace="nowrap">{`${fee} %`}</Text>
                  </Radio>
                ))}
            </Stack>
          </RadioGroup>
        </Flex>
      )}
      <Button
        mt={3}
        size="lg"
        colorScheme="green"
        variant="solid"
        isFullWidth
        isDisabled={!canSubmit}
        leftIcon={<DepositIcon color="white" />}
        type="submit">
        Mint Liquidity
      </Button>
    </Flex>
  );
}
