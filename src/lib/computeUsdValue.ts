import { Pool } from './Pool';
import { Token, TokenFeature } from './Token';

const computePoolShareUsdValue = async (pool: Pool, address: string) => {
  const share = pool.poolToken.shareOf(address);
  return (
    pool.token1.balanceOf(pool.account) * share * (await pool.token1.fetchMarketPrice()) +
    pool.token2.balanceOf(pool.account) * share * (await pool.token2.fetchMarketPrice())
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
        const pool = pools.find((p) => p.poolToken === t);
        if (!pool) return 0;
        return computePoolShareUsdValue(pool, address);
      } else {
        return t.balanceOf(address) * (await t.fetchMarketPrice());
      }
    },
  );
  return (await Promise.all(_promises)).reduce((prvVal, curVal) => prvVal + curVal, 0);
};
