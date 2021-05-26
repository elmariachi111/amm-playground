import { Button } from '@chakra-ui/button';
import { FormControl } from '@chakra-ui/form-control';
import { Input, InputGroup } from '@chakra-ui/input';
import { Box, Flex, Text } from '@chakra-ui/layout';
import React, { FormEvent, useEffect, useState } from 'react';

import { Pool } from '../../../lib/Pool';
import { Token } from '../../../lib/Token';
import { setField, sha256hash } from '../../helpers';
import TokenValueChooser from '../molecules/TokenValueChooser';

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

  const [pool, setPool] = useState<Pool>();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pool) {
      const poolAddress = await sha256hash(firstToken!.symbol + secondToken!.symbol);
      const p = new Pool(`0x${poolAddress}`, firstToken!, secondToken!, 0);
      p.addLiquidity(address, amt1, amt2);
      poolAdded(p);
      setPool(p);
    } else {
      pool.addLiquidity(address, amt1, amt2);
    }
  };

  useEffect(() => {
    const pool = pools.find((pool) => {
      if (pool.token1 == firstToken && pool.token2 == secondToken) return true;
      if (pool.token2 == firstToken && pool.token1 == secondToken) return true;
    });
    setPool(pool);
  }, [firstToken, secondToken]);

  const updateAmount = (setter: (n: number) => void) => {
    return (amt: string) => {
      const newVal = parseFloat(amt) || 0;
      setter(newVal);
    };
  };
  return (
    <Flex
      direction="column"
      as="form"
      onSubmit={onSubmit}
      justify="space-between"
      h="100%"
      autoComplete="off">
      <Flex direction="column">
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
                type="text"
                name="amount"
                value={amt1}
                onChange={setField(updateAmount(setAmt1))}
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
                type="text"
                name="amount"
                value={amt2}
                onChange={setField(updateAmount(setAmt2))}
              />
            </InputGroup>
          </FormControl>
        </TokenValueChooser>
        <Text color="gray.500" align="right" my={2}>
          {pool && pool.poolToken.symbol}
          {firstToken && secondToken && !pool && <Text>creates a new pool</Text>}
        </Text>
      </Flex>

      <Button
        mt={3}
        size="lg"
        colorScheme="green"
        variant="solid"
        isFullWidth
        isDisabled={firstToken === undefined || secondToken === undefined}
        type="submit">
        Mint Liquidity
      </Button>
    </Flex>
  );
}
