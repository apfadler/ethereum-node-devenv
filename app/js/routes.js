app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url:'/',
			views : {
				'content' : { 
					templateUrl: 'partials/main.html',
					controller: 'MainController'
				}
			}
        })
		
        
 
}]);