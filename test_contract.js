var Web3 = require('./node_modules/web3');

var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));


var test = require('./test/node_module.js');
console.log(test);
console.log(test(web3).contract().multiply(23));

