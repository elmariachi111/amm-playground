/// <reference types="cypress" />
/// <reference types="mocha" />

import { BASE_URL, DEFAULT_SYMBOLS } from '../../src/lib/Coingecko';
import { CoinInfo } from '../../src/types/Coingecko';

const coinResponseSample: CoinInfo = {
  id: 'ethereum',
  symbol: 'eth',
  name: 'Ethereum',
  categories: [],
  description: {
    en: 'Lorem Ipsum',
  },
  image: {
    thumb: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png?1595348880',
    small: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
    large: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
  },
  last_updated: '2021-06-29T17:59:58.715Z',
};

describe('My First Test', () => {
  before(() => {
    cy.intercept(`${BASE_URL}/coins/*`, (req) => {
      const u = new URL(req.url);
      const coinId = u.pathname.split('/').reverse()[0];
      const coinDef = DEFAULT_SYMBOLS.find((sym) => sym.id === coinId);

      req.reply({
        ...coinResponseSample,
        name: coinDef?.name,
        symbol: coinDef?.symbol,
        id: coinId,
      });
    });
    cy.fixture('coingecko_simple_price').then((prices) => {
      cy.intercept(`${BASE_URL}/simple/price*`, (req) => {
        cy.debug();
        const ids = (req.query['ids'] as string).split(',');
        let ret: Record<string, { usd: number; eur: number }> = {};
        for (const id of ids) {
          ret[id] = prices[id];
        }
        req.reply(ret);
      });
    });
  });
  it('can create defaults', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Set some defaults').click();
  });
});
