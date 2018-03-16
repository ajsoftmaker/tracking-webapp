'use strict';

angular.module('trackingWebApp').controller('resetPasswordController',
		resetPasswordController);

function resetPasswordController($scope, $rootScope, $state, $filter, dialogs,
		restAPIService, $location, $timeout, $stateParams) {
	var emailId;
	var role;
	$rootScope.apiUrl = "/api/";
	$rootScope.readKey = "ef67bfe0-ef02-4d49-ba8f-46e16ebd9b1b";
	$rootScope.readPass = "99ba03d3-efb6-4447-a251-c6dcaa7348bb";
	$rootScope.readWriteKey = "4fd28bf6-a866-4189-8e9d-773968d52e76";
	$rootScope.readWritePass = "645a1364-9f6d-4fa3-95ab-8cca6fc0c7fe";
	var userEmail = $stateParams.resetKey;
	var promise = restAPIService.updatePasswordEmailService(userEmail).save();
	promise.$promise.then(function(response) {
		emailId = response.userEmail;
		role = response.role;
	}, function(error) {
		if(error.status == 302) {
			dialogs.notify("Error", "This Login ID has been activated already.", {
				'size' : 'sm'
			});
			$state.go('login');
		} else {
		dialogs.error("Error", error.status + " " + error.statusText, {
			'size' : 'sm'
		});
		}
	});
	
	$scope.update = function() {
		var dataObj = {
			password : btoa($scope.password),
			email : emailId,
			userRole : role
		}

		var promise = restAPIService.updatePasswordService().save(dataObj);
		promise.$promise.then(function(response) {
			dialogs.notify("Success", "Password Updated Successfully", {
				'size' : 'sm'
			});
			$state.go('login');
		}, function(error) {
			dialogs.error("Error", error.status + " " + error.statusText, {
				'size' : 'sm'
			});

		});
	}
}