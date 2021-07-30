import { Input } from '@chakra-ui/input';
import { Flex, Text } from '@chakra-ui/layout';
import { Icon, useColorModeValue } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ImRadioChecked2, ImRadioUnchecked } from 'react-icons/im';

import { currency, setNumericalField } from '../../helpers';
import { Pool, PoolEvents } from '../../lib/Pool';

const WithdrawAmount = ({
  pool,
  balance,
  onPercentChanged,
}: {
  pool: Pool;
  balance: number;
  onPercentChanged: (perc: number) => void;
}) => {
  const [percent, setPercent] = useState<number | undefined>(100);

  const amtToWithdraw = useMemo(() => {
    if (!percent || isNaN(percent) || percent == 0 || percent > 100 || !balance)
      return '';

    const val = (percent / 100) * balance;
    return `${currency(val)} ${pool.poolToken.symbol}`;
  }, [percent, balance]);

  return (
    <Flex direction="column" align="flex-end">
      <Flex direction="row" align="center">
        <Input
          id="percent"
          name="percent"
          size="md"
          textAlign="right"
          type="number"
          step="0.1"
          px={2}
          height="auto"
          placeholder="100"
          value={percent}
          onChange={(e) => {
            const val = setNumericalField(setPercent)(e);
            onPercentChanged(val);
          }}
        />
        <Text>%</Text>
      </Flex>
      <Text fontSize="xs" whiteSpace="nowrap" color="gray.400">
        {amtToWithdraw}
      </Text>
    </Flex>
  );
};

export const WithdrawRadioCard = ({
  pool,
  account,
  onPercentChanged,
  selectPool,
  isSelected,
}: {
  pool: Pool;
  account: string;
  selectPool: (pool: Pool) => void;
  onPercentChanged: (perc: number) => void;
  isSelected: boolean;
}) => {
  const bg = useColorModeValue('white', 'gray.700');
  const border = useColorModeValue('gray.200', 'gray.700');
  const [balance, setBalance] = useState<number>();

  const updateBalance = useCallback(() => {
    setBalance(pool.poolToken.balanceOf(account));
  }, [account]);

  useEffect(() => {
    updateBalance();
    const off = ['LiquidityChanged', 'ReservesChanged'].map((e) =>
      pool.on(e as keyof PoolEvents, updateBalance),
    );
    return () => {
      off.map((_off) => _off());
    };
  }, [account]);

  return (
    <Flex
      onClick={() => selectPool(pool)}
      bg={bg}
      px={4}
      py={isSelected ? 4 : 6}
      borderRadius={4}
      border="1px solid"
      borderColor={border}
      justify="space-between"
      align="flex-start">
      <Flex direction="row" align="center">
        <Icon
          as={isSelected ? ImRadioChecked2 : ImRadioUnchecked}
          color="green.500"
          boxSize={5}
          mr={3}
        />
        <Text>{pool.poolToken.symbol}</Text>
      </Flex>
      {isSelected && balance ? (
        <WithdrawAmount
          pool={pool}
          balance={balance}
          onPercentChanged={onPercentChanged}
        />
      ) : (
        <Text>{currency(balance)}</Text>
      )}
    </Flex>
  );
};
