import { Image } from '@chakra-ui/image';
import { Flex, LinkBox, LinkOverlay, SimpleGrid, Text } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';

import { adaptCoin, default as coinGeckoApi } from '../../lib/Coingecko';
import { Token } from '../../lib/Token';
import { CoinInfo } from '../../types/Coingecko';

const CoinGeckoTokens = ({
  onNew,
  tokens,
}: {
  onNew: (t: Token) => void;
  tokens: Token[];
}) => {
  const [coinInfo, setCoinInfo] = useState<CoinInfo[]>([]);

  useEffect(() => {
    (async () => {
      const defaults = await coinGeckoApi.getCachedDefaulTokens();
      const notAdapted = defaults.filter((ci) => {
        const inTokenList = tokens.find(
          (t) => t.symbol.toLowerCase() === ci.symbol.toLowerCase(),
        );
        return inTokenList ? false : true;
      });
      setCoinInfo(notAdapted);
    })();
  }, [tokens]);

  return (
    <SimpleGrid columns={3} spacing={5} my={5}>
      {coinInfo.map((coin) => (
        <LinkBox key={`coininfo-${coin.id}`} sx={{ cursor: 'pointer' }}>
          <LinkOverlay
            onClick={async () => {
              const token = await adaptCoin(coin.symbol);
              if (token) onNew(token);
            }}>
            <Flex direction="column" align="center" justify="center">
              <Image
                width="35px"
                h="35px"
                src={coin.image.small}
                alt={coin.name}
                my={2}
              />
              <Text textAlign="center" fontSize="sm">
                {coin.name}
              </Text>
            </Flex>
          </LinkOverlay>
        </LinkBox>
      ))}
    </SimpleGrid>
  );
};

export default CoinGeckoTokens;
