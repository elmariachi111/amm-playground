import { CloseButton } from '@chakra-ui/close-button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Container, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/layout';
import { Collapse } from '@chakra-ui/transition';
import React, { useEffect, useState } from 'react';

import { Pool } from '../lib/Pool';
import { Token } from '../lib/Token';
import Account from './components/Account';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import NewPool from './components/NewPool';
import NewToken from './components/NewToken';
import { PoolView } from './components/PoolView';
import { TokenView } from './components/TokenView';


export default function App() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [accounts, setAccounts] = useState<string[]>([]);
  const {isOpen, onClose} = useDisclosure({defaultIsOpen: true});

  const addToken = (token: Token) => {
    setTokens((old) => [...old, token]);
  };

  const addPool = (pool: Pool) => {
    addToken(pool.poolToken);
    setPools((old) => [...old, pool]);
  };

  useEffect(() => {
    setTokens([]);
    const dai = new Token('DAI', 'Dai');
    const eth = new Token('ETH', 'Eth');
    dai.mint(100_000, 'stadolf');
    eth.mint(1000, 'stadolf');
    dai.mint(1500000, 'baddi');
    eth.mint(1000, 'baddi');
    addToken(dai);
    addToken(eth);
    const pool = new Pool('0xabcdefabcdef', eth, dai);
    addPool(pool);
    //pool.addLiquidity('stadolf', 9000, 3);
    setAccounts(['stadolf', 'baddi', pool.account]);
    pool.addLiquidity('stadolf', 10, 3000 * 10);
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
        <Collapse  in={isOpen}>
        <Box rounded="xl" bg="gray.200" p={3} border="gray.300" position="relative">
          <CloseButton onClick={onClose} position="absolute" right={2} />
          <Text> This is all built in plain Typescript, no chain, no db involved.</Text>
          <Text>1. create some tokens ("DAI")</Text>
          <Text>2. Mint some tokens. Use real names as addresses (10 Eth -> "stadolf")</Text>
          <Text>3. Create a new pool using two tokens</Text>
          <Text>4. add Liquidity to the new pool</Text>
          <Text>5. swap one token for another using another user</Text>
        </Box>
        </Collapse>
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
            <VStack spacing={5} mt={5}>
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
