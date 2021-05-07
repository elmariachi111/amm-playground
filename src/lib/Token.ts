import { Emitter } from '@servie/events';

interface TokenEvents {
  Minted: [{ to: string; amount: number }];
  Transferred: [{ from: string; to: string; amount: number }];
  Burnt: [{ from: string; amount: number }];
}

export enum TokenFeature {
  ERC20,
  LiquidityToken,
}

export class Token extends Emitter<TokenEvents> {
  balances: Record<string, number> = {};
  totalSupply = 0;
  feature: TokenFeature = TokenFeature.ERC20;

  public readonly symbol: string;
  public readonly name: string;

  constructor(symbol: string, name: string, feature = TokenFeature.ERC20) {
    super();
    this.symbol = symbol;
    this.name = name;
    this.feature = feature;
  }

  mint(amount: number, to: string) {
    this.totalSupply += amount;
    if (!this.balances[to]) {
      this.balances[to] = amount;
    } else {
      this.balances[to] += amount;
    }
    this.emit('Minted', { to, amount });
  }

  transfer(from: string, to: string, amount: number) {
    if (!this.balances[to]) {
      this.balances[to] = 0;
    }
    if (this.balanceOf(from) < amount) {
      throw new Error('no sufficient funds');
    }
    this.balances[from] -= amount;
    this.balances[to] += amount;

    this.emit('Transferred', { from, to, amount });
  }

  burn(from: string, amount: number) {
    this.balances[from] -= amount;
    this.totalSupply -= amount;
    this.emit('Burnt', { from, amount });
  }

  balanceOf(from: string) {
    return this.balances[from] || 0;
  }
}
