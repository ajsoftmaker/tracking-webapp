'use strict';

angular.module('trackingWebApp').controller('headernotificationController',
		headernotificationController);

headernotificationController.$inject = [ '$scope', '$http', '$state',
		'$rootScope','restAPIService' ];

function headernotificationController($scope, $http, $state, $rootScope ,restAPIService) {
	$("#userID").text($rootScope.userID);
	$scope.loginID = $rootScope.loginID;
	$scope.logout = function() {
		$state.go('login');
		$rootScope.mode = 0;
	}
	$scope.mode = $rootScope.mode;
	var id ;
	if ($scope.mode == undefined || $scope.mode == "") {
		$scope.mode = 0;
	}

	$scope.onSwitchMode = function(m) {
		var mode;
		if(m == "Student") {
			mode = "student";
		} else if( m == "Admin") {
			mode = "tenantadmin";
		}
		
		$scope.username = $rootScope.loginID;
		var password = $rootScope.password;
		$scope.roles ={
				name:""
		}
		var promise = restAPIService.labjumpUsersByLoginIdService($scope.username , password).query();
		promise.$promise.then(
				function (response) {
						$scope.roles.name  = mode;
						$http.defaults.headers.common.Authorization = "Basic " + $scope.username + " " + password +" " + $scope.roles.name;
						var promise = restAPIService.loginService($scope.username, password , $scope.roles.name).get();
						promise.$promise.then(
							function (response) {
								$rootScope.user = response;
								$http.defaults.headers.common.Authorization = "Basic " + btoa($rootScope.user.token + ":") ;
								 if (response.userRole == "tenantadmin") {
									$rootScope.loginID = response.userloginID;
									var promise = restAPIService.tenantService(response.tenant_id).get();
									promise.$promise.then(
											function (response) {
												$rootScope.userID = response.tenantName +" Admin";
											    id = $rootScope.user.tenant_id;
											    getlogoService();
											    $("#userID").text($rootScope.userID);
												$scope.loginID = $rootScope.loginID;
												
												 //  switching mode 	
											 	$scope.mode = "Student";
											 	
												$state.go('home.tadashboard');
											},
										    function(error){
										    	dialogs.error("Error",  error.data.error, {'size': 'sm' });
										    }
											);
								}
								else if (response.userRole == "student") {
									$rootScope.loginID = response.userloginID;
									var promise = restAPIService.tenantService(response.tenant_id).get();
									promise.$promise.then(
											function (response) {
												$rootScope.userID = response.tenantName +" Student";
												id = $rootScope.user.tenant_id;
											    getlogoService();
											    $("#userID").text($rootScope.userID);
												$scope.loginID = $rootScope.loginID;
												
												 //  switching mode 	
												$scope.mode = "Admin";
												
												$state.go('home.stdashboard');
											},
										    function(error){
										    	dialogs.error("Error",  error.data.error, {'size': 'sm' });
										    }
											);
								}
								
						    },
						    function(error){
						    	dialogs.error("Error",  error.data.error, {'size': 'sm' });
						    }
						);
						if(!$scope.$$phase) {
							 $scope.$apply();
							}
							
					},function (error) {
						dialogs.error("Error",  error.data.error, {'size': 'sm' });
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
