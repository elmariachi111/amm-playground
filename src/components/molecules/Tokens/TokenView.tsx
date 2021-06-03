import { IconButton } from '@chakra-ui/button';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Flex, Text } from '@chakra-ui/layout';
import React, { FormEvent, useEffect, useState } from 'react';
import { HiArrowRight } from 'react-icons/hi';

import { colorRange, setField } from '../../../helpers';
import { Token, TokenFeature } from '../../../lib/Token';
import TokenSymbol from '../../atoms/TokenSymbol';

const MintForm = ({ token }: { token: Token }) => {
  const [toMint, setToMint] = useState(0);
  const [recipient, setRecipient] = useState<string>('');

  const mint = (e: FormEvent) => {
    e.preventDefault();
    token.mint(toMint, recipient);
  };
  const inputBg = useColorModeValue('white', 'gray.800');

  return (
    <form onSubmit={mint} autoComplete="off">
      <Flex px={3} py={2} alignItems="center" gridGap={2}>
        <Text>Mint</Text>
        <FormControl id="symbol">
          <Input
            size="sm"
            type="text"
            name="symbol"
            variant="flushed"
            placeholder="Amount"
            bg={inputBg}
            onChange={setField((val: string) => {
              setToMint(parseInt(val));
            })}
          />
        </FormControl>
        <Text>to</Text>
        <FormControl id="name">
          <Input
            type="text"
            size="sm"
            name="name"
            variant="flushed"
            placeholder="recipient"
            bg={inputBg}
            onChange={setField(setRecipient)}
          />
        </FormControl>
        <IconButton
          colorScheme="green"
          size="sm"
          variant="link"
          type="submit"
          aria-label="Submit"
          icon={<HiArrowRight />}
        />
      </Flex>
    </form>
  );
};

const TokenView = ({ token }: { token: Token }) => {
  const [totalSupply, setTotalSupply] = useState<number>(token.totalSupply);

  useEffect(() => {
    const off = [
      token.on('Minted', (args) => {
        setTotalSupply(token.totalSupply);
      }),
      token.on('Burnt', (args) => {
        setTotalSupply(token.totalSupply);
      }),
    ];

    return () => {
      off.map((_off) => _off());
    };
  }, [token]);

  const bgColor = useColorModeValue('twitter.100', 'twitter.800');
  const headerBg = useColorModeValue('linkedin.200', 'linkedin.600');

  const tokenColor = colorRange(token.symbol)[0];

  return (
    <Flex
      borderRadius={8}
      mb={3}
      width="100%"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden">
      <Flex backgroundColor={tokenColor} width="5px"></Flex>
      <Flex direction="column" width="100%">
        <Flex p={3} align="center" justifyContent="space-between" bg="gray.100">
          <Flex align="center">
            <TokenSymbol symbol={token.symbol} size={15} />
            <Text fontSize="xl" fontWeight="normal" maxW="400px" ml={2}>
              {token.symbol}
            </Text>
          </Flex>
          <Flex gridGap={1} align="center" fontSize="sm">
            <Text color="gray.400" textTransform="uppercase" fontWeight="bold">
              Supply
            </Text>
            <Text>{totalSupply.toFixed(2)}</Text>
          </Flex>
        </Flex>
        {token.feature !== TokenFeature.LiquidityToken && (
          <Flex bgColor="white" p={3} borderBottomRadius={4}>
            <MintForm token={token} />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export { TokenView };
