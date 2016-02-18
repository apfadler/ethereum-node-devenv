/*

TODO 

- display my address

*/

'use strict';

var controllers = angular.module("controllers", []);

controllers.controller("MainController", ['$scope', '$http', function ($scope, $http) {
	
	$scope.contracts = [ ];
	
	$http.get('/listContracts')
		.success(function(data, status, headers, config) {
			$scope.contracts = data;
			console.log($scope.contracts);
		})
		.error(function(data, status, headers, config) {
			console.log("Error getting contracts");
		});
	
	$scope.currentMethod = "";
	$scope.currentContract = "";
	$scope.params = {};
	$scope.lastResult = "";
	
	$scope.functionCaller = "";
	
	$scope.selectMethod = function(whichContract, whichMethod)	 {
		$scope.currentMethod = whichMethod;
		$scope.currentContract = whichContract;
		$scope.params = {};
		$scope.lastResult = "";
		
		for (var i=0; i < whichMethod.inputs.length; i++)
		{
			$scope.params[whichMethod.inputs[i].name] = "null";
		}
		
		console.log($scope.params);
	}
	
	$scope.callContract = function() {
		console.log($scope.currentMethod);
		console.log($scope.currentContract);
		console.log($scope.params);
		
		var path="";
		
		for (var i=0; i < $scope.contracts.length; i++)
		{
			
			if ($scope.contracts[i].name == $scope.currentContract.name) {
				for (var j=0; j < $scope.contracts[i].api.length; j++) {
				
					if ($scope.contracts[i].api[j].name == $scope.currentMethod.name) {
						path = $scope.contracts[i].api[j].path;
					}
				}
			}
		}
		
		var contractParams = [];
		for (var key in $scope.params) {
			contractParams.push($scope.params[key]);
		}
		
		console.log(contractParams);
		
		$http.post(path, { params : contractParams} )
			.success(function(data, status, headers, config) {
				console.log(data);
				$scope.lastResult = JSON.stringify(data);
				$scope.params = {};
			})
			.error(function(data, status, headers, config) {
				console.log("Error calling function");
				$scope.lastResult =  "An Error occured!";
				$scope.params = {};
			});
		
	}
	
	
	///////////////////////////////////////////////////////////////////////////
	$scope.web3 = new Web3();
    $scope.global_keystore = {};
	$scope.addresses = [];

	$scope.setWeb3Provider = function(keystore) {
		
		$scope.web3Provider = new HookedWeb3Provider({
		  host: "http://localhost:8080/ethproxy",
		  transaction_signer: keystore
		});

		$scope.web3.setProvider($scope.web3Provider);
	}

    $scope.newAddresses = function (password) {
        
		if (password == '') {
		  password = prompt('Enter password to retrieve addresses', 'Password');
		}

		var numAddr = parseInt(document.getElementById('numAddr').value)

		lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {

		$scope.global_keystore.generateNewAddress(pwDerivedKey, numAddr);

		$scope.addresses = $scope.global_keystore.getAddresses();

		//document.getElementById('sendFrom').innerHTML = ''
		//document.getElementById('functionCaller').innerHTML = ''
		$scope.functionCaller = ""
		//for (var i=0; i<$scope.addresses.length; ++i) {
		  //document.getElementById('sendFrom').innerHTML += '<option value="' + $scope.addresses[i] + '">' + $scope.addresses[i] + '</option>'
		  //document.getElementById('functionCaller').innerHTML += '<option value="' + addresses[i] + '">' + addresses[i] + '</option>'
		  //$scope.functionCaller  =  addresses[i];
		//}

		$scope.getBalances();
		})
     };

     $scope.getBalances = function() {
        
        $scope.addresses = $scope.global_keystore.getAddresses();
		
		$scope.accounts=[{address: "Loading balances...", balance : ""}];
		
//        document.getElementById('addr').innerHTML = 'Retrieving addresses...'

		var balances = [];
		var nonces = [];
		for (var i=0; i<$scope.addresses.length; ++i) {
			balances[i] = $scope.web3.eth.getBalance($scope.addresses[i]);
			nonces[i] = $scope.web3.eth.getTransactionCount($scope.addresses[i]);
		}
		
		 for (var i=0; i<$scope.addresses.length; ++i) {
              //document.getElementById('addr').innerHTML += '<div>' + $scope.addresses[i] + ' (Bal: ' + (balances[i] / 1.0e18) + ' ETH, Nonce: ' + nonces[i] + ')' + '</div>'
			  $scope.accounts[i] = {address : $scope.addresses[i], balance : balances[i], nonce : nonces[i]};
        }
		
		
       /* async.map( $scope.addresses, $scope.web3.eth.getBalance, function(err, balances) {
          async.map($scope.addresses, $scope.web3.eth.getTransactionCount, function(err, nonces) {
            //document.getElementById('addr').innerHTML = ''
            for (var i=0; i<$scope.addresses.length; ++i) {
              //document.getElementById('addr').innerHTML += '<div>' + $scope.addresses[i] + ' (Bal: ' + (balances[i] / 1.0e18) + ' ETH, Nonce: ' + nonces[i] + ')' + '</div>'
			  $scope.accounts[i] = {address : $scope.addresses[i], balance : balances[i], nonce : nonces[i]};
            }
			
			
          })
        })*/

		console.log("Balances Loaded");
		$scope.$apply();
    };

     $scope.setSeed =function () {
        var password = prompt('Enter Password to encrypt your seed', 'Password');
                                              
        lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {

        $scope.global_keystore = new lightwallet.keystore(
          document.getElementById('seed').value, 
          pwDerivedKey);

        document.getElementById('seed').value = ''
        
        $scope.newAddresses(password);
        $scope.setWeb3Provider($scope.global_keystore);
        
        $scope.getBalances();
        })
    };

    $scope.newWallet = function () {
		var extraEntropy = document.getElementById('userEntropy').value;
		document.getElementById('userEntropy').value = '';
		var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);

		var infoString = 'Your new wallet seed is: "' + randomSeed + 
		  '". Please write it down on paper or in a password manager, you will need it to access your wallet. Do not let anyone see this seed or they can take your Ether. ' +
		  'Please enter a password to encrypt your seed while in the browser.'
		var password = prompt(infoString, 'Password');

		lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {

		$scope.global_keystore = new lightwallet.keystore(
		  randomSeed,
		  pwDerivedKey);
				
		$scope.newAddresses(password);
		$scope.setWeb3Provider($scope.global_keystore);
		$scope.getBalances();
		})
    };

    $scope.showSeed = function () {
		var password = prompt('Enter password to show your seed. Do not let anyone else see your seed.', 'Password');

		lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {
		var seed = $scope.global_keystore.getSeed(pwDerivedKey);
		alert('Your seed is: "' + seed + '". Please write it down.')
		})
    };

    $scope.sendEth = function () {
		var fromAddr = document.getElementById('sendFrom').value
		var toAddr = document.getElementById('sendTo').value
		var valueEth = document.getElementById('sendValueAmount').value
		var value = parseFloat(valueEth)*1.0e18
		var gasPrice = 50000000000
		var gas = 50000
		$scope.web3.eth.sendTransaction({from: fromAddr, to: toAddr, value: value, gasPrice: gasPrice, gas: gas}, function (err, txhash) {
		  console.log('error: ' + err)
		  console.log('txhash: ' + txhash)
		})
    };

    $scope.functionCall = function () {
	
		var fromAddr = $scope.functionCaller;//document.getElementById('functionCaller').value
		var contractAddr = document.getElementById('contractAddr').value
		var abi = JSON.parse(document.getElementById('contractAbi').value)
		var contract = $scope.web3.eth.contract(abi).at(contractAddr)
		var functionName = document.getElementById('functionName').value
		var args = JSON.parse('[' + document.getElementById('functionArgs').value + ']')
		var valueEth = document.getElementById('sendValueAmount').value
		var value = parseFloat(valueEth)*1.0e18
		var gasPrice = 50000000000
		var gas = 3141592
		args.push({from: fromAddr, value: value, gasPrice: gasPrice, gas: gas})
		var callback = function(err, txhash) {
		  console.log('error: ' + err)
		  console.log('txhash: ' + txhash)
		}
		args.push(callback)
		console.log(contract[functionName].apply(this, args));
     };
	
	
	
}]);
