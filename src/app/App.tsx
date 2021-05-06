import { Box, Container, Heading, SimpleGrid } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';

import { Pool } from '../lib/Pool';
import { Token } from '../lib/Token';
import Account from './components/Account';
import { Header } from './components/Header';
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

  useEffect(() => {
    setTokens([]);
    const adi = new Token('ADI', 'Addi');
    const bdy = new Token('BDY', 'Baddy');
    adi.mint(10000, 'stadolf');
    bdy.mint(10000, 'stadolf');
    addToken(adi);
    addToken(bdy);
    setAccounts(['stadolf', 'badolf']);

    const pool = new Pool('0xabcdefabcdef', adi, bdy);
    addPool(pool);

    pool.addLiquidity('stadolf', 1000, 500);
  }, []);

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
        <SimpleGrid columns={3} spacing={5} mt={5}>
          {tokens.map((t) => (
            <TokenView token={t} key={`token-${t.symbol}`} />
          ))}
          <NewToken onNew={addToken} />
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
            <SimpleGrid columns={3} spacing={5} mt={5}>
              {pools.map((p) => (
                <PoolView pool={p} key={`pool-${p.poolToken.symbol}`} />
              ))}
              <NewPool onCreated={addPool} tokens={tokens} />
            </SimpleGrid>
          </Box>
        )}
      </Container>
    </>
  );
}
