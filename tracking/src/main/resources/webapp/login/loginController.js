'use strict';

angular.module('trackingWebApp')
	.controller('loginController', loginController);

loginController.$inject = ['$http', '$rootScope', '$scope', '$state', 'restAPIService', 'dialogs'];

function loginController ($http, $rootScope, $scope, $state, restAPIService, dialogs) {
	$rootScope.apiUrl = "/api/";
	var id;
	var password;
	$scope.roles ={
			name:"superadmin"
	}
	var promise = restAPIService.superAdminService().get();
	 promise.$promise.then(
			 function(response) {
				 $scope.adminUser = response.adminUser;
				 $scope.adminPassword = response.adminPassword;
			 },
			 function(error){
			    	dialogs.error("Error",  error.data.error, {'size': 'sm' });
			    }
	 );
	$scope.onlogin = function() {
		$rootScope.username = $scope.username;
		if($scope.username == $scope.adminUser && $scope.password == $scope.adminPassword) {
			password = $scope.password;
		}else {
			password = btoa($scope.password);
			$rootScope.password = password;
		}
		
		if($scope.username == $scope.adminUser && password == $scope.adminPassword) {
			$http.defaults.headers.common.Authorization = "Basic " + $scope.username + " " + password +" " + $scope.roles.name;
			var promise = restAPIService.loginService($scope.username, password , $scope.roles.name).get();
			promise.$promise.then(
				function (response) {
					$rootScope.user = response;
					if (response.userRole == "superadmin") {
						$http.defaults.headers.common.Authorization = "Basic " + btoa($rootScope.user.token + ":") ;
						$rootScope.userID = "LabJump Super Admin";
						$rootScope.loginID = "Super Admin";
						$state.go('home.sadashboard');
					}
				},function(error) {
					dialogs.error("Error",  error.data.error, {'size': 'sm' });
				}
			);	
		
		} else {
		var promise = restAPIService.labjumpUsersByLoginIdService($scope.username , password).query();
		promise.$promise.then(
				function (response) {
					if(response.length > 1) {
						$rootScope.multipleObj = response;
						$state.go('multipleId');
					} else {
						$scope.roles.name  = response[0].userRole;
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
					}
				},
				function(error) {
					dialogs.error("Error",  error.data.error, {'size': 'sm' });
				}
				);
		}
	}
	 
	$scope.forgot = function() {
		$state.go('forgot');
	}
	
	function getlogoService(){
		var promise1 = restAPIService.logoService(id).get();
		promise1.$promise.then(
				function (response) {
					$scope.encodedLogo = response.success;
					$rootScope.encodedLogo = $scope.encodedLogo;
			    },
			    function(error){
			    	dialogs.error("Error",  error.data.error, {'size': 'sm' });
			    }
			);
	}
}