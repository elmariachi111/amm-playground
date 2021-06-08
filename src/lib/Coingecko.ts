import { CoinInfo } from '../types/Coingecko';
import { Token } from './Token';

//https://www.coingecko.com/en/api#explore-api
const BASE_URL = 'https://api.coingecko.com/api/v3';
const COIN_QUERY_PARAMS =
  'curl -X GET "https://api.coingecko.com/api/v3/coins/decentraland?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false';

const DEFAULT_SYMBOLS = [
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
  },
  {
    id: 'dai',
    symbol: 'dai',
    name: 'Dai',
  },
  {
    id: 'usd-coin',
    symbol: 'usdc',
    name: 'USD Coin',
  },
  {
    id: 'the-graph',
    symbol: 'grt',
    name: 'The Graph',
  },
  {
    id: 'uniswap',
    symbol: 'uni',
    name: 'Uniswap',
  },
  {
    id: 'matic-network',
    symbol: 'matic',
    name: 'Polygon',
  },
  {
    id: 'chainlink',
    symbol: 'link',
    name: 'Chainlink',
  },
  {
    id: 'basic-attention-token',
    symbol: 'bat',
    name: 'Basic Attention Token',
  },
  {
    id: 'decentraland',
    symbol: 'mana',
    name: 'Decentraland',
  },
  {
    id: 'maker',
    symbol: 'mkr',
    name: 'Maker',
  },
  {
    id: 'curvehash',
    symbol: 'curve',
    name: 'CURVEHASH',
  },
  {
    id: 'internet-computer',
    symbol: 'icp',
    name: 'Internet Computer',
  },
  {
    id: 'weth',
    symbol: 'weth',
    name: 'WETH',
  },
  {
    id: 'wrapped-filecoin',
    symbol: 'wfil',
    name: 'Wrapped Filecoin',
  },
  {
    id: 'compound-governance-token',
    symbol: 'comp',
    name: 'Compound',
  },
  {
    id: 'sushi',
    symbol: 'sushi',
    name: 'Sushi',
  },
  {
    id: 'pooltogether',
    symbol: 'pool',
    name: 'PoolTogether',
  },
  {
    id: 'havven',
    symbol: 'snx',
    name: 'Synthetix Network Token',
  },
];

class API {
  async getCachedDefaulTokens(): Promise<CoinInfo[]> {
    const ids = DEFAULT_SYMBOLS.slice(0, 10).map((s) => s.id);
    const cacheKey = `coininfo[${ids.join(',')}]`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached) as CoinInfo[];
    } else {
      const _coins: CoinInfo[] = [];
      const promises = ids.map((id) => {
        const url = BASE_URL + `/coins/${id}` + '?' + COIN_QUERY_PARAMS;
        return fetch(url);
      });
      for await (const res of promises) {
        const coinInfo: CoinInfo = await res.json();
        _coins.push({
          ...coinInfo,
        });
      }
      localStorage.setItem(cacheKey, JSON.stringify(_coins));
      return _coins;
    }
  }

  async getUSDCoinPrice(id: string): Promise<number> {
    const url = BASE_URL + `/simple/price` + '?vs_currencies=usd%2Ceur&ids=' + id;
    const prices = await (await fetch(url)).json();
    return prices[id]['usd'];
  }
}

const api = new API();

export const adaptCoin = async (symbol: string): Promise<Token | null> => {
  const defaultCoins = await api.getCachedDefaulTokens();
  const coinInfo = defaultCoins.find(
    (ci) => ci.symbol.toLowerCase() === symbol.toLowerCase(),
  );
  if (!coinInfo) return null;

  const token = Token.fromCoinInfo(coinInfo);
  token.fetchMarketPrice();
  return token;
};

export default api;
