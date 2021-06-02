import { Button } from '@chakra-ui/button';
import { Flex, Stack, Text } from '@chakra-ui/layout';
import { Radio, RadioGroup } from '@chakra-ui/radio';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';

import { Pool } from '../../lib/Pool';

export default function RedeemForm({
  pools,
  from,
  onDone,
}: {
  pools: Pool[];
  from: string;
  onDone?: () => void;
}) {
  const [redeemablePools, setRedeemablePools] = useState<Pool[]>([]);
  const [selectedPool, selectPool] = useState<Pool>();

  const updatePools = useCallback(() => {
    const _pools = pools.filter((p) => p.poolToken.balanceOf(from) > 1);
    setRedeemablePools(_pools);
  }, [from, pools]);

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

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPool) {
      return;
    }

    const amount = selectedPool.poolToken.balanceOf(from);
    selectedPool.withdrawLiquidity(from, amount);
    onDone && onDone();
  };

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
          selectPool(redeemablePools.find((p) => p.poolToken.symbol === symbol));
        }}
        value={selectedPool?.poolToken.symbol}>
        <Stack spacing={5} direction="column">
          {redeemablePools.map((pool) => (
            <Flex
              bg="white"
              p={2}
              py={4}
              border="1px solid"
              borderColor="gray.200"
              justify="space-between"
              align="center"
              key={`radio-${pool.poolToken.symbol}`}>
              <Radio size="lg" value={pool.poolToken.symbol}>
                <Text>{pool.poolToken.symbol}</Text>
              </Radio>
              <Text>{pool.poolToken.balanceOf(from).toFixed(2)}</Text>
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
        isDisabled={!selectedPool}
        type="submit">
        Redeem
      </Button>
    </Flex>
  );
}
