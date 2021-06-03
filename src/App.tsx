import { Box, Container, Grid, GridItem, Heading, SimpleGrid } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';

import { Header } from './components/atoms/Header';
import Intro from './components/atoms/Intro';
import Account from './components/molecules/Account';
import NewToken from './components/molecules/Tokens/NewToken';
import { TokenView } from './components/molecules/Tokens/TokenView';
import AMM from './components/organisms/AMM';
import { PoolView } from './components/organisms/PoolView';
import { Pool } from './lib/Pool';
import { Token } from './lib/Token';

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

  const removePool = (pool: Pool) => {
    const poolSymbol = pool.poolToken.symbol;
    setTokens((old) => old.filter((o) => o.symbol !== poolSymbol));
    setPools((old) => old.filter((o) => o.poolToken.symbol !== poolSymbol));
  };

  const setSomeDefaults = () => {
    setPools([]);
    const eth = new Token('ETH', 'Eth');
    const dai = new Token('DAI', 'Dai');
    setTokens([eth, dai]);

    dai.mint(1_000_000, 'alice');
    eth.mint(1000, 'alice');

    dai.mint(1_000_000, 'bob');
    eth.mint(1000, 'bob');

    const pool = new Pool('0xethdaipool', eth, dai, 0.3);
    pool.addLiquidity('alice', 10, 3000 * 10);
    setAccounts(['alice', 'bob', '0xethdaipool']); //pool.account
    addPool(pool);
  };

  const includeAccount = (acc: string) => {
    if (!accounts.includes(acc)) {
      setAccounts([...accounts, acc].sort((a, b) => (a.startsWith('0x') ? 1 : -1)));
    }
  };

  useEffect(() => {
    const eth = new Token('ETH', 'Eth');
    setTokens([eth]);
  }, []);

  useEffect(() => {
    const off = pools.flatMap((p) =>
      p.poolToken.on('Burnt', () => {
        if (p.poolToken.totalSupply === 0) {
          console.log('pool removed');
          setPools((old) => old.filter((o) => o.poolToken !== p.poolToken));
        }
      }),
    );
    return () => {
      off.map((_off) => _off());
    };
  }, [pools]);

  useEffect(() => {
    const off = tokens.flatMap((t) => [
      t.on('Minted', (e) => includeAccount(e.to)),
      t.on('Transferred', (e) => includeAccount(e.to)),
      t.on('Burnt', (e) => {
        if (t.totalSupply === 0) {
          console.log('removing token after burn');
          setTokens((old) => old.filter((o) => o.symbol != t.symbol));
        }
      }),
    ]);

    return () => {
      off.map((_off) => _off());
    };
  }, [tokens, includeAccount]);

  return (
    <>
      <Header />
      <Intro setDefaults={setSomeDefaults} tokens={tokens} addToken={addToken} />
      <Container maxW="1800px" my={5}>
        {/*<SimpleGrid py={8} columns={4} spacing={8} minChildWidth="460px">*/}
        <Grid templateColumns="repeat(12, 1fr)" gap={10}>
          <GridItem colSpan={3}>
            <Heading size="xl" mb={4}>
              Accounts
            </Heading>

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
          <GridItem colSpan={7}>
            <Heading size="xl" mb={3}>
              Interact
            </Heading>
            <AMM
              account={selectedAccount}
              tokens={tokens}
              pools={pools}
              poolAdded={addPool}
            />
          </GridItem>
          <GridItem colSpan={2}>
            <Heading size="xl" mb={3}>
              Tokens
            </Heading>
            {tokens.map((t) => (
              <TokenView token={t} key={`token-${t.symbol}`} />
            ))}
            {<NewToken onNew={addToken} />}
          </GridItem>
        </Grid>

        {tokens.length >= 2 && (
          <Box>
            <Heading mt={5} mb={3}>
              Pools
            </Heading>
            <SimpleGrid columns={2} spacing={5} mt={5} align="start">
              {pools.map((p) => (
                <PoolView pool={p} key={`pool-${p.poolToken.symbol}`} />
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Container>
      <Header />
    </>
  );
}
