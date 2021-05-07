import { Pool } from './lib/Pool';
import { Token } from './lib/Token';

const DAI = new Token('DAI', 'Dai');
const Graph = new Token('GRT', 'The Graph');

const account1 = '0xac01';
const account2 = '0xac02';

DAI.mint(2000, account1);
Graph.mint(20000, account1);
DAI.mint(1000, account2);

const pool = new Pool('0xpool', DAI, Graph);
pool.addLiquidity(account1, 1000, 10_000);
console.log('pool balance', pool.poolInfo());

pool.addLiquidity(account1, 1000, 10_000);
console.log('pool balance', pool.poolInfo());

console.log('quote DAI -> GRT', pool.quote(DAI, Graph, 100));
pool.buy(account2, DAI, Graph, 100);
console.log('pool balance', pool.poolInfo());
console.log('account2 balance', DAI.balanceOf(account2), Graph.balanceOf(account2));

console.log('quote GRT -> DAI', pool.quote(Graph, DAI, Graph.balanceOf(account2)));
pool.buy(account2, Graph, DAI, Graph.balanceOf(account2));
console.log('pool balance', pool.poolInfo());
console.log('account2 balance', DAI.balanceOf(account2), Graph.balanceOf(account2));

pool.withdrawLiquidity(account1, pool.poolToken.balanceOf(account1) / 2);
console.log('pool balance', pool.poolInfo());

// console.log("withdraw", pool.withdrawLiquidity(6000.277))
// console.log("balance", pool.balance())

// let graph = pool.buy(DAI.symbol, Graph.symbol, 100);
// console.log("received", `${graph} ${Graph.symbol}`);

// console.log("balance", pool.balance())

// console.log("quote", pool.quote(DAI.symbol, Graph.symbol,  100))

// pool.addLiquidity(
//   new Deposit(DAI, 1000),
//   new Deposit(Graph, 8.26 * 1000)
// )

// console.log("balance", pool.balance())

//console.log("liq quote", pool.liquidityQuote(DAI.symbol, Graph.symbol, 2000));

// console.log("quote", pool.quote(Graph.symbol, DAI.symbol,  909))
// let dai = pool.buy(Graph.symbol, DAI.symbol, 909);
// console.log("received", `${dai} ${DAI.symbol}`);
// console.log("balance", pool.balance())

// pool.buy(DAI.symbol, Graph.symbol, 100);
// console.log("balance", pool.balance())

// console.log("quote", pool.quote(DAI.symbol, Graph.symbol,  1000));

// console.log("pool", pool.balance())
