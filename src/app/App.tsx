import { Box, Container, Heading, SimpleGrid, VStack } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';

import { Pool } from '../lib/Pool';
import { Token } from '../lib/Token';
import Account from './components/Account';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import Intro from './components/Intro';
import NewPool from './components/NewPool';
import NewToken from './components/NewToken';
import { PoolView } from './components/PoolView';
import { TokenView } from './components/TokenView';

export default function App() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [accounts, setAccounts] = useState<string[]>([]);

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
      <Container maxW="container.lg" mt={5}>
        <Intro setDefaults={setSomeDefaults} />
        <SimpleGrid minChildWidth="250px" spacing={5} mt={5}>
          {tokens.map((t) => (
            <TokenView token={t} key={`token-${t.symbol}`} />
          ))}
          {<NewToken onNew={addToken} />}
        </SimpleGrid>

        <Heading mt={5}>Accounts</Heading>
        <Box>
          {accounts.map((account) => (
            <Account
              address={account}
              tokens={tokens}
              pools={pools}
              key={`acc-${account}`}
            />
          ))}
        </Box>
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
      <Footer />
    </>
  );
}
