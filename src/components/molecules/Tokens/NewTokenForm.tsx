import { IconButton } from '@chakra-ui/button';
import { FormControl } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Flex, Text } from '@chakra-ui/layout';
import { useColorModeValue } from '@chakra-ui/react';
import React, { FormEvent, useState } from 'react';
import { HiArrowRight } from 'react-icons/hi';

import { colorRange, setField, setNumericalField } from '../../../helpers';
import { default as coingeckoApi, DEFAULT_SYMBOLS } from '../../../lib/Coingecko';
import { Token } from '../../../lib/Token';
import { CoinInfo } from '../../../types/Coingecko';
import TokenSymbol from '../../atoms/TokenSymbol';

const NewTokenForm = ({ onNew }: { onNew: (t: Token) => void }) => {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [usdPrice, setUsdPrice] = useState<number | undefined>();
  const [coinInfo, setCoinInfo] = useState<CoinInfo | undefined>();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const token = coinInfo ? Token.fromCoinInfo(coinInfo) : new Token(symbol, name);
    if (usdPrice) {
      token.marketPrice = usdPrice;
    }
    onNew(token);
  };
  const tryFetchCoingeckoInfo = async (symbol: string) => {
    const known = DEFAULT_SYMBOLS.find((s) => s.symbol === symbol.toLowerCase());
    if (known) {
      return fetchCoingeckoInfo(symbol);
    }
  };
  const fetchCoingeckoInfo = async (symbol: string) => {
    if (!symbol) return;
    const ci = await coingeckoApi.fetchCoinInfo(symbol);
    if (!ci) return;
    const price = await coingeckoApi.getUSDCoinPrice(ci.id);
    setCoinInfo(ci);
    setSymbol(ci.symbol.toUpperCase());
    setName(ci.name);
    setUsdPrice(price);
  };
  const border = useColorModeValue('gray.200', 'gray.700');
  const bg = useColorModeValue('white', 'gray.600');
  const inputBg = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('gray.100', 'gray.500');

  const tokenColor = colorRange(symbol)[0];

  return (
    <Flex
      rounded="md"
      mb={3}
      width="100%"
      boxShadow="sm"
      border="1px solid"
      borderColor={border}
      overflow="hidden">
      <Flex backgroundColor={tokenColor} width="5px"></Flex>
      <Flex direction="column" width="100%">
        <Flex p={2} align="center" bg={headerBg}>
          <TokenSymbol coinInfo={coinInfo} symbol={symbol} size={15} />
          <Text fontSize="lg" fontWeight="normal" maxW="400px" ml={2}>
            {symbol}
          </Text>
        </Flex>
        <Flex p={1} bgColor={bg}>
          <Flex
            as="form"
            onSubmit={onSubmit}
            autoComplete="off"
            direction="row"
            p={2}
            align="baseline"
            gridGap={4}>
            <FormControl id="symbol">
              <Input
                size="sm"
                variant="flushed"
                type="text"
                name="symbol"
                placeholder="Symbol"
                value={symbol}
                bg={inputBg}
                onBlur={() => fetchCoingeckoInfo(symbol)}
                onChange={(e) => {
                  setField(setSymbol)(e);
                  tryFetchCoingeckoInfo(e.target.value);
                }}
              />
            </FormControl>
            <FormControl id="usdprice">
              <Input
                size="sm"
                type="number"
                step="0.00001"
                variant="flushed"
                placeholder="USD Price"
                name="usdprice"
                value={usdPrice}
                bg={inputBg}
                onChange={setNumericalField(setUsdPrice)}
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
        </Flex>
      </Flex>
    </Flex>
  );
};

export default NewTokenForm;
