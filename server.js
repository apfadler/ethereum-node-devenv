var args = process.argv.slice(2);

console.log(args);
var rpcport = args[0];

var Web3 = require('./node_modules/web3');

var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:'+rpcport));

var coinbase = web3.eth.accounts[args[1]];
web3.eth.defaultAccount = web3.eth.accounts[args[1]];
console.log(coinbase);
console.log(web3.eth.defaultAccount);

var balance = web3.eth.getBalance(coinbase);
console.log(balance.toString(10));


// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================



app.use(express.static(__dirname + '/app'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

var contracts = ['test', 'token'];
var contractDesc=[];

fs = require('fs')

contracts.forEach(function(item) {

	var _mod = require('./'+item+'/node_module.js');
	var mod = _mod(web3);
	
	mod.methods.forEach(function(method) {
	
		console.log("Deploying " + method.path);
		app.post(method.path, function (req,res) {
		
			var contract = mod.contract();
			res.send(contract[method.name].apply(null, req.body.params));
		
		});
	});
	
	contractDesc.push(
		JSON.parse(fs.readFileSync('./'+item+'/contract.json').toString())
	);
});

app.get("/listContracts", function(req,res) {
	res.send(contractDesc);
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");
