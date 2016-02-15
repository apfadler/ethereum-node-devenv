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
}]);
