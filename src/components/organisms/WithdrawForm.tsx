import { Button } from '@chakra-ui/button';
import { Input, InputGroup, InputRightAddon } from '@chakra-ui/input';
import { Flex, Stack, Text } from '@chakra-ui/layout';
import { Radio, RadioGroup } from '@chakra-ui/radio';
import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ImExit } from 'react-icons/im';

import { Pool } from '../../lib/Pool';

const WithdrawAmount = ({
  pool,
  from,
  onShareChanged,
}: {
  pool: Pool;
  from: string;
  onShareChanged: (n: number) => void;
}) => {
  const [share, setShare] = useState<number>(100);

  const amtToWithdraw = useMemo(() => {
    if (share == 0 || share > 100) return;
    return (share / 100) * pool.poolToken.balanceOf(from);
  }, [share, pool]);

  return (
    <Flex direction="column" align="end">
      <Flex direction="row" align="center">
        <Input
          size="md"
          textAlign="right"
          type="number"
          step="0.1"
          px={2}
          height="auto"
          placeholder="100"
          value={share}
          onChange={(e) => {
            const val = e.target.valueAsNumber;
            console.log(val);
            setShare(val);
            onShareChanged(val);
          }}
          onBlur={() => {
            onShareChanged(share);
          }}
        />
        <Text>%</Text>
      </Flex>
      {amtToWithdraw && (
        <Text fontSize="xs">
          {amtToWithdraw.toFixed(2)} {pool.poolToken.symbol}
        </Text>
      )}
    </Flex>
  );
};

export default function WithdrawForm({ pools, from }: { pools: Pool[]; from: string }) {
  const [withdrawablePools, setWithdrawablePools] = useState<Pool[]>([]);
  const [selectedPool, selectPool] = useState<Pool | undefined | null>();
  const [shareToWithdraw, setShareToWithdraw] = useState<number>(100);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(shareToWithdraw);
    if (!selectedPool) {
      return;
    }
    const amtToWithdraw =
      (shareToWithdraw / 100) * selectedPool.poolToken.balanceOf(from);
    selectedPool.withdrawLiquidity(from, amtToWithdraw);
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
    return shareToWithdraw > 0 && shareToWithdraw <= 100;
  }, [from, selectedPool, shareToWithdraw]);

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
          selectPool(_pool);
          setShareToWithdraw(100);
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
                  onShareChanged={setShareToWithdraw}
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
