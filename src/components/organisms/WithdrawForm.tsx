import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Flex, Stack, Text } from '@chakra-ui/layout';
import { useRadio, UseRadioProps } from '@chakra-ui/radio';
import { Box, Icon, useColorModeValue, useRadioGroup } from '@chakra-ui/react';
import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ImRadioChecked2, ImRadioUnchecked } from 'react-icons/im';

import { Pool } from '../../lib/Pool';
import { WithdrawIcon } from './AMM/Icons';

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

  const bg = useColorModeValue('white', 'gray.700');
  const border = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box as="label">
      <input {...input} />
      <Flex
        {...checkbox}
        bg={bg}
        px={4}
        py={state.isChecked ? 4 : 6}
        borderRadius={4}
        border="1px solid"
        borderColor={border}
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

export default function WithdrawForm({
  pools,
  account,
}: {
  pools: Pool[];
  account: string;
}) {
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
      (shareToWithdraw / 100) * selectedPool.poolToken.balanceOf(account);
    selectedPool.withdrawLiquidity(account, amtToWithdraw);
  };

  const updatePools = useCallback(() => {
    const _withdrawablePools = pools.filter((p) => p.poolToken.balanceOf(account) > 0);
    if (_withdrawablePools.length === 0) {
      selectPool(undefined);
    }
    setWithdrawablePools(_withdrawablePools);
    const _bal: Record<string, number> = {};
    pools.forEach((p) => (_bal[p.poolToken.symbol] = p.poolToken.balanceOf(account)));
    setBalances(_bal);
  }, [pools, account]);

  useEffect(() => {
    selectPool(null);
    updatePools();
  }, [account]);

  useEffect(() => {
    const off = pools.flatMap((pool) => [
      pool.on('LiquidityChanged', updatePools),
      pool.on('ReservesChanged', updatePools),
    ]);
    return () => {
      off.map((_off) => _off());
    };
  }, [pools]);

  const canSubmit = useMemo(() => {
    console.log(selectedPool, shareToWithdraw, account);
    return selectedPool && shareToWithdraw > 0 && shareToWithdraw <= 100;
  }, [account, selectedPool, shareToWithdraw]);

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
                <Text>{pool.poolToken.balanceOf(account).toFixed(2)}</Text>
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
        leftIcon={<WithdrawIcon color="white" />}
        isDisabled={!canSubmit}
        type="submit">
        Withdraw
      </Button>
    </Flex>
  );
}
