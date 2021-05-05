import { Button } from "@chakra-ui/button";
import { FormControl } from "@chakra-ui/form-control";
import {
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from "@chakra-ui/input";
import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import React, { FormEvent, useEffect, useState } from "react";

import { Pool } from "../../lib/Pool";
import { Token } from "../../lib/Token";
import { setField } from "../helpers";

function TransferForm({
  token,
  from,
  max,
}: {
  token?: Token;
  from: string;
  max: number;
}) {
  const [amount, setAmount] = useState<number>(0);
  const [to, setTo] = useState<string>("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    token!.transfer(from, to, amount);
  };

  return (
    <form onSubmit={onSubmit}>
      <HStack>
        <FormControl id="amount">
          <InputGroup size="sm">
            <InputLeftAddon>{token?.symbol}</InputLeftAddon>
            <Input
              size="sm"
              type="number"
              name="amount"
              onChange={setField((val: string) => {
                setAmount(parseInt(val));
              })}
            />
          </InputGroup>
        </FormControl>
        <FormControl id="to">
          <InputGroup size="sm">
            <InputLeftAddon>to</InputLeftAddon>
            <Input size="sm" type="text" name="to" onChange={setField(setTo)} />
          </InputGroup>
        </FormControl>
        <Button
          size="sm"
          disabled={!token}
          colorScheme="linkedin"
          px={10}
          type="submit"
        >
          Transfer
        </Button>
      </HStack>
    </form>
  );
}

function AddLiquidityForm({
  address,
  pool,
}: {
  address: string;
  pool: Pool;
  balances: Record<string, number>;
}) {
  const [amt1, setAmt1] = useState(0);
  const [amt2, setAmt2] = useState(0);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    pool.addLiquidity(address, amt1, amt2);
  };

  return (
    <form onSubmit={onSubmit}>
      <HStack>
        <FormControl id="amount">
          <InputGroup size="sm">
            <InputLeftAddon>{pool.token1.symbol}</InputLeftAddon>
            <Input
              size="sm"
              type="number"
              name="amount1"
              onChange={setField((val: string) => {
                setAmt1(parseInt(val));
              })}
            />
          </InputGroup>
        </FormControl>
        <FormControl id="to">
          <InputGroup size="sm">
            <InputLeftAddon>{pool.token2.symbol}</InputLeftAddon>
            <Input
              size="sm"
              type="number"
              name="amount2"
              onChange={setField((val: string) => {
                setAmt2(parseInt(val));
              })}
            />
          </InputGroup>
        </FormControl>
        <Button size="sm" colorScheme="linkedin" px={10} type="submit">
          Add Liquidity
        </Button>
      </HStack>
    </form>
  );
}

function SwapControl({
  sender,
  pool,
  from,
  to,
}: {
  sender: string;
  pool: Pool;
  from: Token;
  to: Token;
}) {
  const [amount, setAmount] = useState<number>(0);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    pool.buy(sender, from, to, amount);
  };
  return (
    <form onSubmit={onSubmit}>
      <HStack>
        <Text>swap </Text>
        <FormControl id="amount">
          <InputGroup size="sm">
            <Input
              size="sm"
              type="number"
              name="amount"
              onChange={setField((val: string) => {
                setAmount(parseInt(val));
              })}
            />
            <InputRightAddon>{from.symbol} </InputRightAddon>
          </InputGroup>
        </FormControl>
        <Text whiteSpace="nowrap">to</Text>
        <Text>{pool.quote(from, to, amount)} </Text>
        <Text>{to.symbol}</Text>
        <Button size="sm" colorScheme="linkedin" px={10} type="submit">
          Swap
        </Button>
      </HStack>
    </form>
  );
}

export default function Account({
  address,
  tokens,
  pools,
}: {
  address: string;
  tokens: Token[];
  pools: Pool[];
}) {
  const [balances, setBalances] = useState<Record<string, number>>({});
  const handleTokenEvent = (token: Token, evt?: any) => {
    setBalances((old) => {
      const ret = { ...old };
      ret[token.symbol] = token.balanceOf(address);
      return ret;
    });
  };

  useEffect(() => {
    const off: Array<() => void> = [];

    for (const t of tokens) {
      off.push(t.on("Minted", (e) => handleTokenEvent(t, e)));
      off.push(t.on("Transferred", (e) => handleTokenEvent(t, e)));
      handleTokenEvent(t);
    }

    return () => {
      for (const _off of off) _off();
    };
  }, [tokens]);

  return (
    <Box my={5}>
      <Heading size="md">{address}</Heading>
      <Heading size="md">Balances</Heading>
      {Object.keys(balances).map((k) => (
        <Flex align="center" gridGap={3} my={2} key={`bal-${k}`}>
          <Flex>
            <Text fontWeight="bold">{k}:</Text>
            <Text>{balances[k]}</Text>
          </Flex>
          <TransferForm
            token={tokens.find((t) => t.symbol === k)}
            from={address}
            max={balances[k]}
          />
        </Flex>
      ))}
      <Heading size="md">Swap Tokens / Add Liquidity</Heading>
      {pools.map((pool) => (
        <>
          <AddLiquidityForm
            address={address}
            pool={pool}
            balances={balances}
            key={`liq-${pool.account}`}
          />
          <SwapControl
            sender={address}
            pool={pool}
            from={pool.token1}
            to={pool.token2}
            key={`swap-${pool.account}`}
          />
          <SwapControl
            sender={address}
            pool={pool}
            from={pool.token2}
            to={pool.token1}
            key={`swap-${pool.account}`}
          />
        </>
      ))}
    </Box>
  );
}
