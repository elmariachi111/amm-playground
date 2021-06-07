import { Image } from '@chakra-ui/image';
import { Flex, LinkBox, LinkOverlay, SimpleGrid, Text } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';

import { default as coinGeckoApi } from '../../lib/Coingecko';
import { Token } from '../../lib/Token';
import { CoinInfo } from '../../types/Coingecko';

const CoinGeckoTokens = ({ onNew }: { onNew: (t: Token) => void }) => {
  const [coinInfo, setCoinInfo] = useState<CoinInfo[]>([]);

  useEffect(() => {
    (async () => {
      setCoinInfo(await coinGeckoApi.getCachedDefaulTokens());
    })();
  }, []);

  const adaptCoin = async (coin: CoinInfo) => {
    const token = Token.fromCoinInfo(coin);
    token.marketPrice = await coinGeckoApi.getUSDCoinPrice(coin.id);
    onNew(token);
    setCoinInfo((old) => old.filter((o) => o.symbol !== coin.symbol));
  };

  return (
    <SimpleGrid columns={2} spacing={5} my={5}>
      {coinInfo.map((coin) => (
        <LinkBox as={Flex} key={`coininfo-${coin.id}`} direction="column" align="center">
          <LinkOverlay href="#" onClick={() => adaptCoin(coin)}>
            <Image src={coin.image.small} alt={coin.name} my={3} />
            <Text>{coin.name}</Text>
          </LinkOverlay>
        </LinkBox>
      ))}
    </SimpleGrid>
  );
};

export default CoinGeckoTokens;
