import { Pool } from './Pool';
import { Token, TokenFeature } from './Token';

export const poolForToken = (pools: Pool[], token: Token) => {
  return pools.find((p) => p.poolToken === token);
};

export const poolShares = (pool: Pool, address: string): number[] => {
  const share = pool.poolToken.shareOf(address);
  return [
    pool.token1.balanceOf(pool.account) * share,
    pool.token2.balanceOf(pool.account) * share,
  ];
};

const computePoolShareUsdValue = async (pool: Pool, address: string) => {
  const shares = poolShares(pool, address);
  return shares[0] * pool.token1.marketPrice + shares[1] * pool.token2.marketPrice;
};

export const computeUsdValue = async (
  address: string,
  tokens: Token[],
  pools: Pool[],
) => {
  console.log('cusd');
  const _promises = tokens.map(
    async (t): Promise<number> => {
      if (t.feature === TokenFeature.LiquidityToken) {
        const pool = poolForToken(pools, t);
        if (!pool) return 0;
        return computePoolShareUsdValue(pool, address);
      } else {
        return t.balanceOf(address) * t.marketPrice;
      }
    },
  );
  return (await Promise.all(_promises)).reduce((prvVal, curVal) => prvVal + curVal, 0);
};

export const predictMarketPrice = (token1: Token, token2: Token, amt: number) => {
  const marketPrices = [token1.marketPrice, token2.marketPrice];
  if (marketPrices[0] === 0 || marketPrices[1] === 0) return NaN;
  return amt * (marketPrices[0] / marketPrices[1]);
};
