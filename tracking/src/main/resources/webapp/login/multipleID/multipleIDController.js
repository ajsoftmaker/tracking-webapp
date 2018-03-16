'use strict';

angular.module('trackingWebApp').controller('multipleIDController',
		multipleIDController);

function multipleIDController($http , $scope, $rootScope, $state, $filter, dialogs,
		restAPIService, $location, $timeout, $stateParams) {
  
	$rootScope.apiUrl = "/api/";
	$rootScope.multipleObj;
	$scope.roles = {
		        name:''
		      };
	var id;
	$scope.onLogin = function() {
		$http.defaults.headers.common.Authorization = "Basic " + $rootScope.username + " " + $rootScope.password +" " + $scope.roles.name;
		var promise = restAPIService.loginService($rootScope.username, $rootScope.password , $scope.roles.name).get();
		promise.$promise.then(
			function (response) {
				$rootScope.user = response;
				$http.defaults.headers.common.Authorization = "Basic " + btoa($rootScope.user.token + ":") ;
			 if (response.userRole == "tenantadmin") {
				 //  switching mode 	
				 	$rootScope.mode = "Student";
				 
					$rootScope.loginID = response.userloginID;
					var promise = restAPIService.tenantService(response.tenant_id).get();
					promise.$promise.then(
							function (response) {
								$rootScope.userID = response.tenantName +" Admin";
							    id = $rootScope.user.tenant_id;
							    getlogoService();
								$state.go('home.tadashboard');
							},
						    function(error){
						    	dialogs.error("Error",  error.data.statusText, {'size': 'sm' });
						    }
							);
				
				}
				else if (response.userRole == "student") {
				//  switching mode 
					$rootScope.mode = "Admin";
					
					$rootScope.loginID = response.userloginID;
					var promise = restAPIService.tenantService(response.tenant_id).get();
					promise.$promise.then(
							function (response) {
								$rootScope.userID = response.tenantName +" Student";
								id = $rootScope.user.tenant_id;
							    getlogoService();
								$state.go('home.stdashboard');
							},
						    function(error){
						    	dialogs.error("Error",  error.data.statusText, {'size': 'sm' });
						    }
							);
					
				}
		    },
		    function(error){
		    	dialogs.error("Error",  error.data.statusText, {'size': 'sm' });
		    }
		);
	}
	function getlogoService(){
		var promise1 = restAPIService.logoService(id).get();
		promise1.$promise.then(
				function (response) {
					$scope.encodedLogo = response.success;
					$rootScope.encodedLogo = $scope.encodedLogo;
			    },
			    function(error){
			    	dialogs.error("Error",  error.data.statusText, {'size': 'sm' });
			    }
			);
	}
}