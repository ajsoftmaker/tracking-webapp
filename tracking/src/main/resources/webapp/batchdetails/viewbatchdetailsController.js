'use strict';

angular.module('trackingWebApp')
	.controller('viewbatchdetailsController', viewbatchdetailsController);

function viewbatchdetailsController($scope, $rootScope, $state, $stateParams, dialogs, restAPIService){
	$scope.batch;
	var batchID = $stateParams.batchID;
	
	getBatchDetail();
	
	function getBatchDetail() {
		var promise1 = restAPIService.batchService(batchID).get();
		promise1.$promise.then(
			function (response) {
				$scope.batch = response;
		    },
		    function(error){
		    	dialogs.error("Error", error.status + " " + error.statusText, {'size': 'sm' });
		    }
		);
	}
	
	$scope.onBack = function() {
		if($rootScope.user.userRole=="superadmin"){
			$state.go("home.samanagecourses");
		} else {
			$state.go("home.taviewcourses");
		}
	}
}
