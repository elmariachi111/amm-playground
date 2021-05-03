import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Box, Heading, Text } from '@chakra-ui/layout';
import React, { FormEvent, useEffect, useState } from 'react'
import { Token } from '../../lib/Token';
import { setField } from '../helpers';

const TokenView = ({ token }: {token: Token}) => {
  
  const [toMint, setToMint] = useState(0);
  const [recipient, setRecipient] = useState<string>("");

  const [totalSupply, setTotalSupply] = useState<number>(token.totalSupply);

  useEffect(() => {
    const off = token.on("Minted", (args) => {
      setTotalSupply(token.totalSupply);
    })
    return () => {
      off();
    }
  }, [token])


  const mint = (e: FormEvent) => {
    e.preventDefault();
    token.mint(toMint, recipient);
  }

  return (
    <Box>
      <Heading size="md">{token.name}</Heading>
      <Text>Total Supply: {totalSupply}</Text>
      <Box mt={3}>
      <form onSubmit={mint} >
        <Heading size="md">Mint new {token.symbol}</Heading>
        <FormControl id="symbol">
          <FormLabel>Amount</FormLabel>
          <Input type="text" name="symbol" onChange={setField(
            (val: string) => {setToMint(parseInt(val))}
          )} />
          
        </FormControl>
        <FormControl id="name">
          <FormLabel>Recipient</FormLabel>
          
          <Input type="text" name="name" onChange={setField(setRecipient)} />
        </FormControl>
        <Box mt={3}>
          <Button  type="submit" colorScheme="linkedin">Mint {token.symbol}</Button>
        </Box>
      </form>
      </Box>
    </Box>
  )

}

export {TokenView}