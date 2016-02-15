/* TODO 
-- contractid as arg
-- specfiy deployment options somewhere (e.g. gas)
*/

var Web3 = require('./node_modules/web3');

var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

var coinbase = web3.eth.coinbase;
console.log(coinbase);

web3.eth.defaultAccount = coinbase;

var balance = web3.eth.getBalance(coinbase);
console.log(balance.toString(10));

var abi = "";
fs = require('fs')
var abi = JSON.parse(fs.readFileSync('token/token.abi').toString());
var bin = fs.readFileSync('token/token.bin').toString();

var myContract;

console.log(abi);
console.log(bin);

function genNodeModule(contractId, contract, contractAbi) {

	var apiMethods=[];
	for (var i=0; i < contractAbi.length; i++)
	{
		apiMethods.push(
		
			{ 
				path : "/"+contractId+"/"+contractAbi[i].name,
				name : contractAbi[i].name
				
			}		
		);
	}
	

	var code = "module.exports = function(web3) { \r\n";
	code += "	var abi = " + JSON.stringify(contractAbi) + ";\r\n"
	code += "	return   {  \r\n"
	code += " 		contract : function() {  \r\n"
	code += "				return  web3.eth.contract(abi).at(\""+contract.address+"\") ; \r\n";
	code += "  			},\r\n";
	code += "  		methods : " + JSON.stringify(apiMethods) + " \r\n";
	code += "		"
	code += "  } \r\n";
	code += " } ";
	
	console.log('./'+contractId+'/node_module.js');
	fs.writeFileSync('./'+contractId+'/node_module.js', code);

}

function genClientInfo(contractId, contract, contractAbi) {

	var apiMethods=[];
	for (var i=0; i < contractAbi.length; i++)
	{
		apiMethods.push(
		
			{ 
				path : "/"+contractId+"/"+contractAbi[i].name,
				name : contractAbi[i].name
			}		
		);
	}
	
	console.log('./'+contractId+'/contract.json');
	fs.writeFileSync('./'+contractId+'/contract.json', JSON.stringify( {name : contractId, api : apiMethods, abi : contractAbi,
				address : contract.address}));

}

web3.eth.contract(abi).new(100000, {from: coinbase, gas: 1000000, data: bin}, function (err, contract) {
            if(err) {
                console.error("ERROR " + err);
                return;

            // callback fires twice, we only want the second call when the contract is deployed
            } else if(contract.address){
			
          
                console.log('contract: ' + contract.address);
				fs.writeFileSync('./test/test.address', contract.address);
				
				genNodeModule('token', contract, abi);
				genClientInfo('token', contract, abi);
				
				console.log("Contract deployed");
            }
        });
		
		