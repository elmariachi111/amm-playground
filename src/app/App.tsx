import { Box, Container, Heading, SimpleGrid } from "@chakra-ui/layout"
import React, { useCallback, useEffect, useState } from "react"
import { Token } from "../lib/Token"
import Account from "./components/Account"
import NewToken from "./components/NewToken"
import { TokenView } from "./components/TokenView"

export default function App() {
  
  const [tokens, setTokens] = useState<Token[]>([])

  const [accounts, setAccounts] = useState<string[]>([]);

  const addToken = (token: Token) => {
    setTokens(old => (
      [...old, token]
    ))
  }

  const includeAccount = useCallback((acc: string) => {
    if (!accounts.includes(acc)) {
      setAccounts(old => [...old, acc]);
    } 
  },[accounts])

  useEffect(() => {
    const off: Array<() => void> = []
   
    for (const t of tokens) {
      off.push(t.on("Minted", (e) => includeAccount(e.to) ));
      off.push(t.on("Transferred", (e) => includeAccount(e.to) ));
    }
    return () => {
      for (const _off of off) _off();
    }
  }, [tokens, includeAccount])

  return (
  <Container maxW="container.lg" mt={5}>
    <Heading size="xl">
      AMM Demo
    </Heading>
    <Heading size="lg">Tokens</Heading>
      <SimpleGrid columns={3} spacing={5} mt={5}>
        {tokens.map(t => <TokenView token={t} />)}
        <NewToken onNew={addToken} />
      </SimpleGrid>
    <Heading mt={5}>      Accounts    </Heading>
    <Box>
      {accounts.map(account => (
        <Account address={account} tokens={tokens} />
      ))}
    </Box>
  </Container>

  )
}