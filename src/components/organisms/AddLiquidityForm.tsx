import { Button } from '@chakra-ui/button';
import { FormControl, FormHelperText } from '@chakra-ui/form-control';
import { Input, InputGroup } from '@chakra-ui/input';
import { Flex, Stack, Text } from '@chakra-ui/layout';
import { Radio, RadioGroup } from '@chakra-ui/radio';
import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { BsDownload } from 'react-icons/bs';

import { setNumericalField } from '../../helpers';
import { predictMarketPrice } from '../../lib/computeUsdValue';
import { Pool } from '../../lib/Pool';
import { Token } from '../../lib/Token';
import TokenValueChooser from '../molecules/TokenValueChooser';

const predefinedFees: Record<string, number> = {
  '0': 0.0,
  '0.05': 0.05,
  '0.3': 0.3,
  '1': 1,
};

export default function AddLiquidityForm({
  address,
  tokens,
  pools,
  poolAdded,
}: {
  address: string;
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
      p.addLiquidity(address, amt1, amt2);
      poolAdded(p);
      setPool(p);
    } else {
      pool.addLiquidity(address, amt1, amt2);
    }
    updateBalances();
  };

  useEffect(() => {
    setAmt1(0);
    updateBalances();
  }, [address]);

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
      [firstToken?.symbol]: firstToken.balanceOf(address),
      [secondToken?.symbol]: secondToken.balanceOf(address),
    };
    setBalances(bal);
  }, [address, firstToken, secondToken]);

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
            setFirstToken((old) => {
              const newFirst = tokens.find((t) => t.symbol === symbol);
              if (secondToken?.symbol === symbol) {
                setSecondToken(old);
              }
              return newFirst;
            });
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
            setSecondToken((old) => {
              const newSecond = tokens.find((t) => t.symbol === symbol);
              if (firstToken?.symbol === symbol) {
                setFirstToken(old);
              }
              return newSecond;
            });
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
            {amt1 && amt1 > 0 && marketPrice != amt2 ? (
              <Text color="red.300">
                not choosing the market price may lead to an arbitrage opportunity.
              </Text>
            ) : (
              <></>
            )}
            {balanceWarning && <Text color="red.300">insufficient funds</Text>}
          </FormControl>
        </TokenValueChooser>
      </Stack>

      {createsNewPool && (
        <Flex direction="column">
          <Text color="gray.500" align="start" my={2}>
            choose a pool fee
          </Text>
          <RadioGroup onChange={setNewPoolFee} value={newPoolFee} defaultValue="0">
            <Stack direction="row" spacing={6}>
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
        leftIcon={<BsDownload />}
        type="submit">
        Mint Liquidity
      </Button>
    </Flex>
  );
}
