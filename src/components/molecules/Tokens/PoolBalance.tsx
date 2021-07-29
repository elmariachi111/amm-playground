import { Flex, Text } from '@chakra-ui/layout';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/popover';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/progress';
import { Table, Tbody, Td, Thead, Tr } from '@chakra-ui/table';
import React, { useCallback, useEffect, useState } from 'react';

import { colorRange, currency } from '../../../helpers';
import { poolShares } from '../../../lib/computeUsdValue';
import { Pool } from '../../../lib/Pool';

interface ShareInfo {
  share: number;
  token1: number;
  token2: number;
  token1Usd: number;
  token2Usd: number;
}

const ShareTable = ({ pool, shareInfo }: { pool: Pool; shareInfo: ShareInfo }) => {
  return (
    <Table variant="striped" size="sm">
      <Thead>
        <Tr></Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>Share</Td>
          <Td>{currency(shareInfo.share)} %</Td>
        </Tr>
        <Tr>
          <Td>{pool.token1.symbol}</Td>
          <Td>{currency(shareInfo.token1)}</Td>
        </Tr>
        <Tr>
          <Td>{pool.token2.symbol}</Td>
          <Td>{currency(shareInfo.token2)}</Td>
        </Tr>
        <Tr>
          <Td>{pool.token1.symbol} val</Td>
          <Td>{currency(shareInfo.token1Usd, true)}</Td>
        </Tr>
        <Tr>
          <Td>{pool.token2.symbol} val</Td>
          <Td>{currency(shareInfo.token2Usd, true)}</Td>
        </Tr>
        <Tr>
          <Td>Total val</Td>
          <Td>{currency(shareInfo.token1Usd + shareInfo.token2Usd, true)}</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};
export default function PoolBalance({ address, pool }: { address: string; pool: Pool }) {
  const [balance, setBalance] = useState<number>(pool.poolToken.balanceOf(address));

  const [shareInfo, setShareInfo] = useState<ShareInfo>({
    share: 0,
    token1: 0,
    token2: 0,
    token1Usd: 0,
    token2Usd: 0,
  });

  const updateBalances = useCallback(() => {
    if (!pool) return;
    const newBalance = pool.poolToken.balanceOf(address);
    setBalance(newBalance);
    const _shares = poolShares(pool, address);

    const usdValues = [pool.token1.marketPrice, pool.token2.marketPrice];

    const newState = {
      share: 100 * (newBalance / pool.poolToken.totalSupply),
      token1: _shares[0],
      token2: _shares[1],
      token1Usd: _shares[0] * usdValues[0],
      token2Usd: _shares[1] * usdValues[1],
    };
    setShareInfo(newState);
  }, [pool.poolToken]);

  useEffect(() => {
    const off: Array<() => void> = [];
    off.push(pool.on('ReservesChanged', updateBalances));
    off.push(pool.on('LiquidityChanged', updateBalances));
    off.push(pool.token1.on('MarketPriceUpdated', updateBalances));
    off.push(pool.token2.on('MarketPriceUpdated', updateBalances));
    updateBalances();
    return () => {
      off.map((_off) => _off());
    };
  }, []);

  const tokenColor = colorRange(pool.poolToken.symbol)[0];

  return (
    <Popover closeOnBlur={true}>
      <PopoverTrigger>
        <Flex
          alignItems="center"
          mr={5}
          sx={{ cursor: 'pointer' }}
          className="pool-indicator">
          <CircularProgress
            sx={{
              transition: 'ease all .2s',
              '.pool-indicator:hover &': { transform: 'scale(1.2)' },
            }}
            value={shareInfo.share}
            color={tokenColor}
            capIsRound={false}
            size="2.8rem"
            mr={1}>
            <CircularProgressLabel>{shareInfo.share.toFixed(0)}%</CircularProgressLabel>
          </CircularProgress>

          <Flex direction="column">
            <Text fontWeight="medium" fontSize="sm">
              {currency(balance)}
            </Text>
            <Text color="gray.400" fontSize="xs">
              {pool.poolToken.symbol}
            </Text>
          </Flex>
        </Flex>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          Details of {address} {pool.poolToken.symbol} shares
        </PopoverHeader>
        <PopoverBody>
          <ShareTable shareInfo={shareInfo} pool={pool} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
