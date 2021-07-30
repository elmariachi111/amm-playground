import { Button } from '@chakra-ui/button';
import { Flex, Stack } from '@chakra-ui/layout';
import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { Pool } from '../../lib/Pool';
import { WithdrawRadioCard } from '../molecules/WithdrawRadioCard';
import { WithdrawIcon } from './AMM/Icons';

interface WithdrawAction {
  percentage: number;
  pool: Pool;
}

export default function WithdrawForm({
  pools,
  account,
}: {
  pools: Pool[];
  account: string;
}) {
  const [withdrawablePools, setWithdrawablePools] = useState<Pool[]>([]);
  const [selectedPool, selectPool] = useState<Pool | undefined | null>();
  const [withdrawAction, setWithdrawAction] = useState<WithdrawAction | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!withdrawAction) {
      return;
    }
    const amtToWithdraw =
      (withdrawAction.percentage / 100) *
      withdrawAction.pool.poolToken.balanceOf(account);
    withdrawAction.pool.withdrawLiquidity(account, amtToWithdraw);
  };

  const updatePools = useCallback(() => {
    const _withdrawablePools = pools.filter((p) => p.poolToken.balanceOf(account) > 0);
    if (_withdrawablePools.length === 0) {
      selectPool(undefined);
    }

    setWithdrawablePools(_withdrawablePools);
  }, [pools, account]);

  // useEffect(() => {
  //   selectPool(null);
  //   updatePools();
  // }, [account]);

  useEffect(() => {
    updatePools();
    const off = pools.flatMap((pool) => [
      pool.on('LiquidityChanged', updatePools),
      pool.on('ReservesChanged', updatePools),
    ]);
    return () => {
      off.map((_off) => _off());
    };
  }, [pools, account]);

  const canSubmit = useMemo(() => {
    console.log(account, withdrawAction);
    return (
      withdrawAction && withdrawAction.percentage > 0 && withdrawAction.percentage <= 100
    );
  }, [account, withdrawAction]);

  const onPercentChanged = (perc: number) => {
    if (selectedPool) {
      setWithdrawAction({
        pool: selectedPool,
        percentage: perc,
      });
    } else {
      setWithdrawAction(null);
    }
  };

  return (
    <Flex direction="column" justify="space-between" h="100%" autoComplete="off">
      <Stack spacing={-1} direction="column">
        {withdrawablePools.map((pool) => {
          return (
            <WithdrawRadioCard
              key={`radio-${pool.poolToken.symbol}`}
              account={account}
              pool={pool}
              isSelected={selectedPool === pool}
              selectPool={(p: Pool) => {
                selectPool(p);
                setWithdrawAction({
                  pool: p,
                  percentage: 100,
                });
              }}
              onPercentChanged={onPercentChanged}
            />
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
        onClick={onSubmit}
        type="submit">
        Withdraw
      </Button>
    </Flex>
  );
}
