import { Button } from '@chakra-ui/button';
import { FormControl } from '@chakra-ui/form-control';
import { Input, InputGroup } from '@chakra-ui/input';
import { Flex, Stack, Text } from '@chakra-ui/layout';
import { Radio, RadioGroup } from '@chakra-ui/radio';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { BsDownload } from 'react-icons/bs';

import { Pool } from '../../lib/Pool';
import { Token } from '../../lib/Token';
import PfxVal from '../atoms/PfxVal';
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

  const [amt1, setAmt1] = useState(0);
  const [amt2, setAmt2] = useState(0);
  const [newPoolFee, setNewPoolFee] = useState<string>();

  const [pool, setPool] = useState<Pool>();
  const [bestPrice, setBestPrice] = useState({
    pool: 0,
    market: 0,
  });
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
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
  };

  useEffect(() => {
    setAmt1(0);
    setAmt2(0);
  }, [address]);
  useEffect(() => {
    const pool = pools.find((pool) => {
      if (pool.token1 == firstToken && pool.token2 == secondToken) return true;
      if (pool.token2 == firstToken && pool.token1 == secondToken) return true;
    });
    setPool(pool);
  }, [pools, firstToken, secondToken]);

  const updateAmount = (setter: (n: number) => void) => {
    return (amt: string) => {
      const newVal = parseFloat(amt) || 0;
      setter(newVal);
    };
  };

  const predictPriceFromMarket = async (token1: Token, token2: Token, amt: number) => {
    const marketPrices = await Promise.all([
      token1.fetchMarketPrice(),
      token2.fetchMarketPrice(),
    ]);
    if (marketPrices[0] === 0 || marketPrices[1] === 0) return NaN;
    return amt * (marketPrices[0] / marketPrices[1]);
  };

  const predictPriceFromPool = (pool: Pool, from: Token, amt: number) => {
    const pidx = pool.token1 === from ? 0 : 1;
    return pool.poolInfo().prices[pidx] * amt;
  };

  useEffect(() => {
    if (!secondToken) return;
    const updateBestPrice = async () => {
      if (firstToken) {
        const marketPrice = await predictPriceFromMarket(firstToken, secondToken, amt1);
        const _price = {
          pool: pool ? predictPriceFromPool(pool, firstToken, amt1) : 0,
          market: marketPrice,
        };
        setBestPrice(_price);
        setAmt2(pool ? _price.pool : _price.market);
      }
    };
    const off = pool
      ? [
          pool.on('LiquidityChanged', updateBestPrice),
          pool.on('ReservesChanged', updateBestPrice),
        ]
      : [];
    updateBestPrice();
    return () => {
      off.map((o) => o());
    };
  }, [pool, amt1, secondToken, firstToken]);

  const canSubmit = useMemo(() => {
    if (!firstToken || !secondToken) return false;
    if (amt1 == 0 || amt2 == 0) return false;

    if (amt1 <= firstToken.balanceOf(address) && amt2 <= secondToken.balanceOf(address))
      return true;
  }, [firstToken, secondToken, amt1, amt2]);

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
                border="none"
                size="lg"
                placeholder="0.0"
                textAlign="right"
                type="number"
                step="0.00001"
                name="amount"
                value={amt1}
                onChange={(e) => setAmt1(e.target.valueAsNumber)}
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
                border="none"
                size="lg"
                placeholder="0.0"
                textAlign="right"
                type="number"
                step="0.00001"
                name="amount"
                value={amt2}
                onChange={(e) => setAmt2(e.target.valueAsNumber)}
              />
            </InputGroup>
          </FormControl>
        </TokenValueChooser>
        <Stack direction="column" py={3}>
          {bestPrice.market > 0 && (
            <PfxVal
              onClick={() => setAmt2(bestPrice.market)}
              pfx="market"
              val={bestPrice.market}
              sfx={`${secondToken?.symbol}/${firstToken?.symbol}`}
            />
          )}
          {bestPrice.pool > 0 && (
            <PfxVal
              onClick={() => setAmt2(bestPrice.pool)}
              pfx="pool"
              val={bestPrice.pool}
              sfx={`${secondToken?.symbol}/${firstToken?.symbol}`}
            />
          )}
        </Stack>
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
