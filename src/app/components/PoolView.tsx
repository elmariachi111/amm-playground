import { Box, Heading, Text } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";

import { Pool, PoolInfo } from "../../lib/Pool";

const PoolView = ({ pool }: { pool: Pool }) => {
  const [poolInfo, setPoolInfo] = useState<PoolInfo>(pool.poolInfo());

  useEffect(() => {
    const off = pool.on("LiquidityChanged", (args) => {
      setPoolInfo(pool.poolInfo());
    });
    return () => {
      off();
    };
  }, [pool]);

  return (
    <Box>
      <Heading size="md">{pool.poolToken.name}</Heading>
      <Text overflowWrap="anywhere">Address: {pool.account} </Text>
      <Text>k: {poolInfo.k}</Text>
      <Text>Reserves</Text>
      <Text>
        {pool.token1.symbol}: {poolInfo.reserves[0]}{" "}
      </Text>
      <Text>
        {pool.token2.symbol}: {poolInfo.reserves[1]}{" "}
      </Text>
      <Text>Prices</Text>
      <Text>
        {pool.token1.symbol}/{pool.token2.symbol}: {poolInfo.prices[0]}
      </Text>
      <Text>
        {pool.token2.symbol}/{pool.token1.symbol}: {poolInfo.prices[1]}
      </Text>
    </Box>
  );
};

export { PoolView };
