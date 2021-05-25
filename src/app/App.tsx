import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
} from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';

import { Pool } from '../lib/Pool';
import { Token } from '../lib/Token';
import { Header } from './components/atoms/Header';
import Intro from './components/atoms/Intro';
import { Footer } from './components/Footer';
import Account from './components/molecules/Account';
import NewToken from './components/molecules/Tokens/NewToken';
import { TokenView } from './components/molecules/Tokens/TokenView';
import NewPool from './components/NewPool';
import AMM from './components/organisms/AMM';
import { PoolView } from './components/PoolView';

export default function App() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>();

  const addToken = (token: Token) => {
    setTokens((old) => [...old, token]);
  };

  const addPool = (pool: Pool) => {
    addToken(pool.poolToken);
    setPools((old) => [...old, pool]);
  };

  const setSomeDefaults = () => {
    const eth = new Token('ETH', 'Eth');
    setTokens([]);
    addToken(eth);

    const dai = new Token('DAI', 'Dai');
    dai.mint(1_000_000, 'alice');
    eth.mint(1000, 'alice');
    dai.mint(1_000_000, 'bob');
    eth.mint(1000, 'bob');
    addToken(dai);
    setAccounts(['alice', 'bob']); //pool.account
    const pool = new Pool('0xethdaipool', eth, dai, 0.3);
    pool.addLiquidity('alice', 10, 3000 * 10);
    addPool(pool);
  };
  const includeAccount = (acc: string) => {
    if (!accounts.includes(acc)) {
      setAccounts([...accounts, acc]);
    }
  };

  useEffect(() => {
    const off: Array<() => void> = [];
    for (const t of tokens) {
      off.push(t.on('Minted', (e) => includeAccount(e.to)));
      off.push(t.on('Transferred', (e) => includeAccount(e.to)));
    }
    return () => {
      for (const _off of off) _off();
    };
  }, [tokens, includeAccount]);

  return (
    <>
      <Header />
      <Intro setDefaults={setSomeDefaults} />
      <Container maxW="1800px" mt={5}>
        <Grid py={8} templateColumns="repeat(4, 1fr)" gridGap={12}>
          <GridItem colSpan={1} overflow="hidden">
            <Heading size="xl">Accounts</Heading>

            {accounts.map((account) => (
              <Account
                address={account}
                tokens={tokens}
                pools={pools}
                key={`acc-${account}`}
                selected={account === selectedAccount}
                onSelect={setSelectedAccount}
              />
            ))}
          </GridItem>
          <GridItem colSpan={2}>
            <Heading size="xl">Interact</Heading>
            <AMM
              account={selectedAccount}
              tokens={tokens}
              pools={pools}
              poolAdded={addPool}
            />
          </GridItem>
          <GridItem colSpan={1}>
            <Heading size="xl">Tokens</Heading>
            {tokens.map((t) => (
              <TokenView token={t} key={`token-${t.symbol}`} />
            ))}
            {<NewToken onNew={addToken} />}
          </GridItem>
        </Grid>

        {tokens.length >= 2 && (
          <Box>
            <Heading mt={5}>Pools</Heading>
            <VStack spacing={5} mt={5} align="start">
              {pools.map((p) => (
                <PoolView pool={p} key={`pool-${p.poolToken.symbol}`} />
              ))}
              <NewPool onCreated={addPool} tokens={tokens} />
            </VStack>
          </Box>
        )}
      </Container>
      <Header />
    </>
  );
}
