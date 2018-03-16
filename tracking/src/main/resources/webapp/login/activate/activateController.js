'use strict';

angular.module('trackingWebApp').controller('activateController',
		activateController);

function activateController($scope, $rootScope, $state, $filter, dialogs,
		restAPIService, $location, $timeout, $stateParams) {
	// global object declarations
	$rootScope.readKey = "ef67bfe0-ef02-4d49-ba8f-46e16ebd9b1b";
	$rootScope.readPass = "99ba03d3-efb6-4447-a251-c6dcaa7348bb";
	$rootScope.readWriteKey = "4fd28bf6-a866-4189-8e9d-773968d52e76";
	$rootScope.readWritePass = "645a1364-9f6d-4fa3-95ab-8cca6fc0c7fe";
	var userEmail,role;
	$rootScope.apiUrl = "/api/";
	var primaryEmail = $stateParams.userkey
	var promise = restAPIService.findEmailService(primaryEmail).save();
	promise.$promise.then(function(response) {
		
		userEmail = response.email;
		role = response.userRole;
		$scope.username = response.userloginID;
	}, function(error) {
			dialogs.notify("Error",  error.data.error, {
				'size' : 'sm'
			});
			$state.go('login');
		
	});

	$scope.savePassword = function() {
		var dataObj = {
			loginID : $scope.username,
			password : btoa($scope.password),
			email : userEmail,
			userRole : role
		}
		var promise = restAPIService.activateService().save(dataObj);
		promise.$promise.then(function(response) {
				dialogs.notify("Success", response.success, {
					'size' : 'sm'
				});

			$state.go('login');
		}, function(error) {
				dialogs.notify("Error",  error.data.error, {
					'size' : 'sm'
				});
				$state.go('login');
			 
		});

	}

}
