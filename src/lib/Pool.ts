import { Emitter } from '@servie/events';

import { Token, TokenFeature } from './Token';

interface PoolEvents {
  LiquidityChanged: [{ token1amt: number; token2amt: number }];
  ReservesChanged: [{ token1bal: number; token2bal: number }];
}

export interface PoolInfo {
  k: number;
  liqTokenSupply: number;
  reserves: number[];
  prices: number[];
  feeRate: number;
}

export class Pool extends Emitter<PoolEvents> {
  public token1: Token;
  public token2: Token;

  public account: string;

  public poolToken: Token;

  public feeRate: number;

  constructor(address: string, token1: Token, token2: Token, feePercent: number = 0.0) {
    super();
    this.token1 = token1;
    this.token2 = token2;
    this.account = address;
    this.feeRate = feePercent / 100;
    this.poolToken = new Token(
      `${token1.symbol}|${token2.symbol}`,
      `${token1.symbol} ${token2.symbol} Pool Shares`,
      TokenFeature.LiquidityToken,
    );
    this.poolToken.pool = this;
  }

  addLiquidity(sender: string, amt1: number, amt2: number) {
    this.token1.transfer(sender, this.account, amt1);
    this.token2.transfer(sender, this.account, amt2);
    this.poolToken.mint(Math.sqrt(amt1 * amt2), sender);
    this.emit('LiquidityChanged', { token1amt: amt1, token2amt: amt2 });
  }

  withdrawLiquidity(sender: string, liquidity: number) {
    const share = liquidity / this.poolToken.totalSupply;
    const withdraw1 = share * this.token1.balanceOf(this.account);
    const withdraw2 = share * this.token2.balanceOf(this.account);

    this.poolToken.transfer(sender, this.account, liquidity);
    this.token1.transfer(this.account, sender, withdraw1);
    this.token2.transfer(this.account, sender, withdraw2);
    this.emit('LiquidityChanged', {
      token1amt: withdraw1,
      token2amt: withdraw2,
    });

    this.poolToken.burn(this.account, liquidity);
  }

  k() {
    return this.reserves()[0] * this.reserves()[1];
  }

  quote(from: Token, to: Token, amount: number): number {
    const fromReserve = from.balanceOf(this.account);
    const toReserve = to.balanceOf(this.account);

    return toReserve - this.k() / (amount - this.feeRate * amount + fromReserve);
  }

  buy(sender: string, from: Token, to: Token, amount: number) {
    const q = this.quote(from, to, amount);
    from.transfer(sender, this.account, amount);
    to.transfer(this.account, sender, q);
    this.emit('ReservesChanged', {
      token1bal: this.token1.balanceOf(this.account),
      token2bal: this.token2.balanceOf(this.account),
    });
    return q;
  }

  reserves(): number[] {
    return [this.token1.balanceOf(this.account), this.token2.balanceOf(this.account)];
  }
  poolInfo(): PoolInfo {
    return {
      reserves: this.reserves(),
      k: this.k(),
      liqTokenSupply: this.poolToken.totalSupply,
      prices: this.prices(),
      feeRate: this.feeRate,
    };
  }

  prices() {
    const bal1 = this.token1.balanceOf(this.account);
    const bal2 = this.token2.balanceOf(this.account);
    return [bal1 / bal2, bal2 / bal1];
  }
}
