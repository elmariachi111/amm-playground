import {Token} from './Token'

export class Pool {

  public token1: Token;
  public token2: Token;

  public account = "0xpool";

  public poolToken: Token;

  constructor(token1: Token, token2: Token) {
    this.token1 = token1;
    this.token2 = token2;
    this.poolToken = new Token(`${token1}|${token2}`, `${token1} ${token2} Pool Shares`);
  }

  addLiquidity(sender: string, amt1: number, amt2: number) {
    this.token1.transfer(sender, this.account, amt1);
    this.token2.transfer(sender, this.account, amt2);
    this.poolToken.mint(Math.sqrt(amt1 * amt2), sender);
  }

  withdrawLiquidity(sender: string, liquidity: number) {
    const share = liquidity / this.poolToken.totalSupply;
    const withdraw1 = (share * this.token1.balanceOf(this.account));
    const withdraw2 = (share * this.token2.balanceOf(this.account));

    this.poolToken.transfer(sender, this.account, liquidity)
    this.token1.transfer(this.account, sender, withdraw1);
    this.token2.transfer(this.account, sender, withdraw2);
    
    this.poolToken.burn(this.account, liquidity);
  }

  poolBalance() {
    return [this.token1.balanceOf(this.account), this.token2.balanceOf(this.account)];
  }

  k() {
    const pBalance = this.poolBalance();
    return pBalance[0] * pBalance[1];
  }

  quote(from: Token, to: Token, amount: number): number {
    const fromReserve = from.balanceOf(this.account);
    const toReserve = to.balanceOf(this.account); 
    return toReserve - this.k() / (amount + fromReserve)
  }

  buy(
    sender: string,
    from: Token, 
    to: Token,
    amount: number, 
  ) {
    const q = this.quote(from, to, amount);
    from.transfer(sender, this.account, amount);
    to.transfer(this.account, sender, q);
    return q;
  }

  balance() {
    return {
      [this.token1.symbol]: this.token1.balanceOf(this.account),
      [this.token2.symbol]: this.token2.balanceOf(this.account),
      k: this.k(),
      liqTokenSupply: this.poolToken.totalSupply,
      ...this.prices()
    }
  }

  prices() {
    const k1 = `${this.token1.symbol}/${this.token2.symbol}`;
    const k2 = `${this.token2.symbol}/${this.token1.symbol}`
    const bal1 = this.token1.balanceOf(this.account);
    const bal2 = this.token2.balanceOf(this.account);
    return ({
      [k1]: bal1/bal2,
      [k2]: bal2/bal1,
    })
  }

}