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
  return (
    shares[0] * (await pool.token1.fetchMarketPrice()) +
    shares[1] * (await pool.token2.fetchMarketPrice())
  );
};

export const computeUsdValue = async (
  address: string,
  tokens: Token[],
  pools: Pool[],
) => {
  const _promises = tokens.map(
    async (t): Promise<number> => {
      if (t.feature === TokenFeature.LiquidityToken) {
        const pool = poolForToken(pools, t);
        if (!pool) return 0;
        return computePoolShareUsdValue(pool, address);
      } else {
        return t.balanceOf(address) * (await t.fetchMarketPrice());
      }
    },
  );
  return (await Promise.all(_promises)).reduce((prvVal, curVal) => prvVal + curVal, 0);
};

export const predictMarketPrice = async (token1: Token, token2: Token, amt: number) => {
  const marketPrices = await Promise.all([
    token1.fetchMarketPrice(),
    token2.fetchMarketPrice(),
  ]);
  if (marketPrices[0] === 0 || marketPrices[1] === 0) return NaN;
  return amt * (marketPrices[0] / marketPrices[1]);
};
