export class Token {

  balances: Record<string, number> = {};

  totalSupply = 0;

  constructor(public symbol: string, public name: string) {}

  mint(amt: number, to: string) {
    this.totalSupply += amt;
    if (!this.balances[to]) {
      this.balances[to] = amt;
    } else {
      this.balances[to] += amt;
    }
  }

  transfer(from: string, to: string, amt: number) {
    if (!this.balances[to]) {
      this.balances[to] = 0;
    }
    if (this.balanceOf(from) < amt) {
      throw new Error("no sufficient funds");
    }
    this.balances[from] -= amt;
    this.balances[to] += amt;
  }

  burn(from: string, amt: number) {
    this.balances[from] -= amt;
    this.totalSupply -= amt;
  }

  balanceOf(from: string) {
    return this.balances[from] || 0;
  } 
}