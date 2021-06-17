import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Flex, Stack, Text } from '@chakra-ui/layout';
import { Radio, RadioGroup } from '@chakra-ui/radio';
import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ImExit } from 'react-icons/im';

import { Pool } from '../../lib/Pool';

const WithdrawAmount = ({
  pool,
  from,
  onAmountChanged,
}: {
  pool: Pool;
  from: string;
  onAmountChanged: (n: number) => void;
}) => {
  const [amount, setAmount] = useState<number>(pool.poolToken.balanceOf(from));

  return (
    <Flex direction="column" align="end">
      <Input
        border="none"
        size="md"
        textAlign="right"
        type="number"
        step="0.00001"
        placeholder="0.0"
        p={1}
        pl={2}
        onChange={(e) => {
          const val = e.target.valueAsNumber;
          setAmount(val);
          onAmountChanged(val);
        }}
        value={amount}
      />
    </Flex>
  );
};

export default function WithdrawForm({ pools, from }: { pools: Pool[]; from: string }) {
  const [withdrawablePools, setWithdrawablePools] = useState<Pool[]>([]);
  const [selectedPool, selectPool] = useState<Pool | undefined | null>();
  const [amountToWithdraw, setAmountToWithdraw] = useState<number>(0);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPool) {
      return;
    }

    selectedPool.withdrawLiquidity(from, amountToWithdraw);
  };

  const updatePools = useCallback(() => {
    setWithdrawablePools(pools.filter((p) => p.poolToken.balanceOf(from) > 0));
    selectPool(null);
  }, [pools, from]);

  useEffect(() => {
    updatePools();
    const off = pools.flatMap((pool) => [
      pool.on('LiquidityChanged', updatePools),
      pool.on('ReservesChanged', updatePools),
    ]);
    return () => {
      off.map((_off) => _off());
    };
  }, [pools, from]);

  const canSubmit = useMemo(() => {
    if (!selectedPool) return false;
    return amountToWithdraw <= selectedPool.poolToken.balanceOf(from);
  }, [from, selectedPool, amountToWithdraw]);

  return (
    <Flex
      as="form"
      direction="column"
      onSubmit={onSubmit}
      justify="space-between"
      h="100%"
      autoComplete="off">
      <RadioGroup
        colorScheme="green"
        onChange={(symbol) => {
          const _pool = withdrawablePools.find((p) => p.poolToken.symbol === symbol);
          if (!_pool) return;
          setAmountToWithdraw(_pool.poolToken.balanceOf(from));
          selectPool(_pool);
        }}
        value={selectedPool ? selectedPool.poolToken.symbol : undefined}>
        <Stack spacing={-1} direction="column">
          {withdrawablePools.map((pool) => (
            <Flex
              bg="white"
              p={4}
              borderRadius={4}
              border="1px solid"
              borderColor="gray.200"
              justify="space-between"
              align="center"
              onClick={() => selectPool(pool)}
              key={`radio-${pool.poolToken.symbol}`}>
              <Radio size="lg" value={pool.poolToken.symbol}>
                <Text>{pool.poolToken.symbol}</Text>
              </Radio>
              {pool === selectedPool ? (
                <WithdrawAmount
                  from={from}
                  pool={pool}
                  onAmountChanged={setAmountToWithdraw}
                />
              ) : (
                <Text>{pool.poolToken.balanceOf(from).toFixed(2)}</Text>
              )}
            </Flex>
          ))}
        </Stack>
      </RadioGroup>
      <Button
        mt={3}
        size="lg"
        colorScheme="green"
        variant="solid"
        isFullWidth
        leftIcon={<ImExit />}
        isDisabled={!canSubmit}
        type="submit">
        Withdraw
      </Button>
    </Flex>
  );
}
