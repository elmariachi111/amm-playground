import { Button } from '@chakra-ui/button';
import { FormControl } from '@chakra-ui/form-control';
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/input';
import { Box, Flex, Heading, HStack, Text } from '@chakra-ui/layout';
import React, { FormEvent, useEffect, useState } from 'react';
import { Token } from '../../lib/Token';
import { setField } from '../helpers';

function TransferForm({token, from, max}: {token?: Token, from: string, max: number}) {

  const [amount, setAmount] = useState<number>(0);
  const [to, setTo] = useState<string>("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("hää")
    token!.transfer(from, to, amount);
  }

  return <form onSubmit={onSubmit}>
    <HStack>
      <FormControl id="amount" >
        <InputGroup size="sm">
        <InputLeftAddon children={token?.symbol}  />
        <Input size="sm" type="number" name="amount" onChange={setField(
          (val: string) => {setAmount(parseInt(val))}
        )} />
        </InputGroup>
      </FormControl>
      <FormControl id="to">
        <InputGroup size="sm">
          <InputLeftAddon children="to"  />
          <Input size="sm" type="text" name="to" onChange={setField(setTo)}/>
        </InputGroup>
      </FormControl>
      <Button size="sm" disabled={!token} colorScheme="linkedin" px={10} type="submit">Transfer</Button>
    </HStack>
  </form>
}

export default function Account({address, tokens}: {
  address: string,
  tokens: Token[]
}) {

  const [balances, setBalances] = useState<Record<string, number>>({});
  const handleTokenEvent = (token: Token, evt?: any) => {
    console.log(evt);
    setBalances(old => {
      const ret = { ...old }
      ret[token.symbol] = token.balanceOf(address);
      return ret;
    })
  }

  useEffect(() => {
    const off: Array<() => void> = []
   
    for (const t of tokens) {
      off.push(t.on("Minted", (e) => handleTokenEvent(t, e) ));
      off.push(t.on("Transferred", (e) => handleTokenEvent(t, e) ));
      handleTokenEvent(t);
    }

    return () => {
      for (const _off of off) _off();
    }
  }, [tokens])

  return (<Box my={5}>
    <Heading size="md">{address}</Heading>
    {Object.keys(balances).map(k => (
      <Flex align="center" gridGap={3} my={2}>
        <Flex>
          <Text fontWeight="bold">{k}:</Text>
          <Text>{balances[k]}</Text>
        </Flex>
        <TransferForm 
          token={tokens.find(t => t.symbol === k)} 
          from={address} 
          max={balances[k]} />
      </Flex>
    ))}
  </Box>)
}
