var http = require('http'),
    httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
var server = http.createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
 
	console.log(req.url);
 
	if (req.url  == '/ethproxy')
		proxy.web(req, res, { target: 'http://127.0.0.1:8545' });
	else
		proxy.web(req, res, { target: 'http://127.0.0.1:8081' });
		
});

console.log("proxy listening on port 8080")
server.listen(8080);


// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================



app.use(express.static(__dirname + '/app'));                  // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

var contracts = ['token'];
var contractDesc=[];

fs = require('fs')

contracts.forEach(function(item) {
	contractDesc.push(
		JSON.parse(fs.readFileSync('./'+item+'/contract.json').toString())
	);
});

app.get("/listContracts", function(req,res) {
	res.send(contractDesc);
});

// listen (start app with node server.js) ======================================
app.listen(8081);
console.log("App listening on port 8081");
