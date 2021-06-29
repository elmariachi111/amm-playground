import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Flex, Stack, Text } from '@chakra-ui/layout';
import { useRadio, UseRadioProps } from '@chakra-ui/radio';
import { Box, Icon, useRadioGroup } from '@chakra-ui/react';
import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ImExit, ImRadioChecked2, ImRadioUnchecked } from 'react-icons/im';

import { Pool } from '../../lib/Pool';

const WithdrawAmount = ({
  pool,
  share,
  balance,
  onShareChanged,
}: {
  pool: Pool;
  share: number;
  balance: number | undefined;
  onShareChanged: (n: number) => void;
}) => {
  useEffect(() => {}, [pool]);

  const amtToWithdraw = useMemo(() => {
    if (isNaN(share) || share == 0 || share > 100 || !balance) return '';
    const val = (share / 100) * balance;
    return `${val.toFixed(2)} ${pool.poolToken.symbol}`;
  }, [share, pool, balance]);

  return (
    <Flex direction="column" align="flex-end">
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
            onShareChanged(val);
          }}
          onBlur={() => {
            onShareChanged(share);
          }}
        />
        <Text>%</Text>
      </Flex>
      <Text fontSize="xs">{amtToWithdraw}</Text>
    </Flex>
  );
};

const WithdrawRadioCard = (props: UseRadioProps & { pool: Pool; children: any }) => {
  const { getInputProps, getCheckboxProps, state } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();
  const { pool, children } = props;

  return (
    <Box as="label">
      <input {...input} />
      <Flex
        {...checkbox}
        bg="white"
        px={4}
        py={state.isChecked ? 4 : 6}
        borderRadius={4}
        border="1px solid"
        borderColor="gray.200"
        justify="space-between"
        align="center">
        <Flex direction="row" align="center">
          <Icon
            as={state.isChecked ? ImRadioChecked2 : ImRadioUnchecked}
            color="green.500"
            boxSize={5}
            mr={3}
          />
          <Text>{pool.poolToken.symbol}</Text>
        </Flex>
        {children}
      </Flex>
    </Box>
  );
};

export default function WithdrawForm({ pools, from }: { pools: Pool[]; from: string }) {
  const [withdrawablePools, setWithdrawablePools] = useState<Pool[]>([]);
  const [selectedPool, selectPool] = useState<Pool | undefined | null>();
  const [shareToWithdraw, setShareToWithdraw] = useState<number>(100);
  const [balances, setBalances] = useState<Record<string, number>>({});

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'pool',
    defaultValue: undefined,
    onChange: (symbol) => {
      const _pool = withdrawablePools.find((p) => p.poolToken.symbol === symbol);
      if (!_pool) return;
      selectPool(_pool);
      setShareToWithdraw(100);
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPool) {
      return;
    }
    const amtToWithdraw =
      (shareToWithdraw / 100) * selectedPool.poolToken.balanceOf(from);
    selectedPool.withdrawLiquidity(from, amtToWithdraw);
  };

  const updatePools = useCallback(() => {
    setWithdrawablePools(pools.filter((p) => p.poolToken.balanceOf(from) > 0));
    const _bal: Record<string, number> = {};
    pools.forEach((p) => (_bal[p.poolToken.symbol] = p.poolToken.balanceOf(from)));
    setBalances(_bal);
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

  const group = getRootProps();

  return (
    <Flex
      as="form"
      direction="column"
      onSubmit={onSubmit}
      justify="space-between"
      h="100%"
      autoComplete="off">
      <Stack spacing={-1} direction="column" {...group}>
        {withdrawablePools.map((pool) => {
          const radio = getRadioProps({
            value: pool.poolToken.symbol,
          });
          return (
            <WithdrawRadioCard
              key={`radio-${pool.poolToken.symbol}`}
              pool={pool}
              {...radio}>
              {selectedPool === pool ? (
                <WithdrawAmount
                  pool={pool}
                  share={shareToWithdraw}
                  onShareChanged={setShareToWithdraw}
                  balance={balances[pool.poolToken.symbol]}
                />
              ) : (
                <Text>{pool.poolToken.balanceOf(from).toFixed(2)}</Text>
              )}
            </WithdrawRadioCard>
          );
        })}
      </Stack>

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
