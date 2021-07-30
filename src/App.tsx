/// <reference types="react-vis-types" />

import 'react-vis/dist/style.css';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';

import { Container, Grid, GridItem, Heading, SimpleGrid } from '@chakra-ui/layout';
import { ChakraProvider } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { Header } from './components/atoms/Header';
import Intro from './components/atoms/Intro';
import Account from './components/molecules/Account';
import NewToken from './components/molecules/Tokens/NewToken';
import AMM from './components/organisms/AMM';
import { PoolView } from './components/organisms/PoolView';
import { TokenView } from './components/organisms/TokenView';
import { adaptCoin } from './lib/Coingecko';
import { Pool } from './lib/Pool';
import { Token } from './lib/Token';
import theme from './theme';
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

  const setSomeDefaults = async () => {
    setPools([]);
    const eth = await adaptCoin('eth');
    if (!eth) return;
    const dai = await adaptCoin('dai');
    if (!dai) return;

    eth.setMarketPrice(2000);
    dai.setMarketPrice(1);

    setTokens([eth, dai]);

    dai.mint(200000, 'alice');
    eth.mint(100, 'alice');

    dai.mint(10000, 'bob');
    eth.mint(10, 'bob');

    // const pool = new Pool('0xethdaipool', eth, dai, 1);
    // pool.addLiquidity('alice', 10, 2000 * 10);
    // addPool(pool);

    setAccounts(['alice', 'bob']);
  };

  useEffect(() => {
    setSomeDefaults();
    return () => {};
  }, []);

  const includeAccount = (acc: string) => {
    if (!accounts.includes(acc)) {
      const newAccounts = [...accounts, acc];

      const poolAccounts = newAccounts.filter((a) => a.startsWith('0x'));
      const eoaAccounts = newAccounts.filter((a) => !a.startsWith('0x')).sort();

      setAccounts([...eoaAccounts, ...poolAccounts]);
    }
  };

  useEffect(() => {
    const off = pools.flatMap((p) =>
      p.poolToken.on('Burnt', () => {
        if (p.poolToken.totalSupply < 1e-10) {
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
      t.on('Burnt', () => {
        if (t.totalSupply < 1e-10) {
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
    <ChakraProvider theme={theme}>
      <Header />
      <Intro setDefaults={setSomeDefaults} tokens={tokens} addToken={addToken} />
      <Container maxW="1800px" my={10} id="amm-app" minH="1200px">
        <Grid templateRows="min-content" templateColumns="repeat(12, 1fr)" gap={10}>
          <GridItem rowSpan={1} colSpan={{ xl: 3, md: 3 }}>
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
          <GridItem rowSpan={1} colSpan={{ xl: 7, md: 6 }}>
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
          <GridItem rowSpan={2} colSpan={{ xl: 2, md: 3 }}>
            <Heading size="xl" mb={3}>
              Tokens
            </Heading>
            {tokens.map((t) => (
              <TokenView token={t} key={`token-${t.symbol}`} />
            ))}
            {<NewToken onNew={addToken} />}
          </GridItem>
          {pools.length > 0 && (
            <GridItem colSpan={10} rowSpan={1} alignSelf="start">
              <Heading mt={5} mb={3}>
                Pools
              </Heading>
              <SimpleGrid columns={{ xl: 2, lg: 1 }} spacing={5} mt={5} align="start">
                {pools.map((p) => (
                  <PoolView pool={p} key={`pool-${p.poolToken.symbol}`} />
                ))}
              </SimpleGrid>
            </GridItem>
          )}
        </Grid>
      </Container>
      <Header />
    </ChakraProvider>
  );
}
