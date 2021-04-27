import {Token} from './Token';
import {Deposit, Pool} from './Pool';

const DAI = new Token("DAI", "Dai")
const Graph = new Token("GRT", "The Graph")

const pool = new Pool(DAI.symbol, Graph.symbol);


console.log("liq", pool.addLiquidity(
  new Deposit(DAI, 1000), 
  new Deposit(Graph, 10000)
));

console.log("balance", pool.balance())

console.log("liq", pool.addLiquidity(
  new Deposit(DAI, 1000), 
  new Deposit(Graph, 10000)
));

console.log("balance", pool.balance())

let graph = pool.buy(DAI.symbol, Graph.symbol, 100);
console.log("received", `${graph} ${Graph.symbol}`);

console.log("withdraw", pool.withdrawLiquidity(6000.277))
console.log("balance", pool.balance())

// console.log("quote", pool.quote(DAI.symbol, Graph.symbol,  100));
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


