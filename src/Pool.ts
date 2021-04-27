import {Token} from './Token'

export class Deposit {
  token: Token;
  amount: number;

  constructor(token: Token, amount: number) {
    this.token = token;
    this.amount = amount;
  }
}

export class Pool {

  public deposits: Record<string, number> = {};
  
  public poolTokensSupply = 0;

  constructor(token1: string, token2: string) {
    this.deposits[token1] = 0;
    this.deposits[token2] = 0;
  }

  k() {
    return Object.values(this.deposits)[0] * Object.values(this.deposits)[1];
  }

  liquidityQuote(from: string, to: string,  amount: number) {
    const ratio = (this.k() / (amount + this.deposits[from] )) - this.deposits[to];
    return ratio;
  }

  addLiquidity(deposit1: Deposit, deposit2: Deposit) : number{
    this.deposits[deposit1.token.symbol] += deposit1.amount;
    this.deposits[deposit2.token.symbol] += deposit2.amount;
    return this.mintPoolTokens(Math.sqrt(deposit1.amount * deposit2.amount));
  }

  mintPoolTokens(amt: number) {
    this.poolTokensSupply += amt;
    return amt;
  }

  withdrawLiquidity(liquidity: number) {
    const share = liquidity / this.poolTokensSupply;
    const keys = Object.keys(this.deposits);
    const withdrawA = (share * this.deposits[keys[0]]);
    const withdrawB = (share * this.deposits[keys[1]]);
    this.deposits[keys[0]] -= withdrawA;
    this.deposits[keys[1]] -= withdrawB;
    this.poolTokensSupply -= liquidity;
    return {
      [keys[0]]: withdrawA,
      [keys[1]]: withdrawB
    }
  }

  quote(from: string, to: string, amount: number): number {
    const depositFrom = this.deposits[from];
    const depositTo = this.deposits[to];
    return depositTo - this.k() / (amount + depositFrom)
  }

  balance() {
    return {
      ...this.deposits,
      k: this.k(),
      liqTokenSupply: this.poolTokensSupply,
      ...this.prices()
    }
  }
  
  prices() {
    const keys = Object.keys(this.deposits);
    const values = Object.values(this.deposits);
    const k1 = `${keys[0]}/${keys[1]}`;
    const k2 = `${keys[1]}/${keys[0]}`
    return ({
      [k1]: values[0]/values[1],
      [k2]: values[1]/values[0],
    })
  }

  buy(
    from: string, 
    to: string,
    amount: number, 
  ) {
    const q = this.quote(from, to, amount);
    this.deposits[from] += amount;
    this.deposits[to] -= q;
    return q;
  }
}