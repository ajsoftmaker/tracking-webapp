'use strict';

angular.module('trackingWebApp').controller('tenantDetailController',
		tenantDetailController);

function tenantDetailController($scope, $rootScope, $state, $filter, dialogs,
		restAPIService) {
	var tenantId;

	tenantId = $rootScope.user.tenant_id;
	getlogoService();
	$scope.logoValue = true;

	$scope.onUploadLogo = function() {
		var fileReference = document.getElementById('logo').files[0];

		// check if file is image
		if (fileReference.type.indexOf('image') < 0) {
			dialogs.error("Error", "Please select an image" , {'size' : 'sm'});
			return;
		}
		// check for file size
		if (fileReference.size > 30720) {
			dialogs.error("Error","Please select an image with size less than 30 KB", {'size' : 'sm'});
			return;
		}

		var fd = new FormData();
		fd.append('logofile', fileReference);

		var promise1 = restAPIService.logoService(tenantId).save(fd);
		promise1.$promise.then(function(response) {
			var promise2 = restAPIService.logoService(tenantId).get();
			promise2.$promise.then(function(response) {
				$scope.encodedLogo = response;
				$rootScope.encodedLogo = $scope.encodedLogo.success;
				document.getElementById("headerLogo").src = "data:image/jpeg;base64,"+ $scope.encodedLogo.success;
				dialogs.notify("Success", "Logo Uploaded Sucessfully" ,{'size' : 'sm'});
				$state.go("home.tadashboard");
			}, function(error) {
			});
		}, function(error) {
			dialogs.error("Error",error.data.error, {'size' : 'sm'});
		});
	}

	function getlogoService() {
		var promise1 = restAPIService.logoService(tenantId).get();
		promise1.$promise.then(function(response) {
			$scope.encodedLogo = response;
			if ($scope.encodedLogo.success == "Set Default Logo") {
				document.getElementById("logoID").src = "/assets/images/labjump_logo.png";
			} else {
				$rootScope.encodedLogo = $scope.encodedLogo.success;
				document.getElementById("logoID").src = "data:image/jpeg;base64,"+$scope.encodedLogo.success;
			}
		}, function(error) {
		});
	}

	$scope.fileNameChanged = function(event) {
		var path = event.value;
		if(path.length > 0) {
			$scope.logoValue = false;
		}
		else {
			$scope.logoValue = true;
		}
		$scope.$apply();
	}
}