import { Container, Grid, GridItem, Heading, Link, SimpleGrid } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';

import { Header } from './components/atoms/Header';
import Intro from './components/atoms/Intro';
import Account from './components/molecules/Account';
import NewToken from './components/molecules/Tokens/NewToken';
import { TokenView } from './components/molecules/Tokens/TokenView';
import AMM from './components/organisms/AMM';
import CoinGeckoTokens from './components/organisms/CoinGeckoTokens';
import { PoolView } from './components/organisms/PoolView';
import { adaptCoin } from './lib/Coingecko';
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

  const setSomeDefaults = async () => {
    setPools([]);
    const eth = await adaptCoin('eth');
    if (!eth) return;
    eth.setMarketPrice(2000);
    const dai = await adaptCoin('dai');
    if (!dai) return;
    dai.setMarketPrice(1);

    setTokens([eth, dai]);

    dai.mint(200000, 'alice');
    eth.mint(100, 'alice');

    dai.mint(10000, 'bob');
    eth.mint(10, 'bob');

    // const pool = new Pool('0xethdaipool', eth, dai, 1);
    // pool.addLiquidity('alice', 10, 2000 * 10);
    // pool.addLiquidity('bob', 5, 2000 * 5);

    //dai.mint(10000, 'charlie');
    setAccounts(['alice', 'bob']);
    //addPool(pool);
  };

  const includeAccount = (acc: string) => {
    if (!accounts.includes(acc)) {
      setAccounts([...accounts, acc].sort((a) => (a.startsWith('0x') ? 1 : -1)));
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
    <>
      <Header />
      <Intro setDefaults={setSomeDefaults} tokens={tokens} addToken={addToken} />
      <Container maxW="1800px" my={10}>
        <Grid templateRows="min-content" templateColumns="repeat(12, 1fr)" gap={10}>
          <GridItem rowSpan={1} colSpan={3}>
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
          <GridItem rowSpan={1} colSpan={7}>
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
          <GridItem colSpan={2} rowSpan={2}>
            <Heading size="xl" mb={3}>
              Tokens
            </Heading>
            {tokens.map((t) => (
              <TokenView token={t} key={`token-${t.symbol}`} />
            ))}
            {<NewToken onNew={addToken} />}
            <Heading size="md" mt={16} whiteSpace="nowrap" textAlign="center">
              Adopt a token from
              <Link d="inline" isExternal href="https://www.coingecko.com/en" ml={1}>
                CoinGecko
              </Link>
            </Heading>
            {<CoinGeckoTokens onNew={addToken} tokens={tokens} />}
          </GridItem>
          {pools.length > 0 && (
            <GridItem colSpan={10} rowSpan={1} alignSelf="start">
              <Heading mt={5} mb={3}>
                Pools
              </Heading>
              <SimpleGrid columns={2} spacing={5} mt={5} align="start">
                {pools.map((p) => (
                  <PoolView pool={p} key={`pool-${p.poolToken.symbol}`} />
                ))}
              </SimpleGrid>
            </GridItem>
          )}
        </Grid>
      </Container>
      <Header />
    </>
  );
}
