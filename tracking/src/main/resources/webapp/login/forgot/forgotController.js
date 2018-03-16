'use strict';

angular.module('trackingWebApp')
		.controller('forgotController', forgotController);

function forgotController($scope, $rootScope, $state, $filter, dialogs,
		restAPIService, $location, $timeout, $stateParams) {
	$scope.getEmail = true;
	$scope.userObj = {};
	var email;
	$rootScope.apiUrl = "/api/";
	$scope.email;
	$scope.continueForgot = function() {
		var promise = restAPIService.findEmailService($scope.email).query();
		promise.$promise.then(function(response) {
			$rootScope.userObj = response;
				var email = $rootScope.userObj[0].email;
				var role = $rootScope.userObj[0].userRole;
				var promise = restAPIService.forgotPasswordService(email, role)
						.get();
				promise.$promise.then(function(response) {

					$rootScope.email = email;
					dialogs.notify("Success",
							"A mail has been sent to your mail ID with a link to reset your password.", {
								'size' : 'sm'
							});
					$state.go('login');
				}, function(error) {
					dialogs.error("Error", error.status + " "
							+ error.statusText, {
						'size' : 'sm'
					});
				});
			
		}, function(error) {
			
			dialogs.error("Error", "User is not Registered with this Email ", {
				'size' : 'sm'
			});
		})

	}

	$scope.back = function() {
		$state.go('login');
	}
	
	$scope.onChangeEmail = function(email) {
		if(email.length > 2) {
			$scope.getEmail = false;
		}
		 
	}
}