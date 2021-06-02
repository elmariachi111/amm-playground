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
    const off = tokens.flatMap((t) => [
      t.on('Minted', (e) => includeAccount(e.to)),
      t.on('Transferred', (e) => includeAccount(e.to)),
    ]);

    return () => {
      off.map((_off) => _off());
    };
  }, [tokens, includeAccount]);

  return (
    <>
      <Header />
      <Intro setDefaults={setSomeDefaults} />
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
